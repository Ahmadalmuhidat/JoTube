import UserRepository from "../repositories/userRepository.js";
import { Webhook } from "svix";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return await this.userRepository.getUsers();
  }

  async handleClerkWebhook(req, res) {
      const WEBHOOK_SECRET = process.env.CLERK_SIGNING_SECRET;
      if (!WEBHOOK_SECRET) {
        return res.status(500).json({ error: 'Missing CLERK_SIGNING_SECRET' });
      }

      const payload = JSON.stringify(req.body);
      const headers = req.headers;
      const webhook = new Webhook(WEBHOOK_SECRET);
      let event;

      event = webhook.verify(payload, {
        "svix-id": headers["svix-id"],
        "svix-timestamp": headers["svix-timestamp"],
        "svix-signature": headers["svix-signature"],
      });

      const { id, first_name, last_name, image_url } = event.data;
      const eventType = event.type;
      const name = `${first_name ?? ''} ${last_name ?? ''}`.trim();

      await this.userRepository.syncUser({
        clerkId: id,
        name,
        image: image_url,
        eventType
      });

      return true;
  }
}