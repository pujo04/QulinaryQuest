import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import RestaurantSource from '../../data/restaurant-source';
import { getShortDescription } from '../../utils/description-helper';

const Favorite = {
  async render() {
    return `
      <div class="favorite-container">
        <div class="section-header" style="text-align: left; margin-bottom: 28px;">
          <span class="section-eyebrow">KOLEKSI TERSIMPAN</span>
          <h2 class="section-title">Restoran Favorit</h2>
        </div>
        <div id="favorite-restaurants" class="restaurants__container"></div>
        <div id="no-favorites" class="no-favorites" style="display: none;">
          <div class="empty-state-card">
            <div class="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 class="empty-state-title">Belum Ada Restoran Tersimpan</h3>
            <p class="empty-state-desc">Jelajahi berbagai destinasi kuliner istimewa dan simpan tempat favorit Anda untuk akses cepat kapan saja.</p>
            <a href="#/home" class="btn-cta-primary empty-state-btn">Jelajahi Restoran</a>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const favoriteRestaurantsContainer = document.getElementById('favorite-restaurants');
    const noFavoritesMessage = document.getElementById('no-favorites');

    try {
      const favoriteRestaurants = await FavoriteRestaurantIdb.getAllRestaurants();

      if (!favoriteRestaurants || favoriteRestaurants.length === 0) {
        noFavoritesMessage.style.display = 'block';
        favoriteRestaurantsContainer.style.display = 'none';
        return;
      }

      noFavoritesMessage.style.display = 'none';
      favoriteRestaurantsContainer.style.display = 'grid';
      favoriteRestaurantsContainer.innerHTML = '';

      favoriteRestaurants.forEach((restaurant) => {
        const restaurantCard = this._createFavoriteRestaurantCard(restaurant);
        favoriteRestaurantsContainer.appendChild(restaurantCard);
      });
    } catch (error) {
      console.error('Error loading favorite restaurants:', error);
      noFavoritesMessage.style.display = 'block';
      noFavoritesMessage.innerHTML = '<p class="error-text">Gagal memuat restoran favorit. Silakan coba lagi.</p>';
    }
  },

  _createFavoriteRestaurantCard(restaurant) {
    const restaurantCard = document.createElement('div');
    restaurantCard.classList.add('restaurant-card', 'favorite-restaurant-card', 'card-visible');
    restaurantCard.setAttribute('tabindex', '0');
    restaurantCard.setAttribute('aria-label', `Restaurant: ${restaurant.name}`);

    restaurantCard.innerHTML = `
      <div class="image-wrapper" style="position: relative;">
        <img src="${RestaurantSource.getRestaurantImageUrl(restaurant.pictureId)}" 
             alt="${restaurant.name}" 
             class="favorite-restaurant-image"
             style="height: 200px; width: 100%; object-fit: cover;">
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
        <button class="remove-favorite-btn" data-id="${restaurant.id}" style="width: 100%; background: var(--surface-cream); color: var(--primary-dark); border: 1px solid var(--border-subtle); padding: 10px; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; margin-top: 16px; transition: all 0.2s ease;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Hapus Favorit
        </button>
      </div>
    `;

    restaurantCard.addEventListener('click', (event) => {
      if (!event.target.closest('.remove-favorite-btn')) {
        window.location.href = `/#/detail/${restaurant.id}`;
      }
    });

    const removeButton = restaurantCard.querySelector('.remove-favorite-btn');
    removeButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      const restaurantId = event.currentTarget.dataset.id;

      try {
        await FavoriteRestaurantIdb.deleteRestaurant(restaurantId);
        this.afterRender();
      } catch (error) {
        console.error('Gagal menghapus restoran favorit:', error);
      }
    });

    return restaurantCard;
  },
};

export default Favorite;