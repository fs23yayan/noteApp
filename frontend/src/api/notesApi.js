const BASE = 'https://notes-api.dicoding.dev/v2';

/**
 * Helper to check fetch response and parse
 */
async function handleResponse(response) {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = json?.message || response.statusText || 'API error';
    throw new Error(msg);
  }
  return json.data ?? json;
}

export async function getNotes() {
  const res = await fetch(`${BASE}/notes`);
  const json = await handleResponse(res);
  // API returns {status,message,data: [...]}
  return json;
}

export async function getArchivedNotes() {
  const res = await fetch(`${BASE}/notes/archived`);
  const json = await handleResponse(res);
  return json;
}

export async function getNote(id) {
  const res = await fetch(`${BASE}/notes/${encodeURIComponent(id)}`);
  const json = await handleResponse(res);
  return json;
}

export async function createNote({ title, body }) {
  const res = await fetch(`${BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body })
  });
  const json = await handleResponse(res);
  return json;
}

export async function deleteNote(id) {
  const res = await fetch(`${BASE}/notes/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  const json = await handleResponse(res);
  return json;
}

export async function archiveNote(id) {
  const res = await fetch(`${BASE}/notes/${encodeURIComponent(id)}/archive`, {
    method: 'POST'
  });
  const json = await handleResponse(res);
  return json;
}
export async function unarchiveNote(id) {
  const res = await fetch(`${BASE}/notes/${encodeURIComponent(id)}/unarchive`, {
    method: 'POST'
  });
  const json = await handleResponse(res);
  return json;
}
