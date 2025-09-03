import { TaskManagerApp } from './app.js';
import { UIController } from './ui.js';

const app = new TaskManagerApp();
const ui = new UIController(app);

document.addEventListener('DOMContentLoaded', async () => {
  ui.bindEvents();
  await ui.init();

  const tareasFaltantes = [
    {
      title: 'Revisar documentación',
      description: 'Leer requerimientos y objetivos',
      assignee: 'Josephine Labadie-Fadel'
    },
    {
      title: 'Implementar persistencia',
      description: 'Wrapper localStorage',
      assignee: 'Doyle Feeney-Olson'
    }
  ];
  const users = app.listUsers();
  tareasFaltantes.forEach(tarea => {
    const user = users.find(u => u.username === tarea.assignee);
    const yaExiste = app.tasks.some(t => t.title === tarea.title);
    if (user && !yaExiste) {
      app.createTask({
        title: tarea.title,
        description: tarea.description,
        assigneeId: user.id
      });
    }
  });
  ui.renderTasks();
  ui.renderStats();
});
