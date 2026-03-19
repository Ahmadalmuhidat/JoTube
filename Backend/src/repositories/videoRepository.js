import prisma from '../database/prisma.js';
import Video from '../entities/video.js';

export default class VideoRepository {
  async feed(categoryId) {
    const videosData = await prisma.video.findMany({
      where: {
        categories: {
          some: { categoryId }
        }
      }
    });
    return videosData.map(videoData => new Video(videoData));
  }

  async create(body) {
    try {
      const videoData = await prisma.video.create({
        data: {
          title: body.title,
          description: body.description,
          videoUrl: body.videoUrl,
          thumbnailUrl: body.thumbnailUrl,
          views: body.views || 0,
          duration: body.duration || 0,
          isPublished: body.isPublished ?? false,
          authorId: body.authorId,
          categories: {
            create: body.categoryIds?.map(categoryId => ({
              category: {
                connect: { id: categoryId }
              }
            })) || []
          }
        },
        include: {
          categories: true
        }
      });
      return new Video(videoData);
    } catch (error) {
      console.error("Database error creating video:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await prisma.video.delete({
        where: {
          id: id,
        }
      });
      return true;
    } catch (error) {
      console.error("Error deleting video:", error);
      return false;
    }
  }
}