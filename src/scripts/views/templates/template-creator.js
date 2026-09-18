import CONFIG from '../../globals/config';

const createRestaurantDetailTemplate = (restaurant) => `
  <h2 class="restaurant__title">${restaurant.name}</h2>
  <img class="restaurant__poster" src="${CONFIG.BASE_IMAGE_URL + restaurant.pictureId}" alt="${restaurant.name}" />
  <div class="restaurant__info">
    <h3>Informasi</h3>
    <h4>Alamat</h4>
    <p>${restaurant.address}</p>
    <h4>Kota</h4>
    <p>${restaurant.city}</p>
    <h4>Rating</h4>
    <p>⭐️ ${restaurant.rating}</p>
  </div>
  <div class="restaurant__description">
    <h3>Deskripsi</h3>
    <p>${restaurant.description}</p>
  </div>
  <div class="restaurant__menu">
    <h3>Menu</h3>
    <div class="restaurant__menu-foods">
      <h4>Makanan</h4>
      <ul>
        ${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}
      </ul>
    </div>
    <div class="restaurant__menu-drinks">
      <h4>Minuman</h4>
      <ul>
        ${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}
      </ul>
    </div>
  </div>
`;

const createRestaurantItemTemplate = (restaurant) => `
  <div class="restaurant-item">
    <div class="restaurant-item__header">
      <img class="restaurant-item__header__poster" alt="${restaurant.name}"
           src="${CONFIG.BASE_IMAGE_URL + restaurant.pictureId}">
      <div class="restaurant-item__header__rating">
        <p>⭐️<span class="restaurant-item__header__rating__score">${restaurant.rating}</span></p>
      </div>
    </div>
    <div class="restaurant-item__content">
      <h3><a href="/#/detail/${restaurant.id}">${restaurant.name}</a></h3>
      <p>${restaurant.city}</p>
      <p>${restaurant.description}</p>
    </div>
  </div>
`;

const createLikeButtonTemplate = () => `
  <button aria-label="like this restaurant" id="likeButton" class="like btn-fav-luxury btn-fav-capsule">
    <svg class="fav-heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="btn-fav-text">Tambah ke Favorit</span>
  </button>
`;

const createLikedButtonTemplate = () => `
  <button aria-label="unlike this restaurant" id="likedButton" class="like btn-fav-luxury btn-fav-capsule active btn-fav-capsule--active">
    <svg class="fav-heart-icon" width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span class="btn-fav-text">Tersimpan di Favorit</span>
  </button>
`;

const createReviewTemplate = (review) => `
  <div class="review-item">
    <h4>${review.name}</h4>
    <p>${review.review}</p>
    <small>${review.date}</small>
  </div>
`;

export {
  createRestaurantItemTemplate,
  createRestaurantDetailTemplate,
  createLikeButtonTemplate,
  createLikedButtonTemplate,
  createReviewTemplate,
};