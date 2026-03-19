import SearchService from '../services/searchService.js';

class SearchController {
  constructor() {
    this.searchService = new SearchService();
  }

  async search(req, res) {
    const { q, categoryId, page, limit, type } = req.query;
    const query = q || '';

    if (type === 'channel') {
      const channels = await this.searchService.searchChannels(
        query,
        parseInt(page) || 1,
        parseInt(limit) || 10
      );
      return res.status(200).json(channels);
    } else {
      const videos = await this.searchService.searchVideos(
        query,
        categoryId,
        parseInt(page) || 1,
        parseInt(limit) || 20
      );
      return res.status(200).json(videos);
    }
  }
}

export default new SearchController();
