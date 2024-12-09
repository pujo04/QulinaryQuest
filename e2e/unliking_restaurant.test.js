const { I } = inject();

Feature('Unliking Restaurants');

Scenario('should be able to unlike a previously liked restaurant', async ({ I }) => {
  I.amOnPage('/');
  I.waitForElement('.restaurant-card', 20);
  I.saveScreenshot('home_page_before_unlike.png');
  const firstRestaurantName = await I.grabTextFrom('.restaurant-name');
  I.click('.restaurant-card');

  I.waitForElement('#favoriteButtonContainer', 20);
  
  I.saveScreenshot('restaurant_detail_page_before_like.png');
  
  I.click('#likeButton');
  
  I.saveScreenshot('like_restaurant_button_clicked.png');
  
  I.amOnPage('/#/favorite');
  I.waitForElement('.restaurant-card', 20);
  
  I.saveScreenshot('favorite_page_after_like.png');
  
  I.click('.restaurant-card');
  
  I.saveScreenshot('restaurant_detail_page_before_unlike.png');
  
  I.waitForElement('#likedButton', 20);
  I.click('#likedButton');
  
  I.saveScreenshot('unlike_restaurant_button_clicked.png');
  
  I.amOnPage('/#/favorite');
  
  I.saveScreenshot('favorite_page_after_unlike.png');
  
  I.waitForText('Anda belum memiliki restoran favorit.', 20);
  I.see('Anda belum memiliki restoran favorit.');
});