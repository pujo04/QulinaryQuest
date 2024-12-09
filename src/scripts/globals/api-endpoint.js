const API_ENDPOINT = {
  RESTAURANTS: 'https://restaurant-api.dicoding.dev/list',
  DETAIL: (id) => `https://restaurant-api.dicoding.dev/detail/${id}`,
  IMAGE: 'https://restaurant-api.dicoding.dev/images/medium/',
  REVIEW: 'https://restaurant-api.dicoding.dev/review',
};

export default API_ENDPOINT;