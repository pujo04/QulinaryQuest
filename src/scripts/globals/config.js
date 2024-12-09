const CONFIG = {
  DATABASE_NAME: 'restaurant-catalog-database',
  DATABASE_VERSION: 1,
  OBJECT_STORE_NAME: 'restaurants',
  BASE_URL: 'https://restaurant-api.dicoding.dev/',
  BASE_IMAGE_URL: 'https://restaurant-api.dicoding.dev/images/medium/<pictureId>',
  REVIEW: 'https://restaurant-api.dicoding.dev/review',
  CACHE_NAME: new Date().toISOString(),
};

export default CONFIG;