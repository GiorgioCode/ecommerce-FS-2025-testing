// Store global de Zustand para el manejo completo del carrito de compras
// Implementa el patrón de estado global sin necesidad de Context API
// Incluye persistencia automática en localStorage para mantener el carrito entre sesiones

// Importación de la función create de Zustand para crear el store
import { create } from 'zustand';
// Importación del middleware persist para persistencia en localStorage
import { persist } from 'zustand/middleware';

// Creación y exportación del store de carrito usando Zustand
// El store se crea usando la función create() que recibe una función de configuración
export const useCartStore = create(
  // Envolvemos el store con el middleware persist para localStorage
  persist(
    // Función de configuración que recibe set (para actualizar estado) y get (para leer estado)
    (set, get) => ({
      // === ESTADO INICIAL DEL STORE ===
      items: [],      // Array que almacena los productos del carrito en formato {producto, cantidad}
      isOpen: false,  // Boolean que controla si el drawer del carrito está visible
      
      // === ACCIÓN: AGREGAR PRODUCTO AL CARRITO ===
      // Función que maneja la lógica de agregar productos (nuevos o incrementar existentes)
      addItem: (product) => {
        // Obtener el estado actual de items usando get()
        const currentItems = get().items;
        
        // Buscar si el producto ya existe en el carrito comparando por ID
        // findIndex retorna el índice del elemento encontrado, o -1 si no existe
        const existingItemIndex = currentItems.findIndex(
          (item) => item.producto.id === product.id // Comparación por ID del producto
        );
        
        // Verificar si el producto ya existe en el carrito
        if (existingItemIndex >= 0) {
          // CASO 1: El producto ya existe - incrementar su cantidad
          // Crear una copia del array para mantener inmutabilidad (buena práctica React)
          const updatedItems = [...currentItems];
          // Incrementar la cantidad del producto existente
          updatedItems[existingItemIndex].cantidad += 1;
          // Actualizar el estado con set()
          set({ items: updatedItems });
        } else {
          // CASO 2: El producto no existe - agregarlo como nuevo item
          // Usar spread operator para crear nuevo array manteniendo items existentes
          set({
            items: [...currentItems, { producto: product, cantidad: 1 }]
          });
        }
      },
      
      // Función para eliminar un producto del carrito
      removeItem: (productId) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.producto.id === productId
        );
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...currentItems];
          if (updatedItems[existingItemIndex].cantidad > 1) {
            // Si hay más de 1, decrementar la cantidad
            updatedItems[existingItemIndex].cantidad -= 1;
          } else {
            // Si hay 1, eliminar el item completamente
            updatedItems.splice(existingItemIndex, 1);
          }
          set({ items: updatedItems });
        }
      },
      
      // Función para eliminar completamente un producto del carrito
      deleteItem: (productId) => {
        set({
          items: get().items.filter(item => item.producto.id !== productId)
        });
      },
      
      // Función para limpiar todo el carrito
      clearCart: () => {
        set({ items: [] });
      },
      
      // Función para calcular el total del carrito
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.producto.precio * item.cantidad), 
          0
        );
      },
      
      // Función para obtener la cantidad total de items
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },
      
      // Funciones para manejar el estado del drawer del carrito
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      // Función para obtener los datos del carrito formateados para la orden
      getOrderData: () => {
        const items = get().items;
        const total = get().getTotal();
        return {
          productos: items.map(item => ({
            id: item.producto.id,
            nombre: item.producto.nombre,
            precio: item.producto.precio,
            cantidad: item.cantidad
          })),
          total: total,
          fecha: new Date().toISOString()
        };
      }
    }),
    {
      name: 'cart-storage', // Nombre para localStorage
      partialize: (state) => ({ items: state.items }), // Solo persistir los items
    }
  )
);
