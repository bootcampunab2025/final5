import { TaskManagerApp } from './app.js';
import { UIController } from './ui.js';

const app = new TaskManagerApp();
const ui = new UIController(app);

document.addEventListener('DOMContentLoaded', async () => {
  ui.bindEvents();
  await ui.init();
});
