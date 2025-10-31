// Custom Element: App Header with search functionality
class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  static get observedAttributes() {
    return ['note-count', 'archived-count'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    const searchInput = this.shadowRoot.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.dispatchEvent(
          new CustomEvent('search', {
            detail: { query: e.target.value },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }

  render() {
    const noteCount = this.getAttribute('note-count') || '0';
    const archivedCount = this.getAttribute('archived-count') || '0';

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 2rem 3rem;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          color: white;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .stat-number {
          font-weight: 700;
          font-size: 1.2rem;
          margin-right: 0.5rem;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1.5rem;
          padding-left: 3rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #667eea;
          width: 20px;
          height: 20px;
        }

        @media (max-width: 768px) {
          .header {
            padding: 1.5rem 1rem 2rem;
          }

          .title {
            font-size: 2rem;
          }

          .stats {
            gap: 1rem;
          }

          .stat-item {
            padding: 0.6rem 1rem;
            font-size: 0.85rem;
          }
        }
      </style>
      <header class="header">
        <div class="header-content">
          <h1 class="title">Notes App</h1>
          <p class="subtitle">Organize your thoughts, track your ideas</p>
          
          <div class="stats">
            <div class="stat-item">
              <span class="stat-number">${noteCount}</span>
              <span>Active Notes</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${archivedCount}</span>
              <span>Archived</span>
            </div>
          </div>

          <div class="search-container">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search notes by title or content..."
            />
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);