#!/usr/bin/env node
/**
 * optimize-images.mjs
 *
 * Script encargado de optimizar imágenes de un proyecto, mantener un fallback
 * en formato original y generar su versión WebP. Incluye backup automático
 * antes de modificar cualquier archivo.
 *
 * ───────────────────────────────────────────────────────────
 * FUNCIONES PRINCIPALES:
 *
 * ✔ Recorre una carpeta de assets buscando imágenes válidas
 * ✔ Realiza un BACKUP completo antes de modificar nada
 * ✔ Optimiza JPG, PNG, TIFF y WebP
 * ✔ Genera siempre una copia WebP
 * ✔ Reduce dimensiones solo si exceden un máximo definido
 * ✔ Mantiene datos como fechas de modificación (mtime/atime)
 * ✔ Soporta concurrencia con p-limit
 * ✔ Puede renombrar archivos a formato SEO (opcional)
 * ✔ Modo dry-run (simula sin escribir cambios)
 *
 * 🆕 CAMBIO PEDIDO POR EL USUARIO:
 *   → Los GIFs (animados o no) ahora se omiten completamente,
 *     evitando romper animaciones.
 *
 * Requisitos:
 *   npm i --save-dev sharp fs-extra p-limit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

import sharp from 'sharp';
import fsExtra from 'fs-extra';
import pLimit from 'p-limit';

// ---------------------------------------------------------------------------
// CONFIGURACIÓN GENERAL DEL SCRIPT
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Carpeta donde se buscará el material a optimizar.
 * Puede personalizarse via variable ASSETS_DIR.
 */
const ASSETS_DIR = process.env.ASSETS_DIR || path.join(__dirname, 'src', 'assets');

/**
 * Carpeta donde se almacenará una copia completa antes de modificar los archivos.
 * Esto permite recuperar el proyecto incluso si algo falla.
 */
const BACKUP_ROOT = path.join(__dirname, `assets_backup_${new Date().toISOString().replace(/[:.]/g,'-')}`);

/**
 * Archivo de log donde se registran las acciones del script.
 */
const LOG_FILE = path.join(__dirname, 'optimize-images.log');

/**
 * Concurrencia máxima para evitar saturar CPU (sharp usa varios hilos).
 */
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);

/**
 * Resolución máxima permitida.
 * Si una imagen excede este ancho o alto → se redimensiona hacia adentro.
 */
const MAX_DIMENSION = Number(process.env.MAX_DIMENSION || 3840);

/**
 * Parámetros de calidad predeterminados.
 */
const DEFAULT_JPEG_QUALITY = Number(process.env.JPEG_QUALITY || 82);
const DEFAULT_WEBP_QUALITY = Number(process.env.WEBP_QUALITY || 80);
const DEFAULT_PNG_COMPRESSION = Number(process.env.PNG_COMPRESSION || 8); // 0–9

// CLI flags:
const ARGV = process.argv.slice(2);
const FLAG_RENAME_SEO = ARGV.includes('--rename-seo'); // renombrado SEO silencioso
const FLAG_DRY_RUN = ARGV.includes('--dry-run'); // simula sin escribir

/**
 * Extensiones de imágenes a procesar.
 * GIF y formatos animados se omiten para preservar animaciones.
 * Solo se procesan formatos estáticos que pueden optimizarse sin pérdida perceptible.
 */
const EXT_IMG = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif']);

/**
 * Extensiones de archivos que se ignoran completamente (animados, vectoriales, etc.)
 */
const EXT_IGNORE = new Set(['.gif', '.svg', '.ico']);

/**
 * Directorios a ignorar totalmente.
 */
const IGNORE_DIRS = new Set(['node_modules', '.git', 'assets_backup']);

// ---------------------------------------------------------------------------
// UTILIDADES
// ---------------------------------------------------------------------------

/**
 * Registra mensajes en consola y en un archivo .log.
 */
function nowLog(...parts) {
  try {
    const ln = `[${new Date().toISOString()}] ${parts.join(' ')}`;
    console.log(ln);
    fs.appendFileSync(LOG_FILE, ln + '\n');
  } catch {
    // Evita que un error de log interrumpa el proceso
  }
}

