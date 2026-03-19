import ChannelRepository from '../repositories/channelRepository.js';

export default class ChannelService {
  constructor() {
    this.channelRepository = new ChannelRepository();
  }

  async create(userId, name, description) {
    return await this.channelRepository.create(userId, name, description);
  }

  async getByUserId(userId) {
    return await this.channelRepository.getByUserId(userId);
  }

  async getById(id) {
    return await this.channelRepository.getById(id);
  }

  async getSubscribedChannels(userId) {
    return await this.channelRepository.getSubscribedChannels(userId);
  }

  async getSubscriptionFeed(userId) {
    return await this.channelRepository.getSubscriptionFeed(userId);
  }
}