const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      margin: 10px 0;
      animation: appear .2s ease;
    }
    .card {
      padding: 12px;
      border-radius: 8px;
      background: linear-gradient(180deg, #fff, #fbfbfd);
      box-shadow: 0 1px 6px rgba(16,24,40,0.06);
      border: 1px solid rgba(16,24,40,0.04);
      display: flex;
      flex-direction: column;
    }
    .meta { display:flex; justify-content:space-between; align-items:center; gap:10px; }
    .title { font-weight:600; margin: 0 0 8px 0; font-size: 1.05rem; }
    .body { margin: 0 0 12px 0; white-space:pre-wrap; color: #333; }
    .actions { display:flex; gap:8px; }
    .btn { padding:8px 10px; border-radius:6px; border:none; cursor:pointer; font-size:0.9rem; }
    .btn.small { padding:6px 8px; font-size:0.85rem; }
    .btn.delete { background: #ffe8e8; color:#a00; }
    .btn.archive { background: #e8f0ff; color:#034; }
    .created { font-size:0.85rem; color:#666; }
    @keyframes appear { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform:none; } }
  </style>
  <div class="card">
    <div class="meta">
      <div>
        <div class="title"></div>
        <div class="created"></div>
      </div>
      <div class="actions">
        <button class="btn archive small"></button>
        <button class="btn delete small">Delete</button>
      </div>
    </div>
    <div class="body"></div>
  </div>
`;

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._note = null;
    this.deleteBtn = this.shadowRoot.querySelector('.delete');
    this.archiveBtn = this.shadowRoot.querySelector('.archive');
    this.titleEl = this.shadowRoot.querySelector('.title');
    this.bodyEl = this.shadowRoot.querySelector('.body');
    this.createdEl = this.shadowRoot.querySelector('.created');

    this.deleteBtn.addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('delete-note', { bubbles: true, composed: true, detail: { id: this._note.id } }));
    });

    this.archiveBtn.addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('toggle-archive', { bubbles: true, composed: true, detail: { id: this._note.id } }));
    });
  }

  set note(note) {
    this._note = note;
    this.titleEl.textContent = note.title;
    this.bodyEl.textContent = note.body;
    this.createdEl.textContent = new Date(note.createdAt).toLocaleString();
    this.archiveBtn.textContent = note.archived ? 'Unarchive' : 'Archive';
  }

  get note() {
    return this._note;
  }
}

customElements.define('note-item', NoteItem);
