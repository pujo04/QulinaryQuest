import RestaurantSource from '../../data/restaurant-source';
import { getShortDescription } from '../../utils/description-helper';

const Home = {
  async render() {
    return `
      <section class="hero-editorial">
        <div class="hero-editorial__container">
          <!-- Kolom Kiri: Narasi Editorial & CTA -->
          <div class="hero-editorial__content">
            <div class="hero-editorial__badge">
              <span class="badge-sparkle">✦</span>
              <span>CURATED GASTRONOMY GUIDE</span>
            </div>
            <h1 class="hero-editorial__title">
              Eksplorasi Keajaiban Rasa & <span class="text-accent-italic">Atmosfer Bersantap</span> Terbaik
            </h1>
            <p class="hero-editorial__desc">
              Temukan kurasi restoran pilihan, bistro tersembunyi, dan kafe estetik dengan sajian menggugah selera di setiap sudut kota Anda.
            </p>
            
            <div class="hero-editorial__actions">
              <a href="#restaurant-section" id="btnExplore" class="btn-cta-primary">
                <span>Jelajahi Restoran</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
              </a>
              <a href="#/favorite" class="btn-cta-secondary">
                <span>Koleksi Favorit</span>
              </a>
            </div>

            <!-- Trust Metrics -->
            <div class="hero-editorial__stats">
              <div class="stat-item">
                <strong>4.8+</strong>
                <span>Rating Kurasi</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <strong>50+</strong>
                <span>Destinasi Pilihan</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <strong>100%</strong>
                <span>Rasa Autentik</span>
              </div>
            </div>
          </div>

          <!-- Kolom Kanan: Bento Grid Kolase Foto Resto & Hidangan -->
          <div class="hero-editorial__bento">
            <div class="bento-card bento-card--large">
              <picture>
                <source media="(min-width: 800px)" srcset="./images/heros/optimized/hero-image_2-large.jpg">
                <img 
                  src="./images/heros/optimized/hero-image_2-small.jpg" 
                  alt="Suasana Restoran Elegan" 
                  onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';"
                />
              </picture>
              <div class="bento-card__overlay">
                <span class="bento-tag">Warm & Cozy Ambience</span>
              </div>
            </div>

            <div class="bento-card bento-card--top">
              <picture>
                <source media="(min-width: 800px)" srcset="./images/heros/optimized/hero-image_4-large.jpg">
                <img 
                  src="./images/heros/optimized/hero-image_4-small.jpg" 
                  alt="Sajian Hidangan Lezat" 
                  onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';"
                />
              </picture>
              <div class="bento-card__overlay">
                <span class="bento-rating">★ 4.9 Specialty Dish</span>
              </div>
            </div>

            <div class="bento-card bento-card--bottom">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80" 
                alt="Artisan Craft Beverage"
              />
              <div class="bento-card__overlay">
                <span class="bento-tag">Artisan Craft Beverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="restaurant-section" id="restaurant-section">
        <div class="section-header">
         <h2 class="section-title">Explore Restaurants</h2>
        </div>
        <div class="loading-spinner" aria-label="Loading restaurants">
          <div class="spinner"></div>
        </div>
        <div class="error-message" role="alert" style="display: none;"></div>
        <div id="restaurants" class="restaurants__container" aria-live="polite"></div>
      </section>
    `;
  },

  async afterRender() {
    const restaurantsContainer = document.getElementById('restaurants');
    const loadingSpinner = document.querySelector('.loading-spinner');

    this._setupSmoothScroll();

    try {
      loadingSpinner.style.display = 'flex';
      const restaurants = await RestaurantSource.listRestaurants();

      loadingSpinner.style.display = 'none';

      if (!restaurants || restaurants.length === 0) {
        this._showError('No restaurants found. Please check back later.');
        return;
      }

      restaurantsContainer.innerHTML = '';

      restaurants.forEach((restaurant) => {
        const restaurantCard = this._createRestaurantCard(restaurant);
        restaurantsContainer.appendChild(restaurantCard);
      });

      this._setupCardAnimations();
      this._setupLazyLoading();
      this._addLazyLoadStyles();
    } catch (error) {
      this._handleError(error);
    }
  },

  _setupSmoothScroll() {
    const exploreBtn = document.getElementById('btnExplore') || document.querySelector('.btn-cta-primary');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const targetElement = document.getElementById('restaurant-section') || document.getElementById('restaurants');
        if (targetElement) {
          const navHeight = document.querySelector('.app-bar')?.offsetHeight || 66;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    }
  },

  _setupCardAnimations() {
    const cards = document.querySelectorAll('.restaurant-card');
    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('card-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
      );

      cards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 4) * 0.08}s`;
        cardObserver.observe(card);
      });
    } else {
      cards.forEach((card) => card.classList.add('card-visible'));
    }
  },

  _createRestaurantCard(restaurant) {
    const restaurantCard = document.createElement('div');
    restaurantCard.classList.add('restaurant-card');
    restaurantCard.setAttribute('tabindex', '0');
    restaurantCard.setAttribute('aria-label', `Restaurant: ${restaurant.name}`);

    // Placeholder gambar dengan teknik blur
    restaurantCard.innerHTML = `
      <div class="image-wrapper" style="position: relative;">
        <img 
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' width='300' height='200'%3E%3Crect width='100%' height='100%' fill='%23f0f0f0'/%3E%3C/svg%3E"
          data-src="${RestaurantSource.getRestaurantImageUrl(restaurant.pictureId)}" 
          alt="${restaurant.name}" 
          class="home-restaurant-image lazy-load"
          loading="lazy"
          width="300"
          height="200"
        >
        <div style="position: absolute; top: 12px; right: 12px; background: rgba(18, 19, 22, 0.7); backdrop-filter: blur(4px); color: #FFF; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#C87D55" stroke="#C87D55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          ${restaurant.rating}
        </div>
      </div>
      <div class="restaurant-info">
        <h3 class="restaurant-name home-restaurant-name">${restaurant.name}</h3>
        <p class="restaurant-location" aria-label="Location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${restaurant.city}
        </p>
        <p class="restaurant-description">
          ${getShortDescription(restaurant)}
        </p>
      </div>
    `;

    // Event listener untuk navigasi
    restaurantCard.addEventListener('click', () => {
      window.location.href = `/#/detail/${restaurant.id}`;
    });

    restaurantCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        window.location.href = `/#/detail/${restaurant.id}`;
      }
    });

    return restaurantCard;
  },

  _setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');

    // Cek dukungan IntersectionObserver
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const image = entry.target;

              // Tambahkan efek transisi
              image.style.transition = 'opacity 0.5s ease-in-out';
              image.style.opacity = '0';

              // Load gambar
              const img = new Image();
              img.src = image.dataset.src;
              img.onload = () => {
                image.src = image.dataset.src;
                image.style.opacity = '1';
                image.classList.remove('lazy-load');
                image.classList.add('loaded');
                observer.unobserve(image);
              };
            }
          });
        },
        {
          rootMargin: '50px 0px', // Mulai memuat gambar sebelum masuk viewport
          threshold: 0.01 // Sedikit gambar yang terlihat sudah cukup
        }
      );

      lazyImages.forEach((image) => imageObserver.observe(image));
    } else {
      // Fallback untuk browser lama
      lazyImages.forEach((image) => {
        image.src = image.dataset.src;
        image.classList.remove('lazy-load');
        image.classList.add('loaded');
      });
    }
  },

  _addLazyLoadStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .lazy-load {
        filter: blur(10px);
        transform: scale(1.1);
        transition: filter 0.5s ease-in-out, transform 0.5s ease-in-out;
      }
      .lazy-load.loaded {
        filter: blur(0);
        transform: scale(1);
      }
    `;
    document.head.appendChild(style);
  },

  _showError(message) {
    const errorMessageElement = document.querySelector('.error-message');
    const loadingSpinner = document.querySelector('.loading-spinner');

    loadingSpinner.style.display = 'none';
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
  },

  _handleError(error) {
    console.error('Error fetching restaurants:', error);

    let errorMessage = 'Failed to load restaurants. Please try again later.';

    if (error.response) {
      errorMessage = `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'No response from server. Check your internet connection.';
    }

    this._showError(errorMessage);
  }
};

export default Home;