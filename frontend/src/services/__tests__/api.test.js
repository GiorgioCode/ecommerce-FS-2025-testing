// ============================================================
// TESTS DE SERVICIOS API - COMUNICACIÓN CON EL BACKEND
// ============================================================
// ¿QUÉ SON LOS SERVICIOS API?
// Son funciones que encapsulan las llamadas HTTP al servidor backend
// Se encargan de:
// - Hacer peticiones HTTP (GET, POST, PUT, DELETE)
// - Manejar las respuestas del servidor
// - Transformar datos si es necesario
// - Manejar errores de red y HTTP
// - Proveer una interfaz limpia para el resto de la aplicación
//
// ¿QUÉ VAMOS A TESTEAR?
// 1. Peticiones GET (obtener datos)
// 2. Peticiones POST (crear datos)
// 3. Peticiones PUT (actualizar datos)
// 4. Peticiones DELETE (eliminar datos)
// 5. Manejo de errores de red
// 6. Manejo de errores HTTP (400, 404, 500, etc.)
// 7. Headers y body de las peticiones
// 8. Transformación de respuestas
// 9. Health check del servidor

// ============================================================
// IMPORTACIONES
// ============================================================

// IMPORTACIÓN 1: Herramientas de Vitest
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// - describe: Agrupa tests relacionados (API Service, productsAPI, etc.)
// - it: Define cada test individual
// - expect: Para verificaciones
// - vi: Para crear mocks (especialmente importante para fetch)
// - beforeEach: Limpiar mocks antes de cada test
// - afterEach: Restaurar mocks después de cada test

// IMPORTACIÓN 2: Los servicios que vamos a testear
import { productsAPI, ordersAPI, checkServerHealth } from '../api';
// Estos son los servicios que encapsulan las llamadas HTTP:
// - productsAPI: CRUD de productos
// - ordersAPI: CRUD de órdenes
// - checkServerHealth: Verifica si el servidor está disponible

// ============================================================
// MOCK GLOBAL DE FETCH
// ============================================================
global.fetch = vi.fn();
// ⚠️ CONCEPTO CRÍTICO: Mockear fetch
//
// ¿QUÉ ES FETCH?
// fetch es la función nativa del navegador para hacer peticiones HTTP
// Ejemplo real:
// fetch('https://api.ejemplo.com/productos')
//   .then(response => response.json())
//   .then(data => console.log(data))
//
// ¿POR QUÉ MOCKEAR FETCH?
// 1. En tests NO queremos hacer peticiones HTTP reales:
//    - Serían lentas (red)
//    - Dependerían de un servidor externo
//    - Podrían fallar por razones ajenas al código
//    - Costarían dinero (APIs de pago)
//    - Modificarían datos reales
//
// 2. Con el mock podemos:
//    - Controlar exactamente qué responde
//    - Simular errores
//    - Verificar qué se llamó
//    - Hacer tests instantáneos
//
// global.fetch = vi.fn()
// Reemplaza la función fetch global con una función mock de Vitest
// Ahora cuando el código llame a fetch(), usará nuestro mock

