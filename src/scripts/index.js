import 'regenerator-runtime';
import '../styles/main.css';
import '../styles/responsive.css';
import App from './views/app';
import swRegister from './utils/sw-register';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

// Optimasi Performance dan Aksesibilitas
class AppInitializer {
  constructor() {
    this.app = new App({
      button: document.querySelector('#hamburgerButton'),
      drawer: document.querySelector('#navigationDrawer'),
      content: document.querySelector('#mainContent'),
    });

    this.initEventListeners();
    this.setupPerformanceObservers();
    this.ensureFooterSocialIcons();
  }

  initEventListeners() {
    // Gunakan event delegation untuk efisiensi
    window.addEventListener('hashchange', this.handleRouteChange.bind(this));
    window.addEventListener('load', this.handleInitialLoad.bind(this));
    document.addEventListener('DOMContentLoaded', this.handleDOMLoaded.bind(this));
  }

  handleRouteChange() {
    this.app.renderPage();
    this.scrollToTop();
    this.ensureFooterSocialIcons();
  }

  handleInitialLoad() {
    this.app.renderPage();
    swRegister();
    this.handleFooterAnimation();
    this.ensureFooterSocialIcons();
    this.setupAccessibilityFeatures();
  }

  handleDOMLoaded() {
    this.handleFooterAnimation();
    this.ensureFooterSocialIcons();
    this.initLazyLoading();
  }

  ensureFooterSocialIcons() {
    const container = document.querySelector('.luxury-footer-social .social-icons, .social-icons');
    if (container) {
      container.innerHTML = `
        <a href="https://github.com/pujo04" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub - Andreas Pujo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/andreaspujos/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn - Andreas Pujo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.763z"/>
          </svg>
        </a>
      `;
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  handleFooterAnimation() {
    const footerSections = document.querySelectorAll('.footer-section');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    footerSections.forEach((section) => {
      observer.observe(section);
    });
  }

  setupAccessibilityFeatures() {
    // Tambahkan fitur aksesibilitas
    this.addKeyboardNavigation();
    this.improveFormAccessibility();
  }

  addKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Contoh: Navigasi dengan keyboard
      if (event.key === 'ArrowLeft') {
        // Navigasi ke halaman sebelumnya
        window.history.back();
      }
      if (event.key === 'ArrowRight') {
        // Navigasi ke halaman selanjutnya
        window.history.forward();
      }
    });
  }

  improveFormAccessibility() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.setAttribute('novalidate', true);

      // Tambahkan petunjuk error yang lebih baik
      form.addEventListener('invalid', (event) => {
        event.preventDefault();
        const invalidField = event.target;
        invalidField.setAttribute('aria-invalid', 'true');

        // Tampilkan pesan error dengan aria-live
        const errorContainer = document.createElement('div');
        errorContainer.setAttribute('role', 'alert');
        errorContainer.setAttribute('aria-live', 'assertive');
        errorContainer.textContent = `Error: ${invalidField.validationMessage}`;

        invalidField.parentNode.appendChild(errorContainer);
      }, true);
    });
  }

  initLazyLoading() {
    // Konfigurasi tambahan untuk lazy loading
    lazySizes.cfg.init = false; // Nonaktifkan auto-init
    lazySizes.init(); // Inisialisasi manual
  }

  setupPerformanceObservers() {
    // Pantau performa aplikasi
    if ('PerformanceObserver' in window) {
      const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`Performance ${entry.name}: ${entry.duration}ms`);
        }
      });

      performanceObserver.observe({
        entryTypes: ['measure', 'navigation']
      });
    }
  }
}

// Inisialisasi aplikasi
new AppInitializer();