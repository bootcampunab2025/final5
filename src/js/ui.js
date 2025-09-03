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
        window.location.reload();
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
    let progressAttr = "low";
    if (s.completionRate >= 0.8) progressAttr = "high";
    else if (s.completionRate >= 0.4) progressAttr = "medium";
    this.statsBox.innerHTML = `
      <div class="stat-box"><span>Total</span><strong>${s.total}</strong></div>
      <div class="stat-box"><span>Completadas</span><strong>${s.completed}</strong></div>
      <div class="stat-box"><span>Pendientes</span><strong>${s.pending}</strong></div>
      <div class="stat-box" data-progress="${progressAttr}"><span>Avance</span><strong>${(s.completionRate*100).toFixed(0)}%</strong></div>
      <div class="stat-box"><span>Por usuario</span>
        ${s.byUser.map(x => {
          const rate = x.total ? x.completed / x.total : 0;
          let barColor = '#ef4444';
          if (rate >= 0.8) barColor = '#22c55e';
          else if (rate >= 0.4) barColor = '#facc15';
          return `<div class="user-progress" data-userid="${x.user.id}">
            <strong>${x.user.username}</strong>
            <div class="badges-row">
              <span class="badge badge-green">✔️ ${x.completed}</span>
              <span class="badge badge-yellow">⏳ ${x.total - x.completed}</span>
              <span class="badge badge-total">Total: ${x.total}</span>
              <button class="delete-user-btn" title="Eliminar usuario" style="margin-left:1em;background:linear-gradient(90deg,#ef4444,#b91c1c);color:#fff;border:none;border-radius:8px;padding:0.3em 0.8em;cursor:pointer;font-weight:bold;">Eliminar</button>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-inner" style="width:${(rate*100).toFixed(0)}%;background:${barColor};"></div>
            </div>
          </div>`;
        }).join('') || '<div class="empty">Sin usuarios</div>'}
      </div>
    `;
    this.statsBox.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const userDiv = btn.closest('.user-progress');
        const userId = userDiv.getAttribute('data-userid');
        if (confirm('¿Seguro que quieres eliminar este usuario y sus tareas?')) {
          this.app.deleteUser(userId);
          this.renderUsersInSelect();
          this.renderTasks();
          this.renderStats();
        }
      });
    });
  }
}
