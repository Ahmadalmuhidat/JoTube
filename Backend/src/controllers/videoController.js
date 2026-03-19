import VideoService from '../services/videoService.js';
import UserRepository from '../repositories/userRepository.js';
import StorageStrategy from '../providers/storageStrategy.js';
import GoogleStorage from '../providers/googleStorage.js';

export default class VideoController {
  constructor() {
    // Initialize dependencies
    const storageStrategy = new StorageStrategy();
    storageStrategy.setStorage(new GoogleStorage());

    // Initialize services
    this.videoService = new VideoService(storageStrategy);
    this.userRepository = new UserRepository();
  }

  async feed(req, res) {
    const videos = await this.videoService.getFeed(req.params.categoryId);
    res.status(200).json(videos);
  }

  async _getUser(req) {
     const clerkId = req.auth?.userId;
     if (!clerkId) return null;
     return await this.userRepository.findByClerkId(clerkId);
  }

  async create(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const newVideo = await this.videoService.createVideo(req.body, req.files, user.id);
    res.status(201).json(newVideo);
  }

  async delete(req, res) {
    const result = await this.videoService.deleteVideo(req.params.id);
    res.status(200).json({ message: 'Video deleted successfully' });
  }

  async view(req, res) {
    const user = await this._getUser(req);
    const videoId = req.body.videoId;
    if (!videoId) return res.status(400).json({ error: 'videoId is required' });

    await this.videoService.viewVideo(videoId, user?.id);
    res.status(200).json({ message: 'Video viewed successfully' });
  }

  async like(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const videoId = req.body.videoId;
    const result = await this.videoService.toggleLike(videoId, user.id);
    res.status(200).json(result);
  }

  async dislike(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const videoId = req.body.videoId;
    const result = await this.videoService.toggleDislike(videoId, user.id);
    res.status(200).json(result);
  }

  async subscribe(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const videoId = req.body.videoId;
    await this.videoService.subscribe(videoId, user.id);
    res.status(200).json({ message: 'Subscribed successfully' });
  }

  async unsubscribe(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const videoId = req.body.videoId;
    await this.videoService.unsubscribe(videoId, user.id);
    res.status(200).json({ message: 'Unsubscribed successfully' });
  }

  async comment(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { videoId, content } = req.body;
    const comment = await this.videoService.addComment(videoId, user.id, content);
    res.status(200).json({ message: 'Comment added successfully', comment });
  }
}