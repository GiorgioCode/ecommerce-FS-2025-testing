// Componente App - Componente raíz de la aplicación React
// Responsabilidades: configurar enrutamiento, layout general y estructura de páginas
// Este es el punto de entrada principal después del index.js

// Importación de React (biblioteca principal)
import React from 'react';
// Importación de componentes de React Router para navegación SPA (Single Page Application)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importación de componentes principales de la aplicación
import Header from './components/Header';     // Navegación principal y marca
import Cart from './components/Cart';         // Carrito lateral (drawer)
import Home from './pages/Home';              // Página de inicio
import Products from './pages/Products';      // Catálogo de productos
// Ya no necesitamos importar CSS personalizado - usamos Tailwind

// Definición del componente funcional principal App
function App() {
  return (
    // BrowserRouter habilita la navegación SPA usando HTML5 History API
    // Envuelve toda la aplicación para habilitar React Router
    <Router>
      {/* Contenedor principal con layout usando Flexbox */}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header fijo que se muestra en todas las páginas */}
        <Header />
        
        {/* Contenedor principal para las páginas - flex-1 para ocupar espacio disponible */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4">
          <Routes>
            {/* Ruta principal - Página de inicio */}
            <Route path="/" element={<Home />} />
            
            {/* Ruta de productos - Lista completa con filtros */}
            <Route path="/products" element={<Products />} />
            
            
            {/* Ruta 404 - Página no encontrada */}
            <Route path="*" element={
              <div className="text-center py-8 space-y-3">
                <h2 className="text-xl font-bold text-gray-900">Página no encontrada</h2>
                <p className="text-gray-600">La página que buscas no existe.</p>
                <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                  Volver al inicio
                </a>
              </div>
            } />
          </Routes>
        </main>
        
        {/* Componente del carrito - Se muestra como overlay cuando está abierto */}
        <Cart />
        
        {/* Footer simple con Tailwind */}
        <footer className="bg-gray-900 text-white py-4 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm">&copy; 2024 GameHub. Todos los derechos reservados.</p>
            <p className="text-xs text-gray-400">Gaming Store</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App
