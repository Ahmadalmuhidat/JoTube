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
    const likedCategoryIds = likedVideos.flatMap(l => l.video.categories.map(c => c.categoryId));
    if (likedCategoryIds.length > 0) {
      return await prisma.video.findMany({
        where: {
          categories: {
            some: {
              categoryId: { in: likedCategoryIds }
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

  async getTrendingVideos() {
    return await prisma.video.findMany({
      take: 10,
      orderBy: {
        views: {
          _count: 'desc'
        }
      },
      include: {
        channel: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async getRecentVideos() {
    return await prisma.video.findMany({
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

  async suggestions(videoId, channelId) {
    const suggestions = await prisma.video.findMany({
      where: {
        channelId: channelId,
        id: { not: videoId },
        isPublished: true
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
