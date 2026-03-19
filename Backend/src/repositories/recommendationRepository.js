import prisma from '../database/prisma.js';

class RecommendationRepository {
  async getRecommendations(userId) {
    let subscriptionVideos = [];
    let relatedVideos = [];

    if (userId) {
      // 1. Get videos from channels the user is subscribed to
      const subscriptions = await prisma.subscription.findMany({
        where: { userId },
        select: { channelId: true }
      });
      const channelIds = subscriptions.map(s => s.channelId);

      if (channelIds.length > 0) {
        subscriptionVideos = await prisma.video.findMany({
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
            channel: true
          }
        });
      }

      // 2. Get videos from categories the user likes
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
        relatedVideos = await prisma.video.findMany({
          where: {
            categories: {
              some: {
                categoryId: { in: likedCategoryIds }
              }
            },
            NOT: {
              OR: [
                { views: { some: { userId } } },
                { id: { in: likedVideos.map(l => l.videoId) } }
              ]
            }
          },
          take: 10,
          include: {
            channel: true
          }
        });
      }
    }

    // 3. Get trending videos (most views total)
    const trendingVideos = await prisma.video.findMany({
      take: 10,
      orderBy: {
        views: {
          _count: 'desc'
        }
      },
      include: {
        channel: true
      }
    });

    // 4. Get recently added videos
    const recentVideos = await prisma.video.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        channel: true
      }
    });

    // Combine and remove duplicates
    const allVideos = [...subscriptionVideos, ...relatedVideos, ...trendingVideos, ...recentVideos];
    const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.id, v])).values());

    return uniqueVideos;
  }
}

export default RecommendationRepository;
