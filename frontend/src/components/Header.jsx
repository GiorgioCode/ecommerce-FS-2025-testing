// Componente Header - Navegación principal y acceso al carrito
// Incluye el logo, navegación y botón del carrito con contador
// Este componente se renderiza en todas las páginas como header fijo

// Importación de React (biblioteca principal)
import React from 'react';
// Importación de Link para navegación SPA y useLocation para detectar ruta activa
import { Link, useLocation } from 'react-router-dom';
// Importación del store de Zustand para acceder al estado del carrito
import { useCartStore } from '../store/useCartStore';

// Definición del componente funcional Header
const Header = () => {
  // Hook de React Router para obtener la ruta actual y marcar enlaces activos
  const location = useLocation();
  
  // Extracción de funciones del store de Zustand usando destructuring
  // getTotalItems: función para calcular total de productos en carrito
  // toggleCart: función para abrir/cerrar el drawer del carrito
  const { getTotalItems, toggleCart } = useCartStore();
  
  // Ejecutar la función getTotalItems para obtener el contador actual
  // Se re-ejecuta automáticamente cuando cambia el estado del carrito
  const totalItems = getTotalItems();

  // Renderizado del componente - JSX que define la estructura del header
  return (
    // Header fijo con fondo blanco, sombra y z-index alto para estar sobre otros elementos
    <header className="bg-white border-b sticky top-0 z-50">
      {/* Contenedor responsive que centra el contenido con padding */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Sección del logo y marca de la tienda */}
        <div className="flex flex-col">
          {/* Link de React Router que navega al home sin recargar la página */}
          <Link to="/" className="text-decoration-none hover:opacity-80 transition-opacity">
            {/* Título principal de la marca con color gaming */}
            <h1 className="text-xl font-bold text-gray-900">GameHub</h1>
            {/* Subtítulo descriptivo de la marca */}
            <p className="text-xs text-gray-500 hidden md:block">Gaming Store</p>
          </Link>
        </div>

        {/* Navegación principal del sitio - oculta en móviles */}
        <nav className="hidden md:flex">
          {/* Lista horizontal para los enlaces de navegación */}
          <ul className="flex space-x-6">
            {/* Item de navegación - Página de Inicio */}
            <li>
              <Link 
                to="/" // Ruta de destino
                // Clases Tailwind dinámicas: activo vs normal
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Inicio
              </Link>
            </li>
            {/* Item de navegación - Página de Productos */}
            <li>
              <Link 
                to="/products" // Ruta al catálogo de productos
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/products' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Productos
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sección del botón del carrito de compras */}
        <div className="flex items-center">
          <button 
            className="relative flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors" 
            onClick={toggleCart} // Event handler que ejecuta la función toggleCart al hacer click
            aria-label={`Abrir carrito (${totalItems} items)`} // Accesibilidad para lectores de pantalla
          >
            {/* Icono visual del carrito usando emoji para simplicidad */}
            <span className="text-base">🛒</span>
            
            {/* Badge contador que solo se muestra si hay items en el carrito */}
            {totalItems > 0 && ( // Renderizado condicional usando operador AND lógico
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems} {/* Muestra el número total de items */}
              </span>
            )}
            
            {/* Texto descriptivo del botón - oculto en móviles */}
            <span className="hidden sm:block">
              Carrito
              {/* Muestra el contador en el texto solo si hay items */}
              {totalItems > 0 && ` (${totalItems})`}
            </span>
          </button>
        </div>
        {/* Cierre del contenedor principal */}
      </div>
      {/* Cierre del elemento header */}
    </header>
  ); // Fin del return JSX
}; // Fin de la función del componente

// Exportación por defecto del componente para poder importarlo en otros archivos
export default Header;
