import './styles/styles.css';
import './components/loading-indicator.js';
import './components/note-item.js';
import { initApp } from './app';

document.addEventListener('DOMContentLoaded', () => {
  initApp(document.getElementById('app'));
});
