import ChannelService from '../services/channelService.js';
import UserRepository from '../repositories/userRepository.js';

import StorageStrategy from '../providers/storageStrategy.js';
import GoogleStorage from '../providers/googleStorage.js';

class ChannelController {
  constructor() {
    const storageStrategy = new StorageStrategy();
    storageStrategy.setStorage(new GoogleStorage());

    this.channelService = new ChannelService(storageStrategy);
    this.userRepository = new UserRepository();
  }

  async update(req, res) {
    try {
      const clerkId = req.auth?.userId;
      const user = await this.userRepository.findByClerkId(clerkId);
      if (!user) return res.status(401).json({ error: 'User not found' });

      const imageFile = req.files?.image?.[0];
      const bannerFile = req.files?.banner?.[0];

      const channel = await this.channelService.update(user.id, req.body, imageFile, bannerFile);
      res.status(200).json(channel);
    } catch (error) {
      console.error("Error updating channel:", error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async create(req, res) {
    const clerkId = req.auth?.userId;
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    // Check if user already has a channel
    const existingChannel = await this.channelService.getByUserId(user.id);
    if (existingChannel) return res.status(400).json({ error: 'Channel already exists for this user' });

    const { name, description } = req.body;
    const channel = await this.channelService.create(user.id, name, description);
    res.status(201).json(channel);

  }

  async getMyChannel(req, res) {
    const clerkId = req.auth?.userId;
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const channel = await this.channelService.getByUserId(user.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    res.status(200).json(channel);
  }

  async getChannelById(req, res) {
    const user = await this._getUser(req);
    const channel = await this.channelService.getById(req.params.id, user?.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });
    res.status(200).json(channel);
  }

  async _getUser(req) {
    const clerkId = req.auth?.userId;
    if (!clerkId) return null;
    return await this.userRepository.findByClerkId(clerkId);
  }

  async subscribe(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      await this.channelService.subscribe(req.params.id, user.id);
      res.status(200).json({ message: "Subscribed successfully" });
    } catch (error) {
      console.error("Subscribe error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async unsubscribe(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      await this.channelService.unsubscribe(req.params.id, user.id);
      res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSubscribedChannels(req, res) {
    const clerkId = req.auth?.userId;
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const channels = await this.channelService.getSubscribedChannels(user.id);
    res.status(200).json(channels);
  }

  async getSubscriptionFeed(req, res) {
    const clerkId = req.auth?.userId;
    const user = await this.userRepository.findByClerkId(clerkId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const videos = await this.channelService.getSubscriptionFeed(user.id);
    res.status(200).json(videos);
  }
}

export default new ChannelController();
