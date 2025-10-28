// ============================================================
// TESTS DEL COMPONENTE CART - EL CARRITO DE COMPRAS
// ============================================================
// ¿QUÉ ES EL CART?
// El Cart (carrito) es un componente tipo "drawer" (cajón deslizable)
// que aparece desde el lado derecho de la pantalla.
// Muestra:
// - Los productos que el usuario ha agregado
// - Cantidades de cada producto
// - El precio total
// - Botones para modificar cantidades
// - Opción de procesar la compra (checkout)
//
// ¿QUÉ VAMOS A TESTEAR?
// 1. Que el carrito se muestre/oculte correctamente
// 2. Manejo de carrito vacío
// 3. Mostrar productos correctamente
// 4. Botones de cantidad (+, -, eliminar)
// 5. Cálculo del total
// 6. Proceso de checkout
// 7. Manejo de errores

// ============================================================
// IMPORTACIONES NECESARIAS
// ============================================================

// IMPORTACIÓN 1: Herramientas de Vitest
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Ya conocidas, pero recordemos:
// - describe: Agrupa tests relacionados
// - it: Define un test individual
// - expect: Para verificaciones
// - vi: Para crear mocks
// - beforeEach: Código antes de cada test

// IMPORTACIÓN 2: React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// - render: Dibuja el componente
// - screen: Busca elementos
// - fireEvent: Simula acciones del usuario
// - waitFor: Espera código asíncrono (IMPORTANTE para el checkout)

// IMPORTACIÓN 3: El componente Cart que vamos a testear
import Cart from '../Cart';

// IMPORTACIÓN 4: El store del carrito
import { useCartStore } from '../../store/useCartStore';
// El Cart depende fuertemente del store
// El store contiene:
// - Lista de productos en el carrito
// - Estado abierto/cerrado
// - Funciones para modificar productos

// IMPORTACIÓN 5: La API de órdenes
import { ordersAPI } from '../../services/api';
// Se usa cuando el usuario hace checkout
// Envía la orden al servidor backend

// ============================================================
// CONFIGURACIÓN DE MOCKS
// ============================================================

// MOCK 1: El store del carrito
vi.mock('../../store/useCartStore');
// ¿Por qué mockear el store?
// - Para controlar exactamente qué productos hay en el carrito
// - Para verificar que se llaman las funciones correctas
// - Para evitar efectos secundarios entre tests
// - Para hacer los tests predecibles

// MOCK 2: La API de órdenes
vi.mock('../../services/api', () => ({
  ordersAPI: {
    create: vi.fn()
    // create es la función que envía la orden al servidor
    // La mockeamos para:
    // - No hacer llamadas HTTP reales
    // - Controlar si tiene éxito o falla
    // - Verificar que se llama con los datos correctos
  }
}));
// NOTA: Solo mockeamos ordersAPI.create
// No mockeamos otras funciones de la API que Cart no usa

