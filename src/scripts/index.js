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
  }

  handleInitialLoad() {
    this.app.renderPage();
    swRegister();
    this.handleFooterAnimation();
    this.setupAccessibilityFeatures();
  }

  handleDOMLoaded() {
    this.handleFooterAnimation();
    this.initLazyLoading();
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