import * as notesApi from './api/notesApi.js';

const createAppRoot = () => {
  const container = document.createElement('div');
  container.className = 'container';

  container.innerHTML = `
    <header class="app-header">
      <h1 class="title">Notes App</h1>
      <div class="actions">
        <button id="refreshBtn" class="btn">Refresh</button>
        <button id="toggleArchived" class="btn">Show Archived</button>
      </div>
    </header>

    <section class="create-section">
      <h2>Create new note</h2>
      <form id="createForm" class="create-form">
        <input id="title" placeholder="Title" required />
        <textarea id="body" placeholder="Write note..." rows="4" required></textarea>
        <div class="form-actions">
          <button type="submit" class="btn primary">Add Note</button>
        </div>
      </form>
    </section>

    <section class="notes-section">
      <h2 id="listTitle">Active Notes</h2>
      <loading-indicator hidden id="globalLoader"></loading-indicator>
      <div id="notesList" class="notes-list"></div>
    </section>
  `;
  return container;
};

export function initApp(appRoot) {
  const container = createAppRoot();
  appRoot.appendChild(container);

  const loader = container.querySelector('#globalLoader');
  const notesList = container.querySelector('#notesList');
  const createForm = container.querySelector('#createForm');
  const refreshBtn = container.querySelector('#refreshBtn');
  const toggleArchivedBtn = container.querySelector('#toggleArchived');
  const listTitle = container.querySelector('#listTitle');

  let showArchived = false;

  async function setLoading(on = true) {
    if (on) loader.removeAttribute('hidden'); else loader.setAttribute('hidden', '');
  }

  async function loadNotes() {
    try {
      setLoading(true);
      const data = showArchived ? await notesApi.getArchivedNotes() : await notesApi.getNotes();
      notesList.innerHTML = '';
      if (!data || data.length === 0) {
        notesList.innerHTML = `<p class="empty">No notes found.</p>`;
      } else {
        data.forEach(note => {
          const noteEl = document.createElement('note-item');
          noteEl.note = note;
          noteEl.addEventListener('delete-note', async (e) => {
            const id = e.detail.id;
            if (!confirm('Delete this note?')) return;
            try {
              setLoading(true);
              await notesApi.deleteNote(id);
              await loadNotes();
            } catch (err) {
              alert('Delete failed: ' + err.message);
            } finally {
              setLoading(false);
            }
          });

          noteEl.addEventListener('toggle-archive', async (e) => {
            const id = e.detail.id;
            try {
              setLoading(true);
              if (note.archived) {
                await notesApi.unarchiveNote(id);
              } else {
                await notesApi.archiveNote(id);
              }
              await loadNotes();
            } catch (err) {
              alert('Archive action failed: ' + err.message);
            } finally {
              setLoading(false);
            }
          });

          notesList.appendChild(noteEl);
        });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load notes: ' + err.message);
      notesList.innerHTML = `<p class="empty">Failed to load notes.</p>`;
    } finally {
      setLoading(false);
    }
  }

  createForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const title = createForm.querySelector('#title').value.trim();
    const body = createForm.querySelector('#body').value.trim();
    if (!title || !body) {
      alert('Please provide title and body.');
      return;
    }

    try {
      setLoading(true);
      await notesApi.createNote({ title, body });
      createForm.reset();
      // show active list after adding
      showArchived = false;
      toggleArchivedBtn.textContent = 'Show Archived';
      listTitle.textContent = 'Active Notes';
      await loadNotes();
    } catch (err) {
      alert('Create note failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  });

  refreshBtn.addEventListener('click', loadNotes);

  toggleArchivedBtn.addEventListener('click', async () => {
    showArchived = !showArchived;
    toggleArchivedBtn.textContent = showArchived ? 'Show Active' : 'Show Archived';
    listTitle.textContent = showArchived ? 'Archived Notes' : 'Active Notes';
    await loadNotes();
  });

  // initial load
  loadNotes();
}
