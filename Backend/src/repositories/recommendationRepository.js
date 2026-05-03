import prisma from '../database/prisma.js';

class RecommendationRepository {
  async getVideosFromSubscriptions(userId) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      select: { channelId: true }
    });
    const channelIds = subscriptions.map(s => s.channelId);

    if (channelIds.length > 0) {
      return await prisma.video.findMany({
        where: {
          channelId: { in: channelIds },
          visibility: 'PUBLIC',
          NOT: {
            views: {
              some: { userId }
            }
          }
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          channel: {
            include: {
              user: true
            }
          }
        }
      });
    }

    return [];
  }

  async getVideosFromLikedCategories(userId) {
    const likedVideos = await prisma.like.findMany({
      where: { userId },
      include: {
        video: {
          include: {
            categories: true
          }
        }
      }
    });
    const likedCategoryIds = likedVideos.flatMap(l => l.video.categories.map(c => c.id));
    if (likedCategoryIds.length > 0) {
      return await prisma.video.findMany({
        where: {
          visibility: 'PUBLIC',
          categories: {
            some: {
              id: { in: likedCategoryIds }
            }
          },
          NOT: {
            views: {
              some: { userId }
            }
          }
        },
        take: 10,
        include: {
          channel: {
            include: {
              user: true
            }
          }
        }
      });
    }
    return [];
  }

  async getTrendingVideos({ cursor, limit = 12 } = {}) {
    const videosData = await prisma.video.findMany({
      where: { visibility: 'PUBLIC' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [
        { views: { _count: 'desc' } },
        { id: 'asc' }
      ],
      include: {
        channel: {
          include: {
            user: true
          }
        }
      }
    });

    let nextCursor = undefined;
    if (videosData.length > limit) {
      const nextItem = videosData.pop();
      nextCursor = nextItem.id;
    }

    return { videos: videosData, nextCursor };
  }

  async getRecentVideos({ cursor, limit = 12 } = {}) {
    const videosData = await prisma.video.findMany({
      where: { visibility: 'PUBLIC' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ],
      include: {
        channel: {
          include: {
            user: true
          }
        }
      }
    });

    let nextCursor = undefined;
    if (videosData.length > limit) {
      const nextItem = videosData.pop();
      nextCursor = nextItem.id;
    }

    return { videos: videosData, nextCursor };
  }

  async suggestions(videoId, channelId) {
    const suggestions = await prisma.video.findMany({
      where: {
        channelId: channelId,
        id: { not: videoId },
        visibility: 'PUBLIC'
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        channel: {
          include: {
            user: true
          }
        }
      }
    });

    return suggestions;
  }
}

export default RecommendationRepository;
