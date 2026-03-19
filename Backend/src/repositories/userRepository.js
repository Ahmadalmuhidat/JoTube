import prisma from '../database/prisma.js';
import User from '../entities/user.js';

export default class UserRepository {
  async findByClerkId(clerkId) {
    const userData = await prisma.user.findUnique({
      where: { clerkId },
    });
    return userData ? new User(userData) : null;
  }

  async findAll() {
    const usersData = await prisma.user.findMany();
    return usersData.map(userData => new User(userData));
  }

  async save(user) {
    const userData = await prisma.user.upsert({
      where: { clerkId: user.clerkId },
      update: {
        name: user.name,
        image: user.image,
      },
      create: {
        clerkId: user.clerkId,
        name: user.name,
        image: user.image,
      },
    });
    return new User(userData);
  }

  async findById(videoId) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });
    return video;
  }

  async delete(clerkId) {
    await prisma.user.delete({
      where: { clerkId },
    });
  }
}
