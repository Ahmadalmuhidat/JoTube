import UserRepository from "../repositories/userRepository.js";
import { Webhook } from "svix";

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return await this.userRepository.findAll();
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

    try {
      event = webhook.verify(payload, {
        "svix-id": headers["svix-id"],
        "svix-timestamp": headers["svix-timestamp"],
        "svix-signature": headers["svix-signature"],
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return res.status(400).json({ error: "Error verifying webhook" });
    }

    const { id } = event.data;
    const eventType = event.type;

    try {
      const { first_name, last_name, image_url } = event.data || {};
      const name = `${first_name ?? ''} ${last_name ?? ''}`.trim();

      await this.userRepository.syncUser({
        clerkId: id,
        name,
        image: image_url,
        eventType
      });

      return true;
    } catch (error) {
      console.error("Error handling webhook event:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}