import RecommendationService from '../services/recommendationService.js';

class RecommendationController {
  constructor() {
    this.recommendationService = new RecommendationService();
  }

  async getRecommendations(req, res) {
    const userId = req.auth?.userId;
    const recommendations = await this.recommendationService.getRecommendations(userId);
    res.status(200).json(recommendations);
  }
}

export default new RecommendationController();