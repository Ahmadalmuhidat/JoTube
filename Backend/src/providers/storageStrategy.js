/**
 * @interface StorageProvider
 * upload(file, name, bucket): Promise<string>
 * delete(name, bucket): Promise<void>
 */

export default class StorageStrategy {
  constructor() {
    this.storage = null;
  }

  setStorage(storage) {
    this.storage = storage;
  }

  async upload(file, name, bucket) {
    if (!this.storage) {
      throw new Error('Storage provider not initialized');
    }

    return await this.storage.upload(file, name, bucket);
  }

  async delete(name, bucket) {
    if (!this.storage) {
      throw new Error('Storage provider not initialized');
    }

    return await this.storage.delete(name, bucket);
  }
}