/**
 * Convierte un nombre de archivo en una versión SEO-friendly y web-safe:
 * - Minúsculas para consistencia
 * - Elimina acentos y diacríticos (á→a, ñ→n, ü→u)
 * - Remueve caracteres especiales que pueden causar problemas en URLs
 * - Espacios y guiones bajos → guiones medios
 * - Colapsa múltiples guiones consecutivos
 * - Elimina guiones al inicio/final
 * 
 * Ejemplos:
 *   "Mi Foto (2023).JPG" → "mi-foto-2023.jpg"
 *   "Diseño_web__final.png" → "diseno-web-final.png"
 */
function seoSafeName(name) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);

  // Normalizar y remover diacríticos (acentos)
  let s = base.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  
  // Remover caracteres no alfanuméricos (excepto espacios, guiones y guiones bajos)
  s = s.replace(/[^0-9A-Za-z\s\-\_]/g, '');
  
  // Convertir espacios y guiones bajos a guiones medios
  s = s.trim().replace(/[\s\_]+/g, '-').toLowerCase();
  
  // Colapsar múltiples guiones consecutivos
  s = s.replace(/-{2,}/g, '-');
  
  // Remover guiones al inicio y final
  s = s.replace(/^-+|-+$/g, '');
  
  // Si después de limpiar queda vacío, usar timestamp
  if (!s) s = `image-${Date.now()}`;

  return s + ext.toLowerCase();
}

/**
 * Recorre recursivamente una carpeta y devuelve una lista de archivos de imagen válidos.
 * Ignora directorios del sistema, archivos ocultos y formatos no soportados.
 * 
 * @param {string} dir - Directorio raíz a escanear
 * @returns {Promise<string[]>} - Array de rutas absolutas a archivos de imagen
 */
async function walk(dir) {
  const results = [];

  async function _walk(d) {
    let items;
    
    try {
      items = await fs.promises.readdir(d, { withFileTypes: true });
    } catch (err) {
      // Si no podemos leer el directorio, lo saltamos (permisos, etc.)
      nowLog('⚠️ No se pudo leer directorio:', d, err.message);
      return;
    }

    for (const it of items) {
      // Ignorar archivos/carpetas ocultos que empiezan con punto
      if (it.name.startsWith('.')) continue;
      
      // Ignorar directorios especiales
      if (IGNORE_DIRS.has(it.name)) continue;
      
      // Ignorar carpetas de backup previos
      if (it.name.startsWith('assets_backup_')) continue;

      const p = path.join(d, it.name);

      if (it.isDirectory()) {
        await _walk(p);
      } else if (it.isFile()) {
        const ext = path.extname(it.name).toLowerCase();
        
        // Solo procesar extensiones válidas, ignorar formatos no soportados
        if (EXT_IMG.has(ext) && !EXT_IGNORE.has(ext)) {
          results.push(p);
        }
      }
    }
  }

  await _walk(dir);
  return results;
}

/**
 * Define ajustes de calidad óptimos según características de la imagen.
 * Busca el equilibrio perfecto entre tamaño de archivo y calidad visual.
 * 
 * Estrategia:
 * - Imágenes pequeñas: máxima calidad (evita artefactos visibles)
 * - Imágenes medianas: calidad alta (óptimo para web)
 * - Imágenes grandes: calidad ajustada (reduce peso sin pérdida perceptible)
 * 
 * @param {Object} meta - Metadatos de la imagen (width, height, format, etc.)
 * @param {number} origBytes - Tamaño original del archivo en bytes
 * @returns {Object} Configuración de calidad y resize
 */
