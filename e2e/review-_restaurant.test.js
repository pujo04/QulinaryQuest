Feature('Restaurant Review Submission');

Before(async ({ I }) => {
  I.amOnPage('/#/detail/s1knt6za9kkfw1e867');
  I.wait(2);
});

Scenario('Should handle empty review submission', async ({ I }) => {
  I.waitForElement('.restaurant-name', 30);
  I.saveScreenshot('review_form_before_submit.png');

  I.executeScript(() => {
    document.querySelector('#reviewer-name').removeAttribute('required');
    document.querySelector('#review-text').removeAttribute('required');
  });

  I.click('.submit-review-btn');
  I.saveScreenshot('empty_review_error.png');
  I.see('Nama dan ulasan tidak boleh kosong');
});

Scenario('Should prevent submission with only name', async ({ I }) => {
  I.waitForElement('.restaurant-name', 30);
  I.waitForElement('#review-form', 30);
  
  const uniqueName = `User_${Date.now()}`;
  I.fillField('#reviewer-name', uniqueName);

  I.executeScript(() => {
    document.querySelector('#review-text').removeAttribute('required');
  });

  I.click('.submit-review-btn');
  I.saveScreenshot('partial_review_error.png');
  I.see('Nama dan ulasan tidak boleh kosong');
});

Scenario('Should submit a valid review successfully', async ({ I }) => {
  I.waitForElement('.restaurant-name', 30);
  I.waitForElement('#review-form', 30);
  
  const uniqueName = `TestUser_${Date.now()}`;
  const uniqueReview = `Excellent experience at ${new Date().toLocaleString()}`;
  
  I.fillField('#reviewer-name', uniqueName);
  I.fillField('#review-text', uniqueReview);
  I.click('.submit-review-btn');
  I.saveScreenshot('valid_review_submission.png');
  I.see('Ulasan berhasil ditambahkan!');
  I.see(uniqueName);
  I.see(uniqueReview);
});