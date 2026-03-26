import prisma from '../database/prisma.js';

export default class StudioRepository {
  async getChannelStats(userId) {
    const channel = await prisma.channel.findFirst({
      where: { userId },
      include: {
        _count: {
          select: {
            subscribers: true,
            videos: true
          }
        },
        videos: {
          select: {
            viewCount: true
          }
        }
      }
    });

    if (!channel) return null;

    const totalViews = channel.videos.reduce((acc, video) => acc + video.viewCount, 0);

    return {
      subscribers: channel._count.subscribers,
      videos: channel._count.videos,
      views: totalViews,
      watchTime: (totalViews * 0.1).toFixed(1) // Placeholder estimation
    };
  }

  async getRecentVideos(userId, limit = 5) {
    const channel = await prisma.channel.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!channel) return [];

    return await prisma.video.findMany({
      where: { channelId: channel.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
            dislikes: true
          }
        }
      }
    });
  }
}