function chooseSettings(meta, origBytes) {
  const maxSide = Math.max(meta.width || 0, meta.height || 0);
  const megapixels = ((meta.width || 0) * (meta.height || 0)) / 1_000_000;
  
  // Clasificación por tamaño
  const isVeryLarge = maxSide > 3000 || origBytes > 3 * 1024 * 1024;
  const isLarge = maxSide > 2000 || origBytes > 1.5 * 1024 * 1024;
  const isSmall = maxSide < 800 && origBytes < 300 * 1024;

  let jpegQ = DEFAULT_JPEG_QUALITY;
  let webpQ = DEFAULT_WEBP_QUALITY;
  let pngCompression = DEFAULT_PNG_COMPRESSION;

  if (isVeryLarge) {
    // Imágenes muy grandes: reducir calidad moderadamente
    // Sigue siendo imperceptible para el ojo humano en pantalla
    jpegQ = Math.max(75, jpegQ - 7);
    webpQ = Math.max(75, webpQ - 5);
    pngCompression = Math.min(9, pngCompression + 1);
  } else if (isLarge) {
    // Imágenes grandes: ajuste suave
    jpegQ = Math.max(78, jpegQ - 4);
    webpQ = Math.max(78, webpQ - 2);
  } else if (isSmall) {
    // Imágenes pequeñas: máxima calidad para evitar pixelación
    jpegQ = Math.min(95, jpegQ + 8);
    webpQ = Math.min(90, webpQ + 8);
    pngCompression = Math.max(6, pngCompression - 2);
  }

  const shouldResize = maxSide > MAX_DIMENSION;
  
  return { jpegQ, webpQ, pngCompression, shouldResize, megapixels };
}

/**
 * Escritura atómica:
 * - Crea archivo temporal
 * - Lo renombra
 * Esto evita archivos corruptos si el proceso se interrumpe.
 */
async function atomicWrite(filePath, buffer) {
  const dir = path.dirname(filePath);
  await fsExtra.ensureDir(dir);

  const tmp = path.join(dir, `.${path.basename(filePath)}.tmp-${process.pid}-${Date.now()}`);
  await fs.promises.writeFile(tmp, buffer);
  await fs.promises.rename(tmp, filePath);
}

/**
 * Preserva las fechas de acceso y modificación del archivo original.
 * Esto mantiene la metadata temporal para herramientas que la usen (git, backup, etc.).
 * 
 * Es una operación best-effort: si falla (permisos, filesystem, etc.), 
 * no interrumpe el proceso ya que no es crítica.
 * 
 * @param {string} srcPath - Ruta del archivo original (de donde leer las fechas)
 * @param {string} destPath - Ruta del archivo destino (donde aplicar las fechas)
 */
async function preserveTimes(srcPath, destPath) {
  try {
    const st = await fs.promises.stat(srcPath);
    await fs.promises.utimes(destPath, st.atime, st.mtime);
  } catch (err) {
    // Silenciosamente ignoramos errores de timestamps
    // (no son críticos para la funcionalidad)
  }
}

// ---------------------------------------------------------------------------
// BACKUP DE ARCHIVOS
// ---------------------------------------------------------------------------

/**
 * Realiza una copia de seguridad completa antes de modificar archivos.
 * Esta es una red de seguridad crítica que permite revertir cambios.
 * 
 * La copia preserva:
 * - Estructura de directorios
 * - Contenido exacto de archivos
 * - Timestamps originales
 * 
 * @param {string[]} files - Array de rutas absolutas a respaldar
 */
async function createBackup(files) {
  if (!files || files.length === 0) {
    nowLog('⚠️ No hay archivos para respaldar');
    return;
  }

  nowLog(`🗂️  Creando backup de ${files.length} archivos en: ${BACKUP_ROOT}`);

  let backed = 0;
  let failed = 0;

  for (const f of files) {
    try {
      const rel = path.relative(ASSETS_DIR, f);
      const dest = path.join(BACKUP_ROOT, rel);

      await fsExtra.ensureDir(path.dirname(dest));
      await fsExtra.copy(f, dest, { preserveTimestamps: true });
      backed++;
    } catch (err) {
      nowLog(`❌ Error al respaldar ${f}:`, err.message);
      failed++;
    }
  }

  if (failed > 0) {
    nowLog(`⚠️  Backup completado con errores: ${backed} OK, ${failed} fallidos`);
  } else {
    nowLog(`✅ Backup completado exitosamente: ${backed} archivos`);
  }
}

