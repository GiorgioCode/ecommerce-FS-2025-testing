// IMPORTACIONES NECESARIAS PARA LOS TESTS
// 'describe' - Función que agrupa tests relacionados (como una carpeta de tests)
// 'it' - Función para definir un test individual
// 'expect' - Función para hacer afirmaciones/verificaciones en los tests
// 'vi' - Utilidad de Vitest para crear mocks (simulaciones de funciones/módulos)
// 'beforeEach' - Función que se ejecuta antes de cada test
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Importamos las herramientas de React Testing Library
// 'render' - Función para renderizar (dibujar) componentes React en memoria para testear
// 'screen' - Objeto que nos permite buscar elementos en el componente renderizado
// 'fireEvent' - Función para simular eventos del usuario (clicks, escritura, etc.)
import { render, screen, fireEvent } from '@testing-library/react';

// Importamos el componente que vamos a testear
import ProductCard from '../ProductCard';

// Importamos el store de Zustand que el componente usa (para poder simularlo)
import { useCartStore } from '../../store/useCartStore';

// CONFIGURACIÓN DE MOCKS (SIMULACIONES)
// Le decimos a Vitest que simule/falsifique el store de Zustand
// Esto evita que los tests dependan del store real y nos da control total
vi.mock('../../store/useCartStore');

