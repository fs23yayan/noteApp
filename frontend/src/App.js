import React, { useState, useEffect } from 'react';
import './App.css';
import { notesData } from './mock';
import './components/AppHeader';
import './components/NoteCard';
import './components/NoteForm';

function App() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load initial notes from mock data
    setNotes(notesData);
  }, []);

  const handleAddNote = (event) => {
    const { title, body } = event.detail;
    const newNote = {
      id: `notes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    setNotes([newNote, ...notes]);
  };

  const handleDeleteNote = (event) => {
    const { id } = event.detail;
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleArchiveNote = (event) => {
    const { id } = event.detail;
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, archived: !note.archived } : note
      )
    );
  };

  const handleSearch = (event) => {
    setSearchQuery(event.detail.query.toLowerCase());
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery) ||
      note.body.toLowerCase().includes(searchQuery)
  );

  const activeNotes = filteredNotes.filter((note) => !note.archived);
  const archivedNotes = filteredNotes.filter((note) => note.archived);

  useEffect(() => {
    const appHeader = document.querySelector('app-header');
    if (appHeader) {
      appHeader.addEventListener('search', handleSearch);
      return () => {
        appHeader.removeEventListener('search', handleSearch);
      };
    }
  }, []);

  useEffect(() => {
    const noteForm = document.querySelector('note-form');
    if (noteForm) {
      noteForm.addEventListener('submit-note', handleAddNote);
      return () => {
        noteForm.removeEventListener('submit-note', handleAddNote);
      };
    }
  }, [notes]);

  useEffect(() => {
    const noteCards = document.querySelectorAll('note-card');
    noteCards.forEach((card) => {
      card.addEventListener('delete', handleDeleteNote);
      card.addEventListener('archive', handleArchiveNote);
    });
    return () => {
      noteCards.forEach((card) => {
        card.removeEventListener('delete', handleDeleteNote);
        card.removeEventListener('archive', handleArchiveNote);
      });
    };
  }, [filteredNotes]);

  return (
    <div className="App">
      <app-header
        note-count={activeNotes.length}
        archived-count={archivedNotes.length}
      ></app-header>

      <main className="main-content">
        <div className="container">
          <note-form></note-form>

          {activeNotes.length > 0 && (
            <section className="notes-section">
              <h2 className="section-title">
                <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Active Notes
                <span className="count-badge">{activeNotes.length}</span>
              </h2>
              <div className="notes-grid">
                {activeNotes.map((note) => (
                  <note-card
                    key={note.id}
                    note-id={note.id}
                    title={note.title}
                    body={note.body}
                    created-at={note.createdAt}
                    archived={note.archived.toString()}
                  ></note-card>
                ))}
              </div>
            </section>
          )}

          {archivedNotes.length > 0 && (
            <section className="notes-section">
              <h2 className="section-title">
                <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
                Archived Notes
                <span className="count-badge archived">{archivedNotes.length}</span>
              </h2>
              <div className="notes-grid">
                {archivedNotes.map((note) => (
                  <note-card
                    key={note.id}
                    note-id={note.id}
                    title={note.title}
                    body={note.body}
                    created-at={note.createdAt}
                    archived={note.archived.toString()}
                  ></note-card>
                ))}
              </div>
            </section>
          )}

          {filteredNotes.length === 0 && (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3>No notes found</h3>
              <p>
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first note to get started'}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Notes App. Built with Web Components</p>
        </div>
      </footer>
    </div>
  );
}

export default App;