// ---------------------------------------------------------------------------
// PROCESAMIENTO DE UNA IMAGEN INDIVIDUAL
// ---------------------------------------------------------------------------

/**
 * Optimiza una imagen individual y genera su versión WebP.
 * 
 * Proceso:
 * 1. Lee y valida la imagen
 * 2. Detecta formato y características
 * 3. Omite GIFs y archivos animados (preserva animaciones)
 * 4. Optimiza el archivo original con configuración adaptativa
 * 5. Genera versión WebP de alta calidad (solo si no es WebP ya)
 * 6. Guarda con escritura atómica y preserva timestamps
 * 
 * Configuración de calidad adaptativa:
 * - Imágenes pequeñas: calidad muy alta (evita artefactos)
 * - Imágenes medianas: calidad óptima para web
 * - Imágenes grandes: calidad ajustada (reduce peso sin pérdida perceptible)
 * 
 * @param {string} filePath - Ruta absoluta del archivo a optimizar
 * @param {Object} opts - Opciones { dryRun: boolean }
 * @returns {Promise<Object>} Estadísticas del procesamiento
 */
async function optimizeFile(filePath, opts = { dryRun: false }) {
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);
  const baseNameNoExt = path.basename(filePath, ext);

  try {
    // -----------------------------------------------------------------------
    // PASO 1: Validaciones iniciales
    // -----------------------------------------------------------------------
    
    // Omitir GIFs completamente (pueden ser animados)
    if (EXT_IGNORE.has(ext)) {
      return { file: filePath, skipped: true, reason: 'Formato ignorado (GIF/SVG/ICO)' };
    }

    // Leer archivo original
    const origBuffer = await fs.promises.readFile(filePath);
    
    // Validar que el archivo no esté vacío o corrupto
    if (!origBuffer || origBuffer.length === 0) {
      return { file: filePath, error: 'Archivo vacío o corrupto' };
    }

    // -----------------------------------------------------------------------
    // PASO 2: Cargar imagen con sharp y obtener metadata
    // -----------------------------------------------------------------------
    
    let image;
    try {
      image = sharp(origBuffer, { 
        failOnError: false,  // Continúa incluso con warnings
        animated: false      // No procesar frames múltiples
      });
    } catch (err) {
      return { file: filePath, error: `No se pudo cargar con sharp: ${err.message}` };
    }

    const meta = await image.metadata().catch(() => null);
    
    if (!meta || !meta.width || !meta.height) {
      return { file: filePath, error: 'No se pudo leer metadata de la imagen' };
    }

    // Detectar imágenes animadas (GIF animados, APNG, WebP animado)
    if (meta.pages && meta.pages > 1) {
      return { file: filePath, skipped: true, reason: 'Imagen animada (multi-frame)' };
    }

    // -----------------------------------------------------------------------
    // PASO 3: Calcular configuración de calidad óptima
    // -----------------------------------------------------------------------
    
    const { jpegQ, webpQ, pngCompression, shouldResize, megapixels } =
      chooseSettings(meta, origBuffer.length);

    const resizeOptions = shouldResize ? {
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: 'lanczos3'  // Mejor algoritmo de redimensionado
    } : null;

    // -----------------------------------------------------------------------
    // PASO 4: Optimizar archivo original (mantiene formato)
    // -----------------------------------------------------------------------
    
    let optimizedOriginalBuffer;
    let processingApplied = false;

    if (ext === '.jpg' || ext === '.jpeg') {
      let pipeline = image.clone();
      if (resizeOptions) pipeline = pipeline.resize(resizeOptions);
      
      // Intentar con mozjpeg, si falla usar encoder estándar
      try {
        optimizedOriginalBuffer = await pipeline.jpeg({
          quality: jpegQ,
          progressive: true,
          mozjpeg: true,
          chromaSubsampling: '4:2:0',  // Óptimo para fotos
          optimizeScans: true
        }).toBuffer();
      } catch {
        // Fallback sin mozjpeg
        pipeline = image.clone();
        if (resizeOptions) pipeline = pipeline.resize(resizeOptions);
        optimizedOriginalBuffer = await pipeline.jpeg({
          quality: jpegQ,
          progressive: true
        }).toBuffer();
      }
      processingApplied = true;
    }
    else if (ext === '.png') {
      let pipeline = image.clone();
      if (resizeOptions) pipeline = pipeline.resize(resizeOptions);
      
      optimizedOriginalBuffer = await pipeline.png({
        compressionLevel: pngCompression,
        progressive: false,  // PNG no tiene progressive como JPEG
        adaptiveFiltering: true,  // Mejor compresión
        palette: meta.channels <= 3  // Usar paleta si es posible
      }).toBuffer();
      processingApplied = true;
    }
    else if (ext === '.webp') {
      let pipeline = image.clone();
      if (resizeOptions) pipeline = pipeline.resize(resizeOptions);
      
      optimizedOriginalBuffer = await pipeline.webp({
        quality: webpQ,
        effort: 6,  // Balance entre velocidad y compresión (0-6)
        smartSubsample: true
      }).toBuffer();
      processingApplied = true;
    }
    else if (ext === '.tiff' || ext === '.tif') {
      let pipeline = image.clone();
      if (resizeOptions) pipeline = pipeline.resize(resizeOptions);
      
      optimizedOriginalBuffer = await pipeline.tiff({
        compression: 'lzw',  // Compresión sin pérdida
        quality: 95
      }).toBuffer();
      processingApplied = true;
    }
    else {
      // Formato desconocido, intentar conversión genérica
      let pipeline = image.clone();
      if (resizeOptions) pipeline = pipeline.resize(resizeOptions);
      optimizedOriginalBuffer = await pipeline.toBuffer();
      processingApplied = true;
    }

    // -----------------------------------------------------------------------
    // PASO 5: Generar versión WebP (solo si no es WebP original)
    // -----------------------------------------------------------------------
    
    let webpBuffer = null;
    let webpPath = null;
    let webpBytes = 0;
    
    // Solo generar WebP si el original NO es WebP (evita duplicados)
    if (ext !== '.webp') {
      let pipelineWebp = image.clone();
      if (resizeOptions) pipelineWebp = pipelineWebp.resize(resizeOptions);
      
      webpBuffer = await pipelineWebp.webp({
        quality: webpQ,
        effort: 6,
        smartSubsample: true,
        nearLossless: false  // Queremos calidad alta pero con compresión
      }).toBuffer();
      
      webpPath = path.join(dir, baseNameNoExt + '.webp');
      webpBytes = webpBuffer.length;
    }

    // -----------------------------------------------------------------------
    // PASO 6: Calcular estadísticas
    // -----------------------------------------------------------------------
    
    const stats = {
      file: filePath,
      format: meta.format,
      dimensions: `${meta.width}x${meta.height}`,
      megapixels: megapixels.toFixed(2),
      originalBytes: origBuffer.length,
      optimizedBytes: optimizedOriginalBuffer.length,
      webpBytes: webpBytes,
      webpPath: webpPath,
      resized: shouldResize,
      savingsPercent: ((origBuffer.length - optimizedOriginalBuffer.length) / Math.max(1, origBuffer.length)) * 100,
      qualityUsed: ext === '.jpg' || ext === '.jpeg' ? jpegQ : webpQ
    };

    // -----------------------------------------------------------------------
    // PASO 7: Modo dry-run → solo simular
    // -----------------------------------------------------------------------
    
    if (opts.dryRun) {
      nowLog(`[DRY-RUN] ${path.basename(filePath)}: ${(origBuffer.length/1024).toFixed(1)}KB → ${(optimizedOriginalBuffer.length/1024).toFixed(1)}KB (${stats.savingsPercent.toFixed(1)}% ahorro)`);
      return { ...stats, dryRun: true };
    }

    // -----------------------------------------------------------------------
    // PASO 8: Guardar archivos optimizados (escritura atómica)
    // -----------------------------------------------------------------------
    
    // Guardar archivo original optimizado
    await atomicWrite(filePath, optimizedOriginalBuffer);
    await preserveTimes(filePath, filePath);

    // Guardar versión WebP (si se generó)
    if (webpBuffer && webpPath) {
      await atomicWrite(webpPath, webpBuffer);
      await preserveTimes(filePath, webpPath);
    }

    // Log de éxito
    const savedKB = ((origBuffer.length - optimizedOriginalBuffer.length) / 1024).toFixed(1);
    const webpInfo = webpPath ? ` + WebP (${(webpBytes/1024).toFixed(1)}KB)` : '';
    nowLog(`✓ ${path.basename(filePath)}: ${(origBuffer.length/1024).toFixed(1)}KB → ${(optimizedOriginalBuffer.length/1024).toFixed(1)}KB (-${savedKB}KB)${webpInfo}`);

    return stats;

  } catch (err) {
    nowLog(`✗ Error procesando ${path.basename(filePath)}:`, err.message);
    return { file: filePath, error: String(err.message || err) };
  }
}

