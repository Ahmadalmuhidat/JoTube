import RecommendationRepository from '../repositories/recommendationRepository.js';
import VideoService from './videoService.js';

export default class RecommendationService {
  constructor() {
    this.recommendationRepository = new RecommendationRepository();
    this.videoService = new VideoService();
  }

  async getRecommendations(userId) {
    let KnowenUserRecommendations = [];
    const UnKnowenUserRecommendations = await this._UnknownUserRecommendations();

    if (userId) {
      KnowenUserRecommendations = await this._KnowenUserRecommendations(userId);
    }

    const allVideos = [...KnowenUserRecommendations, ...UnKnowenUserRecommendations];
    const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.id, v])).values());

    return uniqueVideos;
  }

  async _KnowenUserRecommendations(userId) {
    const subscriptionVideos = await this.recommendationRepository.getVideosFromSubscriptions(userId);
    const relatedVideos = await this.recommendationRepository.getVideosFromLikedCategories(userId);
    return [...subscriptionVideos, ...relatedVideos];
  }

  async _UnknownUserRecommendations() {
    const trendingVideos = await this.recommendationRepository.getTrendingVideos();
    const recentVideos = await this.recommendationRepository.getRecentVideos();
    return [...trendingVideos, ...recentVideos];
  }

  async suggestions(id) {
    const video = await this.videoService.getVideoById(id);
    if (!video) return [];

    return await this.recommendationRepository.suggestions(video.id, video.channelId);
  }
}