// ============================================================
// SUITE PRINCIPAL DE TESTS
// ============================================================
describe('API Service', () => {
  // Todos los tests de servicios API van aquí
  
  // ============================================================
  // CONFIGURACIÓN ANTES DE CADA TEST
  // ============================================================
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpia el historial de llamadas de todos los mocks
    // Especialmente importante para fetch que se usa en todos los tests
    // Sin esto:
    // - Test 1 llama fetch 2 veces
    // - Test 2 pensaría que fetch fue llamado 4 veces (2 del test 1 + 2 propias)
  });

  // ============================================================
  // LIMPIEZA DESPUÉS DE CADA TEST
  // ============================================================
  afterEach(() => {
    vi.restoreAllMocks();
    // Restaura los mocks a su estado original
    // Diferencia con clearAllMocks:
    // - clearAllMocks: Borra el historial pero mantiene el mock
    // - restoreAllMocks: Devuelve la función original (si existía)
    // Buena práctica para evitar efectos secundarios entre tests
  });

  // ============================================================
  // TESTS DE PRODUCTS API - CRUD DE PRODUCTOS
  // ============================================================
  describe('productsAPI', () => {
    
    // ============================================================
    // GET ALL - OBTENER TODOS LOS PRODUCTOS
    // ============================================================
    describe('getAll', () => {
      
      // TEST 1: Caso exitoso - GET /products
      it('debe obtener todos los productos correctamente', async () => {
        // PASO 1: Preparar datos de prueba
        const mockProducts = [
          { id: 1, nombre: 'PlayStation 5', precio: 75000 },
          { id: 2, nombre: 'Xbox Series X', precio: 65000 }
        ];
        
        // PASO 2: Configurar el mock de fetch
        fetch.mockResolvedValueOnce({
          ok: true,                         // Respuesta exitosa (200-299)
          json: async () => mockProducts    // Método json() que devuelve los productos
        });
        // ⚠️ ANATOMÍA DE UNA RESPUESTA FETCH:
        // fetch devuelve un objeto Response que tiene:
        // - ok: boolean (true si status es 200-299)
        // - status: número (200, 404, 500, etc.)
        // - json(): función que parsea el body como JSON
        // - text(): función que devuelve el body como texto
        // - headers: objeto con los headers de respuesta
        //
        // ¿Por qué json es async?
        // Porque leer el body de la respuesta es asíncrono
        // El body puede ser grande y tomar tiempo en descargarse
        
        // PASO 3: Llamar a la función que estamos testeando
        const result = await productsAPI.getAll();
        // await porque getAll es async (hace fetch)
        
        // PASO 4: Verificar que fetch fue llamado correctamente
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products');
        // Verifica:
        // - URL correcta
        // - No hay headers adicionales (es GET simple)
        // - No hay body (es GET)
        
        // PASO 5: Verificar que devolvió los productos correctos
        expect(result).toEqual(mockProducts);
        // toEqual hace comparación profunda de objetos
        // Verifica que la estructura y valores son idénticos
      });

      // TEST 2: Error de red - Sin conexión
      it('debe manejar errores de red', async () => {
        // PASO 1: Simular que fetch falla completamente
        fetch.mockRejectedValueOnce(new Error('Network error'));
        // mockRejectedValueOnce = La promesa es rechazada
        // Simula:
        // - Sin conexión a internet
        // - Servidor no alcanzable
        // - DNS no resuelve
        // - Timeout de conexión
        
        // PASO 2: Verificar que el error se propaga correctamente
        await expect(productsAPI.getAll()).rejects.toThrow('Network error');
        // ⚠️ SINTAXIS ESPECIAL: expect().rejects.toThrow()
        // - expect(): Envuelve la promesa
        // - .rejects: Espera que la promesa sea rechazada
        // - .toThrow('Network error'): Verifica el mensaje de error
        //
        // Sin await, el test pasaría incorrectamente
        // porque no esperaría a que la promesa se resuelva/rechace
        //
        // MANEJO DE ERRORES DE RED:
        // En la app real, esto debería:
        // 1. Mostrar mensaje al usuario
        // 2. Ofrecer reintentar
        // 3. Posiblemente usar datos en caché
        // 4. Registrar el error para análisis
      });

      // TEST 3: Error HTTP - Servidor responde con error
      it('debe manejar errores HTTP', async () => {
        // PASO 1: Simular respuesta HTTP con error
        fetch.mockResolvedValueOnce({
          ok: false,      // Status NO está en 200-299
          status: 500     // Internal Server Error
        });
        // ⚠️ IMPORTANTE: La promesa se RESUELVE (no rechaza)
        // fetch solo rechaza por errores de red
        // Errores HTTP (404, 500) son respuestas "exitosas" a nivel de red
        
        // PASO 2: Verificar que se lanza error con el status
        await expect(productsAPI.getAll()).rejects.toThrow('HTTP error! status: 500');
        //
        // CÓDIGOS HTTP COMUNES:
        // 2xx - Éxito:
        //   200: OK
        //   201: Created (después de POST)
        //   204: No Content (después de DELETE)
        //
        // 4xx - Error del cliente:
        //   400: Bad Request (datos inválidos)
        //   401: Unauthorized (necesita login)
        //   403: Forbidden (sin permisos)
        //   404: Not Found (no existe)
        //
        // 5xx - Error del servidor:
        //   500: Internal Server Error (bug en backend)
        //   502: Bad Gateway (proxy error)
        //   503: Service Unavailable (mantenimiento)
        //
        // EL SERVICIO DEBE:
        // Detectar que ok === false
        // Lanzar un error con información del status
        // Para que el componente pueda manejarlo apropiadamente
      });
    });

    // ============================================================
    // GET BY ID - OBTENER UN PRODUCTO ESPECÍFICO
    // ============================================================
    describe('getById', () => {
      // TEST 4: Obtener producto por ID - GET /products/:id
      it('debe obtener un producto por ID', async () => {
        // PASO 1: Preparar el producto esperado
        const mockProduct = { id: 1, nombre: 'PlayStation 5', precio: 75000 };
        
        // PASO 2: Configurar respuesta exitosa
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockProduct
        });
        
        // PASO 3: Llamar getById con ID 1
        const result = await productsAPI.getById(1);
        
        // PASO 4: Verificar URL con el ID en el path
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products/1');
        // URL RESTful: /products/1
        // El ID va en la URL, no como query parameter
        // Correcto: /products/1
        // Incorrecto: /products?id=1
        
        // PASO 5: Verificar que devolvió el producto correcto
        expect(result).toEqual(mockProduct);
        //
        // USO TÍPICO:
        // - Página de detalle de producto
        // - Editar producto existente
        // - Verificar stock de un producto específico
      });
    });

    // ============================================================
    // CREATE - CREAR UN NUEVO PRODUCTO (POST)
    // ============================================================
    describe('create', () => {
      // TEST 5: Crear producto - POST /products
      it('debe crear un nuevo producto', async () => {
        // PASO 1: Preparar datos del nuevo producto (sin ID)
        const newProduct = { nombre: 'Nintendo Switch', precio: 45000 };
        // Nota: NO incluimos ID, el servidor lo genera
        
        // PASO 2: Simular respuesta del servidor (con ID asignado)
        const createdProduct = { id: 3, ...newProduct };
        // El servidor devuelve el producto CON el ID generado
        // ...newProduct = spread operator, copia todas las propiedades
        
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => createdProduct
        });
        
        // PASO 3: Llamar create con el nuevo producto
        const result = await productsAPI.create(newProduct);
        
        // PASO 4: Verificar la petición POST completa
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products', {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(newProduct)
        });
        // ⚠️ ANATOMÍA DE UNA PETICIÓN POST:
        //
        // URL: Donde enviar los datos
        // 
        // HEADERS:
        // - Content-Type: 'application/json'
        //   Le dice al servidor que el body es JSON
        //   Sin esto, el servidor no sabría cómo interpretar el body
        //
        // METHOD: 'POST'
        // - GET: Obtener datos
        // - POST: Crear nuevo recurso
        // - PUT: Actualizar recurso existente
        // - DELETE: Eliminar recurso
        //
        // BODY: JSON.stringify(newProduct)
        // - Convierte el objeto JavaScript a string JSON
        // - { nombre: "Switch" } → '{"nombre":"Switch"}'
        // - El servidor parsea este string de vuelta a objeto
        
        // PASO 5: Verificar que devolvió el producto con ID
        expect(result).toEqual(createdProduct);
        //
        // FLUJO COMPLETO:
        // 1. Cliente envía producto SIN ID
        // 2. Servidor crea el producto
        // 3. Servidor asigna ID único
        // 4. Servidor devuelve producto CON ID
        // 5. Cliente guarda el ID para futuras operaciones
      });
    });

    // ============================================================
    // UPDATE - ACTUALIZAR PRODUCTO EXISTENTE (PUT)
    // ============================================================
    describe('update', () => {
      // TEST 6: Actualizar producto - PUT /products/:id
      it('debe actualizar un producto existente', async () => {
        // PASO 1: Preparar datos actualizados (CON ID)
        const updatedProduct = { 
          id: 1, 
          nombre: 'PlayStation 5 Pro',  // Nombre cambiado
          precio: 85000                 // Precio aumentado
        };
        
        // PASO 2: Simular respuesta exitosa
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => updatedProduct
        });
        
        // PASO 3: Llamar update con ID y datos nuevos
        const result = await productsAPI.update(1, updatedProduct);
        
        // PASO 4: Verificar petición PUT
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products/1', {
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          body: JSON.stringify(updatedProduct)
        });
        // PUT vs POST:
        // - POST: Crea nuevo recurso (sin ID en URL)
        // - PUT: Actualiza recurso existente (con ID en URL)
        //
        // PUT es IDEMPOTENTE:
        // - Llamarlo 1 vez = producto actualizado
        // - Llamarlo 10 veces = mismo resultado
        // POST NO es idempotente:
        // - Llamarlo 10 veces = 10 productos creados
        
        // PASO 5: Verificar respuesta
        expect(result).toEqual(updatedProduct);
        //
        // CASOS DE USO:
        // - Editar precio de producto
        // - Actualizar stock
        // - Cambiar descripción
        // - Activar/desactivar producto
      });
    });

    // ============================================================
    // DELETE - ELIMINAR PRODUCTO (DELETE)
    // ============================================================
    describe('delete', () => {
      // TEST 7: Eliminar producto - DELETE /products/:id
      it('debe eliminar un producto', async () => {
        // PASO 1: Simular respuesta exitosa (normalmente vacía)
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({})  // Respuesta vacía o confirmación
        });
        
        // PASO 2: Llamar delete con el ID
        const result = await productsAPI.delete(1);
        
        // PASO 3: Verificar petición DELETE
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products/1', {
          method: 'DELETE'
        });
        // DELETE es simple:
        // - No necesita headers (no hay body)
        // - No necesita body (el ID va en la URL)
        // - Solo necesita method: 'DELETE'
        
        // PASO 4: Verificar respuesta (normalmente vacía)
        expect(result).toEqual({});
        //
        // RESPUESTAS TÍPICAS DE DELETE:
        // 1. {} o null (confirmación simple)
        // 2. { success: true }
        // 3. El objeto eliminado (para undo)
        // 4. Status 204 No Content (sin body)
        //
        // CONSIDERACIONES:
        // - ¿Eliminación física o lógica?
        //   Física: Se borra de la BD
        //   Lógica: Se marca como eliminado (soft delete)
        // - ¿Qué pasa con relaciones?
        //   Ej: Eliminar producto con órdenes pendientes
        // - ¿Permitir recuperación?
        //   Papelera de reciclaje vs eliminación permanente
      });
    });
  });

  // ============================================================
  // TESTS DE ORDERS API - GESTIÓN DE ÓRDENES/PEDIDOS
  // ============================================================
  describe('ordersAPI', () => {
    // Similar a productsAPI pero para órdenes de compra
    // Las órdenes contienen:
    // - Productos comprados
    // - Cantidades
    // - Total
    // - Fecha
    // - Estado (pendiente, completada, cancelada)
    
    // ============================================================
    // GET ALL ORDERS - OBTENER TODAS LAS ÓRDENES
    // ============================================================
    describe('getAll', () => {
      // TEST 8: Obtener todas las órdenes - GET /orders
      it('debe obtener todas las órdenes', async () => {
        // PASO 1: Preparar órdenes de prueba
        const mockOrders = [
          { id: 1, total: 150000, fecha: '2024-01-01' },
          { id: 2, total: 65000, fecha: '2024-01-02' }
        ];
        
        // PASO 2: Simular respuesta exitosa
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockOrders
        });
        
        // PASO 3: Llamar getAll de ordersAPI
        const result = await ordersAPI.getAll();
        
        // PASO 4: Verificar URL correcta
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/orders');
        // Nota: orders, no products
        
        // PASO 5: Verificar órdenes devueltas
        expect(result).toEqual(mockOrders);
        //
        // USO TÍPICO:
        // - Panel de administración
        // - Historial de compras del usuario
        // - Reportes de ventas
        // - Dashboard de estadísticas
      });
    });

    // ============================================================
    // GET ORDER BY ID - OBTENER ORDEN ESPECÍFICA
    // ============================================================
    describe('getById', () => {
      // TEST 9: Obtener orden por ID - GET /orders/:id
      it('debe obtener una orden por ID', async () => {
        // PASO 1: Preparar orden de prueba
        const mockOrder = { 
          id: 1, 
          total: 150000, 
          fecha: '2024-01-01',
          // Normalmente incluiría:
          // productos: [{...}],
          // cliente: {...},
          // estado: 'completada'
        };
        
        // PASO 2: Simular respuesta exitosa
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockOrder
        });
        
        // PASO 3: Llamar getById
        const result = await ordersAPI.getById(1);
        
        // PASO 4: Verificar URL con ID
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/orders/1');
        
        // PASO 5: Verificar orden devuelta
        expect(result).toEqual(mockOrder);
        //
        // USO:
        // - Ver detalle de una compra
        // - Imprimir factura
        // - Tracking de envío
        // - Procesar devolución
      });
    });

    // ============================================================
    // CREATE ORDER - CREAR NUEVA ORDEN (CHECKOUT)
    // ============================================================
    describe('create', () => {
      // TEST 10: Crear orden - POST /orders
      it('debe crear una nueva orden', async () => {
        // PASO 1: Preparar datos de la nueva orden
        const newOrder = {
          productos: [
            { id: 1, nombre: 'PlayStation 5', cantidad: 2 }
          ],
          total: 150000,  // 2 x 75000
          fecha: new Date().toISOString()  // "2024-01-15T10:30:00.000Z"
        };
        // Esto representa el checkout del carrito
        
        // PASO 2: Simular respuesta con ID asignado
        const createdOrder = { id: 10, ...newOrder };
        
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => createdOrder
        });
        
        // PASO 3: Crear la orden
        const result = await ordersAPI.create(newOrder);
        
        // PASO 4: Verificar petición POST
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/orders', {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(newOrder)
        });
        
        // PASO 5: Verificar orden creada
        expect(result).toEqual(createdOrder);
        //
        // FLUJO DE CHECKOUT:
        // 1. Usuario llena carrito
        // 2. Usuario hace click en "Finalizar Compra"
        // 3. Frontend prepara la orden (productos, total, fecha)
        // 4. Frontend envía orden al backend (este test)
        // 5. Backend valida y crea la orden
        // 6. Backend devuelve orden con ID
        // 7. Frontend muestra confirmación
        // 8. Frontend limpia el carrito
      });

      // TEST 11: Error al crear orden - Validación
      it('debe manejar errores al crear órdenes', async () => {
        // PASO 1: Orden inválida (sin productos)
        const newOrder = { productos: [], total: 0 };
        // El servidor rechazará una orden vacía
        
        // PASO 2: Simular error 400 Bad Request
        fetch.mockResolvedValueOnce({
          ok: false,
          status: 400  // Bad Request = datos inválidos
        });
        
        // PASO 3: Verificar que se propaga el error
        await expect(ordersAPI.create(newOrder)).rejects.toThrow('HTTP error! status: 400');
        //
        // VALIDACIONES TÍPICAS DEL SERVIDOR:
        // - Orden debe tener al menos 1 producto
        // - Total debe ser mayor a 0
        // - Productos deben existir en inventario
        // - Stock suficiente para cada producto
        // - Datos del cliente completos
        // - Método de pago válido
        //
        // ERROR 400 vs OTROS ERRORES:
        // - 400: Datos inválidos (error del cliente)
        // - 401: No autenticado (necesita login)
        // - 402: Pago requerido
        // - 403: Sin permisos
        // - 409: Conflicto (producto sin stock)
        // - 500: Error del servidor
      });
    });

    // ============================================================
    // UPDATE ORDER - ACTUALIZAR ORDEN EXISTENTE
    // ============================================================
    describe('update', () => {
      // TEST 12: Actualizar orden - PUT /orders/:id
      it('debe actualizar una orden existente', async () => {
        // PASO 1: Preparar datos actualizados
        const updatedOrder = { 
          id: 1, 
          status: 'completed',  // Cambiar estado a completada
          total: 150000 
        };
        // Casos de actualización:
        // - Cambiar estado (pendiente → completada → entregada)
        // - Actualizar dirección de envío
        // - Añadir número de tracking
        // - Procesar devolución parcial
        
        // PASO 2: Simular respuesta exitosa
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => updatedOrder
        });
        
        // PASO 3: Actualizar la orden
        const result = await ordersAPI.update(1, updatedOrder);
        
        // PASO 4: Verificar petición PUT
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/orders/1', {
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          body: JSON.stringify(updatedOrder)
        });
        
        // PASO 5: Verificar respuesta
        expect(result).toEqual(updatedOrder);
        //
        // ESTADOS TÍPICOS DE UNA ORDEN:
        // 1. 'pending': Recién creada, esperando pago
        // 2. 'paid': Pago confirmado
        // 3. 'processing': Preparando envío
        // 4. 'shipped': Enviada
        // 5. 'delivered': Entregada
        // 6. 'completed': Finalizada
        // 7. 'cancelled': Cancelada
        // 8. 'refunded': Reembolsada
      });
    });

    // ============================================================
    // DELETE ORDER - ELIMINAR/CANCELAR ORDEN
    // ============================================================
    describe('delete', () => {
      // TEST 13: Eliminar orden - DELETE /orders/:id
      it('debe eliminar una orden', async () => {
        // PASO 1: Simular respuesta exitosa
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({})
        });
        
        // PASO 2: Eliminar la orden
        const result = await ordersAPI.delete(1);
        
        // PASO 3: Verificar petición DELETE
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/orders/1', {
          method: 'DELETE'
        });
        
        // PASO 4: Verificar respuesta
        expect(result).toEqual({});
        //
        // CONSIDERACIONES PARA ELIMINAR ÓRDENES:
        // 1. ¿Se puede eliminar cualquier orden?
        //    - Solo pendientes/no pagadas
        //    - Con autorización especial
        //    - Nunca (solo cancelar)
        //
        // 2. Implicaciones:
        //    - Devolver stock al inventario
        //    - Cancelar pago si existe
        //    - Notificar al cliente
        //    - Actualizar estadísticas
        //
        // 3. Mejor práctica:
        //    - No eliminar, cambiar estado a 'cancelled'
        //    - Mantener historial para auditoría
        //    - Soft delete con campo deleted_at
      });
    });
  });

  // ============================================================
  // HEALTH CHECK - VERIFICACIÓN DE DISPONIBILIDAD DEL SERVIDOR
  // ============================================================
  describe('checkServerHealth', () => {
    // TEST 14: Servidor disponible
    it('debe retornar true si el servidor está disponible', async () => {
      // PASO 1: Simular servidor respondiendo OK
      fetch.mockResolvedValueOnce({ ok: true });
      // Solo verificamos que responde, no importa el contenido
      
      // PASO 2: Verificar salud del servidor
      const result = await checkServerHealth();
      
      // PASO 3: Verificar que se hizo ping al servidor
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/products?_limit=1');
      // ¿Por qué /products?_limit=1?
      // - Endpoint ligero (solo 1 producto)
      // - No requiere autenticación
      // - Rápido de responder
      // - Si products funciona, el servidor está OK
      //
      // Alternativas para health check:
      // - /health o /ping (endpoint dedicado)
      // - / (raíz del API)
      // - /status (información del servidor)
      
      // PASO 4: Verificar que retorna true
      expect(result).toBe(true);
      //
      // USO DEL HEALTH CHECK:
      // 1. Al iniciar la aplicación
      //    - Mostrar mensaje si el servidor no está disponible
      // 2. Antes de operaciones críticas
      //    - Verificar antes de procesar pago
      // 3. Monitoring continuo
      //    - Verificar cada X minutos
      // 4. Recuperación de errores
      //    - Reintentar cuando vuelva a estar disponible
    });

    // TEST 15: Servidor no disponible - Error de red
    it('debe retornar false si el servidor no está disponible', async () => {
      // PASO 1: Simular servidor caído
      fetch.mockRejectedValueOnce(new Error('Connection refused'));
      // Errores posibles:
      // - 'Connection refused': Servidor apagado
      // - 'Network error': Sin conexión
      // - 'Timeout': Servidor muy lento
      
      // PASO 2: Verificar salud
      const result = await checkServerHealth();
      
      // PASO 3: Debe retornar false (no lanzar error)
      expect(result).toBe(false);
      // IMPORTANTE: No lanza error, retorna false
      // Permite manejar la situación gracefully
      //
      // MANEJO CUANDO EL SERVIDOR NO ESTÁ DISPONIBLE:
      // if (!await checkServerHealth()) {
      //   mostrarMensaje("Servidor no disponible");
      //   mostrarBotonReintentar();
      //   usarModoDemostración();
      //   trabajarOffline();
      // }
    });

    // TEST 16: Servidor responde pero con error
    it('debe retornar false si el servidor responde con error', async () => {
      // PASO 1: Simular respuesta con error HTTP
      fetch.mockResolvedValueOnce({ ok: false });
      // El servidor responde pero con error (500, 503, etc.)
      
      // PASO 2: Verificar salud
      const result = await checkServerHealth();
      
      // PASO 3: Debe retornar false
      expect(result).toBe(false);
      //
      // DIFERENCIA ENTRE ESTE TEST Y EL ANTERIOR:
      // - Test 15: No hay conexión (fetch rechaza)
      // - Test 16: Hay conexión pero servidor con problemas
      //
      // Situaciones:
      // - Base de datos caída (500)
      // - Mantenimiento (503)
      // - Sobrecarga (429 Too Many Requests)
    });
  });

  // ============================================================
  // ERROR HANDLING - MANEJO Y LOGGING DE ERRORES
  // ============================================================
  describe('Error handling', () => {
    // TEST 17: Logging de errores en consola
    it('debe loggear errores en la consola', async () => {
      // PASO 1: Espiar console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // ⚠️ CONCEPTO: vi.spyOn
      // - Crea un "espía" que observa una función
      // - Puede verificar cuándo y cómo se llama
      // - mockImplementation(() => {}) evita que imprima en tests
      //
      // Sin mockImplementation:
      // Los errores aparecerían en la salida de tests (ruidoso)
      // Con mockImplementation vacía:
      // Capturamos las llamadas sin ensuciar la consola
      
      // PASO 2: Simular error
      fetch.mockRejectedValueOnce(new Error('Test error'));
      
      // PASO 3: Llamar función que debería loggear el error
      await expect(productsAPI.getAll()).rejects.toThrow();
      
      // PASO 4: Verificar que se loggeó el error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching products:',  // Mensaje descriptivo
        expect.any(Error)             // El objeto Error
      );
      // expect.any(Error) verifica que es cualquier instancia de Error
      // No importa el mensaje exacto del error
      
      // PASO 5: Limpiar el espía
      consoleErrorSpy.mockRestore();
      // Devuelve console.error a su estado original
      // Importante para no afectar otros tests
      //
      // MEJORES PRÁCTICAS DE LOGGING:
      // 1. Desarrollo: console.error con detalles
      // 2. Producción: Servicio de logging (Sentry, LogRocket)
      // 3. Información útil:
      //    - Qué falló
      //    - Dónde (endpoint)
      //    - Cuándo (timestamp)
      //    - Contexto (usuario, acción)
      // 4. No exponer información sensible
      //    - No loggear passwords
      //    - No loggear tokens
      //    - No loggear datos personales
    });
  });
});

// ============================================================
// FIN DE LOS TESTS DE SERVICIOS API
// ============================================================
// RESUMEN DE LO QUE TESTEAMOS:
// 1. CRUD de Productos (GET, POST, PUT, DELETE)
// 2. CRUD de Órdenes (GET, POST, PUT, DELETE)
// 3. Manejo de errores de red
// 4. Manejo de errores HTTP
// 5. Health check del servidor
// 6. Logging de errores
//
// CONCEPTOS CLAVE APRENDIDOS:
// - Mockear fetch globalmente
// - Anatomía de respuestas HTTP
// - Diferencia entre errores de red y HTTP
// - Métodos HTTP y sus usos
// - Headers y body en peticiones
// - JSON.stringify y response.json()
// - Health checks y monitoring
// - Logging y debugging
//
// IMPORTANCIA DE TESTEAR SERVICIOS API:
// - Son el puente entre frontend y backend
// - Errores aquí afectan toda la aplicación
// - Difíciles de debuggear sin tests
// - Críticos para la experiencia del usuario
