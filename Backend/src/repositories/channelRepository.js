import prisma from '../database/prisma.js';

export default class ChannelRepository {
  async getById(id) {
    return await prisma.channel.findUnique({
      where: { id },
      include: {
        user: true,
        videos: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          include: { channel: true }
        },
        _count: {
          select: {
            subscribers: true,
            videos: true
          }
        }
      }
    });
  }

  async getByUserId(userId) {
    return await prisma.channel.findFirst({
      where: { userId },
      include: {
        _count: {
          select: {
            subscribers: true,
            videos: true
          }
        }
      }
    });
  }

  async create(userId, name, description) {
    return await prisma.channel.create({
      data: {
        userId,
        name,
        description
      }
    });
  }

  async update(id, data) {
    return await prisma.channel.update({
      where: { id },
      data
    });
  }

  async getSubscribedChannels(userId) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      include: {
        channel: {
          include: {
            _count: {
              select: {
                subscribers: true
              }
            }
          }
        }
      }
    });
    return subscriptions.map(s => s.channel);
  }

  async getSubscriptionFeed(userId) {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      select: { channelId: true }
    });
    const channelIds = subscriptions.map(s => s.channelId);

    return await prisma.video.findMany({
      where: {
        channelId: { in: channelIds },
        isPublished: true
      },
      include: {
        channel: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
