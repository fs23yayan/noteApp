const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      --size: 40px;
    }
    :host([hidden]) { display: none; }
    .loader {
      width: var(--size);
      height: var(--size);
      border-radius: 50%;
      display: inline-block;
      position: relative;
      animation: rotate 1s linear infinite;
      border: 4px solid rgba(0,0,0,0.12);
      border-top-color: rgba(0,0,0,0.6);
    }
    @keyframes rotate { 100% { transform: rotate(360deg);} }
  </style>
  <div class="loader" aria-hidden="true"></div>
`;

class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('loading-indicator', LoadingIndicator);
