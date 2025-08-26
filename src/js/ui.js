import { TaskManagerApp } from './app.js';

export class UIController {
  constructor(app) {
    this.app = app;
    this.loginForm = document.getElementById('login-form');
    this.usernameInput = document.getElementById('username');
    this.loginMessage = document.getElementById('login-message');
    this.userInfo = document.getElementById('user-info');
    this.authPanel = document.getElementById('auth-panel');
    this.taskPanel = document.getElementById('task-panel');
    this.statsPanel = document.getElementById('stats-panel');

    this.taskForm = document.getElementById('task-form');
    this.taskTitle = document.getElementById('task-title');
    this.taskDesc = document.getElementById('task-desc');
    this.taskAssignee = document.getElementById('task-assignee');
    this.taskFormCancel = document.getElementById('task-form-cancel');
    this.taskList = document.getElementById('task-list');
    this.statsBox = document.getElementById('stats');

    this.editingTaskId = null;
  }

  bindEvents() {
    // Autenticación
    this.loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = this.usernameInput.value.trim();
      if (!name) return;
      const user = this.app.login(name);
      this.loginMessage.textContent = `Bienvenido ${user.username}`;
      this.renderUsersInSelect();
      this.updateSessionUI();
      this.showAppPanels();
      this.renderTasks();
      this.renderStats();
    });

    // Crear / actualizar tarea
    this.taskForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = {
        title: this.taskTitle.value,
        description: this.taskDesc.value,
        assigneeId: this.taskAssignee.value || null
      };
      if (this.editingTaskId) {
        this.app.updateTask(this.editingTaskId, data);
      } else {
        this.app.createTask(data);
      }
      this.resetTaskForm();
      this.renderTasks();
      this.renderStats();
    });

    this.taskFormCancel.addEventListener('click', () => {
      this.resetTaskForm();
    });

    // Delegación de eventos para acciones de tarea
    this.taskList.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'edit') return this.handleEdit(id);
      if (action === 'delete') { this.app.deleteTask(id); this.renderTasks(); this.renderStats(); }
      if (action === 'toggle') { this.app.toggleTask(id); this.renderTasks(); this.renderStats(); }
    });
  }

  async init() {
    await this.app.initializeIfEmpty();
    if (this.app.currentUser) {
      this.renderUsersInSelect();
      this.updateSessionUI();
      this.showAppPanels();
      this.renderTasks();
      this.renderStats();
    }
  }

  showAppPanels() {
    this.taskPanel.hidden = false;
    this.statsPanel.hidden = false;
  }

  updateSessionUI() {
    if (this.app.currentUser) {
    this.userInfo.innerHTML = `<span>Usuario: <strong>${this.app.currentUser.username}</strong> <small style="opacity:.7">(${this.app.currentUser.email})</small></span> <button id="logout-btn" class="secondary">Salir</button>`;
      document.getElementById('logout-btn').addEventListener('click', () => {
        this.app.logout();
        window.location.reload(); // simplifica limpieza de UI
      });
    } else {
      this.userInfo.textContent = '';
    }
  }

  renderUsersInSelect() {
    const users = this.app.listUsers();
    this.taskAssignee.innerHTML = '<option value="">(sin asignar)</option>' + users.map(u => `<option value="${u.id}" title="${u.email}">${u.username}</option>`).join('');
  }

  renderTasks() {
    if (this.app.tasks.length === 0) {
      this.taskList.innerHTML = '<li class="empty">Sin tareas aún</li>';
      return;
    }
    const usersById = Object.fromEntries(this.app.users.map(u => [u.id, u]));
    this.taskList.innerHTML = this.app.tasks.slice().reverse().map(t => {
      const assigneeUser = t.assigneeId ? usersById[t.assigneeId] : null;
      const assignee = assigneeUser ? assigneeUser.username : 'No asignada';
      return `<li class="task-item ${t.completed ? 'completed' : ''}">
        <div>
        <strong>${t.title}</strong> <span class="badge" title="${assigneeUser ? assigneeUser.email : ''}">${assignee}</span><br />
          <span class="task-meta">Creada: ${new Date(t.createdAt).toLocaleString()}</span>
          ${t.description ? `<div class="desc">${t.description}</div>` : ''}
        </div>
        <div class="task-actions">
          <button data-action="toggle" data-id="${t.id}" title="Completar / Reabrir">${t.completed ? 'Reabrir' : 'Completar'}</button>
          <button data-action="edit" data-id="${t.id}" class="secondary" title="Editar">Editar</button>
          <button data-action="delete" data-id="${t.id}" class="secondary" title="Eliminar">✕</button>
        </div>
      </li>`;
    }).join('');
  }

  handleEdit(id) {
    const t = this.app.tasks.find(tsk => tsk.id === id);
    if (!t) return;
    this.editingTaskId = id;
    this.taskTitle.value = t.title;
    this.taskDesc.value = t.description;
    this.taskAssignee.value = t.assigneeId || '';
    this.taskForm.querySelector('button[type="submit"]').textContent = 'Actualizar tarea';
    this.taskFormCancel.hidden = false;
  }

  resetTaskForm() {
    this.editingTaskId = null;
    this.taskTitle.value = '';
    this.taskDesc.value = '';
    this.taskAssignee.value = '';
    this.taskForm.querySelector('button[type="submit"]').textContent = 'Crear / Actualizar';
    this.taskFormCancel.hidden = true;
  }

  renderStats() {
    const s = this.app.stats();
    this.statsBox.innerHTML = `
      <div class="stat-box"><span>Total</span><strong>${s.total}</strong></div>
      <div class="stat-box"><span>Completadas</span><strong>${s.completed}</strong></div>
      <div class="stat-box"><span>Pendientes</span><strong>${s.pending}</strong></div>
      <div class="stat-box"><span>Avance</span><strong>${(s.completionRate*100).toFixed(0)}%</strong></div>
      <div class="stat-box"><span>Por usuario</span>${s.byUser.map(x => `<div>${x.user.username}: ${x.completed}/${x.total}</div>`).join('') || '<div class="empty">Sin usuarios</div>'}</div>
    `;
  }
}
