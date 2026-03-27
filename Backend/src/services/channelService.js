import ChannelRepository from '../repositories/channelRepository.js';
import prisma from '../database/prisma.js';

export default class ChannelService {
  constructor(storageStrategy) {
    this.channelRepository = new ChannelRepository();
    this.storageStrategy = storageStrategy;
  }

  async create(userId, name, description) {
    return await this.channelRepository.create(userId, name, description);
  }

  async update(userId, data, imageFile, bannerFile) {
    let channel = await this.getByUserId(userId);
    
    // If channel doesn't exist, create a default one first
    if (!channel) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      channel = await this.channelRepository.create(userId, data.name || user?.name || "My Channel", data.description || "");
    }

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

  async getById(id, userId = null) {
    return await this.channelRepository.getById(id, userId);
  }

  async subscribe(channelId, userId) {
    return await this.channelRepository.subscribe(channelId, userId);
  }

  async unsubscribe(channelId, userId) {
    return await this.channelRepository.unsubscribe(channelId, userId);
  }

  async getSubscribedChannels(userId) {
    return await this.channelRepository.getSubscribedChannels(userId);
  }

  async getSubscriptionFeed(userId) {
    return await this.channelRepository.getSubscriptionFeed(userId);
  }
}