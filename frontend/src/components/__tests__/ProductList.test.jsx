// ============================================================
// TESTS DEL COMPONENTE PRODUCTLIST - LISTA DE PRODUCTOS
// ============================================================
// ¿QUÉ ES PRODUCTLIST?
// ProductList es el componente que muestra todos los productos disponibles
// Se encarga de:
// - Cargar productos desde la API
// - Mostrar un spinner durante la carga
// - Mostrar los productos en una grilla/cuadrícula
// - Permitir filtrar por categoría
// - Permitir búsqueda por nombre
// - Manejar errores de carga
// - Mostrar mensaje cuando no hay productos
//
// ¿QUÉ VAMOS A TESTEAR?
// 1. Estados de carga (loading spinner)
// 2. Carga exitosa de productos
// 3. Lista vacía de productos
// 4. Manejo de errores
// 5. Filtrado por categoría
// 6. Búsqueda de productos
// 7. Paginación (si existe)
// 8. Ordenamiento (si existe)

// ============================================================
// IMPORTACIONES
// ============================================================

// IMPORTACIÓN 1: Herramientas de Vitest
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Ya familiares, pero recordemos su uso en este contexto:
// - describe: Agrupa todos los tests de ProductList
// - it: Cada caso específico a probar
// - expect: Verificaciones
// - vi: Para crear mocks de API y componentes
// - beforeEach: Limpiar mocks entre tests

// IMPORTACIÓN 2: React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// - render: Para montar ProductList
// - screen: Buscar elementos en la lista
// - fireEvent: Simular clicks en filtros/búsqueda
// - waitFor: CRÍTICO aquí por la carga asíncrona

// IMPORTACIÓN 3: El componente ProductList
import ProductList from '../ProductList';

// IMPORTACIÓN 4: La API de productos
import { productsAPI } from '../../services/api';
// ProductList llama a productsAPI.getAll() para obtener productos
// Debemos mockear esto para controlar qué productos se muestran

// ============================================================
// CONFIGURACIÓN DE MOCKS
// ============================================================

// MOCK 1: La API de productos
vi.mock('../../services/api', () => ({
  productsAPI: {
    getAll: vi.fn()
    // getAll() es la función que obtiene todos los productos
    // La mockearemos para:
    // - Devolver productos de prueba
    // - Simular demoras en la carga
    // - Simular errores de red
    // - Devolver lista vacía
  }
}));

// MOCK 2: El componente ProductCard
vi.mock('../ProductCard', () => ({
  default: ({ product }) => (
    <div data-testid={`product-${product.id}`}>{product.nombre}</div>
  )
}));
// ⚠️ CONCEPTO IMPORTANTE: ¿Por qué mockear ProductCard?
//
// ProductList renderiza múltiples ProductCard (uno por producto)
// Si usáramos el ProductCard real:
// 1. Los tests serían más complejos (botones, imágenes, etc.)
// 2. Si ProductCard falla, fallarían los tests de ProductList
// 3. Ya testeamos ProductCard por separado
//
// SOLUCIÓN: Reemplazar con versión simplificada
// - Solo muestra el nombre del producto
// - Tiene data-testid único para cada producto
// - Es suficiente para testear ProductList
//
// ({ product }) => ...
// Esto es "destructuring" de props
// El componente recibe props.product y lo extrae directamente

