function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

export async function fetchInitialTasks(users = []) {
  await delay(400 + Math.random()*400);
  const pick = (i) => users[i % users.length]?.id;
  const creator = (i) => users[i % users.length]?.id;
  const sample = [
    { title: 'Revisar documentación', description: 'Leer requerimientos y objetivos', completed: false, assigneeId: pick(0), createdBy: creator(0) },
    { title: 'Configurar entorno', description: 'Estructura de carpetas y Live Server', completed: true, assigneeId: pick(1), createdBy: creator(1) },
    { title: 'Diseñar modelo de datos', description: 'Definir clases User y Task', completed: false, assigneeId: pick(2), createdBy: creator(2) },
    { title: 'Implementar persistencia', description: 'Wrapper localStorage', completed: false, assigneeId: pick(0), createdBy: creator(0) },
    { title: 'Controlador UI', description: 'Eventos y render dinámico', completed: true, assigneeId: pick(1), createdBy: creator(1) },
    { title: 'Sembrar datos demo', description: 'Usuarios y tareas iniciales', completed: true, assigneeId: pick(2), createdBy: creator(2) },
    { title: 'Refactorizar código', description: '', completed: false, assigneeId: null, createdBy: creator(1) },
    { title: 'Revisión final', description: 'Verificar funcionalidades principales', completed: false, assigneeId: pick(0), createdBy: creator(0) }
  ];
  return sample;
}
