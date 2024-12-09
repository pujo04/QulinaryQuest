module.exports = function() {
  return actor({
    // Custom steps bisa ditambahkan di sini
    async navigateToRestaurantDetail(index = 0) {
      // Navigasi ke detail restoran berdasarkan index
      this.amOnPage('/');
      this.waitForElement('.restaurant-item', 10);
      this.click(`.restaurant-item:nth-child(${index + 1}) a`);
      this.waitForElement('.restaurant-detail', 10);
    },

    async addToFavorite() {
      // Tambahkan restoran ke favorit
      this.waitForElement('#likeButton', 10);
      this.click('#likeButton');
    },

    async removeFromFavorite() {
      // Hapus restoran dari favorit
      this.waitForElement('#likedButton', 10);
      this.click('#likedButton');
    }
  });
};