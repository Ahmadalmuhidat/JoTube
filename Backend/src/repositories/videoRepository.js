import prisma from '../database/prisma.js';
import Video from '../entities/video.js';

export default class VideoRepository {
  async feed(categoryId) {
    const videosData = await prisma.video.findMany({
      where: categoryId ? {
        categories: {
          some: { categoryId }
        }
      } : {},
      include: {
        channel: true
      }
    });
    return videosData.map(videoData => new Video(videoData));
  }

  async create(body) {
    const videoData = await prisma.video.create({
      data: {
        title: body.title,
        description: body.description,
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl,
        viewCount: body.viewCount || 0,
        likeCount: 0,
        dislikeCount: 0,
        duration: body.duration || 0,
        isPublished: body.isPublished ?? false,
        channelId: body.channelId,
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
  }

  async delete(id) {
    await prisma.video.delete({
      where: {
        id: id,
      }
    });
    return true;

  }

  async findById(id) {
    const videoData = await prisma.video.findUnique({
      where: {
        id: id,
      },
      include: {
        channel: true
      }
    });
    if (!videoData) return null;
    return new Video(videoData);
  }

  async view(videoId, userId) {
    await prisma.$transaction(async (tx) => {
      const view = await tx.view.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (!view) {
        await tx.view.create({
          data: { videoId, userId }
        });
        await tx.video.update({
          where: { id: videoId },
          data: { viewCount: { increment: 1 } }
        });
      }
    });
    return true;
  }

  async toggleLike(videoId, userId) {
    return await prisma.$transaction(async (tx) => {
      const existingLike = await tx.like.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });
      const existingDislike = await tx.dislike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingLike) {
        // Remove like
        await tx.like.delete({ where: { id: existingLike.id } });
        await tx.video.update({ where: { id: videoId }, data: { likeCount: { decrement: 1 } } });
        return { action: 'removed_like' };
      } else {
        // Add like
        await tx.like.create({ data: { videoId, userId } });
        await tx.video.update({ where: { id: videoId }, data: { likeCount: { increment: 1 } } });

        if (existingDislike) {
          // Remove dislike if it existed
          await tx.dislike.delete({ where: { id: existingDislike.id } });
          await tx.video.update({ where: { id: videoId }, data: { dislikeCount: { decrement: 1 } } });
        }
        return { action: 'liked' };
      }
    });
  }

  async toggleDislike(videoId, userId) {
    return await prisma.$transaction(async (tx) => {
      const existingLike = await tx.like.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });
      const existingDislike = await tx.dislike.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existingDislike) {
        // Remove dislike
        await tx.dislike.delete({ where: { id: existingDislike.id } });
        await tx.video.update({ where: { id: videoId }, data: { dislikeCount: { decrement: 1 } } });
        return { action: 'removed_dislike' };
      } else {
        // Add dislike
        await tx.dislike.create({ data: { videoId, userId } });
        await tx.video.update({ where: { id: videoId }, data: { dislikeCount: { increment: 1 } } });

        if (existingLike) {
          // Remove like if it existed
          await tx.like.delete({ where: { id: existingLike.id } });
          await tx.video.update({ where: { id: videoId }, data: { likeCount: { decrement: 1 } } });
        }
        return { action: 'disliked' };
      }
    });
  }

  async subscribe(channelId, userId) {
    await prisma.subscription.upsert({
      where: { userId_channelId: { userId, channelId } },
      update: {},
      create: { channelId, userId }
    });
    return true;
  }

  async unsubscribe(channelId, userId) {
    await prisma.subscription.delete({
      where: { userId_channelId: { userId, channelId } }
    });
    return true;
  }

  async comment(videoId, userId, content) {
    return await prisma.comment.create({
      data: { videoId, userId, content }
    });
  }
}