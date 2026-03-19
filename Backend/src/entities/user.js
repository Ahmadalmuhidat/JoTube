export default class User {
  constructor({ id, clerkId, name, image, createdAt, updatedAt }) {
    this.id = id;
    this.clerkId = clerkId;
    this.name = name;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Domain logic can go here (e.g., validation, business rules)
  updateName(newName) {
    if (!newName || newName.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    this.name = newName;
  }
}
