import StudioRepository from '../repositories/studioRepository.js';
import UserRepository from '../repositories/userRepository.js';

export default class StudioController {
  constructor() {
    this.studioRepository = new StudioRepository();
    this.userRepository = new UserRepository();
  }

  async _getUser(req) {
    const clerkId = req.auth?.userId;
    if (!clerkId) return null;
    return await this.userRepository.findByClerkId(clerkId);
  }

  async getStats(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const stats = await this.studioRepository.getChannelStats(user.id);
      if (!stats) return res.status(404).json({ message: "Channel not found" });

      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching studio stats:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getVideos(req, res) {
    try {
      const user = await this._getUser(req);
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const videos = await this.studioRepository.getRecentVideos(user.id);
      res.status(200).json(videos);
    } catch (error) {
      console.error('Error fetching studio videos:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
