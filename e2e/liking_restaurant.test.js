const assert = require('assert');

Feature('Liking Restaurants');

Scenario('should show empty favorite restaurants', async ({ I }) => {
  I.amOnPage('/#/favorite');

  I.waitForText('Anda belum memiliki restoran favorit.', 20);
  I.saveScreenshot('empty_favorite_page.png');

  I.see('Anda belum memiliki restoran favorit.');
});

Scenario('should be able to like a restaurant', async ({ I }) => {
  I.amOnPage('/');
  I.waitForElement('.restaurant-card', 20);
  
  const firstRestaurantName = await I.grabTextFrom('.restaurant-name');

  I.click('.restaurant-card');
  
  I.waitForElement('#likeButton', 20);
  I.click('#likeButton');
  I.saveScreenshot('restaurant_liked.png');

  I.amOnPage('/#/favorite');
  
  I.waitForElement('.restaurant-card', 20);
  const favoritedRestaurantName = await I.grabTextFrom('.restaurant-name');
  
  assert.strictEqual(
    favoritedRestaurantName, 
    firstRestaurantName, 
    'Liked restaurant name does not match'
  );
  I.saveScreenshot('favorite_page_verified.png');
});

Scenario('should be able to unlike a favorited restaurant', async ({ I }) => {
  I.amOnPage('/');
  I.waitForElement('.restaurant-card', 20);

  I.click('.restaurant-card');
  
  I.waitForElement('#likeButton', 20);
  I.click('#likeButton');

  I.click('#likedButton');
  I.saveScreenshot('restaurant_unliked.png');

  I.amOnPage('/#/favorite');
  
  I.waitForText('Anda belum memiliki restoran favorit.', 20);
  I.saveScreenshot('empty_favorite_page.png');
  I.see('Anda belum memiliki restoran favorit.');
});