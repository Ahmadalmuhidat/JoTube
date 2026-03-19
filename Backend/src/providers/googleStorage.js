import { Storage } from '@google-cloud/storage';

export default class GoogleStorage {
  constructor() {
    this.storage = new Storage();
  }

  async upload(file, name, bucket) {
    const bucket = this.storage.bucket(bucket);
    const file = bucket.file(name);
    await file.save(file.data, {
      metadata: {
        contentType: file.contentType,
      },
    });
    return file.publicUrl();
  }

  async delete(name, bucket) {
    const bucket = this.storage.bucket(bucket);
    const file = bucket.file(name);
    await file.delete();
  }
}