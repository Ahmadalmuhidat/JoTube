import CategoryRepository from "../repositories/categoryRepository.js";

export default class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAll() {
    return await this.categoryRepository.getAll();
  }

  async create(name) {
    return await this.categoryRepository.create(name);
  }

  async delete(id) {
    await this.categoryRepository.delete(id);
  }

  async findByName(name) {
    return await this.categoryRepository.findByName(name);
  }
}