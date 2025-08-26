const KEYS = {
  users: 'ctm_users',
  tasks: 'ctm_tasks',
  session: 'ctm_session_user'
};

export const storage = {
  loadUsers() { return JSON.parse(localStorage.getItem(KEYS.users) || '[]'); },
  saveUsers(users) { localStorage.setItem(KEYS.users, JSON.stringify(users)); },
  loadTasks() { return JSON.parse(localStorage.getItem(KEYS.tasks) || '[]'); },
  saveTasks(tasks) { localStorage.setItem(KEYS.tasks, JSON.stringify(tasks)); },
  loadSession() { return JSON.parse(localStorage.getItem(KEYS.session) || 'null'); },
  saveSession(user) { localStorage.setItem(KEYS.session, JSON.stringify(user)); },
  clearSession() { localStorage.removeItem(KEYS.session); }
};
