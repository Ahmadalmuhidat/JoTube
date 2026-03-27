import CategoryService from '../services/categoryService.js';

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  async getAll(req, res) {
    const categories = await this.categoryService.getAll();
    res.status(200).json(categories);

  }

  async create(req, res) {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const existing = await this.categoryService.findByName(name);
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    const category = await this.categoryService.create(name);
    res.status(201).json(category);

  }

  async delete(req, res) {
    await this.categoryService.delete(req.params.id);
    res.status(204).send();

  }
}

export default new CategoryController();
