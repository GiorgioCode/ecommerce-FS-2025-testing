// ============================================================
// ARCHIVO DE TESTS PARA EL COMPONENTE HEADER
// ============================================================
// ¿QUÉ ES ESTE ARCHIVO?
// Este archivo contiene "pruebas automáticas" para el componente Header (la barra de navegación)
// Un test es como un robot que verifica que tu código funciona correctamente
// En lugar de probar manualmente cada vez, escribimos código que prueba nuestro código

// ============================================================
// IMPORTACIONES - HERRAMIENTAS QUE NECESITAMOS PARA TESTEAR
// ============================================================

// IMPORTACIÓN 1: Herramientas básicas de Vitest (nuestro framework de testing)
import { describe, it, expect, vi, beforeEach } from 'vitest';
// ¿Qué es cada una?
// - describe: Crea un grupo de tests relacionados (como una carpeta)
// - it: Define un test individual (cada cosa específica que queremos probar)
// - expect: Nos permite verificar que algo es verdadero (ej: expect(2+2).toBe(4))
// - vi: Herramienta para crear "simulaciones" (mocks) de funciones y módulos
// - beforeEach: Código que se ejecuta antes de CADA test (para preparar el ambiente)

// IMPORTACIÓN 2: Herramientas de React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
// ¿Qué es cada una?
// - render: "Dibuja" un componente React en memoria (no en el navegador real)
//          Es como crear una versión invisible del componente para testear
// - screen: Objeto que contiene métodos para buscar elementos en lo que renderizamos
//          Como un inspector que puede buscar botones, textos, imágenes, etc.
// - fireEvent: Simula acciones del usuario (clicks, escribir, etc.)
//             Es como tener un usuario robot que puede interactuar con el componente

// IMPORTACIÓN 3: React Router
import { BrowserRouter } from 'react-router-dom';
// ¿Por qué lo necesitamos?
// El Header usa componentes <Link> de React Router para la navegación
// React Router REQUIERE que estos Links estén dentro de un Router
// Sin esto, el test fallaría con un error diciendo "useRoutes() may be used only in Router"

// IMPORTACIÓN 4: El componente que vamos a testear
import Header from '../Header';
// Este es el componente real que queremos probar
// Lo importamos desde su ubicación en la carpeta padre (..)

// IMPORTACIÓN 5: El store del carrito
import { useCartStore } from '../../store/useCartStore';
// ¿Qué es un store?
// Es un lugar donde guardamos datos que múltiples componentes necesitan
// En este caso, guarda la información del carrito de compras
// ¿Por qué lo importamos?
// Porque el Header muestra cuántos items hay en el carrito

// ============================================================
// CONFIGURACIÓN DE MOCKS (SIMULACIONES/IMITACIONES)
// ============================================================
// ¿QUÉ ES UN MOCK?
// Un mock es como un "doble de acción" en las películas
// En lugar de usar el componente/función real, usamos una versión falsa controlada
// ¿POR QUÉ USAR MOCKS?
// 1. Para aislar lo que estamos probando (solo queremos probar el Header, no el store)
// 2. Para controlar exactamente qué datos recibe el componente
// 3. Para hacer los tests más rápidos (no necesitan conexiones reales)
// 4. Para hacer los tests predecibles (siempre dan el mismo resultado)

// MOCK #1: Simulamos el store del carrito
vi.mock('../../store/useCartStore');
// ¿Qué hace esta línea?
// Le dice a Vitest: "Cuando alguien importe useCartStore, no uses el real, usa una versión falsa"
// Esto nos permite controlar qué devuelve el store sin tener un carrito real

