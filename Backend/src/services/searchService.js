import VideoRepository from "../repositories/videoRepository.js";
import ChannelRepository from "../repositories/channelRepository.js";

export default class SearchService {
  constructor() {
    this.videoRepository = new VideoRepository();
    this.channelRepository = new ChannelRepository();
  }

  async searchVideos(query, categoryId, page, limit) {
    return await this.videoRepository.search(query, categoryId, page, limit);
  }

  async searchChannels(query, page, limit) {
    return await this.channelRepository.search(query, page, limit);
  }
}