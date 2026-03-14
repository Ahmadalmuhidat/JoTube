import UserService from '../../../domain/services/userService.js';

export default class UserController {
  constructor() {
    this.userService = new UserService();

    this.getUsers = this.getUsers.bind(this);
    this.handleClerkWebhook = this.handleClerkWebhook.bind(this);
  }

  async getUsers(req, res) {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleClerkWebhook(req, res) {
    try {
      const result = await this.userService.handleClerkWebhook(req, res);
      res.json({ success: result });
    } catch (error) {
      console.error("Error handling webhook event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}