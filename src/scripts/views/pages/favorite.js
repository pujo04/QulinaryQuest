import FavoriteRestaurantIdb from '../../data/favorite-restaurant-idb';
import RestaurantSource from '../../data/restaurant-source';

const Favorite = {
  async render() {
    return `
      <div class="favorite-container">
        <h2>Restoran Favorit</h2>
        <div id="favorite-restaurants" class="restaurants__container"></div>
        <div id="no-favorites" class="no-favorites" style="display: none;">
          <p>Anda belum memiliki restoran favorit.</p>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const favoriteRestaurantsContainer = document.getElementById('favorite-restaurants');
    const noFavoritesMessage = document.getElementById('no-favorites');

    try {
      const favoriteRestaurants = await FavoriteRestaurantIdb.getAllRestaurants();

      if (favoriteRestaurants.length === 0) {
        noFavoritesMessage.style.display = 'block';
        favoriteRestaurantsContainer.style.display = 'none';
        return;
      }

      favoriteRestaurantsContainer.innerHTML = '';

      favoriteRestaurants.forEach((restaurant) => {
        const restaurantCard = this._createFavoriteRestaurantCard(restaurant);
        favoriteRestaurantsContainer.appendChild(restaurantCard);
      });
    } catch (error) {
      console.error('Error loading favorite restaurants:', error);
      noFavoritesMessage.style.display = 'block';
      noFavoritesMessage.textContent = 'Gagal memuat restoran favorit. Silakan coba lagi.';
    }
  },

  _createFavoriteRestaurantCard(restaurant) {
    const restaurantCard = document.createElement('div');
    restaurantCard.classList.add('restaurant-card', 'favorite-restaurant-card');

    restaurantCard.innerHTML = `
      <img src="${RestaurantSource.getRestaurantImageUrl(restaurant.pictureId)}" 
           alt="${restaurant.name}" 
           class="favorite-restaurant-image">
      <div class="restaurant-info">
        <h3 class="restaurant-name home-restaurant-name">${restaurant.name}</h3>
        <div class="restaurant-meta">
          <p class="restaurant-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${restaurant.city}
          </p>
          <p class="restaurant-rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="yellow" stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            ${restaurant.rating}
          </p>
        </div>
        <button class="remove-favorite-btn" data-id="${restaurant.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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