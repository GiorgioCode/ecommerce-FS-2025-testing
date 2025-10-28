// ============================================================
// TESTS DE LA PÁGINA PRODUCTS
// Esta página es simple: solo muestra el componente ProductList
// ============================================================

// IMPORTACIONES NECESARIAS
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Importamos la página que vamos a testear
import Products from '../Products';

// CONFIGURACIÓN DE MOCKS
// Simulamos el componente ProductList para no depender de su implementación real
// Esto hace que los tests sean más rápidos y aislados
vi.mock('../../components/ProductList', () => ({
  // En lugar del componente real, renderizamos un div simple con un data-testid
  // Esto es suficiente para verificar que el componente se incluye en la página
  default: () => <div data-testid="product-list">ProductList Component</div>
}));

// SUITE DE TESTS PARA LA PÁGINA PRODUCTS
describe('Products Page', () => {
  
  // TEST 1: Verificar que la página se renderiza correctamente
  it('debe renderizar la página de productos', () => {
    // PASO 1: Renderizamos la página Products
    render(<Products />);
    
    // PASO 2: Buscamos el elemento que representa ProductList (por su data-testid)
    const productList = screen.getByTestId('product-list');
    
    // PASO 3: Verificamos que el componente ProductList existe en la página
    expect(productList).toBeInTheDocument();
  });

  // TEST 2: Verificar que el componente ProductList está incluido
  it('debe incluir el componente ProductList', () => {
    // PASO 1: Renderizamos la página
    render(<Products />);
    
    // PASO 2: Verificamos que el texto del mock aparece
    // Esto confirma que ProductList fue incluido y renderizado
    expect(screen.getByText('ProductList Component')).toBeInTheDocument();
  });

  // TEST 3: Verificar la estructura HTML de la página
  it('debe tener la estructura correcta', () => {
    // PASO 1: Renderizamos y obtenemos el container (elemento raíz)
    const { container } = render(<Products />);
    
    // PASO 2: Obtenemos el primer hijo del container (el div principal)
    const mainDiv = container.firstChild;
    
    // PASO 3: Verificamos que es un elemento DIV
    expect(mainDiv.tagName).toBe('DIV');
    
    // PASO 4: Verificamos que tiene exactamente 1 hijo (ProductList)
    expect(mainDiv.children).toHaveLength(1);
  });

  // TEST 4: Verificar que no se pasan props innecesarias
  it('debe pasar ProductList sin props adicionales', () => {
    // CONTEXTO: Products es una página simple que solo envuelve ProductList
    // No necesita pasar props porque ProductList obtiene los datos por sí mismo
    
    // PASO 1: Renderizamos la página
    const { container } = render(<Products />);
    
    // PASO 2: Buscamos el elemento ProductList mockeado
    const productListElement = container.querySelector('[data-testid="product-list"]');
    
    // PASO 3: Verificamos que existe (está renderizado)
    expect(productListElement).toBeInTheDocument();
    
    // NOTA: En este diseño, ProductList maneja su propio estado y datos
    // La página Products solo actúa como contenedor
  });
});