// MOCK #2: Simulamos parcialmente React Router
vi.mock('react-router-dom', async () => {
  // Paso 1: Obtenemos TODAS las funciones reales de react-router-dom
  const actual = await vi.importActual('react-router-dom');
  // ¿Por qué "actual"? Porque queremos mantener la mayoría de funciones originales
  // Solo queremos cambiar UNA función (useLocation)
  
  // Paso 2: Retornamos un objeto con todas las funciones
  return {
    ...actual,  // Los tres puntos (...) significan "copia todo lo que hay en 'actual'"
                // Esto incluye BrowserRouter, Link, y todas las demás funciones
    
    useLocation: vi.fn(() => ({ pathname: '/' }))  
    // PERO reemplazamos useLocation con nuestra versión
    // vi.fn() crea una función simulada
    // () => ({ pathname: '/' }) es lo que devuelve esa función
    // pathname: '/' simula que estamos en la página principal
    // ¿Por qué hacer esto? Para controlar en qué página "cree" el Header que está
  };
});

// ============================================================
// INICIO DE LA SUITE DE TESTS
// ============================================================
// La función describe() crea un "grupo" de tests relacionados
// Es como crear una carpeta llamada "Header Component" donde ponemos todos los tests del Header
describe('Header Component', () => {
  // Todo lo que está dentro de estas llaves {} son los tests del Header
  
  // ============================================================
  // PREPARACIÓN DE FUNCIONES SIMULADAS
  // ============================================================
  // Aquí creamos las funciones "falsas" que usará nuestro Header en los tests
  
  // FUNCIÓN SIMULADA #1: toggleCart
  const mockToggleCart = vi.fn();
  // ¿Qué es vi.fn()?
  // Crea una función vacía que podemos controlar y espiar
  // ¿Para qué sirve toggleCart?
  // En la aplicación real, abre/cierra el drawer del carrito
  // En los tests, solo verificaremos que se llama cuando debe llamarse
  
  // FUNCIÓN SIMULADA #2: getTotalItems  
  const mockGetTotalItems = vi.fn();
  // ¿Para qué sirve getTotalItems?
  // En la aplicación real, cuenta cuántos productos hay en el carrito
  // En los tests, le diremos que devuelva el número que queramos (0, 5, 10, etc.)

  // ============================================================
  // CONFIGURACIÓN QUE SE EJECUTA ANTES DE CADA TEST
  // ============================================================
  // beforeEach es como un "ritual de preparación"
  // Se ejecuta AUTOMÁTICAMENTE antes de cada test individual
  // ¿Por qué? Para asegurar que cada test empiece en las mismas condiciones
  beforeEach(() => {
    // PASO 1: Limpieza de mocks
    vi.clearAllMocks();
    // ¿Qué hace clearAllMocks()?
    // Borra el "historial" de llamadas a las funciones simuladas
    // Es como borrar la pizarra antes de empezar una nueva clase
    // ¿Por qué es importante?
    // Si el test 1 llama a toggleCart 2 veces, y el test 2 también,
    // sin limpiar, el test 2 pensaría que toggleCart fue llamada 4 veces
    
    // PASO 2: Configurar qué devuelve el store simulado
    useCartStore.mockReturnValue({
      getTotalItems: mockGetTotalItems,  
      toggleCart: mockToggleCart
    });
    // ¿Qué hace mockReturnValue?
    // Define qué valor devuelve una función simulada cuando es llamada
    // En este caso, cuando el Header ejecute:
    //   const store = useCartStore()
    // Recibirá un objeto con nuestras dos funciones simuladas
    // Así podemos controlar exactamente qué funciones tiene disponibles el Header
  });

  // ============================================================
  // FUNCIÓN HELPER (AYUDANTE) PARA RENDERIZAR EL HEADER
  // ============================================================
  // Esta es una función que creamos para no repetir código
  const renderHeader = () => {
    // La función render() de React Testing Library "dibuja" el componente
    // pero no en el navegador real, sino en memoria (DOM virtual)
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };
  // ¿Por qué envolvemos Header en BrowserRouter?
  // El Header usa componentes <Link to="/products"> de React Router
  // Estos Links NECESITAN estar dentro de un Router para funcionar
  // Si no lo hacemos, el test fallará con: "useRoutes() may be used only in Router"
  // ¿Por qué hacer una función aparte?
  // Porque vamos a renderizar el Header en CADA test
  // En lugar de escribir estas 5 líneas cada vez, solo escribimos: renderHeader()

  // ============================================================
  // TEST 1: VERIFICAR QUE EL LOGO Y TÍTULO APARECEN
  // ============================================================
  // it() define un test individual
  // El primer parámetro es una descripción de qué estamos probando
  // El segundo parámetro es una función con el código del test
  it('debe renderizar el logo y título de la tienda', () => {
    
    // PASO 1: Preparar los datos simulados
    mockGetTotalItems.mockReturnValue(0);
    // ¿Qué hace mockReturnValue(0)?
    // Le dice a nuestra función simulada: "cuando te llamen, devuelve 0"
    // Esto simula que hay 0 productos en el carrito
    // ¿Por qué configuramos esto aquí si no estamos probando el carrito?
    // Porque el Header SIEMPRE intenta mostrar el número de items
    // Si no le damos un valor, podría causar errores
    
    // PASO 2: Renderizar (dibujar) el componente Header
    renderHeader();
    // Esto ejecuta nuestra función helper que definimos arriba
    // Ahora el Header está "dibujado" en memoria, listo para ser inspeccionado
    
    // PASO 3: Buscar y verificar que existe el texto "GameHub"
    expect(screen.getByText('GameHub')).toBeInTheDocument();
    // Desglosemos esta línea:
    // - screen: Es como una "pantalla virtual" donde se dibujó el Header
    // - getByText('GameHub'): Busca un elemento que contenga exactamente el texto "GameHub"
    //                         Si no lo encuentra, el test falla inmediatamente
    // - expect(): Envuelve lo que queremos verificar
    // - toBeInTheDocument(): Verifica que el elemento existe en el documento
    // En español: "Espero que el texto 'GameHub' esté en el documento"
    
    // PASO 4: Buscar y verificar que existe el texto "Gaming Store"
    expect(screen.getByText('Gaming Store')).toBeInTheDocument();
    // Misma lógica que arriba, pero buscando el eslogan de la tienda
    // Si ambas verificaciones pasan, el test es exitoso ✅
  });

  // ============================================================
  // TEST 2: VERIFICAR QUE LOS ENLACES DE NAVEGACIÓN EXISTEN
  // ============================================================
  it('debe renderizar los enlaces de navegación', () => {
    
    // PASO 1: Configurar el carrito como vacío
    mockGetTotalItems.mockReturnValue(0);
    // Nuevamente configuramos el carrito con 0 items
    // Cada test es independiente, necesita su propia configuración
    
    // PASO 2: Renderizar el Header
    renderHeader();
    
    // PASO 3: Buscar y verificar el enlace "Inicio"
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();
    // Analicemos getByRole():
    // - Es diferente a getByText() que usamos antes
    // - getByRole busca elementos por su "rol" en HTML
    // - 'link' es el rol de los elementos <a> y <Link>
    // - { name: 'Inicio' } especifica qué link buscar por su texto
    // ¿Qué son los roles?
    // Son etiquetas que describen qué hace un elemento:
    // - 'button' para botones
    // - 'link' para enlaces
    // - 'heading' para títulos
    // - 'textbox' para campos de texto
    // ¿Por qué usar getByRole en lugar de getByText?
    // Porque es más específico: no solo busca el texto "Inicio",
    // busca un ENLACE con el texto "Inicio"
    
    // PASO 4: Buscar y verificar el enlace "Productos"
    expect(screen.getByRole('link', { name: 'Productos' })).toBeInTheDocument();
    // Misma lógica: buscamos un elemento con rol 'link' y texto 'Productos'
  });

  // TEST 3: Verificar que el botón del carrito existe
  it('debe mostrar el botón del carrito', () => {
    // PASO 1: Configuramos carrito vacío
    mockGetTotalItems.mockReturnValue(0);
    
    // PASO 2: Renderizamos el Header
    renderHeader();
    
    // PASO 3: Buscamos un botón que contenga la palabra "carrito"
    // La regex /carrito/i busca "carrito" sin importar mayúsculas/minúsculas
    const cartButton = screen.getByRole('button', { name: /carrito/i });
    
    // PASO 4: Verificamos que el botón existe en el documento
    expect(cartButton).toBeInTheDocument();
  });

  // TEST 4: Verificar que se muestra un contador cuando hay productos en el carrito
  it('debe mostrar el contador cuando hay items en el carrito', () => {
    // PASO 1: Configuramos el mock para simular 5 items en el carrito
    mockGetTotalItems.mockReturnValue(5);
    
    // PASO 2: Renderizamos el Header
    renderHeader();
    
    // PASO 3: Verificamos que aparece el número "5" en el badge (círculo rojo pequeño)
    // Este es el indicador visual que muestra cuántos items hay
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // PASO 4: Verificamos que el texto del botón también incluye el número
    // Debería mostrar algo como "Carrito (5)"
    expect(screen.getByText(/carrito.*5/i)).toBeInTheDocument();
  });

  // ============================================================
  // TEST 5: VERIFICAR QUE NO SE MUESTRA CONTADOR CON CARRITO VACÍO
  // ============================================================
  // Este test es especial: verifica que algo NO aparece
  it('no debe mostrar contador cuando el carrito está vacío', () => {
    
    // PASO 1: Configurar el carrito como vacío (0 items)
    mockGetTotalItems.mockReturnValue(0);
    // Le decimos a la función simulada que devuelva 0
    // Esto simula un carrito completamente vacío
    
    // PASO 2: Renderizar el Header
    renderHeader();
    
    // PASO 3: Verificar que NO aparece el número "0"
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    
    // ⚠️ CONCEPTO IMPORTANTE: queryByText vs getByText
    // Hasta ahora usamos getByText(), pero aquí usamos queryByText()
    // ¿CUÁL ES LA DIFERENCIA?
    //
    // getByText():
    // - Si encuentra el elemento: lo devuelve ✅
    // - Si NO encuentra el elemento: LANZA UN ERROR y el test falla ❌
    // - Úsalo cuando ESPERAS que algo exista
    //
    // queryByText():
    // - Si encuentra el elemento: lo devuelve ✅
    // - Si NO encuentra el elemento: devuelve null (no lanza error) ✅
    // - Úsalo cuando quieres verificar que algo NO existe
    //
    // ¿Por qué esta diferencia importa aquí?
    // Queremos verificar que el "0" NO aparece
    // Si usáramos getByText('0'), el test fallaría con error antes de poder verificar
    // Con queryByText('0'), obtenemos null si no existe, que es lo que esperamos
    //
    // ⚠️ CONCEPTO IMPORTANTE: .not.toBeInTheDocument()
    // - toBeInTheDocument() verifica que algo EXISTE
    // - .not.toBeInTheDocument() verifica que algo NO EXISTE
    // - El .not invierte la verificación
    //
    // En español esta línea dice:
    // "Espero que el texto '0' NO esté en el documento"
    //
    // ¿Por qué no mostrar el 0?
    // Es una decisión de diseño: mostrar "Carrito (0)" puede ser confuso
    // Es mejor no mostrar nada cuando el carrito está vacío
  });

  // ============================================================
  // TEST 6: VERIFICAR QUE EL BOTÓN DEL CARRITO RESPONDE AL CLICK
  // ============================================================
  // Este test verifica la INTERACCIÓN: ¿qué pasa cuando el usuario hace click?
  it('debe llamar a toggleCart al hacer click en el botón del carrito', () => {
    
    // PASO 1: Configurar el carrito con 3 items
    mockGetTotalItems.mockReturnValue(3);
    // Configuramos 3 items para que el botón muestre "Carrito (3)"
    // No importa el número exacto, solo que sea mayor a 0
    
    // PASO 2: Renderizar el Header
    renderHeader();
    
    // PASO 3: Buscar el botón del carrito
    const cartButton = screen.getByRole('button', { name: /carrito/i });
    // Buscamos específicamente un BOTÓN (no un link) que contenga "carrito"
    // La expresión /carrito/i es una "expresión regular" (regex)
    // - El / al inicio y final delimitan la expresión
    // - carrito es el texto que buscamos
    // - La 'i' al final significa "insensitive" (no distingue mayúsculas/minúsculas)
    // - Encontrará: "Carrito", "carrito", "CARRITO", etc.
    
    // PASO 4: Simular un click del usuario
    fireEvent.click(cartButton);
    // ⚠️ CONCEPTO IMPORTANTE: fireEvent
    // fireEvent es como un "usuario robot" que puede:
    // - .click() - hacer click
    // - .change() - escribir en inputs
    // - .submit() - enviar formularios
    // - .keyDown() - presionar teclas
    // etc.
    //
    // fireEvent.click(cartButton) simula que un usuario real hizo click
    // Esto dispara todos los eventos asociados al click:
    // - onMouseDown (presionar el mouse)
    // - onMouseUp (soltar el mouse)
    // - onClick (el click completo)
    
    // PASO 5: Verificar que se llamó la función toggleCart
    expect(mockToggleCart).toHaveBeenCalledTimes(1);
    // ⚠️ CONCEPTO IMPORTANTE: Verificación de llamadas a funciones
    //
    // Recuerda que mockToggleCart es una función simulada (mock)
    // Las funciones mock "recuerdan" cuándo y cómo fueron llamadas
    //
    // toHaveBeenCalledTimes(1) verifica que la función fue llamada EXACTAMENTE 1 vez
    // Otras verificaciones posibles:
    // - toHaveBeenCalled() - fue llamada al menos una vez
    // - toHaveBeenCalledWith(arg1, arg2) - fue llamada con argumentos específicos
    // - not.toHaveBeenCalled() - NO fue llamada
    //
    // ¿Qué estamos probando realmente?
    // NO estamos probando que el carrito se abre (eso sería responsabilidad del store)
    // Estamos probando que el Header INTENTA abrir el carrito (llama a toggleCart)
    // Es como verificar que el botón está "conectado" correctamente
    //
    // Si este test falla, significa que:
    // - El botón no tiene un onClick configurado, o
    // - El onClick no está llamando a toggleCart, o
    // - Hay un error en el código del Header
  });

  // TEST 7: Verificar que los enlaces de navegación apuntan a las rutas correctas
  it('debe tener los enlaces de navegación correctos', () => {
    // PASO 1: Configuramos carrito vacío
    mockGetTotalItems.mockReturnValue(0);
    
    // PASO 2: Renderizamos el Header
    renderHeader();
    
    // PASO 3: Obtenemos referencias a los enlaces de navegación
    const homeLink = screen.getByRole('link', { name: 'Inicio' });
    const productsLink = screen.getByRole('link', { name: 'Productos' });
    
    // PASO 4: Verificamos que el enlace "Inicio" apunta a la raíz "/"
    expect(homeLink).toHaveAttribute('href', '/');
    
    // PASO 5: Verificamos que el enlace "Productos" apunta a "/products"
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  // TEST 8: Verificar que el enlace activo tiene estilos diferentes (resaltado)
  it('debe resaltar el enlace activo con estilos diferentes', () => {
    // PASO 1: Configuramos carrito vacío
    mockGetTotalItems.mockReturnValue(0);
    
    // PASO 2: Renderizamos el Header
    // Recordemos que el mock de useLocation está configurado para simular que estamos en '/'
    renderHeader();
    
    // PASO 3: Verificamos que el enlace "Inicio" tiene las clases de estilo activo
    const homeLink = screen.getByRole('link', { name: 'Inicio' });
    // toHaveClass verifica que el elemento tiene estas clases CSS
    expect(homeLink).toHaveClass('bg-blue-600', 'text-white');  // Estilos de enlace activo
    
    // PASO 4: Verificamos que el enlace "Productos" NO tiene los estilos activos
    const productsLink = screen.getByRole('link', { name: 'Productos' });
    // .not.toHaveClass verifica que NO tiene esa clase
    expect(productsLink).not.toHaveClass('bg-blue-600');
    // Pero sí debe tener los estilos de enlace inactivo
    expect(productsLink).toHaveClass('text-gray-600');
  });
});
