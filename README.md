# MobileStore - Front-End Technical Assessment

Bienvenido al repositorio de la aplicación **MobileStore**. Este proyecto consiste en una Single Page Application (SPA) desarrollada con **React** para la visualización y gestión de un catálogo de dispositivos móviles, integrando funcionalidades de búsqueda, detalles de producto y persistencia de carrito de compras.

## Descripción del Proyecto

La aplicación ha sido construida siguiendo una arquitectura limpia y modular, priorizando el rendimiento y la experiencia de usuario. Se han implementado dos vistas principales:

1.  **Product List Page (PLP):** Listado de dispositivos con búsqueda en tiempo real y filtrado inteligente.
2.  **Product Detail Page (PDP):** Vista detallada con selectores de opciones y acciones de compra.

## Puesta en Marcha

Para ejecutar el proyecto localmente, asegúrate de tener instalado **Node.js** (v18 o superior recomendado).

### 1. Instalación

Clona el repositorio e instala las dependencias:

npm install

### 2. Scripts Disponibles

El proyecto cuenta con los siguientes scripts estandarizados en el package.json:

Modo Desarrollo:

npm start
Levanta el servidor local con Vite (incluye Hot Module Replacement).

Compilación (Producción):

npm run build
Genera la versión optimizada y minificada en la carpeta dist.

Testing:

npm run test
Ejecuta la suite de pruebas unitarias y de integración utilizando Vitest.

Linting:

npm run lint
Ejecuta la comprobación de calidad de código y estilo mediante ESLint.

### Stack Tecnológico & Decisiones de Arquitectura

A continuación, se detallan las herramientas elegidas y las decisiones técnicas tomadas para cumplir con los requisitos y asegurar la escalabilidad:

Base: React 18 + Vite. Se eligió Vite por su velocidad de compilación y entorno de desarrollo moderno frente a CRA.

Routing: React Router v6 para la gestión de navegación SPA.

Gestión de Estado Servidor & Caché: TanStack Query.

Implementación y persistencia: Se ha configurado un staleTime de 1 hora (3.600.000 ms) para minimizar las peticiones a la API ademas de que se implementó el PersistQueryClientProvider con el adaptador createAsyncStoragePersister conectado a localStorage.

Gestión de Estado Global (Carrito): React Context API.

Arquitectura: Se ha aplicado los princpios SOLID, separando la definición del contexto (CartContext.js) de su proveedor (CartProvider.jsx) y su hook de consumo. Esto facilita el testing y evita conflictos con el Fast Refresh de Vite.

Estilos: CSS Nativo tilizando CSS Grid y Flexbox.

Testing: Vitest + React Testing Library para pruebas unitarias de componentes y hooks.

### Notas sobre Lógica de Negocio

Gestión del Carrito (API Stateless)
Durante la integración, se observó que el endpoint POST /api/cart devuelve siempre un contador fijo (count: 1) y no mantiene una sesión persistente en el lado del servidor.

Para ofrecer una experiencia de usuario coherente y cumplir con el requisito de mostrar el total acumulado en la cabecera:

1. La aplicación valida estrictamente que la API responda con un código HTTP 200 OK.

2. Tras el éxito de la petición, se gestiona un contador incremental local en el cliente.

3. Este valor se persiste en el navegador para mantener la consistencia durante la navegación.
