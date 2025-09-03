
export class User {
  constructor(username, email) {
    this.username = username.trim();
    this.email = (email || User.makeEmailFrom(username)).toLowerCase();
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
  }
  static makeEmailFrom(name) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/\.+/g, '.')
      .replace(/^\.|\.$/g, '') + '@example.com';
  }
}

export class Task {
  constructor({ title, description = '', assigneeId = null, createdBy, id = crypto.randomUUID(), completed = false, createdAt = new Date(), completedAt = null }) {
    this.id = id;
    this.title = title.trim();
    this.description = description.trim();
    this.assigneeId = assigneeId;
    this.createdBy = createdBy;
    this.completed = completed;
    this.createdAt = new Date(createdAt);
    this.completedAt = completedAt ? new Date(completedAt) : null;
  }

  toggleComplete() {
    this.completed = !this.completed;
    this.completedAt = this.completed ? new Date() : null;
  }

  assignTo(userId) {
    this.assigneeId = userId;
  }
}
