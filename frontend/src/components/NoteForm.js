// Custom Element: Note Form with real-time validation
class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.maxTitleLength = 50;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const titleInput = this.shadowRoot.querySelector('#title');
    const bodyInput = this.shadowRoot.querySelector('#body');
    const titleCounter = this.shadowRoot.querySelector('.title-counter');
    const titleError = this.shadowRoot.querySelector('.title-error');

    // Real-time validation for title
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        const remaining = this.maxTitleLength - length;
        
        titleCounter.textContent = `${remaining} characters remaining`;
        
        if (length > this.maxTitleLength) {
          titleInput.classList.add('error');
          titleError.textContent = `Title cannot exceed ${this.maxTitleLength} characters`;
          titleError.style.display = 'block';
        } else if (length === 0) {
          titleInput.classList.add('error');
          titleError.textContent = 'Title is required';
          titleError.style.display = 'block';
        } else {
          titleInput.classList.remove('error');
          titleError.style.display = 'none';
        }

        if (remaining < 10 && remaining >= 0) {
          titleCounter.classList.add('warning');
        } else {
          titleCounter.classList.remove('warning');
        }
      });
    }

    // Form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        if (!title) {
          titleError.textContent = 'Title is required';
          titleError.style.display = 'block';
          titleInput.classList.add('error');
          titleInput.focus();
          return;
        }

        if (title.length > this.maxTitleLength) {
          titleError.textContent = `Title cannot exceed ${this.maxTitleLength} characters`;
          titleError.style.display = 'block';
          titleInput.classList.add('error');
          titleInput.focus();
          return;
        }

        if (!body) {
          bodyInput.focus();
          return;
        }

        this.dispatchEvent(
          new CustomEvent('submit-note', {
            detail: { title, body },
            bubbles: true,
            composed: true,
          })
        );

        // Reset form
        form.reset();
        titleCounter.textContent = `${this.maxTitleLength} characters remaining`;
        titleCounter.classList.remove('warning');
        titleInput.classList.remove('error');
        titleError.style.display = 'none';
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .form-container {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 3rem;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .form-container:focus-within {
          border-color: #667eea;
          box-shadow: 0 6px 30px rgba(102, 126, 234, 0.15);
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .form-icon {
          width: 28px;
          height: 28px;
          color: #667eea;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s ease;
          background: white;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input.error,
        textarea.error {
          border-color: #ef4444;
        }

        input.error:focus,
        textarea.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
          line-height: 1.6;
        }

        .char-counter {
          font-size: 0.85rem;
          color: #718096;
          margin-top: 0.5rem;
          text-align: right;
          transition: color 0.2s ease;
        }

        .char-counter.warning {
          color: #f59e0b;
          font-weight: 600;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: none;
          font-weight: 500;
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          width: 100%;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        .required {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .form-container {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.25rem;
          }

          input,
          textarea {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
      </style>
      <div class="form-container">
        <h2 class="form-title">
          <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Note
        </h2>
        <form>
          <div class="form-group">
            <label for="title">
              Note Title <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter note title..."
                maxlength="${this.maxTitleLength + 50}"
                required
              />
            </div>
            <div class="title-counter char-counter">${this.maxTitleLength} characters remaining</div>
            <div class="title-error error-message"></div>
          </div>
          <div class="form-group">
            <label for="body">
              Note Content <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <textarea
                id="body"
                name="body"
                placeholder="Write your note content here..."
                required
              ></textarea>
            </div>
          </div>
          <button type="submit" class="submit-btn">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Add Note
          </button>
        </form>
      </div>
    `;
  }
}

customElements.define('note-form', NoteForm);

export default NoteForm;


