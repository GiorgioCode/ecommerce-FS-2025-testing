// ============================================================
// TESTS DEL COMPONENTE APP - EL COMPONENTE PRINCIPAL
// ============================================================
// ¿QUÉ ES APP?
// App es el componente "raíz" o principal de tu aplicación React
// Es como el "director de orquesta" que coordina todos los demás componentes
// App decide:
// - Qué página mostrar según la URL (/, /products, etc.)
// - Qué componentes aparecen siempre (Header, Footer, Cart)
// - La estructura general de la aplicación
//
// ¿QUÉ VAMOS A TESTEAR?
// 1. Que el enrutamiento funcione (mostrar la página correcta según la URL)
// 2. Que los componentes comunes (Header, Footer) siempre aparezcan
// 3. Que la estructura HTML sea correcta
// 4. Que maneje correctamente las rutas no existentes (404)

// ============================================================
// IMPORTACIONES
// ============================================================

// IMPORTACIÓN 1: Herramientas de Vitest
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Ya conoces estas, pero recordemos:
// - describe: Agrupa tests relacionados
// - it: Define un test individual
// - expect: Para hacer verificaciones
// - vi: Para crear mocks/simulaciones
// - beforeEach: Código que se ejecuta antes de cada test

// IMPORTACIÓN 2: Herramientas de React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
// - render: Dibuja el componente en memoria
// - screen: Para buscar elementos en lo renderizado
// - waitFor: NUEVO! Espera a que algo ocurra (para código asíncrono)
//           Por ejemplo, esperar a que se carguen datos de una API

// IMPORTACIÓN 3: El componente App que vamos a testear
import App from '../App';

// ============================================================
// CONFIGURACIÓN DE MOCKS - SIMPLIFICANDO LOS COMPONENTES
// ============================================================
// ¿POR QUÉ MOCKEAR LOS COMPONENTES HIJOS?
// App usa muchos componentes (Header, Cart, Home, Products)
// Si usáramos los componentes reales:
// 1. Los tests serían MUY lentos (renderizar todo)
// 2. Si falla Header, fallarían los tests de App (aunque App esté bien)
// 3. Sería difícil saber qué falló exactamente
//
// SOLUCIÓN: Reemplazar los componentes con versiones simples
// En lugar del Header real, usamos un <header> simple
// Esto se llama "Shallow Rendering" (renderizado superficial)

// MOCK 1: Simplificamos el componente Header
vi.mock('../components/Header', () => ({
  default: () => <header data-testid="header">Header Component</header>
}));
// Explicación detallada:
// - vi.mock('../components/Header'): Le decimos a Vitest que simule este archivo
// - () => ({ ... }): Función que devuelve un objeto
// - default: El export default del archivo (el componente Header)
// - () => <header>...</header>: Componente React simplificado
// - data-testid="header": Atributo especial para encontrarlo fácilmente en tests
//
// ¿Qué es data-testid?
// Es un atributo HTML personalizado SOLO para testing
// NO afecta la aplicación real, es ignorado en producción
// Nos permite encontrar elementos sin depender de texto o clases CSS
// que podrían cambiar

// MOCK 2: Simplificamos el componente Cart
vi.mock('../components/Cart', () => ({
  default: () => <div data-testid="cart">Cart Component</div>
}));
// Igual que Header, pero usando un <div> en lugar de <header>

// MOCK 3: Simplificamos la página Home
vi.mock('../pages/Home', () => ({
  default: () => <div data-testid="home">Home Page</div>
}));
// Las páginas también las simplificamos a simples <div>

// MOCK 4: Simplificamos la página Products  
vi.mock('../pages/Products', () => ({
  default: () => <div data-testid="products">Products Page</div>
}));
// Cada mock tiene un data-testid diferente para identificarlo

