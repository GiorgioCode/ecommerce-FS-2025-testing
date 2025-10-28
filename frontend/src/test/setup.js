// ============================================================
// ARCHIVO DE CONFIGURACIÓN GLOBAL PARA TODOS LOS TESTS
// Este archivo se ejecuta ANTES de que corran los tests
// Configura el entorno de testing para toda la aplicación
// ============================================================

// IMPORTACIÓN 1: Extensiones de matchers (verificadores) para el DOM
// @testing-library/jest-dom agrega funciones extra para hacer tests más fáciles
// Por ejemplo: toBeInTheDocument(), toHaveClass(), toBeDisabled(), etc.
// Sin esto, tendríamos que escribir verificaciones más complejas
import '@testing-library/jest-dom';

// IMPORTACIÓN 2: Función cleanup de React Testing Library
// cleanup() limpia/desmonta componentes renderizados después de cada test
// Esto previene que los componentes de un test afecten a otro test
import { cleanup } from '@testing-library/react';

// IMPORTACIÓN 3: Hook afterEach de Vitest
// afterEach es una función que se ejecuta automáticamente después de cada test
// Similar a un "limpiador automático" que corre después de cada prueba
import { afterEach } from 'vitest';

// CONFIGURACIÓN DE LIMPIEZA AUTOMÁTICA
// =========================================
// Esta configuración asegura que después de cada test individual:
// - Se desmonta cualquier componente React que se haya renderizado
// - Se limpia el DOM virtual
// - Se previenen fugas de memoria
// - Se evita que un test contamine a otro

afterEach(() => {
  // cleanup() remueve todos los componentes React del DOM de testing
  // Es como cerrar todas las ventanas después de cada prueba
  // Esto garantiza que cada test empiece con un DOM limpio
  cleanup();
});

// NOTA IMPORTANTE:
// Este archivo se especifica en vite.config.js con: setupFiles: './src/test/setup.js'
// Vitest lo ejecuta automáticamente antes de correr cualquier test
// No necesitas importar este archivo en tus tests - ya está configurado globalmente
