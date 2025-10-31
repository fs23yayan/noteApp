// Main Application Logic - Pure Vanilla JavaScript
class NotesApp {
  constructor() {
    this.notes = [];
    this.searchQuery = '';
    this.init();
  }

  init() {
    // Load initial notes
    this.notes = [...notesData];
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initial render
    this.render();
  }

  setupEventListeners() {
    // Header search event
    const appHeader = document.querySelector('app-header');
    if (appHeader) {
      appHeader.addEventListener('search', (e) => this.handleSearch(e));
    }

    // Form submit event
    const noteForm = document.querySelector('note-form');
    if (noteForm) {
      noteForm.addEventListener('submit-note', (e) => this.handleAddNote(e));
    }

    // Note card events (using event delegation on document)
    document.addEventListener('delete', (e) => {
      if (e.target.tagName === 'NOTE-CARD') {
        this.handleDeleteNote(e);
      }
    });

    document.addEventListener('archive', (e) => {
      if (e.target.tagName === 'NOTE-CARD') {
        this.handleArchiveNote(e);
      }
    });
  }

  handleAddNote(event) {
    const { title, body } = event.detail;
    const newNote = {
      id: `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    this.notes.unshift(newNote); // Add to beginning
    this.render();
  }

  handleDeleteNote(event) {
    const { id } = event.detail;
    this.notes = this.notes.filter(note => note.id !== id);
    this.render();
  }

  handleArchiveNote(event) {
    const { id } = event.detail;
    this.notes = this.notes.map(note => 
      note.id === id ? { ...note, archived: !note.archived } : note
    );
    this.render();
  }

  handleSearch(event) {
    this.searchQuery = event.detail.query.toLowerCase();
    this.render();
  }

  getFilteredNotes() {
    return this.notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(this.searchQuery) ||
        note.body.toLowerCase().includes(this.searchQuery);
      return matchesSearch;
    });
  }

  render() {
    const filteredNotes = this.getFilteredNotes();
    const activeNotes = filteredNotes.filter(note => !note.archived);
    const archivedNotes = filteredNotes.filter(note => note.archived);

    // Update header counts
    const appHeader = document.querySelector('app-header');
    if (appHeader) {
      appHeader.setAttribute('note-count', activeNotes.length);
      appHeader.setAttribute('archived-count', archivedNotes.length);
    }

    // Render active notes
    this.renderNotesSection(
      'active-notes-section',
      'active-notes-grid',
      'active-count',
      activeNotes
    );

    // Render archived notes
    this.renderNotesSection(
      'archived-notes-section',
      'archived-notes-grid',
      'archived-count',
      archivedNotes
    );

    // Handle empty state
    this.renderEmptyState(filteredNotes.length === 0);
  }

  renderNotesSection(sectionId, gridId, countId, notes) {
    const section = document.getElementById(sectionId);
    const grid = document.getElementById(gridId);
    const countBadge = document.getElementById(countId);

    if (!section || !grid) return;

    if (notes.length > 0) {
      section.style.display = 'block';
      countBadge.textContent = notes.length;
      
      // Clear existing notes
      grid.innerHTML = '';
      
      // Add note cards
      notes.forEach(note => {
        const noteCard = document.createElement('note-card');
        noteCard.setAttribute('note-id', note.id);
        noteCard.setAttribute('title', note.title);
        noteCard.setAttribute('body', note.body);
        noteCard.setAttribute('created-at', note.createdAt);
        noteCard.setAttribute('archived', note.archived);
        grid.appendChild(noteCard);
      });
    } else {
      section.style.display = 'none';
    }
  }

  renderEmptyState(show) {
    const emptyState = document.getElementById('empty-state');
    const emptyMessage = document.getElementById('empty-message');
    
    if (show) {
      emptyState.classList.add('show');
      emptyMessage.textContent = this.searchQuery 
        ? 'Try adjusting your search query'
        : 'Create your first note to get started';
    } else {
      emptyState.classList.remove('show');
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
  });
} else {
  window.notesApp = new NotesApp();
}