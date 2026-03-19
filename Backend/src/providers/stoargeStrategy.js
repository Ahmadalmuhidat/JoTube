export default class StoregeStrategy {
  constructor() {
    this.storage = null;
  }

  setStorage(storage) {
    this.storage = storage;
  }

  upload(file, name, bucket) {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }

    return this.storage.upload(file, name, bucket);
  }

  delete(name, bucket) {
    if (!this.storage) {
      throw new Error('Storage not initialized');
    }

    return this.storage.delete(name, bucket);
  }
}