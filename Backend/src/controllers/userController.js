import UserService from "../services/userService.js";

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getUsers() {
    return await this.userService.getUsers();
  }

  async handleClerkWebhook(req, res) {
    return await this.userService.handleClerkWebhook(req, res);;
  }
}