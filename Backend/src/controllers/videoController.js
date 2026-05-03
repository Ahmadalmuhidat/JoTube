import VideoService from '../services/videoService.js';
import UserRepository from '../repositories/userRepository.js';
import StorageStrategy from '../providers/storageStrategy.js';
import GoogleStorage from '../providers/googleStorage.js';
import ChannelService from '../services/channelService.js';
import RecommendationService from '../services/recommendationService.js';

export default class VideoController {
  constructor() {
    // Initialize dependencies
    const storageStrategy = new StorageStrategy();
    storageStrategy.setStorage(new GoogleStorage());

    // Initialize services
    this.videoService = new VideoService(storageStrategy);
    this.channelService = new ChannelService();
    this.userRepository = new UserRepository();
    this.recommendationService = new RecommendationService(this.videoService);
  }

  async feed(req, res) {
    const user = await this._getUser(req);
    const { cursor, limit } = req.query;
    const result = await this.recommendationService.getRecommendations(user?.id, {
      cursor,
      limit: limit ? parseInt(limit) : 12
    });
    res.status(200).json(result);
  }

  async search(req, res) {
    const { cursor, limit, sortBy } = req.query;
    const result = await this.videoService.search(req.params.query, {
      cursor,
      limit: limit ? parseInt(limit) : 12,
      sortBy: sortBy || 'latest'
    });
    res.status(200).json(result);
  }

  async history(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const videos = await this.videoService.getHistory(user.id);
    res.status(200).json({ videos });
  }

  async getWatchLater(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const videos = await this.videoService.getWatchLater(user.id);
    res.status(200).json({ videos });
  }

  async toggleWatchLater(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const result = await this.videoService.toggleWatchLater(req.params.id, user.id);
    res.status(200).json(result);
  }

  async suggestions(req, res) {
    const videos = await this.recommendationService.suggestions(req.params.id);
    res.status(200).json(videos);
  }

  async getById(req, res) {
    try {
      const user = await this._getUser(req);
      const video = await this.videoService.getVideoById(req.params.id, user?.id);
      if (!video) return res.status(404).json({ message: "Video not found" });
      res.status(200).json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async _getUser(req) {
    const clerkId = req.auth?.userId;
    if (!clerkId) return null;
    return await this.userRepository.findByClerkId(clerkId);
  }

  async upload(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const result = await this.videoService.uploadFiles(req.files);
    res.status(200).json(result);
  }

  async create(req, res) {
    const user = await this._getUser(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const channel = await this.channelService.getByUserId(user.id);
    if (!channel) return res.status(400).json({ message: "You must create a channel to upload videos." });

    req.body.channelId = channel.id;

    const newVideo = await this.videoService.createVideo(req.body, req.files);
    res.status(201).json(newVideo);
  }

  async delete(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const videoId = req.params.id;
      const video = await this.videoService.getVideoById(videoId);
      if (!video) return res.status(404).json({ message: "Video not found" });

      // Ownership check
      const channel = await this.channelService.getByUserId(user.id);
      if (!channel || channel.id !== video.channelId) {
        return res.status(403).json({ message: "Forbidden: You don't own this video" });
      }

      await this.videoService.deleteVideo(videoId);
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const videoId = req.params.id;
      const updatedVideo = await this.videoService.updateVideo(videoId, user.id, req.body, req.files);
      res.status(200).json(updatedVideo);
    } catch (error) {
      console.error("Error updating video:", error);
      if (error.message === 'Unauthorized') return res.status(403).json({ message: error.message });
      if (error.message === 'Video not found') return res.status(404).json({ message: error.message });
      res.status(500).json({ message: "Internal server error" });
    }
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

  async deleteComment(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const commentId = req.params.id;
      // We should ideally verify that the user own the comment.
      // For now, we'll just delete it.
      await this.videoService.deleteComment(commentId, user.id);
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getLikedVideos(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const videos = await this.videoService.getLikedVideos(user.id);
      res.status(200).json({ videos });
    } catch (error) {
      console.error("Error fetching liked videos:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}