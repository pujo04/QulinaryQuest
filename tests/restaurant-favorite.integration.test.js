import FavoriteRestaurantIdb from '../src/scripts/data/favorite-restaurant-idb';
import RestaurantSource from '../src/scripts/data/restaurant-source';
import Detail from '../src/scripts/views/pages/detail';

describe('Liking and Unliking Restaurant Integration Test', () => {
  const setupDOM = () => {
    document.body.innerHTML = `
      <div class="restaurant-detail-container">
        <div class="loading-spinner" style="display: flex;">
          <div class="spinner"></div>
        </div>
        <div class="error-message" style="display: none;"></div>
        <div id="restaurant-detail" class="restaurant-detail"></div>
        <div id="favoriteButtonContainer" class="favorite-button-container"></div>
      </div>
    `;
  };

  beforeEach(async () => {
    setupDOM();
    
    const favorites = await FavoriteRestaurantIdb.getAllRestaurants();
    for (const restaurant of favorites) {
      await FavoriteRestaurantIdb.deleteRestaurant(restaurant.id);
    }

    jest.clearAllMocks();
  });

  const mockRestaurantDetail = {
    id: 'rqdv5juczeskfw1e867',
    name: 'Melting Pot',
    description: 'Restaurant description',
    pictureId: '14',
    address: 'Test Address',
    city: 'Jakarta',
    rating: 4.2,
    menus: {
      foods: [{ name: 'Test Food' }],
      drinks: [{ name: 'Test Drink' }]
    },
    customerReviews: [
      {
        name: 'Test Reviewer',
        review: 'Great restaurant',
        date: '2023-01-01'
      }
    ]
  };

  describe('Error Handling', () => {
    it('should handle error when fetching restaurant detail', async () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      delete window.location;
      window.location = {
        hash: `/detail/invalid-id`
      };

      const testError = new Error('Restaurant not found');

      jest.spyOn(RestaurantSource, 'getRestaurantDetail').mockRejectedValue(testError);

      try {
        await Detail.afterRender();
      } catch (error) {
        const loadingSpinner = document.querySelector('.loading-spinner');
        expect(loadingSpinner.style.display).toBe('none');

        const errorMessage = document.querySelector('.error-message');
        
        const expectedErrorMessage = 'Gagal memuat detail restoran. Silakan coba lagi.';
        expect(errorMessage.textContent).toBe(expectedErrorMessage);
        expect(errorMessage.style.display).toBe('block');
      } finally {
        console.error = originalConsoleError;
      }
    });

    it('should handle invalid restaurant ID', async () => {
      delete window.location;
      window.location = {
        hash: `/detail/`
      };

      const originalConsoleError = console.error;
      console.error = jest.fn();

      try {
        await Detail.afterRender();
      } catch (error) {
        const loadingSpinner = document.querySelector('.loading-spinner');
        expect(loadingSpinner.style.display).toBe('none');

        const errorMessage = document.querySelector('.error-message');
        
        const expectedErrorMessage = 'Gagal memuat detail restoran. Silakan coba lagi.';
        expect(errorMessage.textContent).toBe(expectedErrorMessage);
        expect(errorMessage.style.display).toBe('block');
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  describe('Unliking Restaurant', () => {
    it('should be able to unlike a restaurant', async () => {
      await FavoriteRestaurantIdb.putRestaurant(mockRestaurantDetail);

      delete window.location;
      window.location = {
        hash: `#/detail/${mockRestaurantDetail.id}`
      };

      jest.spyOn(RestaurantSource, 'getRestaurantDetail').mockResolvedValue(mockRestaurantDetail);
      jest.spyOn(RestaurantSource, 'getRestaurantImageUrl').mockReturnValue('test-image-url');

      await Detail.afterRender();

      const loadingSpinner = document.querySelector('.loading-spinner');
      expect(loadingSpinner.style.display).toBe('none');

      const likedButton = document.querySelector('#likedButton');
      expect(likedButton).toBeTruthy();
      
      likedButton.dispatchEvent(new Event('click'));

      const savedRestaurant = await FavoriteRestaurantIdb.getRestaurant(mockRestaurantDetail.id);
      
      expect(savedRestaurant).toBeFalsy();

      const likeButton = document.querySelector('#likeButton');
      expect(likeButton).toBeTruthy();
    });
  });

  describe('Favorite Restaurants List', () => {
    it('should return all favorited restaurants', async () => {
      const restaurants = [
        { ...mockRestaurantDetail, id: 'restaurant1' },
        { ...mockRestaurantDetail, id: 'restaurant2' }
      ];

      for (const restaurant of restaurants) {
        await FavoriteRestaurantIdb.putRestaurant(restaurant);
      }

      const favorites = await FavoriteRestaurantIdb.getAllRestaurants();
      
      expect(favorites.length).toBe(2);
      expect(favorites.map(r => r.id)).toEqual(['restaurant1', 'restaurant2']);
    });
  });
});