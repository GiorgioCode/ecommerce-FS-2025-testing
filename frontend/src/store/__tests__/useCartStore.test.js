// ============================================================
// TESTS DEL STORE DE ZUSTAND - ESTADO GLOBAL DEL CARRITO
// Zustand es una librería de manejo de estado global (como Redux pero más simple)
// Este archivo testea todas las funciones del store del carrito
// ============================================================

// IMPORTACIONES NECESARIAS
// 'describe', 'it', 'expect', 'beforeEach' - Utilidades de Vitest para testing
import { describe, it, expect, beforeEach } from 'vitest';

// 'renderHook' - Permite testear hooks de React de forma aislada (sin componentes)
// 'act' - Envuelve las actualizaciones de estado para que React las procese correctamente
import { renderHook, act } from '@testing-library/react';

// Importamos el store de Zustand que vamos a testear
// Este store maneja todo el estado del carrito de compras
import { useCartStore } from '../useCartStore';

// SUITE PRINCIPAL DE TESTS
describe('useCartStore - Zustand Store', () => {
  // CONFIGURACIÓN ANTES DE CADA TEST
  // Esto garantiza que cada test empiece con un store limpio
  beforeEach(() => {
    // act() es necesario cuando modificamos estado en los tests
    // Le dice a React que procese todas las actualizaciones pendientes
    act(() => {
      // Limpiamos todos los productos del carrito
      useCartStore.getState().clearCart();
      
      // Cerramos el drawer del carrito (por si estaba abierto)
      useCartStore.getState().closeCart();
    });
    
    // NOTA: getState() obtiene el estado actual del store de Zustand
    // No necesitamos renderizar un componente, accedemos directamente al store
  });

  // GRUPO DE TESTS 1: GESTIÓN DE PRODUCTOS EN EL CARRITO
  describe('Gestión de productos', () => {
    
    // TEST 1: Agregar un producto nuevo al carrito
    it('debe agregar un producto nuevo al carrito', () => {
      // PASO 1: Creamos un producto de prueba
      const product = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      
      // PASO 2: Agregamos el producto al carrito
      // act() envuelve las actualizaciones de estado para que React las procese
      act(() => {
        // Obtenemos el store y llamamos a la función addItem
        useCartStore.getState().addItem(product);
      });
      
      // PASO 3: Obtenemos los items actuales del carrito
      const items = useCartStore.getState().items;
      
      // PASO 4: Verificamos que hay exactamente 1 item en el carrito
      expect(items).toHaveLength(1);
      
      // PASO 5: Verificamos que el item tiene la estructura correcta
      // Debe ser un objeto con 'producto' y 'cantidad'
      expect(items[0]).toEqual({ producto: product, cantidad: 1 });
    });

    // TEST 2: Incrementar cantidad cuando agregamos un producto que ya existe
    it('debe incrementar la cantidad si el producto ya existe', () => {
      // PASO 1: Creamos un producto de prueba
      const product = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      
      // PASO 2: Agregamos el mismo producto DOS veces
      act(() => {
        // Primera vez: agrega el producto con cantidad 1
        useCartStore.getState().addItem(product);
        
        // Segunda vez: debe incrementar la cantidad a 2 (no crear otro item)
        useCartStore.getState().addItem(product);
      });
      
      // PASO 3: Obtenemos los items del carrito
      const items = useCartStore.getState().items;
      
      // PASO 4: Verificamos que sigue habiendo UN solo item (no dos)
      expect(items).toHaveLength(1);
      
      // PASO 5: Verificamos que la cantidad se incrementó a 2
      expect(items[0].cantidad).toBe(2);
    });

    // TEST 3: Decrementar cantidad cuando removemos un item
    it('debe remover un item decrementando la cantidad', () => {
      // PASO 1: Creamos un producto de prueba
      const product = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      
      // PASO 2: Agregamos el producto 2 veces, luego removemos 1
      act(() => {
        // Agregamos dos veces (cantidad = 2)
        useCartStore.getState().addItem(product);
        useCartStore.getState().addItem(product);
        
        // Removemos una vez (debe quedar cantidad = 1)
        // removeItem recibe el ID del producto
        useCartStore.getState().removeItem(1);
      });
      
      // PASO 3: Obtenemos los items del carrito
      const items = useCartStore.getState().items;
      
      // PASO 4: Verificamos que el producto sigue en el carrito
      expect(items).toHaveLength(1);
      
      // PASO 5: Verificamos que la cantidad se decrementó a 1
      expect(items[0].cantidad).toBe(1);
    });

    // TEST 4: Eliminar completamente el producto cuando la cantidad llega a 0
    it('debe eliminar el producto si la cantidad llega a 0', () => {
      // PASO 1: Creamos un producto de prueba
      const product = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      
      // PASO 2: Agregamos 1 producto y luego lo removemos
      act(() => {
        // Agregamos una vez (cantidad = 1)
        useCartStore.getState().addItem(product);
        
        // Removemos una vez (cantidad = 0, debe eliminarse del carrito)
        useCartStore.getState().removeItem(1);
      });
      
      // PASO 3: Obtenemos los items del carrito
      const items = useCartStore.getState().items;
      
      // PASO 4: Verificamos que el carrito está vacío
      // El producto fue completamente eliminado, no solo con cantidad 0
      expect(items).toHaveLength(0);
    });

    // TEST 5: Eliminar completamente un producto sin importar su cantidad
    it('debe eliminar completamente un producto con deleteItem', () => {
      // PASO 1: Creamos dos productos diferentes de prueba
      const product1 = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      const product2 = { id: 2, nombre: 'Xbox Series X', precio: 65000 };
      
      // PASO 2: Agregamos productos y luego eliminamos uno completamente
      act(() => {
        // Agregamos product1 dos veces (cantidad = 2)
        useCartStore.getState().addItem(product1);
        useCartStore.getState().addItem(product1);
        
        // Agregamos product2 una vez
        useCartStore.getState().addItem(product2);
        
        // deleteItem elimina TODO el product1, sin importar que tenga cantidad 2
        // Es diferente a removeItem que solo decrementa
        useCartStore.getState().deleteItem(1);
      });
      
      // PASO 3: Obtenemos los items del carrito
      const items = useCartStore.getState().items;
      
      // PASO 4: Verificamos que solo queda 1 producto (el Xbox)
      expect(items).toHaveLength(1);
      
      // PASO 5: Verificamos que el producto restante es el Xbox (id: 2)
      expect(items[0].producto.id).toBe(2);
    });

    // TEST 6: Vaciar completamente el carrito
    it('debe limpiar todo el carrito con clearCart', () => {
      // PASO 1: Creamos dos productos de prueba
      const product1 = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      const product2 = { id: 2, nombre: 'Xbox Series X', precio: 65000 };
      
      // PASO 2: Agregamos productos y luego vaciamos todo el carrito
      act(() => {
        // Agregamos ambos productos
        useCartStore.getState().addItem(product1);
        useCartStore.getState().addItem(product2);
        
        // clearCart elimina TODOS los productos del carrito de una vez
        useCartStore.getState().clearCart();
      });
      
      // PASO 3: Obtenemos los items del carrito
      const items = useCartStore.getState().items;
      
      // PASO 4: Verificamos que el carrito está completamente vacío
      expect(items).toHaveLength(0);
    });
  });
  // FIN DEL GRUPO DE GESTIÓN DE PRODUCTOS

  // GRUPO DE TESTS 2: CÁLCULOS MATEMÁTICOS DEL CARRITO
  describe('Cálculos del carrito', () => {
    
    // TEST 1: Verificar que el total se calcula correctamente
    it('debe calcular el total correctamente', () => {
      // PASO 1: Creamos productos con precios conocidos
      const product1 = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      const product2 = { id: 2, nombre: 'Xbox Series X', precio: 65000 };
      
      // PASO 2: Agregamos productos al carrito
      act(() => {
        // Agregamos PlayStation dos veces
        useCartStore.getState().addItem(product1);
        useCartStore.getState().addItem(product1); // Total PS5: 75000 * 2 = 150000
        
        // Agregamos Xbox una vez
        useCartStore.getState().addItem(product2); // Total Xbox: 65000 * 1 = 65000
      });
      
      // PASO 3: Llamamos a la función getTotal() que debe calcular el precio total
      const total = useCartStore.getState().getTotal();
      
      // PASO 4: Verificamos el cálculo matemático
      // Total esperado: (75000 * 2) + (65000 * 1) = 150000 + 65000 = 215000
      expect(total).toBe(75000 * 2 + 65000);
    });

    // TEST 2: Verificar que cuenta correctamente el total de items
    it('debe calcular el total de items correctamente', () => {
      // PASO 1: Creamos productos de prueba
      const product1 = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      const product2 = { id: 2, nombre: 'Xbox Series X', precio: 65000 };
      
      // PASO 2: Agregamos varios productos
      act(() => {
        // Agregamos PlayStation TRES veces
        useCartStore.getState().addItem(product1);
        useCartStore.getState().addItem(product1);
        useCartStore.getState().addItem(product1); // Total: 3 unidades de PS5
        
        // Agregamos Xbox UNA vez
        useCartStore.getState().addItem(product2); // Total: 1 unidad de Xbox
      });
      
      // PASO 3: Llamamos a getTotalItems() que debe contar TODAS las unidades
      const totalItems = useCartStore.getState().getTotalItems();
      
      // PASO 4: Verificamos que cuenta 4 items en total (3 PS5 + 1 Xbox)
      // getTotalItems cuenta la cantidad total, no los productos diferentes
      expect(totalItems).toBe(4);
    });

    // TEST 3: Verificar valores cuando el carrito está vacío
    it('debe retornar 0 cuando el carrito está vacío', () => {
      // PASO 1: No agregamos ningún producto (el carrito ya está limpio por beforeEach)
      
      // PASO 2: Obtenemos el total del precio
      const total = useCartStore.getState().getTotal();
      
      // PASO 3: Obtenemos el total de items
      const totalItems = useCartStore.getState().getTotalItems();
      
      // PASO 4: Verificamos que ambos valores son 0
      expect(total).toBe(0);        // Precio total debe ser 0
      expect(totalItems).toBe(0);   // Cantidad total debe ser 0
    });
  });
  // FIN DEL GRUPO DE CÁLCULOS

  // GRUPO DE TESTS 3: CONTROL DE VISIBILIDAD DEL DRAWER
  describe('Control del drawer del carrito', () => {
    
    // TEST 1: Abrir el drawer del carrito
    it('debe abrir el carrito', () => {
      // PASO 1: Llamamos a la función openCart
      act(() => {
        useCartStore.getState().openCart();
      });
      
      // PASO 2: Verificamos que el estado isOpen cambió a true
      // isOpen controla si el drawer del carrito está visible o no
      expect(useCartStore.getState().isOpen).toBe(true);
    });

    // TEST 2: Cerrar el drawer del carrito
    it('debe cerrar el carrito', () => {
      // PASO 1: Primero abrimos y luego cerramos el carrito
      act(() => {
        // Abrimos el carrito primero
        useCartStore.getState().openCart();
        
        // Luego lo cerramos
        useCartStore.getState().closeCart();
      });
      
      // PASO 2: Verificamos que isOpen volvió a false
      expect(useCartStore.getState().isOpen).toBe(false);
    });

    // TEST 3: Alternar (toggle) el estado del carrito
    it('debe alternar el estado del carrito', () => {
      // PASO 1: Guardamos el estado inicial (debería ser false por el beforeEach)
      const initialState = useCartStore.getState().isOpen;
      
      // PASO 2: Llamamos a toggleCart por primera vez
      act(() => {
        // toggleCart invierte el estado: si está cerrado lo abre, si está abierto lo cierra
        useCartStore.getState().toggleCart();
      });
      
      // PASO 3: Verificamos que el estado se invirtió
      expect(useCartStore.getState().isOpen).toBe(!initialState);
      
      // PASO 4: Llamamos a toggleCart por segunda vez
      act(() => {
        useCartStore.getState().toggleCart();
      });
      
      // PASO 5: Verificamos que volvió al estado original
      expect(useCartStore.getState().isOpen).toBe(initialState);
    });
  });
  // FIN DEL GRUPO DE CONTROL DEL DRAWER

  // GRUPO DE TESTS 4: PREPARACIÓN DE DATOS PARA ÓRDENES
  describe('Datos de orden', () => {
    
    // TEST 1: Generar estructura de datos para enviar al backend
    it('debe generar los datos de orden correctamente', () => {
      // PASO 1: Creamos productos de prueba
      const product1 = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
      const product2 = { id: 2, nombre: 'Xbox Series X', precio: 65000 };
      
      // PASO 2: Agregamos productos al carrito
      act(() => {
        useCartStore.getState().addItem(product1);  // Primera PS5
        useCartStore.getState().addItem(product1);  // Segunda PS5
        useCartStore.getState().addItem(product2);  // Un Xbox
      });
      
      // PASO 3: Obtenemos los datos formateados para la orden
      // getOrderData() prepara los datos en el formato que espera el backend
      const orderData = useCartStore.getState().getOrderData();
      
      // PASO 4: Verificamos que la orden tiene todas las propiedades necesarias
      expect(orderData).toHaveProperty('productos');  // Lista de productos
      expect(orderData).toHaveProperty('total');      // Total a pagar
      expect(orderData).toHaveProperty('fecha');       // Fecha de la orden
      
      // PASO 5: Verificamos que hay 2 productos diferentes (no 3 items)
      expect(orderData.productos).toHaveLength(2);
      
      // PASO 6: Verificamos los detalles del primer producto (PS5)
      expect(orderData.productos[0]).toEqual({
        id: 1,
        nombre: 'PlayStation 5',
        precio: 75000,
        cantidad: 2  // Nota: cantidad es 2 porque agregamos PS5 dos veces
      });
      
      // PASO 7: Verificamos los detalles del segundo producto (Xbox)
      expect(orderData.productos[1]).toEqual({
        id: 2,
        nombre: 'Xbox Series X',
        precio: 65000,
        cantidad: 1  // Solo agregamos Xbox una vez
      });
      
      // PASO 8: Verificamos el total calculado
      expect(orderData.total).toBe(215000);  // (75000*2) + (65000*1) = 215000
      
      // PASO 9: Verificamos que se generó una fecha
      // toBeTruthy() verifica que el valor existe y no es null/undefined/false
      expect(orderData.fecha).toBeTruthy();
    });

    // TEST 2: Generar orden vacía cuando no hay productos
    it('debe generar datos de orden vacíos cuando no hay productos', () => {
      // PASO 1: No agregamos productos (carrito vacío)
      
      // PASO 2: Obtenemos los datos de orden del carrito vacío
      const orderData = useCartStore.getState().getOrderData();
      
      // PASO 3: Verificamos que la lista de productos está vacía
      expect(orderData.productos).toHaveLength(0);
      
      // PASO 4: Verificamos que el total es 0
      expect(orderData.total).toBe(0);
      
      // PASO 5: Verificamos que aún así se genera una fecha
      // Incluso con carrito vacío, la orden debe tener fecha
      expect(orderData.fecha).toBeTruthy();
    });
  });
  // FIN DEL GRUPO DE DATOS DE ORDEN
});
// FIN DE TODOS LOS TESTS DEL STORE