// ============================================================
// SUITE DE TESTS PRINCIPAL PARA APP
// ============================================================
describe('App Component', () => {
  // Todos los tests de App van dentro de estas llaves
  
  // ============================================================
  // CONFIGURACIÓN ANTES DE CADA TEST
  // ============================================================
  beforeEach(() => {
    // Limpiamos/reiniciamos el historial del navegador
    window.history.pushState({}, '', '/');
    
    // ⚠️ CONCEPTO IMPORTANTE: window.history
    // window.history es el historial de navegación del navegador
    // Contiene las URLs que el usuario ha visitado
    //
    // pushState() cambia la URL sin recargar la página
    // Parámetros:
    // 1. {} - Estado (datos) asociados con esta entrada del historial (vacío aquí)
    // 2. '' - Título de la página (la mayoría de navegadores lo ignoran)
    // 3. '/' - La nueva URL (en este caso, la raíz)
    //
    // ¿POR QUÉ HACER ESTO?
    // Cada test puede cambiar la URL (ej: navegar a /products)
    // Si no limpiamos, el test 2 podría empezar en /products
    // en lugar de en /, causando resultados inesperados
    // Esto garantiza que TODOS los tests empiecen en la página home (/)
  });

  // ============================================================
  // TEST 1: VERIFICAR QUE EL HEADER SIEMPRE APARECE
  // ============================================================
  it('debe renderizar el header en todas las páginas', () => {
    // PASO 1: Renderizar la aplicación completa
    render(<App />);
    // Como App usa BrowserRouter internamente, no necesitamos envolverlo
    // App se encarga de configurar el enrutamiento
    
    // PASO 2: Buscar el Header por su data-testid
    expect(screen.getByTestId('header')).toBeInTheDocument();
    // getByTestId('header') busca: <header data-testid="header">
    // Recuerda: este es nuestro Header simplificado/mockeado
    //
    // ¿Qué estamos verificando?
    // Que el Header aparece en la página
    // El Header debe aparecer en TODAS las páginas (home, products, 404, etc.)
    // Es un componente "persistente" o "global"
    //
    // Si este test falla:
    // - App no está incluyendo el Header
    // - Hay un error en la estructura de App
    // - El mock del Header no está funcionando
  });

  // ============================================================
  // TEST 2: VERIFICAR QUE EL CARRITO SIEMPRE ESTÁ DISPONIBLE
  // ============================================================
  it('debe renderizar el componente Cart', () => {
    // PASO 1: Renderizar App
    render(<App />);
    
    // PASO 2: Verificar que el Cart existe
    expect(screen.getByTestId('cart')).toBeInTheDocument();
    // Buscamos: <div data-testid="cart">
    //
    // ¿Por qué el Cart siempre debe estar?
    // El Cart es un "drawer" (cajón deslizable)
    // Aunque esté oculto visualmente, debe existir en el DOM
    // para poder abrirse cuando el usuario hace click en el botón del carrito
    //
    // Piensa en el Cart como una puerta:
    // - La puerta siempre está ahí (en el DOM)
    // - Pero puede estar abierta o cerrada (visible u oculta)
  });

  // ============================================================
  // TEST 3: VERIFICAR EL FOOTER Y SU CONTENIDO
  // ============================================================
  it('debe renderizar el footer con información de copyright', () => {
    // PASO 1: Renderizar App
    render(<App />);
    
    // PASO 2: Buscar el texto del copyright
    expect(screen.getByText(/2024 GameHub/)).toBeInTheDocument();
    // La expresión regular /2024 GameHub/ busca ese texto exacto
    // No usamos 'i' al final porque queremos respetar mayúsculas
    
    // PASO 3: Buscar el texto de derechos reservados
    expect(screen.getByText(/todos los derechos reservados/i)).toBeInTheDocument();
    // Aquí SÍ usamos 'i' porque no importan las mayúsculas
    // Podría ser "Todos los derechos" o "TODOS LOS DERECHOS"
    //
    // ¿Por qué verificar el footer?
    // 1. Cumplimiento legal: El copyright es importante legalmente
    // 2. Branding: Asegura que el nombre de la empresa aparece
    // 3. Estructura: Confirma que la aplicación tiene footer
    //
    // El footer, como el header, debe aparecer en TODAS las páginas
  });

  // ============================================================
  // TEST 4: VERIFICAR EL ENRUTAMIENTO - PÁGINA HOME
  // ============================================================
  it('debe renderizar la página Home en la ruta /', () => {
    // PASO 1: Asegurar que estamos en la URL raíz
    window.history.pushState({}, '', '/');
    // Aunque beforeEach ya hace esto, es buena práctica ser explícito
    // Así el test es más claro y autodocumentado
    
    // PASO 2: Renderizar App
    render(<App />);
    
    // PASO 3: Verificar que se muestra la página Home
    expect(screen.getByTestId('home')).toBeInTheDocument();
    // Buscamos: <div data-testid="home">
    //
    // ¿QUÉ ES EL ENRUTAMIENTO?
    // El enrutamiento (routing) es el sistema que decide qué mostrar
    // según la URL del navegador:
    // - Si la URL es "/" → mostrar Home
    // - Si la URL es "/products" → mostrar Products
    // - Si la URL es "/about" → mostrar About
    // etc.
    //
    // React Router se encarga de esto
    // App define las rutas con <Route path="/" element={<Home />} />
    //
    // Este test verifica que cuando estamos en "/",
    // React Router efectivamente muestra el componente Home
  });

  // ============================================================
  // TEST 5: VERIFICAR EL ENRUTAMIENTO - PÁGINA PRODUCTS
  // ============================================================
  it('debe renderizar la página Products en la ruta /products', () => {
    // PASO 1: Cambiar la URL a /products
    window.history.pushState({}, '', '/products');
    // Esto simula que el usuario navegó a /products
    // Ya sea escribiendo en la barra de direcciones
    // o haciendo click en un enlace
    
    // PASO 2: Renderizar App
    render(<App />);
    // App debe detectar que estamos en /products
    // y mostrar el componente Products
    
    // PASO 3: Verificar que Products se muestra
    expect(screen.getByTestId('products')).toBeInTheDocument();
    // Buscamos: <div data-testid="products">
    //
    // Este test asegura que el enrutamiento funciona
    // para múltiples rutas, no solo la raíz
    //
    // Si este test falla:
    // - La ruta /products no está configurada en App
    // - Hay un error en React Router
    // - El componente Products no se está importando correctamente
  });

  // ============================================================
  // TEST 6: VERIFICAR EL MANEJO DE RUTAS NO EXISTENTES (404)
  // ============================================================
  it('debe mostrar página 404 para rutas no encontradas', () => {
    // PASO 1: Navegar a una ruta que NO existe
    window.history.pushState({}, '', '/ruta-no-existe');
    // '/ruta-no-existe' no está definida en las rutas de App
    // Podría ser cualquier URL inválida: /xyz, /productos (mal escrito), etc.
    
    // PASO 2: Renderizar App
    render(<App />);
    
    // PASO 3: Verificar que aparece el título de error 404
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
    // Este es el título principal del error
    
    // PASO 4: Verificar el mensaje explicativo
    expect(screen.getByText(/la página que buscas no existe/i)).toBeInTheDocument();
    // Mensaje más descriptivo para el usuario
    
    // PASO 5: Verificar que hay un enlace para volver
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument();
    // Es importante dar al usuario una forma de salir del error
    //
    // ¿QUÉ ES UNA PÁGINA 404?
    // 404 es el código de error HTTP que significa "No encontrado"
    // En aplicaciones web:
    // - Aparece cuando el usuario intenta acceder a una página que no existe
    // - Puede pasar si el usuario escribe mal una URL
    // - O si sigue un enlace viejo/roto
    //
    // Una buena página 404 debe:
    // 1. Explicar claramente qué pasó
    // 2. Ser amigable (no asustar al usuario)
    // 3. Ofrecer una salida (enlace a home)
    //
    // Este test verifica que App maneja correctamente las rutas inválidas
  });

  // ============================================================
  // TEST 7: VERIFICAR LA ESTRUCTURA CSS/FLEXBOX
  // ============================================================
  it('debe tener la estructura correcta con flexbox', () => {
    // PASO 1: Renderizar y obtener el container
    const { container } = render(<App />);
    // render() devuelve un objeto con varias propiedades útiles:
    // - container: El div que envuelve todo lo renderizado
    // - debug(): Función para imprimir el HTML en consola
    // - rerender(): Para volver a renderizar con nuevas props
    // etc.
    
    // PASO 2: Buscar el contenedor principal por su clase
    const mainContainer = container.querySelector('.min-h-screen');
    // querySelector() funciona igual que en JavaScript normal
    // Busca el primer elemento con la clase 'min-h-screen'
    // El punto (.) indica que es una clase
    
    // PASO 3: Verificar que el contenedor existe
    expect(mainContainer).toBeInTheDocument();
    
    // PASO 4: Verificar las clases CSS de Tailwind
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'bg-gray-50');
    // toHaveClass verifica que el elemento tiene TODAS estas clases
    //
    // ¿QUÉ SIGNIFICAN ESTAS CLASES DE TAILWIND?
    // - min-h-screen: Altura mínima = altura de la pantalla completa
    // - flex: Activa Flexbox (sistema de layout flexible)
    // - flex-col: Dirección de flex en columna (vertical)
    // - bg-gray-50: Color de fondo gris muy claro
    //
    // ¿QUÉ ES FLEXBOX?
    // Flexbox es un sistema de CSS para organizar elementos
    // - flex: Convierte el elemento en un contenedor flexible
    // - flex-col: Los hijos se apilan verticalmente (uno debajo del otro)
    // - Sin flex-col: Los hijos se alinean horizontalmente (uno al lado del otro)
    //
    // Esta estructura asegura que:
    // 1. La app ocupa toda la altura de la pantalla (min-h-screen)
    // 2. Header, contenido y footer se apilan verticalmente (flex-col)
    // 3. Tiene un fondo gris claro (bg-gray-50)
    //
    // Si este test falla, la estructura visual de la app puede estar rota
  });

  // ============================================================
  // TEST 8: VERIFICAR EL CONTENEDOR PRINCIPAL <main>
  // ============================================================
  it('debe tener un contenedor principal con ancho máximo', () => {
    // PASO 1: Renderizar y obtener el container
    const { container } = render(<App />);
    
    // PASO 2: Buscar el elemento <main>
    const mainElement = container.querySelector('main');
    // <main> es una etiqueta HTML5 semántica
    // Indica el contenido principal de la página
    // Debe haber solo UN <main> por página
    
    // PASO 3: Verificar que <main> existe
    expect(mainElement).toBeInTheDocument();
    
    // PASO 4: Verificar las clases CSS
    expect(mainElement).toHaveClass('max-w-6xl', 'mx-auto', 'flex-1');
    //
    // SIGNIFICADO DE ESTAS CLASES TAILWIND:
    // - max-w-6xl: Ancho máximo de 72rem (1152px)
    //             Evita que el contenido se estire demasiado en pantallas grandes
    // - mx-auto: Margen horizontal automático (centra el elemento)
    //           margin-left: auto; margin-right: auto;
    // - flex-1: Toma todo el espacio disponible (flex: 1 1 0%)
    //          Empuja el footer hacia abajo
    //
    // ¿POR QUÉ LIMITAR EL ANCHO?
    // En pantallas muy anchas (4K, ultrawide), el texto sería difícil de leer
    // si se estirara por toda la pantalla. Es mejor mantener un ancho máximo
    // para mejorar la legibilidad.
    //
    // ¿QUÉ HACE flex-1?
    // En un contenedor flex-col (vertical):
    // - Header: toma su altura natural
    // - Main con flex-1: toma TODO el espacio restante
    // - Footer: toma su altura natural
    // Esto empuja el footer al final de la página,
    // incluso si hay poco contenido
  });

  // ============================================================
  // TEST 9: VERIFICAR LOS ESTILOS DEL FOOTER
  // ============================================================
  it('debe tener el footer con estilos correctos', () => {
    // PASO 1: Renderizar y obtener el container
    const { container } = render(<App />);
    
    // PASO 2: Buscar el elemento <footer>
    const footer = container.querySelector('footer');
    // <footer> es otra etiqueta HTML5 semántica
    // Indica el pie de página con info de copyright, enlaces, etc.
    
    // PASO 3: Verificar que el footer existe
    expect(footer).toBeInTheDocument();
    
    // PASO 4: Verificar las clases CSS del footer
    expect(footer).toHaveClass('bg-gray-900', 'text-white', 'mt-auto');
    //
    // SIGNIFICADO DE ESTAS CLASES:
    // - bg-gray-900: Fondo gris muy oscuro (casi negro)
    // - text-white: Texto de color blanco
    // - mt-auto: margin-top automático (empuja el footer hacia abajo)
    //
    // ¿POR QUÉ ESTOS COLORES?
    // El contraste oscuro/claro (fondo oscuro, texto claro):
    // 1. Crea una separación visual clara del contenido principal
    // 2. Es un patrón común en diseño web
    // 3. Asegura buena legibilidad
    //
    // ¿QUÉ HACE mt-auto?
    // En un contenedor flex:
    // - Empuja el elemento lo más abajo posible
    // - Garantiza que el footer siempre esté al final
    // - Incluso si la página tiene poco contenido
    //
    // Esto se llama "Sticky Footer" - un footer que se "pega" al final
  });

  // ============================================================
  // TEST 10: VERIFICAR EL ENLACE DE LA PÁGINA 404
  // ============================================================
  it('el enlace de volver al inicio debe tener href correcto', () => {
    // PASO 1: Navegar a una ruta inválida para mostrar el 404
    window.history.pushState({}, '', '/ruta-no-existe');
    // Necesitamos estar en una página 404 para que aparezca el enlace
    
    // PASO 2: Renderizar App
    render(<App />);
    
    // PASO 3: Buscar el enlace "Volver al inicio"
    const homeLink = screen.getByRole('link', { name: /volver al inicio/i });
    // Solo existe en la página 404
    
    // PASO 4: Verificar que apunta a la raíz
    expect(homeLink).toHaveAttribute('href', '/');
    // toHaveAttribute verifica atributos HTML
    // En este caso, verificamos que href="/"
    //
    // ¿POR QUÉ ES IMPORTANTE ESTE TEST?
    // Un enlace roto en la página 404 sería irónico y frustrante
    // El usuario estaría "atrapado" sin forma de salir
    // Este test asegura que siempre hay una salida del error 404
    //
    // NOTA SOBRE href:
    // - href="/" significa ir a la raíz del sitio
    // - href="/products" iría a la página de productos
    // - href="https://google.com" iría a un sitio externo
  });
});

