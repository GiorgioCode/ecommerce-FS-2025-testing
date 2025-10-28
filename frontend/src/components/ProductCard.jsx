// Componente ProductCard - Tarjeta reutilizable para mostrar información de un producto individual
// Responsabilidades: mostrar imagen, nombre, descripción, precio y botón de agregar al carrito
// Recibe un objeto 'product' como prop desde el componente padre (ProductList)

// Importación de React (biblioteca principal para crear componentes)
import React from 'react';
// Importación del store de Zustand para acceder a las funciones del carrito
import { useCartStore } from '../store/useCartStore';

// Definición del componente funcional que recibe 'product' como prop via destructuring
const ProductCard = ({ product }) => {
  // Extracción selectiva de solo la función addItem del store de Zustand
  // Esto es más eficiente que extraer todo el store ya que solo necesitamos esta función
  // useCartStore((state) => state.addItem) es un selector que retorna solo addItem
  const addItem = useCartStore((state) => state.addItem);

  // Event handler para manejar el click del botón "Agregar al Carrito"
  // Se ejecuta cuando el usuario hace click en el botón
  const handleAddToCart = () => {
    addItem(product); // Llama a la función del store pasándole el objeto producto completo
    // Feedback visual opcional (se podría agregar una notificación toast aquí)
  };

  // Función utilitaria para formatear números como moneda argentina
  // Reutiliza la misma lógica que en otros componentes para consistencia
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { // Configuración regional argentina
      style: 'currency',  // Formato de moneda
      currency: 'ARS',    // Peso argentino
    }).format(price);     // Convierte el número a formato de moneda
  };

  return (
    // Tarjeta con hover effect sutil y bordes redondeados
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Contenedor de la imagen del producto con overflow hidden */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={product.imagen} 
          alt={product.nombre}
          loading="lazy" // Optimización para carga perezosa
          className="w-full h-full object-cover"
          onError={(e) => {
            // Imagen fallback en caso de error
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>
      
      {/* Información del producto con padding */}
      <div className="p-4 space-y-2">
        {/* Nombre del producto */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{product.nombre}</h3>
        
        {/* Descripción con line-clamp para truncar texto largo */}
        <p className="text-xs text-gray-500 line-clamp-2">{product.descripcion}</p>
        
        {/* Precio destacado */}
        <div className="text-lg font-bold text-blue-600">{formatPrice(product.precio)}</div>
      </div>
      
      {/* Botón para agregar al carrito */}
      <div className="p-4 pt-0">
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors transform hover:scale-105 active:scale-95"
          onClick={handleAddToCart}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
