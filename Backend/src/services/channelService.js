import ChannelRepository from '../repositories/channelRepository.js';

export default class ChannelService {
  constructor(storageStrategy) {
    this.channelRepository = new ChannelRepository();
    this.storageStrategy = storageStrategy;
  }

  async create(userId, name, description) {
    return await this.channelRepository.create(userId, name, description);
  }

  async update(userId, data, imageFile, bannerFile) {
    const channel = await this.getByUserId(userId);
    if (!channel) throw new Error('Channel not found');

    let imageUrl = channel.imageUrl;
    if (imageFile) {
      imageUrl = await this.storageStrategy.upload(
        imageFile,
        imageFile.originalname,
        'jotube/channels/avatars'
      );
    }

    let bannerUrl = channel.bannerUrl;
    if (bannerFile) {
      bannerUrl = await this.storageStrategy.upload(
        bannerFile,
        bannerFile.originalname,
        'jotube/channels/banners'
      );
    }

    return await this.channelRepository.update(channel.id, {
      ...data,
      imageUrl,
      bannerUrl
    });
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