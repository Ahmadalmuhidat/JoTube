import prisma from '../database/prisma.js';

export default class CategoryRepository {
  async getAll() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            videos: true
          }
        }
      }
    });
  }

  async create(name) {
    return await prisma.category.create({
      data: { name }
    });
  }

  async delete(id) {
    return await prisma.category.delete({
      where: { id }
    });
  }

  async findByName(name) {
    return await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });
  }
}
