import ChannelService from '../services/channelService.js';
import UserRepository from '../repositories/userRepository.js';

class ChannelController {
  constructor() {
    this.channelService = new ChannelService();
    this.userRepository = new UserRepository();
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
    const channel = await this.channelService.getById(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });
    res.status(200).json(channel);
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
