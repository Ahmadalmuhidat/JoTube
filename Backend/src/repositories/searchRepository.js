import prisma from '../database/prisma.js';

export default class SearchRepository {
  async searchVideos(query, categoryId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    return await prisma.video.findMany({
      where: {
        AND: [
          { isPublished: true },
          categoryId ? { categories: { some: { categoryId } } } : {},
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      include: {
        channel: true,
        _count: {
          select: {
            views: true,
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });
  }

  async searchChannels(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return await prisma.channel.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        _count: {
          select: {
            subscribers: true,
            videos: true
          }
        }
      },
      skip,
      take: limit
    });
  }
}
