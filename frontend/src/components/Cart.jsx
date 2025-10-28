// Componente Cart - Carrito lateral (drawer) con funcionalidad completa de e-commerce
// Responsabilidades: mostrar productos, modificar cantidades, calcular totales y procesar checkout
// Se renderiza como overlay cuando el estado isOpen del store es true

// Importación de React y hook useState para manejar estados locales del componente
import React, { useState } from 'react';
// Importación del store de Zustand que contiene toda la lógica del carrito
import { useCartStore } from '../store/useCartStore';
// Importación del servicio API para comunicarse con el backend y enviar órdenes
import { ordersAPI } from '../services/api';

// Definición del componente funcional Cart
const Cart = () => {
  // Extracción de estados y funciones del store global de Zustand mediante destructuring
  const { 
    items,        // Array de productos en el carrito con formato {producto, cantidad}
    isOpen,       // Boolean que determina si el carrito está visible
    addItem,      // Función para agregar un producto al carrito
    removeItem,   // Función para decrementar cantidad o eliminar producto
    deleteItem,   // Función para eliminar completamente un producto
    clearCart,    // Función para vaciar todo el carrito
    getTotal,     // Función que calcula el precio total del carrito
    getTotalItems,// Función que cuenta el total de productos
    closeCart,    // Función para cerrar el drawer del carrito
    getOrderData  // Función que formatea los datos para enviar al backend
  } = useCartStore();

  // Estados locales del componente para manejar el proceso de checkout
  // Estos estados no se comparten globalmente, solo son necesarios en este componente
  const [isCheckingOut, setIsCheckingOut] = useState(false);   // Indica si está procesando la compra
  const [checkoutSuccess, setCheckoutSuccess] = useState(false); // Indica si la compra fue exitosa
  const [checkoutError, setCheckoutError] = useState(null);    // Almacena mensajes de error del checkout

  // Función utilitaria para formatear números como moneda argentina
  // Utiliza la API de Internacionalización de JavaScript (Intl)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { // Configuración para Argentina
      style: 'currency',  // Formato de moneda
      currency: 'ARS',    // Peso argentino
    }).format(price);     // Aplica el formato al precio recibido
  };

  // Función asíncrona para manejar el proceso completo de checkout
  // Se ejecuta cuando el usuario hace click en "Finalizar Compra"
  const handleCheckout = async () => {
    // Validación: verificar que el carrito no esté vacío
    if (items.length === 0) {
      alert('Tu carrito está vacío'); // Alert básico (se podría mejorar con toast)
      return; // Salir de la función sin continuar
    }

    // Activar el estado de loading para mostrar spinner/deshabilitar botón
    setIsCheckingOut(true);
    // Limpiar cualquier error previo
    setCheckoutError(null);

    try { // Bloque try-catch para manejo de errores asíncronos
      // Obtener los datos formateados de la orden desde el store
      const orderData = getOrderData();
      
      // Realizar petición HTTP POST al backend para crear la orden
      // Utiliza el servicio API que encapsula fetch
      const response = await ordersAPI.create(orderData);
      
      // Si la petición es exitosa, procesar la respuesta
      console.log('Orden creada exitosamente:', response);
      setCheckoutSuccess(true); // Activar modal de éxito
      
      // Vaciar el carrito ya que la compra fue exitosa
      clearCart();
      
      // Auto-cerrar el modal de éxito y el carrito después de 3 segundos
      // setTimeout programa la ejecución de una función después de un delay
      setTimeout(() => {
        setCheckoutSuccess(false); // Ocultar modal de éxito
        closeCart();               // Cerrar el drawer del carrito
      }, 3000); // 3000ms = 3 segundos
      
    } catch (error) {
      console.error('Error en el checkout:', error);
      setCheckoutError('Error al procesar la compra. Inténtalo nuevamente.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Función para cerrar el carrito
  const handleCloseCart = () => {
    closeCart();
    setCheckoutError(null);
    setCheckoutSuccess(false);
  };

  // No renderizar si el carrito está cerrado
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto flex flex-col">
        {/* Header del carrito */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Carrito 
            {getTotalItems() > 0 && (
              <span className="text-sm text-gray-500">({getTotalItems()})</span>
            )}
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center"
            onClick={handleCloseCart}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
        </div>

        {/* Contenido del carrito */}
        <div className="flex-1 p-4">
          {items.length === 0 ? (
            // Carrito vacío
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <button onClick={closeCart} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                Continuar Comprando
              </button>
            </div>
          ) : (
            // Carrito con productos
            <>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.producto.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    {/* Imagen del producto */}
                    <img 
                      src={item.producto.imagen} 
                      alt={item.producto.nombre}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                      }}
                    />
                    
                    {/* Información del producto */}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.producto.nombre}</h4>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.producto.precio)}
                      </p>
                    </div>
                    
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeItem(item.producto.id)}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-gray-200"
                        aria-label="Decrementar cantidad"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.cantidad}</span>
                      <button 
                        onClick={() => addItem(item.producto)}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm hover:bg-gray-200"
                        aria-label="Incrementar cantidad"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => deleteItem(item.producto.id)}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                        aria-label="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    {/* Subtotal del item */}
                    <div className="text-sm font-medium text-blue-600">
                      {formatPrice(item.producto.precio * item.cantidad)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total del carrito */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">Total:</span>
                  <span className="text-lg font-bold text-blue-600">{formatPrice(getTotal())}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-2">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Procesando...' : 'Finalizar Compra'}
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded transition-colors"
                >
                  Vaciar Carrito
                </button>
              </div>
            </>
          )}

          {/* Modal de éxito */}
          {checkoutSuccess && (
            <div className="success-modal">
              <div className="success-content">
                <h3>¡Compra Exitosa!</h3>
                <p>Tu pedido ha sido procesado correctamente.</p>
                <p>Recibirás un email de confirmación pronto.</p>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {checkoutError && (
            <div className="error-message">
              <p>{checkoutError}</p>
              <button 
                onClick={() => setCheckoutError(null)}
                className="close-error-btn"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
