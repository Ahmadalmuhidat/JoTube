import VideoRepository from '../repositories/videoRepository.js';
import UserRepository from '../repositories/userRepository.js';

export default class VideoController {
  constructor(storageStrategy) {
    this.videoRepository = new VideoRepository();
    this.userRepository = new UserRepository();
    this.mediaStorage = storageStrategy;
  }

  async feed(req, res) {
    try {
      const videos = await this.videoRepository.feed(req.params.categoryId);
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const clerkId = req.auth?.userId;
      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await this.userRepository.findByClerkId(clerkId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let videoUrl = req.body.videoUrl;
      let thumbnailUrl = req.body.thumbnailUrl;

      if (req.files) {
        if (req.files.video) {
          videoUrl = await this.mediaStorage.upload(
            req.files.video[0],
            req.files.video[0].name,
            'joutube/videos'
          );
        }
        if (req.files.thumbnail) {
          thumbnailUrl = await this.mediaStorage.upload(
            req.files.thumbnail[0],
            req.files.thumbnail[0].name,
            'joutube/thumbnails'
          );
        }
      }

      const newVideo = await this.videoRepository.create({
        ...req.body,
        videoUrl,
        thumbnailUrl,
        authorId: user.id, // Use DB user ID
      });

      res.status(201).json(newVideo);
    } catch (error) {
      console.error("Controller error creating video:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const video = await this.videoRepository.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      await this.mediaStorage.delete(
        video.videoUrl.split('/').pop(),
        'joutube/videos'
      );
      await this.mediaStorage.delete(
        video.thumbnailUrl.split('/').pop(),
        'joutube/thumbnails'
      );
      await this.videoRepository.delete(video.id);
      res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}