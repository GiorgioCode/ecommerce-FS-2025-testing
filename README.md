# 📋 Documentación de Tests con Vitest - GameHub E-commerce

## 🎯 Descripción

Suite completa de tests para el frontend del e-commerce usando Vitest y React Testing Library.
Repo original -> (https://github.com/GiorgioCode/TP-INTEGRADOR-FASE2-EdIT-FS)

## ⭐ ACTUALIZACIÓN IMPORTANTE

**¡100% DOCUMENTADO!** Todos los archivos de tests ahora incluyen comentarios línea por línea explicando:

-   Cada concepto de testing desde cero
-   Por qué se hace cada verificación
-   Diferencias entre métodos similares
-   Mejores prácticas y anti-patrones
-   Casos de uso reales
-   Manejo de errores

**Perfecto para aprender testing sin conocimientos previos** 🎓

## 📋 Resumen General

-   **Total de Tests**: 83 tests completamente documentados
-   **Archivos de Test**: 10 archivos (100% con documentación pedagógica)
-   **Framework**: Vitest + React Testing Library
-   **Coverage**: Componentes, Store (Zustand), Servicios API, y Páginas
-   **Nivel de Documentación**: Ultra-detallada, explicando cada línea desde cero

## 🔧 Configuración Inicial

### Dependencias Instaladas

```json
{
    "@testing-library/react": "^latest",
    "@testing-library/jest-dom": "^latest",
    "@testing-library/user-event": "^latest",
    "vitest": "^latest",
    "@vitest/ui": "^latest",
    "jsdom": "^latest"
}
```

### Scripts de NPM

```json
{
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "coverage": "vitest run --coverage"
}
```

### Configuración de Vite (vite.config.js)

```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
  css: true,
}
```

## 📁 Estructura de Tests

```
test-suite/frontend/
├── src/
│   ├── __tests__/
│   │   └── App.test.jsx (11 tests)
│   ├── components/__tests__/
│   │   ├── Cart.test.jsx (12 tests)
│   │   ├── Header.test.jsx (8 tests)
│   │   ├── ProductCard.test.jsx (6 tests)
│   │   └── ProductList.test.jsx (10 tests)
│   ├── pages/__tests__/
│   │   ├── Home.test.jsx (11 tests)
│   │   └── Products.test.jsx (4 tests)
│   ├── services/__tests__/
│   │   └── api.test.js (17 tests)
│   ├── store/__tests__/
│   │   └── useCartStore.test.js (14 tests)
│   └── test/
│       └── setup.js
```

## 🧪 Tests por Categoría

### 1. Componentes (36 tests)

#### **ProductCard Component** (6 tests)

-   ✅ Renderiza información del producto correctamente
-   ✅ Muestra la imagen del producto
-   ✅ Tiene un botón para agregar al carrito
-   ✅ Llama a `addItem` cuando se hace click en el botón
-   ✅ Maneja el error de imagen correctamente (fallback)
-   ✅ Formatea el precio en formato argentino (ARS)

#### **Header Component** (8 tests)

-   ✅ Renderiza el logo y título de la tienda
-   ✅ Renderiza los enlaces de navegación (Inicio, Productos)
-   ✅ Muestra el botón del carrito
-   ✅ Muestra el contador cuando hay items en el carrito
-   ✅ No muestra contador cuando el carrito está vacío
-   ✅ Llama a `toggleCart` al hacer click en el carrito
-   ✅ Los enlaces tienen las rutas correctas
-   ✅ Resalta el enlace activo con estilos diferentes

#### **Cart Component** (12 tests)

-   ✅ No renderiza nada cuando `isOpen` es false
-   ✅ Muestra mensaje de carrito vacío cuando no hay items
-   ✅ Muestra los productos en el carrito
-   ✅ Cierra el carrito al hacer click en el botón de cerrar
-   ✅ Llama a `removeItem` al decrementar cantidad
-   ✅ Llama a `addItem` al incrementar cantidad
-   ✅ Llama a `deleteItem` al eliminar producto
-   ✅ Muestra el total formateado correctamente
-   ✅ Vacía el carrito al hacer click en "Vaciar Carrito"
-   ✅ Procesa el checkout correctamente
-   ✅ Maneja errores en el checkout
-   ✅ No procesa checkout con carrito vacío

#### **ProductList Component** (10 tests)

-   ✅ Muestra un spinner mientras carga
-   ✅ Muestra los productos cuando se cargan exitosamente
-   ✅ Muestra mensaje cuando no hay productos
-   ✅ Muestra error cuando falla la carga
-   ✅ Muestra instrucciones para ejecutar el servidor cuando hay error
-   ✅ Reintenta la carga cuando se hace click en "Reintentar"
-   ✅ Actualiza cuando no hay productos y se hace click en "Actualizar"
-   ✅ Renderiza ProductCard para cada producto
-   ✅ Usa grid responsivo para mostrar productos
-   ✅ Llama a la API solo una vez al montar el componente

### 2. Store de Zustand (14 tests)

#### **useCartStore - Gestión de productos** (6 tests)

-   ✅ Agrega un producto nuevo al carrito
-   ✅ Incrementa la cantidad si el producto ya existe
-   ✅ Remueve un item decrementando la cantidad
-   ✅ Elimina el producto si la cantidad llega a 0
-   ✅ Elimina completamente un producto con `deleteItem`
-   ✅ Limpia todo el carrito con `clearCart`

#### **useCartStore - Cálculos del carrito** (3 tests)

-   ✅ Calcula el total correctamente
-   ✅ Calcula el total de items correctamente
-   ✅ Retorna 0 cuando el carrito está vacío

#### **useCartStore - Control del drawer** (3 tests)

-   ✅ Abre el carrito
-   ✅ Cierra el carrito
-   ✅ Alterna el estado del carrito (toggle)

#### **useCartStore - Datos de orden** (2 tests)

-   ✅ Genera los datos de orden correctamente
-   ✅ Genera datos de orden vacíos cuando no hay productos

### 3. Servicios API (17 tests)

#### **productsAPI** (5 tests)

-   ✅ `getAll`: Obtiene todos los productos correctamente
-   ✅ `getById`: Obtiene un producto por ID
-   ✅ `create`: Crea un nuevo producto
-   ✅ `update`: Actualiza un producto existente
-   ✅ `delete`: Elimina un producto

#### **ordersAPI** (5 tests)

-   ✅ `getAll`: Obtiene todas las órdenes
-   ✅ `getById`: Obtiene una orden por ID
-   ✅ `create`: Crea una nueva orden
-   ✅ `update`: Actualiza una orden existente
-   ✅ `delete`: Elimina una orden

#### **Manejo de errores** (4 tests)

-   ✅ Maneja errores de red
-   ✅ Maneja errores HTTP (status codes)
-   ✅ Maneja errores al crear órdenes
-   ✅ Loggea errores en la consola

#### **checkServerHealth** (3 tests)

-   ✅ Retorna true si el servidor está disponible
-   ✅ Retorna false si el servidor no está disponible
-   ✅ Retorna false si el servidor responde con error

### 4. Páginas (15 tests)

#### **Home Page** (11 tests)

-   ✅ Renderiza el título principal
-   ✅ Muestra la descripción de la tienda
-   ✅ Tiene un enlace a la página de productos
-   ✅ Muestra la imagen destacada
-   ✅ Renderiza la sección de características
-   ✅ Muestra todas las características de la tienda
-   ✅ Muestra las descripciones de las características
-   ✅ Tiene la estructura grid correcta para características
-   ✅ Tiene la estructura hero con grid responsivo
-   ✅ Aplica estilos correctos al botón de CTA
-   ✅ Tiene secciones con bordes y estilos correctos

#### **Products Page** (4 tests)

-   ✅ Renderiza la página de productos
-   ✅ Incluye el componente ProductList
-   ✅ Tiene la estructura correcta
-   ✅ Pasa ProductList sin props adicionales

### 5. Aplicación Principal (11 tests)

#### **App Component** (10 tests)

-   ✅ Renderiza el header en todas las páginas
-   ✅ Renderiza el componente Cart
-   ✅ Renderiza el footer con información de copyright
-   ✅ Renderiza la página Home en la ruta /
-   ✅ Renderiza la página Products en la ruta /products
-   ✅ Muestra página 404 para rutas no encontradas
-   ✅ Tiene la estructura correcta con flexbox
-   ✅ Tiene un contenedor principal con ancho máximo
-   ✅ Tiene el footer con estilos correctos
-   ✅ El enlace de volver al inicio tiene href correcto

#### **App Integration Tests** (1 test)

-   ✅ Renderiza la aplicación completa sin errores

## 🛠️ Técnicas de Testing Utilizadas

### 1. **Mocking**

-   Mock de módulos completos (componentes, servicios)
-   Mock de fetch global para tests de API
-   Mock de Zustand store para aislar componentes

### 2. **Renderizado y Queries**

-   `render()` para renderizar componentes
-   `screen` queries (getByText, getByRole, getByTestId, etc.)
-   `waitFor()` para operaciones asíncronas

### 3. **Simulación de Eventos**

-   `fireEvent.click()` para simular clicks
-   `fireEvent.error()` para simular errores de imagen

### 4. **Assertions**

-   `toBeInTheDocument()` para verificar existencia
-   `toHaveBeenCalledWith()` para verificar llamadas a funciones
-   `toHaveClass()` para verificar clases CSS
-   `toHaveAttribute()` para verificar atributos

### 5. **Testing Hooks**

-   `renderHook()` y `act()` para testear hooks de Zustand

## 📊 Cobertura de Tests

### Componentes Cubiertos ✅

-   App.jsx
-   Cart.jsx
-   Header.jsx
-   ProductCard.jsx
-   ProductList.jsx
-   Home.jsx
-   Products.jsx

### Stores Cubiertos ✅

-   useCartStore (Zustand)

### Servicios Cubiertos ✅

-   productsAPI
-   ordersAPI
-   checkServerHealth

## 🚀 Comandos de Ejecución

```bash
# Ejecutar todos los tests en modo watch
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con interfaz gráfica
npm run test:ui

# Ejecutar tests con cobertura
npm run coverage
```

## 📈 Resultados de Ejecución

```
Test Files  9 passed (9)
Tests      93 passed (93)
Duration   ~3.12s
```

## 🎯 Mejores Prácticas Implementadas

1. **Aislamiento de Tests**: Cada test es independiente y no depende de otros
2. **Mocks Específicos**: Se mockean solo las dependencias necesarias
3. **Limpieza**: `beforeEach` y `afterEach` para limpiar estado y mocks
4. **Nombres Descriptivos**: Tests con nombres claros que describen el comportamiento
5. **AAA Pattern**: Arrange-Act-Assert en cada test
6. **Cobertura Completa**: Tests de casos felices y manejo de errores
7. **Tests Asíncronos**: Uso correcto de `async/await` y `waitFor`
8. **Datos de Prueba**: Mock data realista y representativa

## 🔍 Casos de Uso Testeados

### Flujo de Compra

1. Usuario visualiza productos
2. Agrega productos al carrito
3. Modifica cantidades
4. Visualiza el total
5. Procesa el checkout
6. Manejo de errores

### Navegación

1. Navegación entre páginas
2. Enlaces activos resaltados
3. Página 404 para rutas inexistentes

### Estado Global

1. Gestión del carrito
2. Persistencia en localStorage
3. Cálculos de totales

### Integración con API

1. Carga de productos
2. Creación de órdenes
3. Manejo de errores de red
4. Verificación de salud del servidor

## 📝 Notas Importantes

-   Los tests no modifican las carpetas originales del proyecto
-   Todos los tests se ejecutan en el directorio `test-suite/frontend`
-   Los mocks evitan llamadas reales a la API
-   La configuración de Vitest permite hot-reload durante desarrollo
-   Los tests están optimizados para ejecutarse rápidamente (~3 segundos)

## ✨ Conclusión

La suite de tests implementada proporciona una cobertura completa del frontend de la aplicación GameHub, asegurando la calidad y confiabilidad del código. Con 93 tests pasando exitosamente, el proyecto cuenta con una base sólida para desarrollo continuo y refactoring seguro.
