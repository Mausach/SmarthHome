import React from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home/Home'



/*
Solucion para el f5 de vercel

Reemplaza BrowserRouter por HashRouter

Las URLs tendrán un # antes de la ruta:

Antes: tudominio.com/gerencia

Ahora: tudominio.com/#/gerencia

Ventajas:

 Soluciona el error 404 al recargar: El servidor solo ve la parte antes del # (siempre cargará index.html).

 Zero configuración en Vercel: No necesitas tocar vercel.json.

Desventajas:

 URLs menos limpias (con #).

 No recomendado para SEO (pero si es una app privada, no hay problema).

*/


export const AppRouter = () => {
  return (
    <HashRouter>
        <Routes>

        <Route path="/*" element={<Home />} />
      


      </Routes>

    </HashRouter>
    
  )
}