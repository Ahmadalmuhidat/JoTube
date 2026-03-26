import prisma from '../database/prisma.js';
import Video from '../entities/video.js';

export default class VideoRepository {
  async search(query) {
    const videosData = await prisma.video.findMany({
      where: query ? {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { channel: { name: { contains: query } } }
        ]
      } : {},
      include: {
        channel: {
          include: {
            user: true
          }
        }
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
        isPublished: body.isPublished === 'true' || body.isPublished === true,
        channelId: body.channelId,
        categories: {
          create: (Array.isArray(body.categoryIds) ? body.categoryIds : (body.categoryIds ? [body.categoryIds] : [])).map(categoryId => ({
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

  async findById(id, userId = null) {
    const videoData = await prisma.video.findUnique({
      where: {
        id: id,
      },
      include: {
        channel: {
          include: {
            user: true
          }
        },
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    if (!videoData) return null;

    let isLiked = false;
    let isDisliked = false;
    let isSubscribed = false;

    if (userId) {
      const [like, dislike, subscription] = await Promise.all([
        prisma.like.findUnique({
          where: { userId_videoId: { userId, videoId: id } }
        }),
        prisma.dislike.findUnique({
          where: { userId_videoId: { userId, videoId: id } }
        }),
        prisma.subscription.findUnique({
          where: { userId_channelId: { userId, channelId: videoData.channelId } }
        })
      ]);

      isLiked = !!like;
      isDisliked = !!dislike;
      isSubscribed = !!subscription;
    }

    return new Video({
      ...videoData,
      isLiked,
      isDisliked,
      isSubscribed
    });
  }

  async view(videoId, userId) {
    await prisma.$transaction(async (tx) => {
      if (userId) {
        const existingView = await tx.view.findUnique({
          where: { userId_videoId: { userId, videoId } }
        });

        await tx.view.upsert({
          where: { userId_videoId: { userId, videoId } },
          update: { createdAt: new Date() },
          create: { videoId, userId }
        });

        if (!existingView) {
          await tx.video.update({
            where: { id: videoId },
            data: { viewCount: { increment: 1 } }
          });
        }
      } else {
        await tx.video.update({
          where: { id: videoId },
          data: { viewCount: { increment: 1 } }
        });
      }
    });
    return true;
  }

  async getHistory(userId) {
    const views = await prisma.view.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        video: {
          include: {
            channel: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
    
    return views.map(view => new Video({
      ...view.video,
      viewedAt: view.createdAt
    }));
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

        let removedDislike = false;
        if (existingDislike) {
          // Remove dislike if it existed
          await tx.dislike.delete({ where: { id: existingDislike.id } });
          await tx.video.update({ where: { id: videoId }, data: { dislikeCount: { decrement: 1 } } });
          removedDislike = true;
        }
        return { action: 'liked', removedDislike };
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

        let removedLike = false;
        if (existingLike) {
          // Remove like if it existed
          await tx.like.delete({ where: { id: existingLike.id } });
          await tx.video.update({ where: { id: videoId }, data: { likeCount: { decrement: 1 } } });
          removedLike = true;
        }
        return { action: 'disliked', removedLike };
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
      data: { videoId, userId, content },
      include: {
        user: true
      }
    });
  }

  async deleteComment(id) {
    return await prisma.comment.delete({
      where: { id }
    });
  }
}