// ============================================================
// SUITE DE TESTS PARA EL CARRITO
// ============================================================
describe('Cart Component', () => {
  
  // ============================================================
  // CONFIGURACIÓN DEL STORE MOCK
  // ============================================================
  // Creamos un objeto que simula el store del carrito
  // Este objeto tiene TODAS las propiedades y funciones que Cart espera
  const mockStore = {
    // PROPIEDADES DEL ESTADO
    items: [],        // Array de productos en el carrito
                     // Cada item tiene: { producto: {...}, cantidad: N }
    isOpen: true,    // ¿El drawer está abierto o cerrado?
    
    // FUNCIONES PARA MODIFICAR PRODUCTOS
    addItem: vi.fn(),     // Agregar/incrementar un producto
    removeItem: vi.fn(),  // Decrementar cantidad de un producto
    deleteItem: vi.fn(),  // Eliminar completamente un producto
    clearCart: vi.fn(),   // Vaciar todo el carrito
    
    // FUNCIONES DE CÁLCULO
    getTotal: vi.fn(),      // Calcular precio total
    getTotalItems: vi.fn(), // Contar total de items
    
    // FUNCIONES DE UI
    closeCart: vi.fn(),     // Cerrar el drawer
    
    // FUNCIONES DE DATOS
    getOrderData: vi.fn()   // Preparar datos para el checkout
  };
  // ¿Por qué crear este objeto?
  // Es como una "plantilla" del store que podemos modificar
  // en cada test según lo que necesitemos probar

  // ============================================================
  // CONFIGURACIÓN ANTES DE CADA TEST
  // ============================================================
  beforeEach(() => {
    // PASO 1: Limpiar todos los mocks
    vi.clearAllMocks();
    // Borra el "historial" de llamadas a funciones
    // Cada test empieza limpio
    
    // PASO 2: Configurar el store mock por defecto
    useCartStore.mockReturnValue(mockStore);
    // Cuando Cart llame a useCartStore(),
    // recibirá nuestro mockStore
    //
    // IMPORTANTE: Cada test puede sobrescribir esto
    // si necesita valores diferentes
  });

  // ============================================================
  // TEST 1: VERIFICAR QUE EL CARRITO SE OCULTA CUANDO ESTÁ CERRADO
  // ============================================================
  it('no debe renderizar nada cuando isOpen es false', () => {
    // PASO 1: Configurar el store con isOpen: false
    useCartStore.mockReturnValue({ ...mockStore, isOpen: false });
    // ¿Qué es { ...mockStore, isOpen: false }?
    // Los tres puntos (...) son el "spread operator"
    // Copia todas las propiedades de mockStore
    // PERO reemplaza isOpen con false
    // Es como decir: "usa todo lo de mockStore, pero cambia isOpen"
    //
    // Resultado:
    // - items: [] (copiado)
    // - isOpen: false (cambiado)
    // - addItem: vi.fn() (copiado)
    // - etc.
    
    // PASO 2: Renderizar el Cart
    const { container } = render(<Cart />);
    // container es el div que envuelve todo lo renderizado
    
    // PASO 3: Verificar que NO se renderizó nada
    expect(container.firstChild).toBeNull();
    // container.firstChild es el primer elemento hijo
    // Si es null, significa que Cart no renderizó nada
    //
    // ¿POR QUÉ ESTE COMPORTAMIENTO?
    // El Cart es un drawer (cajón deslizable)
    // Cuando está cerrado (isOpen: false):
    // - No debe renderizar NADA en el DOM
    // - No solo ocultarse con CSS
    // - Completamente ausente
    //
    // Esto es más eficiente:
    // - Menos elementos en el DOM
    // - Menos memoria usada
    // - Mejor performance
    //
    // Si este test falla:
    // Cart está renderizando algo cuando no debería
  });

  // ============================================================
  // TEST 2: MANEJO DE CARRITO VACÍO
  // ============================================================
  it('debe mostrar mensaje de carrito vacío cuando no hay items', () => {
    // PASO 1: Configurar un store con carrito vacío
    useCartStore.mockReturnValue({ 
      ...mockStore,                    // Copiar todo lo demás
      items: [],                       // Array vacío de productos
      getTotalItems: vi.fn(() => 0)   // Función que devuelve 0
    });
    // getTotalItems: vi.fn(() => 0)
    // Esto crea una función mock que SIEMPRE devuelve 0
    // La sintaxis () => 0 es una arrow function que devuelve 0
    
    // PASO 2: Renderizar el Cart
    render(<Cart />);
    // El Cart detectará que items está vacío
    // y mostrará un mensaje especial
    
    // PASO 3: Verificar el mensaje de carrito vacío
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    // Busca el texto exacto "Tu carrito está vacío"
    // Este mensaje debe ser claro y amigable
    
    // PASO 4: Verificar que hay un botón para continuar comprando
    expect(screen.getByRole('button', { name: /continuar comprando/i })).toBeInTheDocument();
    // Busca un botón que contenga "continuar comprando"
    // La 'i' hace la búsqueda case-insensitive
    //
    // ¿POR QUÉ ESTOS ELEMENTOS?
    // Cuando el carrito está vacío:
    // 1. No tiene sentido mostrar productos (no hay)
    // 2. No tiene sentido mostrar el total (sería $0)
    // 3. No tiene sentido mostrar checkout (nada que comprar)
    //
    // En su lugar, mostramos:
    // - Mensaje claro de que está vacío
    // - Botón para volver a comprar
    // - Esto guía al usuario sobre qué hacer
    //
    // UX (User Experience):
    // Un carrito vacío no debe ser un "callejón sin salida"
    // Siempre ofrece una acción siguiente al usuario
  });

  // ============================================================
  // TEST 3: MOSTRAR MÚLTIPLES PRODUCTOS EN EL CARRITO
  // ============================================================
  it('debe mostrar los productos en el carrito', () => {
    // PASO 1: Crear datos de prueba - un carrito con 2 productos
    const items = [
      {
        // PRODUCTO 1: PlayStation 5
        producto: {
          id: 1,                                      // ID único
          nombre: 'PlayStation 5',                   // Nombre a mostrar
          precio: 75000,                             // Precio unitario: $75,000
          imagen: 'https://example.com/ps5.jpg'     // URL de la imagen
        },
        cantidad: 2  // El usuario quiere comprar 2 unidades
      },
      {
        // PRODUCTO 2: Xbox Series X
        producto: {
          id: 2,
          nombre: 'Xbox Series X',
          precio: 65000,                            // Precio unitario: $65,000
          imagen: 'https://example.com/xbox.jpg'
        },
        cantidad: 1  // El usuario quiere comprar 1 unidad
      }
    ];
    // ESTRUCTURA DE DATOS:
    // Cada item en el carrito tiene:
    // - producto: Objeto con toda la info del producto
    // - cantidad: Cuántas unidades quiere el usuario
    //
    // CÁLCULOS:
    // - PS5: 2 unidades × $75,000 = $150,000
    // - Xbox: 1 unidad × $65,000 = $65,000
    // - TOTAL: $215,000
    // - ITEMS TOTALES: 3 (2 PS5 + 1 Xbox)
    
    // PASO 2: Configurar el store con estos productos
    useCartStore.mockReturnValue({
      ...mockStore,                    // Copiar funciones del mock base
      items,                           // Usar nuestros productos de prueba
      getTotalItems: vi.fn(() => 3),  // Total de items: 2 + 1 = 3
      getTotal: vi.fn(() => 215000)   // Total en dinero: 150000 + 65000 = 215000
    });
    // Nota: Configuramos las funciones de cálculo para devolver
    // los valores correctos según nuestros productos
    
    // PASO 3: Renderizar el Cart
    render(<Cart />);
    // Cart ahora mostrará los productos
    
    // PASO 4: Verificar que aparece el nombre del primer producto
    expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
    
    // PASO 5: Verificar que aparece el nombre del segundo producto
    expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
    
    // PASO 6: Verificar que aparece el contador total de items
    expect(screen.getByText('(3)')).toBeInTheDocument();
    // "(3)" aparece en el título del carrito indicando el total de items
    //
    // ¿QUÉ ESTAMOS VERIFICANDO?
    // 1. Que el Cart puede mostrar múltiples productos
    // 2. Que cada producto aparece con su nombre
    // 3. Que el contador refleja el total correcto
    //
    // NOTA: No verificamos precios individuales o imágenes
    // para mantener el test simple y enfocado
  });

  // ============================================================
  // TEST 4: VERIFICAR EL BOTÓN DE CERRAR
  // ============================================================
  it('debe cerrar el carrito al hacer click en el botón de cerrar', () => {
    // PASO 1: Renderizar el Cart (con configuración por defecto)
    render(<Cart />);
    // Usará mockStore que tiene isOpen: true
    
    // PASO 2: Buscar el botón de cerrar por su aria-label
    const closeButton = screen.getByLabelText('Cerrar carrito');
    // ¿Qué es getByLabelText?
    // Busca elementos por su atributo aria-label o por el texto de un <label>
    // aria-label es un atributo de accesibilidad que describe el elemento
    //
    // Ejemplo en HTML:
    // <button aria-label="Cerrar carrito">X</button>
    //
    // ¿POR QUÉ USAR aria-label?
    // 1. ACCESIBILIDAD: Los lectores de pantalla lo leen para usuarios ciegos
    // 2. TESTING: Podemos buscar botones que solo tienen iconos (X, ×, ✕)
    // 3. CLARIDAD: El test es más legible que buscar por "X"
    //
    // El botón de cerrar suele ser:
    // - Una X en la esquina superior derecha
    // - Un icono sin texto
    // - Por eso necesitamos aria-label
    
    // PASO 3: Simular click en el botón
    fireEvent.click(closeButton);
    // Esto dispara el evento onClick del botón
    
    // PASO 4: Verificar que se llamó la función closeCart
    expect(mockStore.closeCart).toHaveBeenCalledTimes(1);
    // Verificamos que la función del store fue llamada exactamente una vez
    //
    // FLUJO COMPLETO:
    // 1. Usuario ve el carrito abierto
    // 2. Usuario hace click en X
    // 3. El componente llama a closeCart()
    // 4. El store cambia isOpen a false
    // 5. El carrito desaparece
    //
    // Este test verifica el paso 3: que el click dispara la acción
    //
    // Si este test falla:
    // - El botón no tiene el onClick configurado
    // - El botón no existe
    // - El aria-label es diferente
  });

  // ============================================================
  // TEST 5: BOTÓN DE DECREMENTAR CANTIDAD (-)
  // ============================================================
  it('debe llamar a removeItem al decrementar cantidad', () => {
    // PASO 1: Crear un carrito con un producto que tiene cantidad > 1
    const items = [{
      producto: { 
        id: 1, 
        nombre: 'PlayStation 5', 
        precio: 75000, 
        imagen: 'test.jpg' 
      },
      cantidad: 2  // IMPORTANTE: Cantidad es 2, se puede decrementar
    }];
    // ¿Por qué cantidad: 2?
    // Si fuera 1 y decrementamos, el producto desaparecería
    // Con 2, al decrementar queda en 1
    
    // PASO 2: Configurar el store con este producto
    useCartStore.mockReturnValue({
      ...mockStore,
      items,
      getTotalItems: vi.fn(() => 2),    // 2 items totales
      getTotal: vi.fn(() => 150000)     // 2 × 75000 = 150000
    });
    
    // PASO 3: Renderizar el Cart
    render(<Cart />);
    // El Cart mostrará el producto con botones + y -
    
    // PASO 4: Buscar el botón de decrementar (-)
    const decrementButton = screen.getByLabelText('Decrementar cantidad');
    // Cada producto tiene:
    // [–] 2 [+]
    // El botón [–] decrementa la cantidad
    
    // PASO 5: Simular click en el botón de decrementar
    fireEvent.click(decrementButton);
    
    // PASO 6: Verificar que se llamó removeItem con el ID correcto
    expect(mockStore.removeItem).toHaveBeenCalledWith(1);
    // removeItem(1) significa:
    // "Quita una unidad del producto con ID 1"
    //
    // COMPORTAMIENTO ESPERADO:
    // - Si cantidad es 2: baja a 1
    // - Si cantidad es 1: el producto se elimina del carrito
    // - Si cantidad es 0: no debería pasar (error)
    //
    // ¿POR QUÉ removeItem Y NO deleteItem?
    // - removeItem: Quita UNA unidad (2 → 1)
    // - deleteItem: Elimina TODAS las unidades de golpe
    //
    // Si este test falla:
    // - El botón – no está conectado a removeItem
    // - El ID del producto no se está pasando correctamente
  });

  // ============================================================
  // TEST 6: BOTÓN DE INCREMENTAR CANTIDAD (+)
  // ============================================================
  it('debe llamar a addItem al incrementar cantidad', () => {
    // PASO 1: Crear los datos del producto
    const product = { 
      id: 1, 
      nombre: 'PlayStation 5', 
      precio: 75000, 
      imagen: 'test.jpg' 
    };
    
    // PASO 2: Crear un carrito con ese producto
    const items = [{
      producto: product,
      cantidad: 1
    }];
    
    useCartStore.mockReturnValue({
      ...mockStore,
      items,
      getTotalItems: vi.fn(() => 1),
      getTotal: vi.fn(() => 75000)    // 1 × 75000 = 75000
    });
    
    // PASO 3: Renderizar el Cart
    render(<Cart />);
    
    // PASO 4: Buscar el botón de incrementar (+)
    const incrementButton = screen.getByLabelText('Incrementar cantidad');
    // Interfaz del producto:
    // [–] 1 [+]
    // El botón [+] incrementa la cantidad
    
    // PASO 5: Simular click en el botón de incrementar
    fireEvent.click(incrementButton);
    
    // PASO 6: Verificar que se llamó addItem con el producto completo
    expect(mockStore.addItem).toHaveBeenCalledWith(product);
    // ¿POR QUÉ addItem RECIBE EL PRODUCTO COMPLETO?
    // - removeItem solo necesita el ID: removeItem(1)
    // - addItem necesita TODO el producto: addItem({id, nombre, precio...})
    // - Porque addItem puede agregar un producto NUEVO al carrito
    // - O incrementar uno existente
    //
    // FLUJO:
    // 1. Usuario ve: PS5 (cantidad: 1)
    // 2. Usuario hace click en [+]
    // 3. Cart llama a addItem(product)
    // 4. Store incrementa cantidad a 2
    //
    // Si este test falla:
    // - El botón + no llama a addItem
    // - No se está pasando el producto completo
  });

  // ============================================================
  // TEST 7: BOTÓN DE ELIMINAR PRODUCTO (PAPELERA/BASURA)
  // ============================================================
  it('debe llamar a deleteItem al eliminar producto', () => {
    // PASO 1: Crear un carrito con un producto
    const items = [{
      producto: { 
        id: 1, 
        nombre: 'PlayStation 5', 
        precio: 75000, 
        imagen: 'test.jpg' 
      },
      cantidad: 2  // Incluso con 2 unidades, se eliminará TODO
    }];
    
    // PASO 2: Configurar el store
    useCartStore.mockReturnValue({
      ...mockStore,
      items,
      getTotalItems: vi.fn(() => 2),
      getTotal: vi.fn(() => 150000)
    });
    
    // PASO 3: Renderizar el Cart
    render(<Cart />);
    
    // PASO 4: Buscar el botón de eliminar (icono de basura)
    const deleteButton = screen.getByLabelText('Eliminar producto');
    // Cada producto tiene 3 botones:
    // [–] 2 [+] [🗑️]
    // El último es eliminar (basura/papelera)
    
    // PASO 5: Simular click en eliminar
    fireEvent.click(deleteButton);
    
    // PASO 6: Verificar que se llamó deleteItem con el ID
    expect(mockStore.deleteItem).toHaveBeenCalledWith(1);
    // deleteItem(1) significa:
    // "Elimina COMPLETAMENTE el producto con ID 1"
    //
    // DIFERENCIA ENTRE TRES ACCIONES:
    // 1. removeItem(1): Resta 1 unidad (2 → 1)
    // 2. addItem(product): Suma 1 unidad (1 → 2)
    // 3. deleteItem(1): Elimina TODO (2 → 0, desaparece)
    //
    // ¿CUÁNDO USAR CADA UNO?
    // - Usuario click en [–]: removeItem
    // - Usuario click en [+]: addItem
    // - Usuario click en [🗑️]: deleteItem
    // - Usuario se arrepintió completamente del producto
    //
    // Si este test falla:
    // - El botón de basura no existe
    // - No está conectado a deleteItem
  });

  // ============================================================
  // TEST 8: FORMATO DEL PRECIO TOTAL
  // ============================================================
  it('debe mostrar el total formateado correctamente', () => {
    // PASO 1: Crear datos de prueba
    const items = [{
      producto: { 
        id: 1, 
        nombre: 'PlayStation 5', 
        precio: 75000,  // $75,000 cada una
        imagen: 'test.jpg' 
      },
      cantidad: 2  // 2 unidades = $150,000 total
    }];
    
    // PASO 2: Configurar el store
    useCartStore.mockReturnValue({
      ...mockStore,
      items,
      getTotalItems: vi.fn(() => 2),
      getTotal: vi.fn(() => 150000)  // Total: 2 × 75000
    });
    
    // PASO 3: Renderizar el Cart
    render(<Cart />);
    
    // PASO 4: Buscar el elemento que contiene "Total:"
    const totalElement = screen.getByText('Total:').nextElementSibling;
    // ¿Qué es nextElementSibling?
    // Es una propiedad del DOM que obtiene el siguiente elemento hermano
    // Ejemplo HTML:
    // <span>Total:</span>
    // <span>$150,000.00</span>  ← Este es el nextElementSibling
    //
    // ¿POR QUÉ BUSCAR ASÍ?
    // El texto "Total:" y el valor están en elementos separados
    // Primero encontramos "Total:", luego su hermano que tiene el valor
    
    // PASO 5: Verificar que el elemento existe
    expect(totalElement).toBeInTheDocument();
    
    // PASO 6: Verificar el formato del número
    expect(totalElement.textContent).toMatch(/150[.,]000/);
    // La regex /150[.,]000/ acepta:
    // - 150,000 (formato USA)
    // - 150.000 (formato Argentina)
    // [.,] significa "punto O coma"
    //
    // FORMATOS DE MONEDA SEGÚN PAÍS:
    // USA: $150,000.00 (coma para miles, punto para decimales)
    // Argentina: $150.000,00 (punto para miles, coma para decimales)
    // El test acepta ambos para ser flexible
    //
    // Si este test falla:
    // - El total no se está formateando
    // - Se muestra como 150000 sin separadores
    // - Hay un error en el cálculo
  });

  // ============================================================
  // TEST 9: BOTÓN DE VACIAR TODO EL CARRITO
  // ============================================================
  it('debe vaciar el carrito al hacer click en el botón correspondiente', () => {
    // PASO 1: Crear un carrito con al menos un producto
    const items = [{
      producto: { 
        id: 1, 
        nombre: 'PlayStation 5', 
        precio: 75000, 
        imagen: 'test.jpg' 
      },
      cantidad: 1
    }];
    // No importa cuántos productos haya
    // "Vaciar carrito" los elimina TODOS
    
    // PASO 2: Configurar el store
    useCartStore.mockReturnValue({
      ...mockStore,
      items,
      getTotalItems: vi.fn(() => 1),
      getTotal: vi.fn(() => 75000)
    });
    
    // PASO 3: Renderizar el Cart
    render(<Cart />);
    
    // PASO 4: Buscar el botón "Vaciar Carrito"
    const clearButton = screen.getByRole('button', { name: /vaciar carrito/i });
    // Este botón suele estar:
    // - Al final del carrito
    // - En color rojo o de advertencia
    // - Separado de los demás botones
    
    // PASO 5: Simular click
    fireEvent.click(clearButton);
    
    // PASO 6: Verificar que se llamó clearCart
    expect(mockStore.clearCart).toHaveBeenCalledTimes(1);
    // clearCart() no recibe parámetros
    // Simplemente vacía TODO el carrito
    //
    // DIFERENCIA ENTRE LIMPIAR Y ELIMINAR:
    // - deleteItem(1): Elimina UN producto específico
    // - clearCart(): Elimina TODOS los productos de una vez
    //
    // ¿CUÁNDO USAR CADA UNO?
    // - Usuario cambió de opinión sobre un producto: deleteItem
    // - Usuario quiere empezar de cero: clearCart
    // - Después de completar una compra: clearCart (automático)
    //
    // UX IMPORTANTE:
    // Este botón debe ser claramente diferente
    // Es una acción destructiva (borra todo)
    // Algunos sitios piden confirmación: "¿Estás seguro?"
  });

  // ============================================================
  // TEST 10: PROCESO DE CHECKOUT EXITOSO (TEST ASÍNCRONO)
  // ============================================================
  it('debe procesar el checkout correctamente', async () => {
    // NOTA: async en la función porque el checkout es asíncrono
    // El checkout hace una llamada HTTP al servidor
    
    // PASO 1: Crear datos del carrito
    const items = [{
      producto: { 
        id: 1, 
        nombre: 'PlayStation 5', 
        precio: 75000, 
        imagen: 'test.jpg' 
      },
      cantidad: 1
    }];
    
    // PASO 2: Crear los datos que se enviarán al servidor
    const orderData = {
      productos: [{ 
        id: 1, 
        nombre: 'PlayStation 5', 
        precio: 75000, 
        cantidad: 1 
      }],
      total: 75000,
      fecha: new Date().toISOString()  // Fecha en formato ISO: "2024-01-15T10:30:00.000Z"
    };
    // ¿Qué es toISOString()?
    // Convierte una fecha a formato estándar internacional
    // Ejemplo: "2024-01-15T10:30:00.000Z"
    // Es el formato que los servidores esperan
    
    // PASO 3: Configurar el store con la función getOrderData
    useCartStore.mockReturnValue({
      ...mockStore,
      items,
      getTotalItems: vi.fn(() => 1),
      getTotal: vi.fn(() => 75000),
      getOrderData: vi.fn(() => orderData)  // Esta función prepara los datos para enviar
    });
    
    // PASO 4: Configurar la respuesta exitosa de la API
    ordersAPI.create.mockResolvedValue({ id: 123, ...orderData });
    // ¿Qué es mockResolvedValue?
    // Hace que la función mock devuelva una PROMESA EXITOSA
    // La promesa se resuelve con: { id: 123, productos: [...], total: 75000, fecha: ... }
    //
    // DIFERENCIA ENTRE mockReturnValue y mockResolvedValue:
    // - mockReturnValue: Devuelve un valor inmediatamente
    // - mockResolvedValue: Devuelve una promesa que se resuelve con el valor
    // - mockRejectedValue: Devuelve una promesa que falla con un error
    
    // PASO 5: Renderizar el Cart
    render(<Cart />);
    
    // PASO 6: Buscar y clickear el botón de checkout
    const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });
    fireEvent.click(checkoutButton);
    
    // PASO 7: Verificar que muestra "Procesando..." inmediatamente
    expect(screen.getByText(/procesando/i)).toBeInTheDocument();
    // Mientras espera la respuesta del servidor,
    // debe mostrar algún indicador de carga
    // Esto mejora la UX (el usuario sabe que está pasando algo)
    
    // PASO 8: Esperar y verificar que todo se completó
    await waitFor(() => {
      // Verificar que se llamó a la API con los datos correctos
      expect(ordersAPI.create).toHaveBeenCalledWith(orderData);
      
      // Verificar que se limpió el carrito después del éxito
      expect(mockStore.clearCart).toHaveBeenCalled();
    });
    // ¿Qué hace await waitFor?
    // 1. Ejecuta la función que le pasamos
    // 2. Si alguna verificación falla, espera y reintenta
    // 3. Sigue reintentando hasta que pase o se agote el tiempo (1000ms por defecto)
    //
    // FLUJO COMPLETO DEL CHECKOUT:
    // 1. Usuario clickea "Finalizar Compra"
    // 2. Cart muestra "Procesando..."
    // 3. Cart llama a getOrderData() para preparar datos
    // 4. Cart envía los datos con ordersAPI.create(orderData)
    // 5. Servidor responde con éxito (id: 123)
    // 6. Cart limpia el carrito (clearCart)
    // 7. Cart muestra mensaje de éxito
    //
    // Si este test falla:
    // - El checkout no está llamando a la API
    // - No se está limpiando el carrito después
    // - Los datos no se están preparando correctamente
  });

  // ============================================================
  // TEST 11: MANEJO DE ERRORES EN EL CHECKOUT
  // ============================================================
  it('debe manejar errores en el checkout', async () => {
    // Este test verifica que la aplicación no "explote" cuando algo sale mal
    
    // PASO 1: Configurar el carrito
    const items = [{
      producto: { 
        id: 1, 
        nombre: 'PlayStation 5', 
        precio: 75000, 
        imagen: 'test.jpg' 
      },
      cantidad: 1
    }];
    
    // PASO 2: Configurar el store
    useCartStore.mockReturnValue({
      ...mockStore,
      items,
      getTotalItems: vi.fn(() => 1),
      getTotal: vi.fn(() => 75000),
      getOrderData: vi.fn(() => ({ 
        productos: [], 
        total: 75000 
      }))
    });
    
    // PASO 3: Configurar la API para que FALLE
    ordersAPI.create.mockRejectedValue(new Error('Error de red'));
    // mockRejectedValue hace que la promesa sea RECHAZADA
    // Simula errores como:
    // - Sin conexión a internet
    // - Servidor caído
    // - Error 500
    // - Timeout
    //
    // ¿Qué es new Error()?
    // Crea un objeto de error en JavaScript
    // Tiene propiedades como:
    // - message: "Error de red"
    // - stack: Dónde ocurrió el error
    
    // PASO 4: Renderizar el Cart
    render(<Cart />);
    
    // PASO 5: Intentar hacer checkout
    const checkoutButton = screen.getByRole('button', { name: /finalizar compra/i });
    fireEvent.click(checkoutButton);
    
    // PASO 6: Esperar y verificar que aparece mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/error al procesar la compra/i)).toBeInTheDocument();
    });
    // El mensaje de error debe ser:
    // - Claro: El usuario debe entender que pasó
    // - Amigable: No mostrar errores técnicos
    // - Útil: Ofrecer qué hacer (reintentar, contactar soporte)
    //
    // MAL MENSAJE: "Error 500: Internal Server Error"
    // BUEN MENSAJE: "Error al procesar la compra. Por favor, intenta nuevamente."
    //
    // QUÉ NO DEBE PASAR:
    // - El carrito NO debe limpiarse (la compra no se completó)
    // - La aplicación NO debe quedarse colgada
    // - NO debe aparecer una pantalla en blanco
    //
    // MANEJO DE ERRORES ROBUSTO:
    // 1. Capturar el error (try/catch)
    // 2. Mostrar mensaje al usuario
    // 3. Mantener el estado (no perder el carrito)
    // 4. Ofrecer opciones (reintentar, cancelar)
    // 5. Opcionalmente: Registrar el error para análisis
    //
    // Si este test falla:
    // - No se está capturando el error (try/catch)
    // - No se muestra mensaje de error
    // - La app crashea con el error
  });

  // ============================================================
  // TEST 12: PREVENIR CHECKOUT CON CARRITO VACÍO
  // ============================================================
  it('no debe procesar checkout con carrito vacío', () => {
    // PASO 1: Mockear window.alert
    window.alert = vi.fn();
    // ¿Qué es window.alert?
    // Es la función nativa del navegador que muestra alertas
    // alert("Hola") → muestra un popup con "Hola"
    //
    // ¿POR QUÉ MOCKEAR ALERT?
    // 1. En tests no hay navegador real (no puede mostrar popups)
    // 2. Los popups bloquearían los tests
    // 3. Queremos verificar que se intentó mostrar una alerta
    //
    // NOTA: alert() es considerado mala UX
    // Mejor usar notificaciones tipo toast o mensajes inline
    
    // PASO 2: Configurar un carrito vacío
    useCartStore.mockReturnValue({
      ...mockStore,
      items: [],                      // Array vacío
      getTotalItems: vi.fn(() => 0),  // 0 items
      getTotal: vi.fn(() => 0)         // Total $0
    });
    
    // PASO 3: Renderizar el Cart
    render(<Cart />);
    
    // PASO 4: Verificar que NO existe el botón de checkout
    expect(screen.queryByRole('button', { name: /finalizar compra/i })).not.toBeInTheDocument();
    // queryByRole (en lugar de getByRole) porque esperamos que NO exista
    // Si usáramos getByRole y no existe, el test fallaría con error
    //
    // DISEÑO DEFENSIVO:
    // El botón de checkout NO debe aparecer si el carrito está vacío
    // Esto previene errores antes de que ocurran
    //
    // CAPAS DE PROTECCIÓN:
    // 1. UI: No mostrar el botón si no hay items
    // 2. Lógica: Verificar items antes de procesar
    // 3. Backend: Validar que la orden tiene productos
    //
    // PRINCIPIO: "Fail Fast"
    // Detectar y prevenir errores lo antes posible
    // No esperar a que el servidor rechace una orden vacía
    //
    // UX CORRECTA para carrito vacío:
    // - NO mostrar botón de checkout
    // - Mostrar mensaje "Tu carrito está vacío"
    // - Ofrecer "Continuar comprando"
    //
    // Si este test falla:
    // - El botón aparece cuando no debería
    // - Falta validación de carrito vacío
  });
});

// ============================================================
// FIN DE LOS TESTS DEL CARRITO
// ============================================================
// RESUMEN DE LO QUE HEMOS TESTEADO:
// 1. Visibilidad: Se muestra/oculta correctamente
// 2. Estado vacío: Mensaje apropiado cuando no hay productos
// 3. Mostrar productos: Lista correcta de items
// 4. Controles de cantidad: Botones +, -, eliminar
// 5. Formateo: Precios con formato de moneda
// 6. Acciones globales: Vaciar carrito, cerrar drawer
// 7. Checkout exitoso: Envío de orden y limpieza
// 8. Manejo de errores: Qué pasa cuando falla
// 9. Validaciones: No permitir acciones inválidas
//
// COBERTURA:
// Estos tests cubren los casos de uso principales
// y los casos límite (edge cases) del carrito
//
// IMPORTANTE:
// El carrito es crítico para el e-commerce
// Errores aquí = pérdida de ventas
// Por eso necesita tests exhaustivos
