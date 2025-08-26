# Gestor de Tareas Colaborativo (Evaluación Final 5)

## Descripción
Aplicación web de gestión de tareas colaborativa desarrollada en JavaScript moderno. Implementa paradigmas de orientación a objetos (modelos `User` y `Task`, clase `TaskManagerApp`), orientación a eventos (listeners de formularios y botones para CRUD de tareas y autenticación) y programación asíncrona (carga inicial simulada de tareas mediante `fetchInitialTasks` con `async/await`). Usa `localStorage` para simular persistencia sin backend.

## Características
- Registro / login simulado de usuarios (creación automática al ingresar un nombre nuevo).
- Creación, edición, eliminación y asignación de tareas.
- Marcar tareas como completadas o reabrirlas.
- Estadísticas de avance globales y por usuario.
- Persistencia local (usuarios, sesión y tareas) en `localStorage`.
- Semilla inicial de tareas desde una "API" simulada con retardo artificial.
- Código modular en ES Modules.

## Estructura de Archivos
```
index.html                # Página principal
src/css/styles.css        # Estilos base
src/js/models.js          # Clases User y Task (OOP)
src/js/storage.js         # Abstracción de acceso a localStorage
src/js/api.js             # Simulación de API externa (async/await)
src/js/app.js             # Lógica central de negocio y estado
src/js/ui.js              # Controlador de interfaz y eventos del DOM
src/js/main.js            # Punto de entrada / bootstrap
```

## Ejecución
No requiere build ni servidor especial; basta con abrir `index.html` en un navegador moderno (recomendado servir vía HTTP para habilitar módulos ES y evitar restricciones CORS al usar `crypto.randomUUID`).

### Opción 1: Doble click (puede funcionar en la mayoría de navegadores).
### Opción 2 (recomendada): Servir con un servidor estático sencillo.
En PowerShell (Windows 10+):

```powershell
# Usando Python si está instalado
python -m http.server 5500
# Luego abrir http://localhost:5500/index.html
```

Alternativas: extensiones de Live Server en VS Code.

## Uso
1. Ingresar un nombre de usuario y presionar "Ingresar".
2. Crear nuevas tareas completando título, descripción (opcional) y asignado (opcional).
3. Usar los botones para completar, editar o eliminar tareas.
4. Observar estadísticas en tiempo real.

## Notas Técnicas / Mejores Prácticas
- Separación clara de capas (modelos, lógica, persistencia, UI).
- Evita lógica de negocio en manipulaciones directas del DOM.
- Uso de `crypto.randomUUID()` para IDs únicos.
- Métodos de la clase `Task` encapsulan cambios de estado (`toggleComplete`, `assignTo`).
- La recarga de página en logout simplifica restaurar estado UI.

## Próximas Mejoras (Ideas)
- Filtro de tareas (por estado, usuario, búsqueda).
- Paginación o virtualización para muchas tareas.
- Confirmaciones modales al eliminar.
- Exportar / importar datos (JSON).
- Integración real con API REST.
- Tests unitarios (Jest / Vitest) para lógica de `TaskManagerApp`.

---
© 2025
