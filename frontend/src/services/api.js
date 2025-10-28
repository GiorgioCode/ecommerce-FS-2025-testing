// Servicio API - Capa de abstracción para comunicación con el backend JSON Server
// Encapsula todas las peticiones HTTP y manejo de errores
// Sigue el patrón de repositorio para separar la lógica de datos del UI

// URL base del servidor JSON Server (debe coincidir con el puerto configurado en el backend)
const API_BASE_URL = 'http://localhost:3001';

// Configuración por defecto para todas las peticiones HTTP
// Se aplica a todas las peticiones que requieren enviar datos JSON
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json', // Especifica que enviamos JSON
  },
};

// Función utilitaria para manejo centralizado de respuestas HTTP
// Convierte respuestas HTTP en objetos JavaScript o lanza errores
const handleResponse = async (response) => {
  // Verificar si la respuesta HTTP fue exitosa (status 200-299)
  if (!response.ok) {
    // Si hay error, lanzar excepción con información del status HTTP
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // Si es exitosa, parsear el JSON y retornarlo
  return await response.json();
};

// SERVICIOS PARA PRODUCTOS
export const productsAPI = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo producto (para futuras funcionalidades de admin)
  create: async (product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(product),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto existente
  update: async (id, product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        ...defaultOptions,
        method: 'PUT',
        body: JSON.stringify(product),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un producto
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

// SERVICIOS PARA ÓRDENES DE COMPRA
export const ordersAPI = {
  // Obtener todas las órdenes
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Obtener una orden por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva orden (proceso de checkout)
  create: async (order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(order),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Actualizar el estado de una orden
  update: async (id, order) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        ...defaultOptions,
        method: 'PUT',
        body: JSON.stringify(order),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una orden
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  },
};

// Función de utilidad para verificar si el servidor está disponible
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?_limit=1`);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
