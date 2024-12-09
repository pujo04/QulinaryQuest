import RestaurantSource from '../../data/restaurant-source';
import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import { createLikeButtonTemplate, createLikedButtonTemplate } from '../templates/template-creator';

const Detail = {
  async render() {
    return `
      <div class="restaurant-detail-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <div class="error-message" style="display: none;"></div>
        <div id="restaurant-detail" class="restaurant-detail"></div>
        <div id="favoriteButtonContainer" class="favorite-button-container"></div>
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
      <div class="restaurant-header reveal">
        <div class="image-container">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='800' height='600'%3E%3Crect width='100%' height='100%' fill='%23f0f0f0'/%3E%3C/svg%3E"
               data-src="${RestaurantSource.getRestaurantImageUrl(restaurant.pictureId)}" 
               alt="${restaurant.name}" 
               class="detail-restaurant-image lazy-load"
               width="800"
               height="600"
          >
          <div class="image-overlay"></div>
        </div>
        <h2 class="restaurant-name detail-restaurant-name slide-in">${restaurant.name}</h2>
      </div>

      <div class="restaurant-location-info reveal">
        <h3>📍 Lokasi</h3>
        <p class="restaurant-address">${restaurant.address}</p>
        <p class="restaurant-city">${restaurant.city}</p>
      </div>

      <div class="restaurant-description reveal">
        <h3>📝 Deskripsi</h3>
        <p>${restaurant.description}</p>
      </div>

      <div class="restaurant-menus">
        <div class="food-menu reveal">
          <h3>🍽️ Menu Makanan</h3>
          <div class="menu-grid">
            ${restaurant.menus.foods.map((food) => `
              <div class="menu-item">
                <span>${food.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="drink-menu reveal">
          <h3>🍹 Menu Minuman</h3>
          <div class="menu-grid">
            ${restaurant.menus.drinks.map((drink) => `
              <div class="menu-item">
                <span>${drink.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="customer-reviews reveal">
        <h3>💬 Ulasan Pelanggan</h3>
        <div class="reviews-container">
          ${restaurant.customerReviews.map((review) => this._createReviewCard(review)).join('')}
        </div>

        <div class="review-form-container reveal">
          <h3>Tambah Ulasan</h3>
          <form id="review-form">
            <div class="form-group">
              <label for="reviewer-name">Nama</label>
              <input 
                type="text" 
                id="reviewer-name" 
                name="reviewer-name" 
                placeholder="Masukkan nama Anda" 
                required
              >
            </div>
            <div class="form-group">
              <label for="review-text">Ulasan</label>
              <textarea 
                id="review-text" 
                name="review-text" 
                placeholder="Tulis ulasan Anda" 
                required
              ></textarea>
            </div>
            <button type="submit" class="submit-review-btn">
              Kirim Ulasan
            </button>
          </form>
        </div>
      </div>
      `;

      this._addRevealAnimations();

      const isRestaurantFavorite = await FavoriteRestaurantIdb.getRestaurant(restaurantId);
      const favoriteButton = isRestaurantFavorite
        ? createLikedButtonTemplate()
        : createLikeButtonTemplate();

      favoriteButtonContainer.innerHTML = favoriteButton;

      this._setupFavoriteButton(restaurant);

      this._setupReviewForm(restaurant.id);

      this._setupLazyLoading(); // Setup lazy loading for the detail image
    } catch (error) {
      loadingSpinner.style.display = 'none';
      errorMessage.textContent = error.message || 'Gagal memuat detail restoran. Silakan coba lagi.';
      errorMessage.style.display = 'block';
      console.error('Error fetching restaurant details:', error);
    }
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
    return `
      <div class="review-card">
        <div class="review-header">
          <h4>${review.name}</h4>
          <span class="review-date">${review.date}</span>
        </div>
        <p class="review-text">${review.review}</p>
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