
import { User, Task } from './models.js';
import { storage } from './storage.js';
import { fetchInitialTasks } from './api.js';

export class TaskManagerApp {
  constructor() {
    this.users = storage.loadUsers();
    this.tasks = storage.loadTasks().map(t => new Task(t));
    this.currentUser = storage.loadSession();
    this.initialized = false;
  }

  persist() {
    storage.saveUsers(this.users);
    storage.saveTasks(this.tasks);
    if (this.currentUser) storage.saveSession(this.currentUser);
    else storage.clearSession();
  }

  deleteUser(userId) {
    this.users = this.users.filter(u => u.id !== userId);
    this.tasks = this.tasks.filter(t => t.assigneeId !== userId && t.createdBy !== userId);
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = null;
    }
    this.persist();
  }

  login(username) {
    let user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      user = new User(username);
      this.users.push(user);
    }
    this.currentUser = user;
    this.persist();
    return user;
  }

  logout() {
    this.currentUser = null;
    this.persist();
  }

  listUsers() {
    return this.users.slice();
  }

  createTask({ title, description, assigneeId }) {
    if (!this.currentUser) throw new Error('Debe iniciar sesión');
    const task = new Task({
      title,
      description,
      assigneeId: assigneeId || null,
      createdBy: this.currentUser.id
    });
    this.tasks.push(task);
    this.persist();
    return task;
  }

  updateTask(id, data) {
    const t = this.tasks.find(tsk => tsk.id === id);
    if (!t) throw new Error('Tarea no encontrada');
    if (data.title !== undefined) t.title = data.title.trim();
    if (data.description !== undefined) t.description = data.description.trim();
    if (data.assigneeId !== undefined) t.assigneeId = data.assigneeId || null;
    this.persist();
    return t;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.persist();
  }

  toggleTask(id) {
    const t = this.tasks.find(tsk => tsk.id === id);
    if (!t) throw new Error('Tarea no encontrada');
    t.toggleComplete();
    this.persist();
    return t;
  }

  stats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total ? completed / total : 0;
    const byUser = this.users.map(u => ({
      user: u,
      total: this.tasks.filter(t => t.assigneeId === u.id).length,
      completed: this.tasks.filter(t => t.assigneeId === u.id && t.completed).length
    }));
    return { total, completed, pending, completionRate, byUser };
  }

  async initializeIfEmpty() {
    if (this.initialized) return;

    if (this.tasks.length === 0) {
      if (this.users.length === 0) {
        try {
          const res = await fetch('https://67da0d3435c87309f52ac712.mockapi.io/api/v1/usuarios');
          const apiUsers = await res.json();
          this.users.push(...apiUsers.map(u => new User(u.name || u.username || u.id)));
        } catch (err) {
          console.error("Error al obtener usuarios desde MockAPI:", err);
        }
      }
      const seed = await fetchInitialTasks(this.users);
      seed.forEach(s => this.tasks.push(new Task({ ...s })));
      this.persist();
    }
    this.initialized = true;
  }
}
