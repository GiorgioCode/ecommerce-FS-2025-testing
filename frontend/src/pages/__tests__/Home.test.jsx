// ============================================================
// TESTS DE LA PÁGINA HOME - PÁGINA DE INICIO/LANDING
// Testea todos los elementos visuales y funcionales de la página principal
// ============================================================

// IMPORTACIONES NECESARIAS
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// BrowserRouter es necesario porque Home usa Link de React Router
import { BrowserRouter } from 'react-router-dom';

// Importamos la página que vamos a testear
import Home from '../Home';

// SUITE DE TESTS PARA LA PÁGINA HOME
describe('Home Page', () => {
  
  // FUNCIÓN HELPER: Renderiza Home envuelto en BrowserRouter
  // Necesitamos BrowserRouter porque la página usa el componente Link
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  // TEST 1: Verificar que el título principal de la página se muestra
  it('debe renderizar el título principal', () => {
    // PASO 1: Renderizamos la página Home
    renderHome();
    
    // PASO 2: Buscamos el texto "Bienvenido a" (case insensitive con /i)
    expect(screen.getByText(/bienvenido a/i)).toBeInTheDocument();
    
    // PASO 3: Buscamos el nombre de la tienda
    expect(screen.getByText('GameHub')).toBeInTheDocument();
  });

  // TEST 2: Verificar que las descripciones/eslogan de la tienda aparecen
  it('debe mostrar la descripción de la tienda', () => {
    // PASO 1: Renderizamos la página
    renderHome();
    
    // PASO 2: Verificamos el eslogan principal
    expect(screen.getByText(/descubre el mejor hardware gaming/i)).toBeInTheDocument();
    
    // PASO 3: Verificamos la descripción adicional
    expect(screen.getByText(/desde consolas hasta periféricos pro/i)).toBeInTheDocument();
  });

  // TEST 3: Verificar el botón/enlace principal de llamada a la acción (CTA)
  it('debe tener un enlace a la página de productos', () => {
    // PASO 1: Renderizamos la página
    renderHome();
    
    // PASO 2: Buscamos el botón CTA "Ver Productos"
    const productsLink = screen.getByRole('link', { name: /ver productos/i });
    
    // PASO 3: Verificamos que el botón existe
    expect(productsLink).toBeInTheDocument();
    
    // PASO 4: Verificamos que apunta a la ruta correcta
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  // TEST 4: Verificar que la imagen hero/banner principal se muestra
  it('debe mostrar la imagen destacada', () => {
    // PASO 1: Renderizamos la página
    renderHome();
    
    // PASO 2: Buscamos la imagen por su texto alternativo
    const heroImage = screen.getByAltText(/setup gaming/i);
    
    // PASO 3: Verificamos que la imagen existe
    expect(heroImage).toBeInTheDocument();
    
    // PASO 4: Verificamos que usa Unsplash (servicio de imágenes)
    // stringContaining verifica que el src contiene ese texto
    expect(heroImage).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
  });

  // TEST 5: Verificar que la sección de características/ventajas existe
  it('debe renderizar la sección de características', () => {
    // PASO 1: Renderizamos la página
    renderHome();
    
    // PASO 2: Verificamos que el título de la sección aparece
    expect(screen.getByText('¿Por qué elegir GameHub?')).toBeInTheDocument();
  });

  // TEST 6: Verificar que todas las características/ventajas se muestran
  it('debe mostrar todas las características de la tienda', () => {
    // PASO 1: Renderizamos la página
    renderHome();
    
    // PASO 2: Definimos las características que esperamos encontrar
    const features = [
      { title: 'Envío Express', icon: '🚚' },      // Camión
      { title: 'Pago Seguro', icon: '🔒' },         // Candado
      { title: 'Hardware Original', icon: '⭐' },     // Estrella
      { title: 'Soporte Gamer', icon: '🔧' }        // Llave inglesa
    ];
    
    // PASO 3: Verificamos que cada característica aparece
    // forEach itera sobre cada elemento del array
    features.forEach(feature => {
      // Verificamos el título de la característica
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      
      // Verificamos el icono emoji de la característica
      expect(screen.getByText(feature.icon)).toBeInTheDocument();
    });
  });

  // TEST 7: Verificar las descripciones detalladas de cada característica
  it('debe mostrar las descripciones de las características', () => {
    // PASO 1: Renderizamos la página
    renderHome();
    
    // PASO 2: Verificamos cada descripción de característica
    // Cada expect busca un texto específico que describe la ventaja
    
    // Descripción del envío
    expect(screen.getByText(/entrega gratuita en pedidos/i)).toBeInTheDocument();
    
    // Descripción del pago
    expect(screen.getByText(/múltiples métodos de pago/i)).toBeInTheDocument();
    
    // Descripción de originalidad
    expect(screen.getByText(/100% productos gaming originales/i)).toBeInTheDocument();
    
    // Descripción del soporte
    expect(screen.getByText(/asesoría especializada/i)).toBeInTheDocument();
  });

  // TEST 8: Verificar el diseño responsivo del grid de características
  it('debe tener la estructura grid correcta para características', () => {
    // PASO 1: Renderizamos y obtenemos el container
    const { container } = renderHome();
    
    // PASO 2: Buscamos el elemento con clases de grid responsivo
    // grid-cols-2: 2 columnas en móvil
    // lg:grid-cols-4: 4 columnas en pantallas grandes
    // El backslash escapa el : en el selector CSS
    const featuresGrid = container.querySelector('.grid-cols-2.lg\\:grid-cols-4');
    
    // PASO 3: Verificamos que el grid existe
    expect(featuresGrid).toBeInTheDocument();
  });

  // TEST 9: Verificar el diseño responsivo de la sección hero
  it('debe tener la estructura hero con grid responsivo', () => {
    // PASO 1: Renderizamos y obtenemos el container
    const { container } = renderHome();
    
    // PASO 2: Buscamos el grid del hero
    // grid-cols-1: Una columna en móvil (texto e imagen apilados)
    // lg:grid-cols-2: Dos columnas en pantallas grandes (texto | imagen)
    const heroGrid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
    
    // PASO 3: Verificamos que el grid existe
    expect(heroGrid).toBeInTheDocument();
  });

  // TEST 10: Verificar los estilos del botón de llamada a la acción
  it('debe aplicar estilos correctos al botón de CTA', () => {
    // PASO 1: Renderizamos la página
    renderHome();
    
    // PASO 2: Obtenemos el botón CTA
    const ctaButton = screen.getByRole('link', { name: /ver productos/i });
    
    // PASO 3: Verificamos las clases de Tailwind CSS
    // bg-blue-600: Fondo azul
    // hover:bg-blue-700: Fondo azul más oscuro al pasar el mouse
    // text-white: Texto blanco
    expect(ctaButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  });

  // TEST 11: Verificar el estilo visual de las secciones
  it('debe tener secciones con bordes y estilos correctos', () => {
    // PASO 1: Renderizamos y obtenemos el container
    const { container } = renderHome();
    
    // PASO 2: Buscamos todas las etiquetas <section>
    const sections = container.querySelectorAll('section');
    
    // PASO 3: Verificamos que hay exactamente 2 secciones
    // Sección 1: Hero/banner
    // Sección 2: Características
    expect(sections).toHaveLength(2);
    
    // PASO 4: Verificamos que cada sección tiene los estilos correctos
    sections.forEach(section => {
      // bg-white: Fondo blanco
      // rounded-lg: Bordes redondeados
      // border: Borde visible
      expect(section).toHaveClass('bg-white', 'rounded-lg', 'border');
    });
  });
});
// FIN DE LOS TESTS DE LA PÁGINA HOME
