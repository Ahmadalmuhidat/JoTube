import { prisma } from "../config/database.js";

export default class PlaylistRepository {
  constructor() {
    this.prisma = prisma;
  }

  async getAll() {
    return await this.prisma.playlist.findMany();
  }

  async getById(id) {
    return await this.prisma.playlist.findUnique({ where: { id } });
  }

  async create(name, description) {
    return await this.prisma.playlist.create({ data: { name, description } });
  }

  async update(id, name, description) {
    return await this.prisma.playlist.update({ where: { id }, data: { name, description } });
  }

  async delete(id) {
    await this.prisma.playlist.delete({ where: { id } });
  }

  async addVideo(playlistId, videoId) {
    return await this.prisma.playlist.update({
      where: { id: playlistId },
      data: { videos: { connect: { id: videoId } } },
    });
  }

  async removeVideo(playlistId, videoId) {
    return await this.prisma.playlist.update({
      where: { id: playlistId },
      data: { videos: { disconnect: { id: videoId } } },
    });
  }
}