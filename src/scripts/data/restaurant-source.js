import API_ENDPOINT from '../globals/api-endpoint';

class RestaurantSource {
  // Metode yang sudah ada
  static async listRestaurants() {
    const response = await fetch(API_ENDPOINT.RESTAURANTS);
    const responseJson = await response.json();
    return responseJson.restaurants;
  }

  // Metode untuk mendapatkan detail restoran
  static async getRestaurantDetail(id) {
    const response = await fetch(API_ENDPOINT.DETAIL(id));
    const responseJson = await response.json();
    return responseJson.restaurant;
  }

  // Metode untuk mendapatkan URL gambar restoran
  static getRestaurantImageUrl(pictureId) {
    return `${API_ENDPOINT.IMAGE}${pictureId}`;
  }

  // Metode baru untuk mengirim ulasan
  static async submitReview(review) {
    try {
      console.log('Sending review to:', API_ENDPOINT.REVIEW);
      console.log('Review data:', review);

      const response = await fetch(API_ENDPOINT.REVIEW, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      return responseData;
    } catch (error) {
      console.error('Detailed error in submitReview:', error);
      throw error;
    }
  }
}

export default RestaurantSource;