// ============================================================
// SEGUNDA SUITE: TESTS DE INTEGRACIÓN
// ============================================================
// ¿QUÉ ES UN TEST DE INTEGRACIÓN?
// Mientras los tests anteriores eran "unitarios" (probaban App aislado),
// estos son tests de "integración" que prueban cómo App interactúa
// con componentes y servicios REALES (o casi reales)
//
// DIFERENCIA ENTRE TESTS UNITARIOS E INTEGRACIÓN:
// - UNITARIO: Prueba UN componente aislado con mocks
//            Rápido, específico, fácil de debuggear
// - INTEGRACIÓN: Prueba VARIOS componentes trabajando juntos
//                Más lento, más realista, puede encontrar bugs de interacción
//
// Es como la diferencia entre:
// - Probar que cada pieza de un motor funciona (unitario)
// - Probar que el motor completo arranca (integración)

describe('App Integration Tests', () => {
  // CONFIGURACIÓN ANTES DE CADA TEST DE INTEGRACIÓN
  beforeEach(() => {
    // PASO 1: Restaurar todos los mocks
    vi.restoreAllMocks();
    // ¿Qué hace restoreAllMocks()?
    // Deshace TODOS los mocks que hicimos antes
    // Los componentes vuelven a ser los originales
    // ¿Por qué hacer esto?
    // Porque ahora queremos probar con componentes más reales
    // para ver si todo funciona bien cuando está conectado
    //
    // NOTA: restoreAllMocks() vs clearAllMocks()
    // - clearAllMocks(): Borra el historial de llamadas pero mantiene el mock
    // - restoreAllMocks(): Elimina el mock completamente, vuelve al original
    
    // PASO 2: Resetear la URL
    window.history.pushState({}, '', '/');
    // Igual que antes, empezamos desde la página principal
  });

  // ============================================================
  // TEST DE INTEGRACIÓN: RENDERIZADO COMPLETO
  // ============================================================
  it('debe renderizar la aplicación completa sin errores', async () => {
    // NOTA: async al final de la línea anterior
    // ¿Qué es async?
    // Indica que esta función es asíncrona (puede esperar cosas)
    // Necesario porque vamos a usar await más adelante
    
    // CONFIGURACIÓN DE MOCKS MÍNIMOS
    // Aunque es un test de integración, aún necesitamos algunos mocks
    // para servicios externos (base de datos, APIs, etc.)
    
    // MOCK 1: Store del carrito
    vi.mock('../store/useCartStore', () => ({
      useCartStore: vi.fn(() => ({
        items: [],            // Carrito vacío
        isOpen: false,        // Drawer cerrado
        getTotalItems: () => 0, // Función que devuelve 0 items
        toggleCart: vi.fn(),   // Función mock para abrir/cerrar
        closeCart: vi.fn()     // Función mock para cerrar
      }))
    }));
    // ¿Por qué mockear el store?
    // El store real podría intentar:
    // - Leer del localStorage (que no existe en tests)
    // - Conectar con una base de datos
    // - Mantener estado entre tests
    // Mejor usar una versión controlada

    // MOCK 2: API de productos
    vi.mock('../services/api', () => ({
      productsAPI: {
        getAll: vi.fn(() => Promise.resolve([]))
        // Promise.resolve([]) crea una promesa que se resuelve inmediatamente
        // con un array vacío de productos
      }
    }));
    // ¿Por qué mockear la API?
    // - No queremos hacer llamadas HTTP reales en tests
    // - Sería lento y poco confiable
    // - Podría fallar si no hay internet
    // - No queremos depender de un servidor externo

    // RENDERIZAR LA APLICACIÓN COMPLETA
    const { container } = render(<App />);
    // Ahora App usará componentes más reales
    // (aunque con store y API mockeados)

    // ESPERAR Y VERIFICAR
    await waitFor(() => {
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });
    // ⚠️ CONCEPTO IMPORTANTE: await y waitFor
    //
    // ¿Qué es await?
    // Hace que JavaScript espere a que una promesa se resuelva
    // Sin await, el test continuaría sin esperar
    //
    // ¿Qué es waitFor?
    // Una función de React Testing Library que:
    // 1. Ejecuta la función que le pasamos
    // 2. Si falla, espera un poco y vuelve a intentar
    // 3. Continúa intentando hasta que funcione o se agote el tiempo
    //
    // ¿Por qué necesitamos waitFor?
    // Porque el renderizado puede ser asíncrono:
    // - Componentes que cargan datos
    // - useEffect que se ejecuta después del render
    // - Animaciones o transiciones
    //
    // En este caso, esperamos a que:
    // 1. App se renderice completamente
    // 2. Todos los componentes se monten
    // 3. El contenedor principal (.min-h-screen) aparezca
    //
    // Si después de varios intentos (por defecto 1000ms)
    // el elemento no aparece, el test falla
    //
    // Este test verifica que App puede renderizarse sin explotar
    // cuando usa componentes más reales
  });
});

// FIN DE LOS TESTS DE APP
// ========================================
// RESUMEN DE LO QUE HEMOS TESTEADO:
// 1. Estructura: Header, Footer, Cart siempre presentes
// 2. Enrutamiento: Mostrar la página correcta según URL
// 3. Error 404: Manejo de rutas no existentes
// 4. CSS/Layout: Clases de Tailwind y estructura flex
// 5. Integración: Que todo funcione junto sin errores
//
// Estos tests aseguran que el "esqueleto" de la aplicación
// funciona correctamente antes de preocuparnos por
// funcionalidades específicas
