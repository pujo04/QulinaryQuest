import RestaurantSource from '../../data/restaurant-source';

const Home = {
  async render() {
    return `
      <div class="hero">
        <div class="hero__inner">
          <h2 class="hero__title">Explore Culinary Delights</h2>
          <p class="hero__tagline">
            Discover amazing restaurants and unforgettable dining experiences
          </p>
        </div>
      </div>
      <section class="restaurant-section">
        <h2 class="section-title">Explore Restaurants</h2>
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

      this._setupLazyLoading();
      this._addLazyLoadStyles();
    } catch (error) {
      this._handleError(error);
    }
  },

  _createRestaurantCard(restaurant) {
    const restaurantCard = document.createElement('div');
    restaurantCard.classList.add('restaurant-card');
    restaurantCard.setAttribute('tabindex', '0');
    restaurantCard.setAttribute('aria-label', `Restaurant: ${restaurant.name}`);

    // Placeholder gambar dengan teknik blur
    restaurantCard.innerHTML = `
      <div class="image-wrapper">
        <img 
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' width='300' height='200'%3E%3Crect width='100%' height='100%' fill='%23f0f0f0'/%3E%3C/svg%3E"
          data-src="${RestaurantSource.getRestaurantImageUrl(restaurant.pictureId)}" 
          alt="${restaurant.name}" 
          class="home-restaurant-image lazy-load"
          loading="lazy"
          width="300"
          height="200"
        >
      </div>
      <div class="restaurant-info">
        <h3 class="restaurant-name home-restaurant-name">${restaurant.name}</h3>
        <p class="restaurant-location" aria-label="Location">📍 ${restaurant.city}</p>
        <p class="restaurant-rating" aria-label="Rating">⭐ ${restaurant.rating}</p>
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