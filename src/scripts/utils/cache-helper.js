import CONFIG from '../globals/config';

const CacheHelper = {
  async cachingAppShell(requests) {
    const cache = await this._openCache();
    await Promise.all(requests.map((request) => cache.add(request)));
  },

  async deleteOldCache() {
    const cacheNames = await caches.keys();
    const cacheNameToKeep = CONFIG.CACHE_NAME || 'QulinaryQuest-V1';

    await Promise.all(
      cacheNames
        .filter((name) => name !== cacheNameToKeep)
        .map((filteredName) => caches.delete(filteredName))
    );
  },

  async revalidateCache(request) {
    const cacheResponse = await caches.match(request);

    if (cacheResponse) {
      this._fetchAndUpdateCache(request);
      return cacheResponse;
    }

    return this._fetchRequest(request);
  },

  async _openCache() {
    return caches.open(CONFIG.CACHE_NAME || 'QulinaryQuest-V1');
  },

  async _fetchAndUpdateCache(request) {
    try {
      const response = await fetch(request);

      if (response && response.status === 200) {
        const cache = await this._openCache();
        cache.put(request, response.clone());
      }
    } catch (error) {
      console.error('Fetch update failed:', error);
    }
  },

  async _fetchRequest(request) {
    try {
      const response = await fetch(request);

      if (response && response.status === 200) {
        await this._addCache(request);
      }

      return response;
    } catch (error) {
      console.error('Fetch request failed:', error);
      return new Response(null, { status: 404 });
    }
  },

  async _addCache(request) {
    const cache = await this._openCache();
    cache.add(request);
  },
};

export default CacheHelper;