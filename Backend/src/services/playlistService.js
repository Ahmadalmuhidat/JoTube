import PlaylistRepository from "../repositories/playlistRepository.js";

export default class PlaylistService {
  constructor() {
    this.playlistRepository = new PlaylistRepository();
  }

  async getAll() {
    return await this.playlistRepository.getAll();
  }

  async getById(id) {
    return await this.playlistRepository.getById(id);
  }

  async create(name, description) {
    return await this.playlistRepository.create(name, description);
  }

  async update(id, name, description) {
    return await this.playlistRepository.update(id, name, description);
  }

  async delete(id) {
    await this.playlistRepository.delete(id);
  }

  async addVideo(playlistId, videoId) {
    return await this.playlistRepository.addVideo(playlistId, videoId);
  }

  async removeVideo(playlistId, videoId) {
    return await this.playlistRepository.removeVideo(playlistId, videoId);
  }
}