// ============================================================
// SUITE DE TESTS PARA PRODUCTLIST
// ============================================================
describe('ProductList Component', () => {
  
  // ============================================================
  // DATOS DE PRUEBA (FIXTURES)
  // ============================================================
  const mockProducts = [
    { 
      id: 1, 
      nombre: 'PlayStation 5', 
      precio: 75000,              // Precio en pesos argentinos
      categoria: 'consolas'        // Para probar filtros
    },
    { 
      id: 2, 
      nombre: 'Xbox Series X', 
      precio: 65000, 
      categoria: 'consolas'        // Misma categoría que PS5
    },
    { 
      id: 3, 
      nombre: 'Nintendo Switch', 
      precio: 45000, 
      categoria: 'consolas'        // Las 3 son consolas
    }
  ];
  // ¿Qué son FIXTURES?
  // Son datos de prueba reutilizables
  // Los definimos una vez y usamos en múltiples tests
  // Ventajas:
  // - Consistencia: Todos los tests usan los mismos datos
  // - Mantenimiento: Cambiar en un solo lugar
  // - Legibilidad: Los tests son más claros

  // ============================================================
  // CONFIGURACIÓN ANTES DE CADA TEST
  // ============================================================
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpia el historial de llamadas de TODOS los mocks
    // ¿Por qué es crítico aquí?
    // ProductList llama a la API al montarse
    // Si no limpiamos, el test 2 vería las llamadas del test 1
    // Causaría falsos positivos/negativos
  });

  // ============================================================
  // TEST 1: ESTADO DE CARGA (LOADING SPINNER)
  // ============================================================
  it('debe mostrar un spinner mientras carga', async () => {
    // NOTA: async porque podríamos necesitar cleanup después
    
    // PASO 1: Configurar una promesa que NUNCA se resuelve
    productsAPI.getAll.mockImplementation(() => new Promise(() => {}));
    // ⚠️ CONCEPTO CLAVE: Promise pendiente infinita
    //
    // new Promise(() => {})
    // Crea una promesa que:
    // - NUNCA se resuelve (no llama resolve)
    // - NUNCA se rechaza (no llama reject)
    // - Queda "colgada" para siempre
    //
    // ¿POR QUÉ HACER ESTO?
    // Simula el momento exacto mientras esperamos la respuesta del servidor
    // Como la promesa nunca termina, el componente se queda en estado "loading"
    // Podemos verificar qué muestra durante la carga
    //
    // En la vida real este estado dura milisegundos
    // En el test lo "congelamos" para examinarlo
    
    // PASO 2: Renderizar ProductList
    render(<ProductList />);
    // ProductList inmediatamente:
    // 1. Se monta
    // 2. Llama a productsAPI.getAll()
    // 3. Recibe una promesa pendiente
    // 4. Muestra el estado de carga
    
    // PASO 3: Verificar el mensaje de carga
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
    // Debe mostrar algún texto indicando que está cargando
    
    // PASO 4: Verificar el spinner visual
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    // ¿Qué es .animate-spin?
    // Una clase de Tailwind CSS que hace rotar el elemento
    // animation: spin 1s linear infinite
    // Es el típico círculo girando que indica carga
    //
    // ¿Por qué document.querySelector en lugar de screen?
    // screen busca por texto, rol, testId, etc.
    // Para buscar por clase CSS, usamos querySelector directamente
    //
    // UX DE ESTADOS DE CARGA:
    // 1. Feedback inmediato (no dejar pantalla en blanco)
    // 2. Indicador visual (spinner)
    // 3. Mensaje descriptivo ("Cargando productos...")
    // 4. No bloquear la UI completamente
    //
    // Si este test falla:
    // - No se muestra nada durante la carga
    // - El usuario ve pantalla en blanco
    // - Mala experiencia de usuario
  });

  // ============================================================
  // TEST 2: CARGA EXITOSA DE PRODUCTOS
  // ============================================================
  it('debe mostrar los productos cuando se cargan exitosamente', async () => {
    // async es OBLIGATORIO aquí por el await
    
    // PASO 1: Configurar API para devolver productos exitosamente
    productsAPI.getAll.mockResolvedValue(mockProducts);
    // mockResolvedValue = La promesa se resuelve exitosamente
    // Devuelve nuestros 3 productos de prueba
    // Simula: fetch exitoso → respuesta del servidor → productos
    
    // PASO 2: Renderizar ProductList
    render(<ProductList />);
    // Flujo interno de ProductList:
    // 1. ComponentDidMount / useEffect
    // 2. setLoading(true)
    // 3. productsAPI.getAll() → Promesa
    // 4. Muestra spinner (brevemente)
    // 5. Promesa se resuelve → mockProducts
    // 6. setProducts(mockProducts)
    // 7. setLoading(false)
    // 8. Re-render con productos
    
    // PASO 3: Esperar a que aparezcan los productos
    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });
    // ⚠️ CONCEPTO IMPORTANTE: ¿Por qué waitFor?
    //
    // El flujo es ASÍNCRONO:
    // 1. render() → Muestra spinner
    // 2. API call → Toma tiempo
    // 3. Estado actualizado → Re-render
    // 4. Productos visibles
    //
    // Sin waitFor:
    // El test verificaría inmediatamente (paso 1)
    // No encontraría los productos (aún cargando)
    // Test fallaría incorrectamente
    //
    // Con waitFor:
    // Reintenta hasta que los productos aparezcan
    // O hasta timeout (1 segundo por defecto)
    //
    // ¿Por qué buscar por data-testid?
    // Nuestro mock de ProductCard tiene:
    // <div data-testid={`product-${product.id}`}>
    // Cada producto tiene un ID único
    
    // PASO 4: Verificar que los nombres también aparecen
    expect(screen.getByText('PlayStation 5')).toBeInTheDocument();
    expect(screen.getByText('Xbox Series X')).toBeInTheDocument();
    expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
    // Doble verificación:
    // - Los componentes existen (por testId)
    // - Muestran el contenido correcto (por texto)
    //
    // FLUJO COMPLETO:
    // Usuario → Abre página → "Cargando..." → Productos aparecen
    //
    // Si este test falla:
    // - La carga asíncrona no funciona
    // - Los productos no se renderizan
    // - Hay un error en el manejo de estado
  });

  // ============================================================
  // TEST 3: LISTA VACÍA DE PRODUCTOS
  // ============================================================
  it('debe mostrar un mensaje cuando no hay productos', async () => {
    // PASO 1: Configurar API para devolver array vacío
    productsAPI.getAll.mockResolvedValue([]);
    // [] = Array vacío, pero la promesa SE RESUELVE exitosamente
    // Diferente a un error: la API funcionó, pero no hay productos
    // Casos reales:
    // - Tienda nueva sin productos aún
    // - Todos los productos agotados/ocultos
    // - Filtros muy restrictivos
    
    // PASO 2: Renderizar ProductList
    render(<ProductList />);
    
    // PASO 3: Esperar y verificar mensaje principal
    await waitFor(() => {
      expect(screen.getByText('No hay productos disponibles')).toBeInTheDocument();
    });
    // Mensaje claro y directo
    
    // PASO 4: Verificar mensaje secundario explicativo
    expect(screen.getByText(/parece que no hay productos/i)).toBeInTheDocument();
    // Mensaje más amigable/humano
    // Usa regex con 'i' para ignorar mayúsculas
    
    // PASO 5: Verificar botón de acción
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    // SIEMPRE ofrece una acción al usuario
    // "Actualizar" permite reintentar por si aparecieron productos
    //
    // UX PARA ESTADOS VACÍOS:
    // 1. NO mostrar tabla/grilla vacía
    // 2. Mensaje claro de qué pasó
    // 3. Explicación adicional si es posible
    // 4. Acción para salir del estado (actualizar, agregar, etc.)
    // 5. Posiblemente una imagen/ilustración
    //
    // MALO: Pantalla en blanco
    // REGULAR: "No hay datos"
    // BUENO: "No hay productos disponibles. Actualizar"
    // EXCELENTE: Todo lo anterior + ilustración + sugerencias
  });

  // ============================================================
  // TEST 4: MANEJO DE ERRORES EN LA CARGA
  // ============================================================
  it('debe mostrar error cuando falla la carga', async () => {
    // PASO 1: Configurar API para que FALLE
    productsAPI.getAll.mockRejectedValue(new Error('Network error'));
    // mockRejectedValue = La promesa es RECHAZADA
    // Simula errores como:
    // - Sin conexión a internet
    // - Servidor caído (500)
    // - Timeout
    // - CORS bloqueado
    // - JSON mal formado
    
    // PASO 2: Renderizar ProductList
    render(<ProductList />);
    // Flujo con error:
    // 1. useEffect llama API
    // 2. Muestra spinner
    // 3. Promesa RECHAZADA
    // 4. catch(error)
    // 5. setError(error)
    // 6. Muestra mensaje de error
    
    // PASO 3: Esperar y verificar título de error
    await waitFor(() => {
      expect(screen.getByText('¡Ups! Algo salió mal')).toBeInTheDocument();
    });
    // Título amigable, no técnico
    // "¡Ups!" es más humano que "ERROR"
    
    // PASO 4: Verificar descripción del error
    expect(screen.getByText(/error al cargar los productos/i)).toBeInTheDocument();
    // Explica QUÉ falló (cargar productos)
    // No muestra el error técnico (Network error)
    
    // PASO 5: Verificar botón de reintento
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
    // SIEMPRE ofrecer recuperación del error
    //
    // MANEJO DE ERRORES - MEJORES PRÁCTICAS:
    // 1. NUNCA mostrar errores técnicos al usuario
    //    MAL: "TypeError: Cannot read property 'map' of undefined"
    //    BIEN: "No pudimos cargar los productos"
    //
    // 2. Ofrecer contexto
    //    ¿Qué estaba haciendo cuando falló?
    //
    // 3. Dar opciones de recuperación
    //    - Reintentar
    //    - Recargar página
    //    - Contactar soporte
    //
    // 4. Mantener tono amigable
    //    No asustar al usuario
    //
    // 5. Registrar error completo (para desarrolladores)
    //    console.error(error) con todos los detalles
  });

  // ============================================================
  // TEST 5: AYUDA CONTEXTUAL EN ERRORES (MODO DESARROLLO)
  // ============================================================
  it('debe mostrar instrucciones para ejecutar el servidor cuando hay error', async () => {
    // PASO 1: Simular error de conexión
    productsAPI.getAll.mockRejectedValue(new Error('Network error'));
    
    // PASO 2: Renderizar ProductList
    render(<ProductList />);
    
    // PASO 3: Verificar mensaje de ayuda específico
    await waitFor(() => {
      expect(screen.getByText(/asegúrate de que el servidor JSON/i)).toBeInTheDocument();
    });
    // Este mensaje es ESPECÍFICO para desarrollo
    // Asume que el error es porque el backend no está corriendo
    
    // PASO 4: Verificar comando exacto para ejecutar
    expect(screen.getByText(/cd backend && npm run dev/i)).toBeInTheDocument();
    // Muestra el COMANDO EXACTO que el desarrollador debe ejecutar
    // cd backend = entrar a la carpeta del backend
    // && = luego ejecutar
    // npm run dev = iniciar el servidor de desarrollo
    //
    // AYUDA CONTEXTUAL INTELIGENTE:
    // La app detecta el contexto y ofrece ayuda específica:
    //
    // 1. Error de red + Desarrollo = "Inicia el servidor"
    // 2. Error de red + Producción = "Verifica tu conexión"
    // 3. Error 404 = "La página no existe"
    // 4. Error 401 = "Necesitas iniciar sesión"
    // 5. Error 403 = "No tienes permisos"
    // 6. Error 500 = "Problema en el servidor"
    //
    // BENEFICIOS:
    // - Reduce frustración del desarrollador
    // - Acelera la resolución de problemas
    // - Educativo para desarrolladores junior
    //
    // IMPLEMENTACIÓN TÍPICA:
    // if (process.env.NODE_ENV === 'development' && error.message.includes('Network')) {
    //   mostrarAyudaDesarrollo();
    // }
    //
    // En producción este mensaje NO debería aparecer
    // Sería información sensible sobre la arquitectura
  });

  // ============================================================
  // TEST 6: FUNCIONALIDAD DE REINTENTO DESPUÉS DE ERROR
  // ============================================================
  it('debe reintentar la carga cuando se hace click en Reintentar', async () => {
    // ESCENARIO: Primera carga falla, reintento exitoso
    
    // PASO 1: Configurar primera llamada para FALLAR
    productsAPI.getAll.mockRejectedValueOnce(new Error('Network error'));
    // ⚠️ CONCEPTO CLAVE: mockRejectedValueOnce vs mockRejectedValue
    //
    // mockRejectedValue: SIEMPRE falla
    // mockRejectedValueOnce: Falla SOLO LA PRIMERA vez
    //
    // Permite simular:
    // - Error temporal de red
    // - Servidor que se recupera
    // - Problemas intermitentes
    
    // PASO 2: Renderizar y esperar el error
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('¡Ups! Algo salió mal')).toBeInTheDocument();
    });
    // Primera llamada a API: FALLA ❌
    
    // PASO 3: Configurar segunda llamada para TENER ÉXITO
    productsAPI.getAll.mockResolvedValueOnce(mockProducts);
    // La SEGUNDA vez que se llame, devolverá productos
    
    // PASO 4: Simular click en Reintentar
    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);
    // Usuario decide intentar de nuevo
    
    // PASO 5: Verificar que ahora sí carga los productos
    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });
    // Segunda llamada a API: ÉXITO ✅
    // El error desaparece, los productos aparecen
    
    // PASO 6: Verificar que se llamó a la API exactamente 2 veces
    expect(productsAPI.getAll).toHaveBeenCalledTimes(2);
    // 1ª llamada: Al montar (falló)
    // 2ª llamada: Al reintentar (éxito)
    //
    // PATRÓN DE REINTENTO (RETRY PATTERN):
    // - Errores temporales son comunes en redes
    // - Un reintento a menudo resuelve el problema
    // - Mejora la resiliencia de la aplicación
    //
    // ESTRATEGIAS DE REINTENTO:
    // 1. Manual: Botón "Reintentar" (este caso)
    // 2. Automático: Reintentar N veces
    // 3. Exponencial: Esperar 1s, 2s, 4s, 8s...
    // 4. Con límite: Máximo 3 intentos
    //
    // Este test verifica que el reintento manual funciona
  });

  // ============================================================
  // TEST 7: ACTUALIZAR LISTA VACÍA
  // ============================================================
  it('debe actualizar cuando no hay productos y se hace click en Actualizar', async () => {
    // ESCENARIO: Lista vacía al inicio, productos aparecen después
    // Simula: Inventario que se actualiza, nuevos productos agregados
    
    // PASO 1: Primera carga devuelve lista VACÍA
    productsAPI.getAll.mockResolvedValueOnce([]);
    // mockResolvedValueOnce([]) = Primera vez devuelve array vacío
    
    // PASO 2: Renderizar y esperar estado vacío
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.getByText('No hay productos disponibles')).toBeInTheDocument();
    });
    // Estado inicial: Sin productos 📦
    
    // PASO 3: Configurar segunda carga CON productos
    productsAPI.getAll.mockResolvedValueOnce(mockProducts);
    // La próxima vez que se llame a la API, HAY productos
    // Simula que el administrador agregó productos al inventario
    
    // PASO 4: Click en "Actualizar"
    const updateButton = screen.getByRole('button', { name: /actualizar/i });
    fireEvent.click(updateButton);
    // Usuario ve lista vacía y decide actualizar
    // Esperando que hayan llegado productos nuevos
    
    // PASO 5: Verificar que ahora SÍ hay productos
    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });
    // Estado final: Productos visibles 🎉
    
    // PASO 6: Verificar dos llamadas a la API
    expect(productsAPI.getAll).toHaveBeenCalledTimes(2);
    // 1ª: Al montar (vacío)
    // 2ª: Al actualizar (con productos)
    //
    // CASOS DE USO REALES:
    // 1. Tienda recién abierta agregando primeros productos
    // 2. Productos agotados que se reabastecen
    // 3. Filtros que inicialmente no tienen resultados
    // 4. Inventario actualizándose en tiempo real
    //
    // DIFERENCIA CON REINTENTO:
    // - Reintento: Después de ERROR
    // - Actualizar: Después de VACÍO
    // Ambos llaman a la API nuevamente pero por razones diferentes
  });

  // ============================================================
  // TEST 8: RENDERIZADO CORRECTO DE PRODUCTCARDS
  // ============================================================
  it('debe renderizar ProductCard para cada producto', async () => {
    // PASO 1: Configurar API con 3 productos
    productsAPI.getAll.mockResolvedValue(mockProducts);
    // mockProducts tiene 3 productos (PS5, Xbox, Switch)
    
    // PASO 2: Renderizar ProductList
    render(<ProductList />);
    
    // PASO 3: Contar cuántos ProductCards se renderizaron
    await waitFor(() => {
      const productCards = screen.getAllByTestId(/^product-/);
      expect(productCards).toHaveLength(3);
    });
    // ⚠️ CONCEPTOS CLAVE:
    //
    // 1. getAllByTestId vs getByTestId:
    //    - getByTestId: Busca UN elemento (falla si hay más)
    //    - getAllByTestId: Busca TODOS los elementos que coincidan
    //    Retorna un ARRAY de elementos
    //
    // 2. La regex /^product-/:
    //    - ^ = "empieza con"
    //    - product- = texto literal
    //    - Coincide con: product-1, product-2, product-3
    //    - NO coincide con: my-product-1, producto-1
    //
    // 3. toHaveLength(3):
    //    Verifica que el array tiene exactamente 3 elementos
    //
    // RELACIÓN 1:1
    // Este test verifica que:
    // - 3 productos en la API
    // - 3 ProductCards renderizados
    // - Relación 1:1 entre datos y componentes
    //
    // Si este test falla:
    // - No se está iterando sobre todos los productos
    // - Hay un filtro no deseado
    // - Error en el map() de productos
    //
    // IMPLEMENTACIÓN TÍPICA:
    // products.map(product => (
    //   <ProductCard key={product.id} product={product} />
    // ))
  });

  // ============================================================
  // TEST 9: DISEÑO RESPONSIVO DE LA GRILLA
  // ============================================================
  it('debe usar grid responsivo para mostrar productos', async () => {
    // PASO 1: Configurar productos
    productsAPI.getAll.mockResolvedValue(mockProducts);
    
    // PASO 2: Renderizar ProductList
    render(<ProductList />);
    
    // PASO 3: Verificar estructura de grilla responsiva
    await waitFor(() => {
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      
      // Verificar clases de Tailwind para cada breakpoint
      expect(gridContainer).toHaveClass('grid-cols-2');     // Móviles: 2 columnas
      expect(gridContainer).toHaveClass('sm:grid-cols-3');  // Tablets pequeñas: 3 columnas
      expect(gridContainer).toHaveClass('md:grid-cols-4');  // Tablets: 4 columnas
      expect(gridContainer).toHaveClass('lg:grid-cols-5');  // Desktop: 5 columnas
    });
    //
    // 📱 DISEÑO RESPONSIVO EXPLICADO:
    //
    // BREAKPOINTS DE TAILWIND CSS:
    // - Default (< 640px): Móviles
    // - sm (640px+): Tablets pequeñas
    // - md (768px+): Tablets
    // - lg (1024px+): Laptops
    // - xl (1280px+): Desktop
    // - 2xl (1536px+): Pantallas grandes
    //
    // CÓMO FUNCIONA:
    // grid-cols-2: Por defecto 2 columnas (móviles)
    // sm:grid-cols-3: A partir de 640px, 3 columnas
    // md:grid-cols-4: A partir de 768px, 4 columnas
    // lg:grid-cols-5: A partir de 1024px, 5 columnas
    //
    // VISUALIZACIÓN:
    // Móvil (320px):     [🎮][🎮]      2 productos por fila
    // Tablet (768px):     [🎮][🎮][🎮][🎮]  4 productos por fila
    // Desktop (1920px):   [🎮][🎮][🎮][🎮][🎮]  5 productos por fila
    //
    // BENEFICIOS:
    // - Aprovecha el espacio disponible
    // - Evita scroll horizontal
    // - Mejora legibilidad en cada dispositivo
    // - Experiencia óptima en cualquier pantalla
    //
    // CSS GRID VS FLEXBOX:
    // - Grid: Mejor para layouts 2D (filas Y columnas)
    // - Flexbox: Mejor para layouts 1D (fila O columna)
    // Aquí usamos Grid porque queremos una cuadrícula de productos
    //
    // Si este test falla:
    // - El layout no es responsivo
    // - Mala experiencia en móviles
    // - Productos muy pequeños o muy grandes
  });

  // ============================================================
  // TEST 10: OPTIMIZACIÓN - EVITAR LLAMADAS INNECESARIAS
  // ============================================================
  it('debe llamar a la API solo una vez al montar el componente', async () => {
    // Este test verifica que no hay llamadas innecesarias a la API
    
    // PASO 1: Configurar API
    productsAPI.getAll.mockResolvedValue(mockProducts);
    
    // PASO 2: Renderizar y obtener función rerender
    const { rerender } = render(<ProductList />);
    // render() devuelve varias utilidades:
    // - container: El contenedor DOM
    // - rerender: Función para re-renderizar con nuevas props
    // - unmount: Para desmontar el componente
    // - debug: Para imprimir el HTML actual
    
    // PASO 3: Esperar carga inicial
    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });
    // Primera renderización: Llama a la API ✅
    
    // PASO 4: Forzar un re-render
    rerender(<ProductList />);
    // ⚠️ ¿QUÉ ES UN RE-RENDER?
    // Es cuando React vuelve a ejecutar el componente
    // Puede ocurrir por:
    // - Cambio de props
    // - Cambio de estado
    // - Cambio en el contexto
    // - Re-render del componente padre
    
    // PASO 5: Verificar que NO hubo segunda llamada
    expect(productsAPI.getAll).toHaveBeenCalledTimes(1);
    // Solo 1 llamada, no 2
    //
    // 🎯 OPTIMIZACIÓN IMPORTANTE:
    //
    // PROBLEMA POTENCIAL:
    // Sin optimización, cada re-render podría:
    // 1. Llamar a la API nuevamente
    // 2. Causar múltiples requests innecesarios
    // 3. Sobrecargar el servidor
    // 4. Consumir datos del usuario
    // 5. Causar parpadeos en la UI
    //
    // SOLUCIÓN EN REACT:
    // useEffect(() => {
    //   fetchProducts(); // Llama a la API
    // }, []); // Array vacío = solo al montar
    //
    // El array de dependencias vacío [] significa:
    // "Ejecuta este efecto SOLO cuando el componente se monta"
    // NO cuando se re-renderiza
    //
    // ANTI-PATRÓN (MALO):
    // useEffect(() => {
    //   fetchProducts();
    // }); // Sin array = ejecuta en CADA render 🔥
    //
    // OTROS PATRONES DE OPTIMIZACIÓN:
    // 1. Cache de datos (no recargar si ya tenemos)
    // 2. Debounce (esperar antes de llamar)
    // 3. Pagination (cargar de a poco)
    // 4. React Query / SWR (librerías especializadas)
    //
    // Si este test falla:
    // - useEffect no tiene array de dependencias correcto
    // - Se está llamando a la API en el render
    // - Problema de performance potencial
  });
});

// ============================================================
// FIN DE LOS TESTS DE PRODUCTLIST
// ============================================================
// RESUMEN DE LO QUE TESTEAMOS:
// 1. Estados de carga (spinner)
// 2. Carga exitosa de productos
// 3. Manejo de lista vacía
// 4. Manejo de errores de red
// 5. Mensajes de ayuda contextual
// 6. Funcionalidad de reintento
// 7. Actualización de lista vacía
// 8. Renderizado correcto de componentes
// 9. Diseño responsivo
// 10. Optimización de llamadas a API
//
// CONCEPTOS CLAVE APRENDIDOS:
// - Promesas pendientes infinitas
// - mockResolvedValue vs mockRejectedValue
// - mockResolvedValueOnce para diferentes respuestas
// - waitFor para código asíncrono
// - getAllByTestId para múltiples elementos
// - Verificación de clases CSS responsivas
// - Optimización con useEffect
//
// ProductList es crítico porque:
// - Es lo primero que ve el usuario
// - Maneja estados complejos (loading, error, empty, success)
// - Interactúa con API externa
// - Debe ser responsivo y performante
