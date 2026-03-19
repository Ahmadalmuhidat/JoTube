import VideoRepository from '../repositories/videoRepository.js';

export default class VideoService {
  constructor(storageStrategy) {
    this.videoRepository = new VideoRepository();
    this.storageStrategy = storageStrategy;
  }

  async getFeed(categoryId) {
    return await this.videoRepository.feed(categoryId);
  }

  async createVideo(data, files, authorId) {
    let videoUrl = data.videoUrl;
    let thumbnailUrl = data.thumbnailUrl;

    if (files) {
      if (files.video) {
        videoUrl = await this.storageStrategy.upload(
          files.video[0],
          files.video[0].name,
          'joutube/videos'
        );
      }
      if (files.thumbnail) {
        thumbnailUrl = await this.storageStrategy.upload(
          files.thumbnail[0],
          files.thumbnail[0].name,
          'joutube/thumbnails'
        );
      }
    }

    return await this.videoRepository.create({
      ...data,
      videoUrl,
      thumbnailUrl,
      channelId: data.channelId,
    });
  }

  async deleteVideo(id) {
    const video = await this.videoRepository.findById(id);
    if (!video) throw new Error('Video not found');

    if (video.videoUrl) {
      await this.storageStrategy.delete(video.videoUrl.split('/').pop(), 'joutube/videos');
    }
    if (video.thumbnailUrl) {
      await this.storageStrategy.delete(video.thumbnailUrl.split('/').pop(), 'joutube/thumbnails');
    }

    return await this.videoRepository.delete(id);
  }

  async viewVideo(videoId, userId) {
    return await this.videoRepository.view(videoId, userId);
  }

  async toggleLike(videoId, userId) {
    return await this.videoRepository.toggleLike(videoId, userId);
  }

  async toggleDislike(videoId, userId) {
    return await this.videoRepository.toggleDislike(videoId, userId);
  }
  
  async addComment(videoId, userId, content) {
    return await this.videoRepository.comment(videoId, userId, content);
  }

  async subscribe(videoId, userId) {
    const video = await this.videoRepository.findById(videoId);
    if (!video) throw new Error('Video not found');
    return await this.videoRepository.subscribe(video.channelId, userId);
  }

  async unsubscribe(videoId, userId) {
    const video = await this.videoRepository.findById(videoId);
    if (!video) throw new Error('Video not found');
    return await this.videoRepository.unsubscribe(video.channelId, userId);
  }
}
