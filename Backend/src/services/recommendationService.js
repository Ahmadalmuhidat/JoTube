import RecommendationRepository from '../repositories/recommendationRepository.js';
import VideoService from './videoService.js';

export default class RecommendationService {
  constructor(videoService) {
    this.recommendationRepository = new RecommendationRepository();
    this.videoService = videoService;
  }

  async getRecommendations(userId, { cursor, limit = 12 } = {}) {
    // For now, if a cursor is present, we assume we are paging through the "Recent" or "Trending" videos
    // until we implement a more complex blending pagination system.
    if (cursor) {
      const videos = await this.recommendationRepository.getRecentVideos({ cursor, limit });
      return {
        ...videos,
        videos: await this.videoService._prepareMultiple(videos.videos)
      };
    }

    let KnowenUserRecommendations = [];
    const unknownFeed = await this._UnknownUserRecommendations({ limit });
    const UnKnowenUserRecommendations = unknownFeed.videos;

    if (userId) {
      KnowenUserRecommendations = await this._KnowenUserRecommendations(userId);
    }

    const allVideos = [...KnowenUserRecommendations, ...UnKnowenUserRecommendations];
    const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.id, v])).values());
    
    // Slice to the limit for the initial batch
    const initialBatch = uniqueVideos.slice(0, limit);
    const preparedBatch = await this.videoService._prepareMultiple(initialBatch);
    const nextCursor = preparedBatch.length > 0 ? preparedBatch[preparedBatch.length - 1].id : undefined;

    return { 
      videos: preparedBatch, 
      nextCursor: unknownFeed.nextCursor || nextCursor 
    };
  }

  async _KnowenUserRecommendations(userId) {
    const subscriptionVideos = await this.recommendationRepository.getVideosFromSubscriptions(userId);
    const relatedVideos = await this.recommendationRepository.getVideosFromLikedCategories(userId);
    return [...subscriptionVideos, ...relatedVideos];
  }

  async _UnknownUserRecommendations({ limit } = {}) {
    // Blend trending and recent for the unknown feed part
    return await this.recommendationRepository.getRecentVideos({ limit });
  }

  async suggestions(id) {
    const video = await this.videoService.getVideoById(id);
    if (!video) return [];

    const suggestions = await this.recommendationRepository.suggestions(video.id, video.channelId);
    return await this.videoService._prepareMultiple(suggestions);
  }
}
