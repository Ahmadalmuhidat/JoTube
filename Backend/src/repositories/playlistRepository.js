import prisma from '../database/prisma.js';

export default class PlaylistRepository {
  async getAll() {
    return await prisma.playlist.findMany();
  }

  async getById(id) {
    return await prisma.playlist.findUnique({ where: { id } });
  }

  async create(name, description) {
    return await prisma.playlist.create({ data: { name, description } });
  }

  async update(id, name, description) {
    return await prisma.playlist.update({ where: { id }, data: { name, description } });
  }

  async delete(id) {
    await prisma.playlist.delete({ where: { id } });
  }

  async addVideo(playlistId, videoId) {
    return await prisma.playlist.update({
      where: { id: playlistId },
      data: { videos: { connect: { id: videoId } } },
    });
  }

  async removeVideo(playlistId, videoId) {
    return await prisma.playlist.update({
      where: { id: playlistId },
      data: { videos: { disconnect: { id: videoId } } },
    });
  }
}