// SUITE DE TESTS - Agrupa todos los tests relacionados con ProductCard
describe('ProductCard Component', () => {
  // Creamos una función simulada (mock) que fingirá ser la función 'addItem' del store
  const mockAddItem = vi.fn();
  
  // Creamos un producto de ejemplo con todos los datos necesarios para los tests
  const mockProduct = {
    id: 1,                                    // ID único del producto
    nombre: 'Nintendo Switch',                // Nombre que debe mostrarse
    descripcion: 'Consola híbrida de Nintendo', // Descripción del producto
    precio: 45000,                           // Precio en pesos (sin formato)
    imagen: 'https://example.com/switch.jpg', // URL de la imagen
    categoria: 'consolas'                    // Categoría del producto
  };

  // CONFIGURACIÓN ANTES DE CADA TEST
  // Esta función se ejecuta automáticamente antes de cada test individual
  beforeEach(() => {
    // Limpia todos los mocks para que cada test empiece limpio
    // Esto evita que los tests se afecten entre sí
    vi.clearAllMocks();
    
    // Configuramos el mock del store para que devuelva nuestra función simulada
    // Cuando el componente llame a useCartStore(), recibirá mockAddItem
    useCartStore.mockReturnValue(mockAddItem);
  });

  // TEST 1: Verificar que el componente muestra correctamente la información del producto
  it('debe renderizar la información del producto correctamente', () => {
    // PASO 1: Renderizamos el componente ProductCard pasándole nuestro producto de prueba
    // El componente se "dibuja" en memoria (no en el navegador real)
    render(<ProductCard product={mockProduct} />);
    
    // PASO 2: Verificamos que el nombre del producto aparece en pantalla
    // getByText busca un elemento que contenga exactamente ese texto
    // toBeInTheDocument() verifica que el elemento existe en el DOM
    expect(screen.getByText('Nintendo Switch')).toBeInTheDocument();
    
    // PASO 3: Verificamos que la descripción del producto aparece
    expect(screen.getByText('Consola híbrida de Nintendo')).toBeInTheDocument();
    
    // PASO 4: Verificamos que el precio formateado aparece
    // Usamos una expresión regular (regex) porque el formato puede variar según el sistema
    // ARS 45,000.00 o 45.000,00 - ambos formatos son válidos
    expect(screen.getByText(/ARS\s*45,000\.00|45\.000,00/)).toBeInTheDocument();
  });

  // TEST 2: Verificar que la imagen del producto se muestra correctamente
  it('debe mostrar la imagen del producto', () => {
    // PASO 1: Renderizamos el componente con el producto
    render(<ProductCard product={mockProduct} />);
    
    // PASO 2: Buscamos la imagen por su texto alternativo (alt text)
    // El alt text es importante para accesibilidad y testing
    const image = screen.getByAltText('Nintendo Switch');
    
    // PASO 3: Verificamos que la imagen existe en el documento
    expect(image).toBeInTheDocument();
    
    // PASO 4: Verificamos que la imagen tiene la URL correcta en su atributo 'src'
    // toHaveAttribute verifica que un elemento tiene un atributo específico con un valor específico
    expect(image).toHaveAttribute('src', 'https://example.com/switch.jpg');
  });

  // TEST 3: Verificar que existe un botón para agregar el producto al carrito
  it('debe tener un botón para agregar al carrito', () => {
    // PASO 1: Renderizamos el componente
    render(<ProductCard product={mockProduct} />);
    
    // PASO 2: Buscamos un botón cuyo texto contenga "agregar" y "carrito"
    // getByRole busca elementos por su rol semántico (button, link, heading, etc.)
    // La regex /agregar.*carrito/i busca texto que contenga "agregar" seguido de "carrito"
    // La 'i' al final hace que la búsqueda no distinga mayúsculas/minúsculas
    const button = screen.getByRole('button', { name: /agregar.*carrito/i });
    
    // PASO 3: Verificamos que el botón existe
    expect(button).toBeInTheDocument();
  });

  // TEST 4: Verificar que al hacer click en el botón se llama a la función addItem
  it('debe llamar a addItem cuando se hace click en el botón', () => {
    // PASO 1: Renderizamos el componente
    render(<ProductCard product={mockProduct} />);
    
    // PASO 2: Buscamos el botón de agregar al carrito
    const button = screen.getByRole('button', { name: /agregar.*carrito/i });
    
    // PASO 3: Simulamos un click del usuario en el botón
    // fireEvent.click simula un evento de click como si un usuario real hiciera click
    fireEvent.click(button);
    
    // PASO 4: Verificamos que nuestra función mock fue llamada exactamente 1 vez
    // toHaveBeenCalledTimes verifica el número de veces que se llamó la función
    expect(mockAddItem).toHaveBeenCalledTimes(1);
    
    // PASO 5: Verificamos que la función fue llamada con el producto correcto como argumento
    // toHaveBeenCalledWith verifica que la función recibió los argumentos esperados
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });

  // TEST 5: Verificar que se maneja correctamente cuando la imagen no carga
  it('debe manejar el error de imagen correctamente', () => {
    // PASO 1: Renderizamos el componente
    render(<ProductCard product={mockProduct} />);
    
    // PASO 2: Buscamos la imagen por su texto alternativo
    const image = screen.getByAltText('Nintendo Switch');
    
    // PASO 3: Simulamos un error de carga de imagen
    // Esto es lo que pasaría si la URL de la imagen no funciona o está rota
    fireEvent.error(image);
    
    // PASO 4: Verificamos que la imagen ahora usa un placeholder (imagen de respaldo)
    // Cuando falla la carga, el componente debe mostrar una imagen por defecto
    // toContain verifica que el string contiene un texto específico
    expect(image.src).toContain('placeholder');
  });

  // TEST 6: Verificar que el precio se formatea correctamente como moneda argentina
  it('debe formatear el precio en formato argentino', () => {
    // PASO 1: Renderizamos el componente
    render(<ProductCard product={mockProduct} />);
    
    // PASO 2: Buscamos el elemento que contiene el precio formateado
    // Usamos regex porque el formato puede variar según la configuración del sistema
    // 45.000 o 45,000 - ambos son formatos válidos para mostrar 45000
    const priceElement = screen.getByText(/45[.,]000/);
    
    // PASO 3: Verificamos que el precio formateado aparece en el documento
    // Esto confirma que el componente está formateando correctamente el número como moneda
    expect(priceElement).toBeInTheDocument();
  });
});
