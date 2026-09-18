import RestaurantSource from '../../data/restaurant-source';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import { createLikeButtonTemplate, createLikedButtonTemplate } from '../templates/template-creator';

const Detail = {
  async render() {
    return `
      <div class="restaurant-detail-container">
        <div class="loading-spinner" aria-label="Loading restaurant detail">
          <div class="spinner"></div>
        </div>
        <div class="error-message" role="alert" style="display: none;"></div>
        <div class="favorite-top-bar">
          <div id="favoriteButtonContainer" class="favorite-button-container"></div>
        </div>
        <div id="restaurant-detail" class="restaurant-detail"></div>
      </div>
    `;
  },

  async afterRender() {
    const restaurantDetailContainer = document.getElementById('restaurant-detail');
    const favoriteButtonContainer = document.getElementById('favoriteButtonContainer');
    const errorMessage = document.querySelector('.error-message');
    const loadingSpinner = document.querySelector('.loading-spinner');

    const url = window.location.hash.split('/')[2];
    const restaurantId = url;

    try {
      loadingSpinner.style.display = 'flex';

      if (!restaurantId) {
        throw new Error('Invalid restaurant ID');
      }

      const restaurant = await RestaurantSource.getRestaurantDetail(restaurantId);

      loadingSpinner.style.display = 'none';

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      restaurantDetailContainer.innerHTML = `
      <!-- HERO RESTAURANT HEADER -->
      <div class="restaurant-header luxury-resto-header reveal">
        <div class="image-container luxury-image-container">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='800' height='600'%3E%3Crect width='100%' height='100%' fill='%23161b22'/%3E%3C/svg%3E"
               data-src="${RestaurantSource.getRestaurantImageUrl(restaurant.pictureId)}" 
               alt="${restaurant.name}" 
               class="detail-restaurant-image lazy-load"
               width="800"
               height="600"
               onerror="this.src='https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80';"
          >
          <div class="image-overlay luxury-image-overlay"></div>
          
          <div class="resto-header-overlay-content">
            <div class="resto-header-badges">
              <span class="badge-rating">★ ${restaurant.rating} <small>/ 5.0</small></span>
              ${this._renderCuisineBadges(restaurant.categories)}
            </div>
            <h2 class="restaurant-name detail-restaurant-name luxury-title">${restaurant.name}</h2>
            <div class="restaurant-location-info resto-location-pill">
              <span class="location-icon">📍</span>
              <span class="restaurant-city">${restaurant.city}</span>
              <span class="location-divider">—</span>
              <span class="restaurant-address">${restaurant.address}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT 2-COLUMN LUXURY GRID -->
      <div class="resto-content-grid">
        <!-- LEFT COLUMN: ABOUT & MENU -->
        <div class="resto-content-left">
          <div class="resto-venue-card editorial-card reveal">
            <div class="card-title-group">
              <span class="card-eyebrow">About The Venue</span>
              <h3 class="card-heading">Ambiance & Philosophy</h3>
            </div>
            <p class="editorial-lead">${this._getAppetizingDescription(restaurant)}</p>
          </div>

          <div class="restaurant-menus editorial-card reveal">
            <div class="menu-board-header">
              <div class="card-title-group">
                <span class="card-eyebrow">Gastronomy Collection</span>
                <h3 class="card-heading">Curated Menu</h3>
              </div>
              <div class="menu-tabs" role="tablist" aria-label="Menu category filters">
                <button type="button" class="menu-tab-btn active" data-filter="all">Semua (${restaurant.menus.foods.length + restaurant.menus.drinks.length})</button>
                <button type="button" class="menu-tab-btn" data-filter="foods">🍽️ Makanan (${restaurant.menus.foods.length})</button>
                <button type="button" class="menu-tab-btn" data-filter="drinks">🍹 Minuman (${restaurant.menus.drinks.length})</button>
              </div>
            </div>

            <div class="food-menu" data-menu-section="foods">
              <h4 class="menu-subheading">🍽️ Menu Makanan</h4>
              <div class="menu-grid">
                ${restaurant.menus.foods.map((food) => `
                  <div class="menu-item luxury-menu-card" data-category="foods">
                    <span class="menu-item__icon">🍲</span>
                    <div class="menu-item__meta">
                      <span class="menu-item__name">${food.name}</span>
                      <span class="menu-item__tag">Specialty Dish</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="drink-menu" data-menu-section="drinks">
              <h4 class="menu-subheading">🍹 Menu Minuman</h4>
              <div class="menu-grid">
                ${restaurant.menus.drinks.map((drink) => `
                  <div class="menu-item luxury-menu-card" data-category="drinks">
                    <span class="menu-item__icon">🥂</span>
                    <div class="menu-item__meta">
                      <span class="menu-item__name">${drink.name}</span>
                      <span class="menu-item__tag">Craft Beverage</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: REVIEWS & FORM -->
        <div class="resto-content-right">
          <div class="customer-reviews editorial-card reveal">
            <div class="card-title-group">
              <span class="card-eyebrow">Guest Impressions</span>
              <h3 class="card-heading">Diner Reviews</h3>
            </div>
            <div class="reviews-container luxury-reviews-container">
              ${restaurant.customerReviews.map((review) => this._createReviewCard(review)).join('')}
            </div>

            <div class="review-form-container reveal">
              <div class="card-title-group">
                <span class="card-eyebrow">Share Experience</span>
                <h3 class="card-heading">Tulis Ulasan</h3>
              </div>
              <form id="review-form" class="luxury-form">
                <div class="form-group luxury-form-group">
                  <label for="reviewer-name">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="reviewer-name" 
                    name="reviewer-name" 
                    placeholder="Contoh: Budi Santoso" 
                    required
                  >
                </div>
                <div class="form-group luxury-form-group">
                  <label for="review-text">Pengalaman Anda</label>
                  <textarea 
                    id="review-text" 
                    name="review-text" 
                    placeholder="Ceritakan cita rasa hidangan dan suasana restoran..." 
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="submit-review-btn btn-luxury-submit">
                  <span>Kirim Ulasan</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      `;

      this._setupMenuTabs();
      this._addRevealAnimations();

      const isRestaurantFavorite = await FavoriteRestaurantIdb.getRestaurant(restaurantId);
      const favoriteButton = isRestaurantFavorite
        ? createLikedButtonTemplate()
        : createLikeButtonTemplate();

      favoriteButtonContainer.innerHTML = favoriteButton;

      this._setupFavoriteButton(restaurant);

      this._setupReviewForm(restaurant.id);

      this._setupLazyLoading();
    } catch (error) {
      loadingSpinner.style.display = 'none';
      errorMessage.textContent = error.message || 'Gagal memuat detail restoran. Silakan coba lagi.';
      errorMessage.style.display = 'block';
      console.error('Error fetching restaurant details:', error);
    }
  },

  _formatCategoryName(categoryName) {
    const raw = (categoryName || '').trim();
    const lower = raw.toLowerCase();

    if (lower === 'bali') return 'Masakan Khas Bali';
    if (lower === 'jawa') return 'Masakan Jawa';
    if (lower === 'sunda') return 'Masakan Sunda';
    if (lower === 'italia') return 'Masakan Italia';
    if (lower === 'spanyol') return 'Masakan Spanyol';
    if (lower === 'sop') return 'Aneka Sop';
    if (lower === 'modern') return 'Modern';
    if (lower === 'cepat saji') return 'Cepat Saji';

    return `Kuliner ${raw}`;
  },

  _renderCuisineBadges(categories) {
    if (!categories || categories.length === 0) {
      return '<span class="badge-category"><span class="badge-icon">🍽️</span> Fine Dining & Cafe</span>';
    }

    const formatted = categories
      .map((c) => this._formatCategoryName(c.name))
      .join(' • ');

    return `<span class="badge-category"><span class="badge-icon">🍽️</span> ${formatted}</span>`;
  },

  _getAppetizingDescription(restaurant) {
    const raw = (restaurant.description || '').trim();
    const isLoremIpsum = !raw ||
      /lorem\s+ipsum/i.test(raw) ||
      /quisque\s+rutrum/i.test(raw) ||
      /curabitur/i.test(raw) ||
      /nam\s+eget/i.test(raw) ||
      /aenean\s+imperdiet/i.test(raw) ||
      raw.length < 35;

    if (!isLoremIpsum) {
      return raw;
    }

    const categories = restaurant.categories && restaurant.categories.length > 0
      ? restaurant.categories.map((c) => this._formatCategoryName(c.name)).join(', ')
      : 'Kuliner Istimewa';
    const city = restaurant.city || 'kota tercinta';
    const name = restaurant.name || 'Restoran ini';

    const isCafe = /cafe|coffee|kopi|bistro|bar/i.test(categories) || /cafe|kopi/i.test(name);

    if (isCafe) {
      return `Diciptakan sebagai tempat pelarian yang hangat dan bersahabat di ${city}, ${name} menghadirkan ruang yang nyaman untuk bersantai, berbincang santai, maupun menyelesaikan pekerjaan. Setiap cangkir kopi diseduh dengan presisi menggunakan biji pilihan berkualitas, berpadu serasi dengan pilihan hidangan artisanal yang dipersiapkan segar setiap hari. Dibalut suasana ${categories} yang menenangkan dan atmosfer yang akrab, ${name} siap menyempurnakan setiap momen berharga Anda.`;
    }

    return `Berakar dari kecintaan mendalam terhadap cita rasa autentik dan tradisi kuliner di ${city}, ${name} menghadirkan perpaduan harmonis antara warisan resep lokal dan sentuhan gastronomi kontemporer. Diolah menggunakan bahan-bahan segar musiman pilihan langsung dari produsen lokal terbaik, setiap sajian kami rangkai untuk merayakan kehangatan momen kebersamaan Anda dalam balutan atmosfer yang tenang, elegan, dan berkelas.`;
  },

  _setupMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab-btn');
    const foodSection = document.querySelector('[data-menu-section="foods"]');
    const drinkSection = document.querySelector('[data-menu-section="drinks"]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        if (filter === 'all') {
          if (foodSection) foodSection.style.display = 'block';
          if (drinkSection) drinkSection.style.display = 'block';
        } else if (filter === 'foods') {
          if (foodSection) foodSection.style.display = 'block';
          if (drinkSection) drinkSection.style.display = 'none';
        } else if (filter === 'drinks') {
          if (foodSection) foodSection.style.display = 'none';
          if (drinkSection) drinkSection.style.display = 'block';
        }
      });
    });
  },

  _setupReviewForm(restaurantId) {
    const reviewForm = document.getElementById('review-form');

    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('reviewer-name');
      const reviewInput = document.getElementById('review-text');

      const newReview = {
        id: restaurantId,
        name: nameInput.value.trim(),
        review: reviewInput.value.trim(),
      };

      if (!newReview.name || !newReview.review) {
        this._showNotification('Nama dan ulasan tidak boleh kosong', 'error');
        return;
      }

      try {
        const response = await RestaurantSource.submitReview(newReview);

        if (response && response.customerReviews) {
          const reviewsContainer = document.querySelector('.reviews-container');

          const newReviewCards = response.customerReviews
            .map((review) => this._createReviewCard(review))
            .join('');

          reviewsContainer.innerHTML = newReviewCards;

          nameInput.value = '';
          reviewInput.value = '';

          this._showNotification('Ulasan berhasil ditambahkan!', 'success');
        } else {
          throw new Error('Respons dari server tidak valid');
        }
      } catch (error) {
        console.error('Gagal mengirim ulasan:', error);
        this._showNotification(
          `Gagal mengirim ulasan: ${error.message || 'Silakan coba lagi'}`,
          'error'
        );
      }
    });
  },

  _createReviewCard(review) {
    const initial = (review.name || 'G').trim().charAt(0).toUpperCase();
    return `
      <div class="review-card luxury-review-card">
        <div class="review-avatar">${initial}</div>
        <div class="review-body">
          <div class="review-header">
            <h4 class="review-name">${review.name}</h4>
            <span class="review-date">${review.date}</span>
          </div>
          <div class="review-rating" aria-label="5 stars rating">★★★★★</div>
          <p class="review-text">“${review.review}”</p>
        </div>
      </div>
    `;
  },

  _showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  },

  _addRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach((reveal, index) => {
      reveal.style.opacity = '0';
      reveal.style.transform = 'translateY(20px)';

      setTimeout(() => {
        reveal.style.transition = 'all 0.8s ease';
        reveal.style.opacity = '1';
        reveal.style.transform = 'translateY(0)';
      }, index * 200);
    });
  },

  _setupFavoriteButton(restaurant) {
    const favoriteButtonContainer = document.getElementById('favoriteButtonContainer');
    const likeButton = document.querySelector('#likeButton');
    const likedButton = document.querySelector('#likedButton');

    const addFavoriteHandler = async () => {
      await FavoriteRestaurantIdb.putRestaurant({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        pictureId: restaurant.pictureId,
        city: restaurant.city,
        rating: restaurant.rating,
      });

      favoriteButtonContainer.innerHTML = createLikedButtonTemplate();
      this._setupFavoriteButton(restaurant);
    };

    const removeFavoriteHandler = async () => {
      await FavoriteRestaurantIdb.deleteRestaurant(restaurant.id);
      favoriteButtonContainer.innerHTML = createLikeButtonTemplate();
      this._setupFavoriteButton(restaurant);
    };

    if (likeButton) {
      likeButton.addEventListener('click', addFavoriteHandler);
    }

    if (likedButton) {
      likedButton.addEventListener('click', removeFavoriteHandler);
    }
  },

  _setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const image = entry.target;
              image.src = image.dataset.src;
              image.classList.remove('lazy-load');
              image.classList.add('loaded');
              observer.unobserve(image);
            }
          });
        },
        { rootMargin: '50px 0px' }
      );

      lazyImages.forEach((image) => imageObserver.observe(image));
    } else {
      lazyImages.forEach((image) => {
        image.src = image.dataset.src;
        image.classList.remove('lazy-load');
        image.classList.add('loaded');
      });
    }
  }
};

export default Detail;