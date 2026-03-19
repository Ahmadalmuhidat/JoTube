import PlaylistService from "../services/playlistService.js";

export default class PlaylistController {
  constructor() {
    this.playlistService = new PlaylistService();
  }

  async getAll(req, res) {
    const playlists = await this.playlistService.getAll();
    res.status(200).json(playlists);
  }

  async getById(req, res) {
    const playlist = await this.playlistService.getById(req.params.id);
    res.status(200).json(playlist);
  }

  async create(req, res) {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const playlist = await this.playlistService.create(name, description);
    res.status(201).json(playlist);
  }

  async update(req, res) {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const playlist = await this.playlistService.update(req.params.id, name, description);
    res.status(200).json(playlist);
  }

  async delete(req, res) {
    await this.playlistService.delete(req.params.id);
    res.status(204).send();
  }

  async addVideo(req, res) {
    const { playlistId, videoId } = req.body;
    if (!playlistId || !videoId) return res.status(400).json({ error: 'Playlist ID and video ID are required' });

    const playlist = await this.playlistService.addVideo(playlistId, videoId);
    res.status(200).json(playlist);
  }

  async removeVideo(req, res) {
    const { playlistId, videoId } = req.body;
    if (!playlistId || !videoId) return res.status(400).json({ error: 'Playlist ID and video ID are required' });

    const playlist = await this.playlistService.removeVideo(playlistId, videoId);
    res.status(200).json(playlist);
  }
}