/**
 * description-helper.js
 * Helper untuk memetakan deskripsi ringkas (short excerpt) dan narasi detail
 * yang realistis, estetik, dan menggugah selera dalam Bahasa Indonesia.
 */

// Peta deskripsi ringkas kurasi spesifik untuk restoran populer pada API
const CURATED_SHORT_DESCRIPTIONS = {
  'Melting Pot': 'Eksplorasi cita rasa autentik Nusantara berpadu kehangatan rempah khas Medan dalam atmosfer modern.',
  'Kafe Kita': 'Ruang temu santai bernuansa hangat dengan racikan kopi istimewa dan kudapan lokal pilihan.',
  'Bring Your Phone Cafe': 'Spot bersantai estetik yang memadukan sajian artisan pastry lezat dengan suasana produktif nan nyaman.',
  'Kafein': 'Menyajikan seduhan kopi legendaris khas Tanah Rencong dengan profil rasa pekat yang khas dan memikat.',
  'Makan mudah': 'Pilihan bersantap praktis nan menggugah selera dengan ragam menu nusantara kaya rasa.',
  'Fairy Cafe': 'Nuansa kafe memikat dengan pilihan minuman manis segar dan hidangan penutup yang memanjakan lidah.',
  'Gigitan Cepat': 'Sajian lezat berkualitas tinggi yang mengutamakan kesegaran bahan dan kenikmatan rasa tropis.',
  'Pangsit Express': 'Kelezatan pangsit lembut isi daging gurih berpadu kaldu hangat kaya rempah yang memikat.',
  'Duta Rasa': 'Koleksi hidangan tradisional pilihan nusantara dengan cita rasa legendaris turun-temurun.',
  'Run The Day': 'Kafe berenergi positif untuk memulai hari dengan sajian sarapan lezat dan artisan espresso.',
};

/**
 * Mengecek apakah teks berupa dummy Latin (Lorem Ipsum / Quisque rutrum).
 * @param {string} text
 * @returns {boolean}
 */
const isDummyText = (text) => {
  if (!text || typeof text !== 'string') return true;
  const cleaned = text.trim();
  if (cleaned.length < 25) return true;
  return /lorem\s+ipsum/i.test(cleaned) ||
         /quisque\s+rutrum/i.test(cleaned) ||
         /curabitur/i.test(cleaned) ||
         /nam\s+eget/i.test(cleaned) ||
         /aenean\s+imperdiet/i.test(cleaned) ||
         /sed\s+consequat/i.test(cleaned);
};

/**
 * Menghasilkan deskripsi ringkas (excerpt) 12-16 kata dalam Bahasa Indonesia
 * untuk kartu katalog restoran di Homepage & Favorite.
 * @param {Object} restaurant
 * @returns {string}
 */
const getShortDescription = (restaurant) => {
  if (!restaurant) return '';

  const name = (restaurant.name || '').trim();
  const city = (restaurant.city || 'kota').trim();

  // 1. Cek apakah ada mapping spesifik kurasi
  if (CURATED_SHORT_DESCRIPTIONS[name]) {
    return CURATED_SHORT_DESCRIPTIONS[name];
  }

  // 2. Jika deskripsi asli bukan dummy dan memiliki panjang wajar, gunakan cuplikan aslinya
  const rawDesc = (restaurant.description || '').trim();
  if (!isDummyText(rawDesc) && rawDesc.length >= 25) {
    // Ambil kalimat pertama atau potong 100 karakter
    const firstSentence = rawDesc.split('.')[0];
    if (firstSentence && firstSentence.length > 20) {
      return `${firstSentence}.`;
    }
    return rawDesc;
  }

  // 3. Dynamic generator berbasis nama & kota
  const isCoffeeOrCafe = /cafe|coffee|kopi|kafe|bistro|bar|roastery/i.test(name);

  if (isCoffeeOrCafe) {
    return `Kafe bernuansa hangat di ${city} dengan racikan kopi pilihan dan kudapan lezat untuk momen santai.`;
  }

  return `Destinasi kuliner istimewa di ${city} yang menyajikan harmoni cita rasa autentik dan kehangatan bersantap.`;
};

/**
 * Menghasilkan deskripsi narasi panjang estetik untuk halaman Detail.
 * @param {Object} restaurant
 * @returns {string}
 */
const getDetailedDescription = (restaurant) => {
  if (!restaurant) return '';

  const rawDesc = (restaurant.description || '').trim();
  if (!isDummyText(rawDesc) && rawDesc.length >= 35) {
    return rawDesc;
  }

  const name = (restaurant.name || 'Restoran ini').trim();
  const city = (restaurant.city || 'kota tercinta').trim();
  const categories = restaurant.categories && restaurant.categories.length > 0
    ? restaurant.categories.map((c) => {
        const lower = (c.name || '').toLowerCase().trim();
        if (lower === 'bali') return 'Masakan Khas Bali';
        if (lower === 'jawa') return 'Masakan Jawa';
        if (lower === 'sunda') return 'Masakan Sunda';
        if (lower === 'italia') return 'Masakan Italia';
        if (lower === 'spanyol') return 'Masakan Spanyol';
        if (lower === 'sop') return 'Aneka Sop';
        if (lower === 'modern') return 'Modern';
        return c.name;
      }).join(', ')
    : 'Kuliner Istimewa';

  const isCafe = /cafe|coffee|kopi|kafe|bistro|bar/i.test(categories) || /cafe|kopi|kafe/i.test(name);

  if (isCafe) {
    return `Diciptakan sebagai tempat pelarian yang hangat dan bersahabat di ${city}, ${name} menghadirkan ruang yang nyaman untuk bersantai, berbincang santai, maupun menyelesaikan pekerjaan. Setiap cangkir kopi diseduh dengan presisi menggunakan biji pilihan berkualitas, berpadu serasi dengan pilihan hidangan artisanal yang dipersiapkan segar setiap hari. Dibalut suasana ${categories} yang menenangkan dan atmosfer yang akrab, ${name} siap menyempurnakan setiap momen berharga Anda.`;
  }

  return `Berakar dari kecintaan mendalam terhadap cita rasa autentik dan tradisi kuliner di ${city}, ${name} menghadirkan perpaduan harmonis antara warisan resep lokal dan sentuhan gastronomi kontemporer. Diolah menggunakan bahan-bahan segar musiman pilihan langsung dari produsen lokal terbaik, setiap sajian kami rangkai untuk merayakan kehangatan momen kebersamaan Anda dalam balutan atmosfer yang tenang, elegan, dan berkelas.`;
};

export {
  isDummyText,
  getShortDescription,
  getDetailedDescription,
};
