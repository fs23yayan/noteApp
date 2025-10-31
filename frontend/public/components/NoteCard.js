// Custom Element: Note Card with custom attribute handling
class NoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['note-id', 'title', 'body', 'created-at', 'archived'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    const deleteBtn = this.shadowRoot.querySelector('.delete-btn');
    const archiveBtn = this.shadowRoot.querySelector('.archive-btn');

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('delete', {
            detail: { id: this.getAttribute('note-id') },
            bubbles: true,
            composed: true,
          })
        );
      });
    }

    if (archiveBtn) {
      archiveBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('archive', {
            detail: { id: this.getAttribute('note-id') },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  render() {
    const title = this.getAttribute('title') || 'Untitled';
    const body = this.getAttribute('body') || '';
    const createdAt = this.getAttribute('created-at') || '';
    const archived = this.getAttribute('archived') === 'true';

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .note-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .note-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .note-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
          border-color: #667eea;
        }

        .note-card:hover::before {
          opacity: 1;
        }

        .note-card.archived {
          background: #f7f7f7;
          opacity: 0.8;
        }

        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .note-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          line-height: 1.4;
          word-break: break-word;
          flex: 1;
        }

        .archived-badge {
          background: #fbbf24;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .note-body {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
          font-size: 0.95rem;
          word-break: break-word;
          white-space: pre-wrap;
        }

        .note-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .note-date {
          color: #718096;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .note-actions {
          display: flex;
          gap: 0.5rem;
        }

        button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button:hover {
          background: #f7fafc;
          transform: scale(1.1);
        }

        .archive-btn:hover {
          background: #fef3c7;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        svg {
          width: 20px;
          height: 20px;
        }

        .icon-archive {
          color: #f59e0b;
        }

        .icon-delete {
          color: #ef4444;
        }

        .icon-clock {
          color: #718096;
          width: 16px;
          height: 16px;
        }

        @media (max-width: 768px) {
          .note-card {
            padding: 1.25rem;
          }

          .note-title {
            font-size: 1.1rem;
          }

          .note-body {
            font-size: 0.9rem;
          }
        }
      </style>
      <div class="note-card ${archived ? 'archived' : ''}">
        <div class="note-header">
          <h3 class="note-title">${title}</h3>
          ${archived ? '<span class="archived-badge">Archived</span>' : ''}
        </div>
        <p class="note-body">${body}</p>
        <div class="note-footer">
          <div class="note-date">
            <svg class="icon-clock" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${this.formatDate(createdAt)}
          </div>
          <div class="note-actions">
            <button class="archive-btn" title="${archived ? 'Unarchive' : 'Archive'} note">
              <svg class="icon-archive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </button>
            <button class="delete-btn" title="Delete note">
              <svg class="icon-delete" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('note-card', NoteCard);