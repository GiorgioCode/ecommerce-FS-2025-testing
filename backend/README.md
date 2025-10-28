# E-commerce Backend (JSON Server)

Este es el backend del proyecto de e-commerce que utiliza JSON Server para simular una API REST.

## Instalación

```bash
npm install
```

## Ejecución

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

El servidor se ejecutará en http://localhost:3001

## Endpoints disponibles

### Productos
- **GET** `/products` - Obtener todos los productos
- **GET** `/products/:id` - Obtener un producto específico
- **POST** `/products` - Crear un nuevo producto
- **PUT** `/products/:id` - Actualizar un producto
- **DELETE** `/products/:id` - Eliminar un producto

### Órdenes de compra
- **GET** `/orders` - Obtener todas las órdenes
- **GET** `/orders/:id` - Obtener una orden específica  
- **POST** `/orders` - Crear una nueva orden de compra
- **PUT** `/orders/:id` - Actualizar una orden
- **DELETE** `/orders/:id` - Eliminar una orden

## Estructura de datos

### Producto
```json
{
  "id": 1,
  "nombre": "Nombre del producto",
  "descripcion": "Descripción detallada del producto",
  "precio": 99.99,
  "imagen": "URL de la imagen"
}
```

### Orden de compra
```json
{
  "id": 1,
  "productos": [
    {
      "id": 1,
      "cantidad": 2,
      "precio": 99.99
    }
  ],
  "total": 199.98,
  "fecha": "2023-01-01T00:00:00.000Z"
}
```
