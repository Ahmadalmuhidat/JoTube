import RecommendationRepository from '../repositories/recommendationRepository.js';

export default class RecommendationService {
  constructor() {
    this.recommendationRepository = new RecommendationRepository();
  }

  async getRecommendations(userId) {
    return await this.recommendationRepository.getRecommendations(userId);
  }
}