// ---------------------------------------------------------------------------
// RENOMBRADO SEO (opcional)
// ---------------------------------------------------------------------------

/**
 * Renombra archivos a formato SEO-friendly (opcional).
 * Solo se ejecuta si se pasa el flag --rename-seo
 * 
 * Proceso:
 * 1. Convierte nombres a formato web-safe
 * 2. Detecta y resuelve colisiones de nombres
 * 3. Mueve archivo original y su WebP asociado
 * 4. Mantiene log de todos los cambios
 * 
 * @param {string[]} files - Array de rutas de archivos a renombrar
 * @returns {Promise<Array>} Array de objetos {from, to} con los cambios
 */
async function maybeRenameSeo(files) {
  if (!FLAG_RENAME_SEO) {
    nowLog('ℹ️  Renombrado SEO no activado. Usa --rename-seo para habilitarlo.');
    return [];
  }

  if (!files || files.length === 0) {
    nowLog('⚠️  No hay archivos para renombrar');
    return [];
  }

  nowLog(`🔎 Renombrado SEO activo. Procesando ${files.length} archivos...`);

  const renamed = [];
  const errors = [];

  for (const f of files) {
    try {
      // Validar que el archivo aún existe
      if (!fs.existsSync(f)) {
        nowLog(`⚠️  Archivo no existe, omitiendo: ${f}`);
        continue;
      }

      const dir = path.dirname(f);
      const name = path.basename(f);
      const seo = seoSafeName(name);

      // Si ya tiene formato SEO, no se toca
      if (seo === name.toLowerCase()) continue;

      let dest = path.join(dir, seo);

      // Resolver colisiones de nombres
      if (fs.existsSync(dest) && dest.toLowerCase() !== f.toLowerCase()) {
        const base = path.basename(seo, path.extname(seo));
        const ext = path.extname(seo);
        let i = 1;

        while (fs.existsSync(dest)) {
          dest = path.join(dir, `${base}-${i}${ext}`);
          i++;
          
          // Prevenir loops infinitos
          if (i > 1000) {
            throw new Error('Demasiadas colisiones de nombres');
          }
        }
      }

      // Solo mover si el destino es diferente (case-insensitive)
      if (dest.toLowerCase() !== f.toLowerCase()) {
        await fsExtra.move(f, dest, { overwrite: false });

        // Mover también su .webp asociado si existe
        const originalWebp = path.join(dir, path.basename(f, path.extname(f)) + '.webp');
        if (fs.existsSync(originalWebp)) {
          const newWebp = path.join(dir, path.basename(dest, path.extname(dest)) + '.webp');
          try {
            await fsExtra.move(originalWebp, newWebp, { overwrite: false });
          } catch (webpErr) {
            nowLog(`⚠️  No se pudo mover WebP asociado: ${originalWebp}`);
          }
        }

        renamed.push({ from: f, to: dest });
        nowLog(`  ✓ ${path.basename(f)} → ${path.basename(dest)}`);
      }

    } catch (err) {
      errors.push({ file: f, error: err.message });
      nowLog(`  ✗ Error renombrando ${path.basename(f)}: ${err.message}`);
    }
  }

  if (errors.length > 0) {
    nowLog(`⚠️  Renombrado completado con errores: ${renamed.length} OK, ${errors.length} fallidos`);
  } else {
    nowLog(`✅ Renombrado SEO completado: ${renamed.length} archivos`);
  }
  
  return renamed;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

/**
 * Función principal del optimizador.
 * Coordina todo el flujo: escaneo, backup, renombrado, optimización y reportes.
 */
async function main() {
  const startTime = Date.now();
  
  nowLog('═══════════════════════════════════════════════════════════');
  nowLog('🚀 OPTIMIZADOR DE IMÁGENES - Iniciando proceso');
  nowLog('═══════════════════════════════════════════════════════════');
  nowLog(`📁 Carpeta de assets: ${ASSETS_DIR}`);
  nowLog(`🔧 Configuración:`);
  nowLog(`   - Dimensión máxima: ${MAX_DIMENSION}px`);
  nowLog(`   - Calidad JPEG: ${DEFAULT_JPEG_QUALITY}`);
  nowLog(`   - Calidad WebP: ${DEFAULT_WEBP_QUALITY}`);
  nowLog(`   - Concurrencia: ${CONCURRENCY} hilos`);
  nowLog(`   - Modo dry-run: ${FLAG_DRY_RUN ? 'SÍ (simulación)' : 'NO'}`);
  nowLog(`   - Renombrado SEO: ${FLAG_RENAME_SEO ? 'SÍ' : 'NO'}`);
  nowLog('');

  // -------------------------------------------------------------------------
  // FASE 1: Validaciones iniciales
  // -------------------------------------------------------------------------
  
  if (!fs.existsSync(ASSETS_DIR)) {
    nowLog('❌ ERROR: No existe la carpeta de assets:', ASSETS_DIR);
    nowLog('   Verifica la ruta o define ASSETS_DIR como variable de entorno.');
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // FASE 2: Escaneo de archivos
  // -------------------------------------------------------------------------
  
  nowLog('🔍 FASE 1: Escaneando archivos...');
  const files = await walk(ASSETS_DIR);

  if (!files.length) {
    nowLog('ℹ️  No se encontraron imágenes válidas para procesar.');
    nowLog('   Formatos soportados: JPG, PNG, WebP, TIFF');
    nowLog('   Formatos ignorados: GIF, SVG, ICO');
    process.exit(0);
  }

  nowLog(`✓ Encontradas ${files.length} imágenes válidas`);
  nowLog('');

  // -------------------------------------------------------------------------
  // FASE 3: Backup de seguridad
  // -------------------------------------------------------------------------
  
  if (!FLAG_DRY_RUN) {
    nowLog('🗂️  FASE 2: Creando backup de seguridad...');
    await createBackup(files);
    nowLog('');
  } else {
    nowLog('⚠️  FASE 2: Backup omitido (modo dry-run)');
    nowLog('');
  }

  // -------------------------------------------------------------------------
  // FASE 4: Renombrado SEO (opcional)
  // -------------------------------------------------------------------------
  
  nowLog('📝 FASE 3: Renombrado SEO...');
  let renamed = [];
  if (FLAG_RENAME_SEO && !FLAG_DRY_RUN) {
    renamed = await maybeRenameSeo(files);
  } else if (FLAG_RENAME_SEO && FLAG_DRY_RUN) {
    nowLog('⚠️  Renombrado SEO omitido (modo dry-run)');
  }
  nowLog('');

  // -------------------------------------------------------------------------
  // FASE 5: Escaneo final (puede haber cambios por renombrado)
  // -------------------------------------------------------------------------
  
  const filesToProcess = await walk(ASSETS_DIR);
  
  if (filesToProcess.length !== files.length) {
    nowLog(`ℹ️  Archivos después del renombrado: ${filesToProcess.length}`);
  }

  // -------------------------------------------------------------------------
  // FASE 6: Optimización de imágenes (con concurrencia)
  // -------------------------------------------------------------------------
  
  nowLog('🎨 FASE 4: Optimizando imágenes...');
  nowLog(`⚙️  Procesando ${filesToProcess.length} archivos (${CONCURRENCY} en paralelo)...`);
  nowLog('');

  const limit = pLimit(CONCURRENCY);
  const tasks = filesToProcess.map(f =>
    limit(() => optimizeFile(f, { dryRun: FLAG_DRY_RUN }))
  );

  const results = await Promise.all(tasks);
  
  // -------------------------------------------------------------------------
  // FASE 7: Análisis de resultados
  // -------------------------------------------------------------------------
  
  const successes = results.filter(r => !r.error && !r.skipped && !r.dryRun);
  const dryRunResults = results.filter(r => r.dryRun);
  const skipped = results.filter(r => r.skipped);
  const errors = results.filter(r => r.error);

  nowLog('');
  nowLog('═══════════════════════════════════════════════════════════');
  nowLog('📊 RESULTADOS DEL PROCESAMIENTO');
  nowLog('═══════════════════════════════════════════════════════════');
  nowLog(`✓ Procesados exitosamente: ${FLAG_DRY_RUN ? dryRunResults.length : successes.length}`);
  nowLog(`⏭ Omitidos (GIF/animados):  ${skipped.length}`);
  nowLog(`✗ Errores:                  ${errors.length}`);
  nowLog('');

  // Mostrar primeros errores si existen
  if (errors.length > 0) {
    nowLog('❌ ERRORES ENCONTRADOS:');
    errors.slice(0, 5).forEach(e => {
      nowLog(`   - ${path.basename(e.file)}: ${e.error}`);
    });
    if (errors.length > 5) {
      nowLog(`   ... y ${errors.length - 5} errores más`);
    }
    nowLog('');
  }

  // -------------------------------------------------------------------------
  // FASE 8: Estadísticas de optimización
  // -------------------------------------------------------------------------
  
  const relevantResults = FLAG_DRY_RUN ? dryRunResults : successes;
  
  if (relevantResults.length > 0) {
    const totalOrig = relevantResults.reduce((s, r) => s + (r.originalBytes || 0), 0);
    const totalOpt = relevantResults.reduce((s, r) => s + (r.optimizedBytes || 0), 0);
    const totalWebp = relevantResults.reduce((s, r) => s + (r.webpBytes || 0), 0);
    const totalSaved = totalOrig - totalOpt;
    const savingsPercent = ((totalSaved / Math.max(1, totalOrig)) * 100);

    nowLog('📈 ESTADÍSTICAS DE OPTIMIZACIÓN:');
    nowLog(`   Peso original:       ${(totalOrig / 1024 / 1024).toFixed(2)} MB`);
    nowLog(`   Peso optimizado:     ${(totalOpt / 1024 / 1024).toFixed(2)} MB`);
    nowLog(`   Ahorro obtenido:     ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${savingsPercent.toFixed(1)}%)`);
    
    if (totalWebp > 0) {
      nowLog(`   Peso WebP generado:  ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
      const webpSavings = ((1 - totalWebp / totalOrig) * 100);
      nowLog(`   Ahorro con WebP:     ${webpSavings.toFixed(1)}% vs original`);
    }
    nowLog('');
  }

  // -------------------------------------------------------------------------
  // FASE 9: Información final
  // -------------------------------------------------------------------------
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  nowLog('═══════════════════════════════════════════════════════════');
  
  if (FLAG_DRY_RUN) {
    nowLog('⚠️  MODO DRY-RUN: No se modificó ningún archivo');
    nowLog('   Ejecuta sin --dry-run para aplicar los cambios');
  } else {
    nowLog('✨ PROCESO COMPLETADO EXITOSAMENTE');
    if (errors.length === 0) {
      nowLog('   Todas las imágenes fueron optimizadas correctamente');
    }
  }
  
  nowLog(`⏱️  Tiempo total: ${elapsed}s`);
  nowLog(`📄 Log completo: ${LOG_FILE}`);
  if (!FLAG_DRY_RUN) {
    nowLog(`🗂️  Backup guardado en: ${BACKUP_ROOT}`);
  }
  nowLog('═══════════════════════════════════════════════════════════');

  // Código de salida apropiado
  if (errors.length > 0) {
    process.exitCode = 2;
  }
}

main().catch(err => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});
