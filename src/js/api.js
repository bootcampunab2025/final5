function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

export async function fetchInitialTasks(users = []) {
  await delay(400 + Math.random() * 400);

  try {
    const res = await fetch('https://67da0d3435c87309f52ac712.mockapi.io/api/v1/tareas');
    const apiTasks = await res.json();

    return apiTasks.map((t, i) => ({
      title: t.title || t.name || `Tarea ${i + 1}`,
      description: t.description || '',
      completed: Boolean(t.completed),
      assigneeId: users[i % users.length]?.id || null,
      createdBy: users[i % users.length]?.id || null,
    }));
  } catch (err) {
    console.error("Error al obtener tareas desde MockAPI:", err);
    return [];
  }
}
