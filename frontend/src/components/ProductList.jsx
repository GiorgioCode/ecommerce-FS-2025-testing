// Componente ProductList - Lista de productos obtenidos del JSON Server
// Maneja el estado de carga, errores y renderiza las tarjetas de productos
import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from './ProductCard';

const ProductList = () => {
  // Estados para manejar los productos y el estado de la petición
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook useEffect para cargar los productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Petición a la API para obtener todos los productos
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Error al cargar los productos. Verifica que el servidor esté ejecutándose.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // Array vacío significa que solo se ejecuta al montar

  // Función para reintentar la carga de productos
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-ejecutar la carga después de un breve delay
    setTimeout(() => {
      const loadProducts = async () => {
        try {
          const data = await productsAPI.getAll();
          setProducts(data);
        } catch (err) {
          setError('Error al cargar los productos. Verifica que el servidor esté ejecutándose.');
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }, 500);
  };

  // Renderizado condicional basado en el estado
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-3">
        {/* Spinner animado con Tailwind */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-center space-y-3">
        <h3 className="text-base font-semibold text-red-800">¡Ups! Algo salió mal</h3>
        <p className="text-sm text-red-600">{error}</p>
        <button 
          onClick={handleRetry} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Reintentar
        </button>
        <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
          💡 Asegúrate de que el servidor JSON esté ejecutándose en el puerto 3001:
          <br />
          <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-xs">cd backend && npm run dev</code>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">No hay productos disponibles</h3>
        <p className="text-sm text-gray-600">Parece que no hay productos en la tienda en este momento.</p>
        <button 
          onClick={handleRetry} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Actualizar
        </button>
      </div>
    );
  }

  // Renderizado principal con la lista de productos
  return (
    <div>
      {/* Grid responsivo de productos usando CSS Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
