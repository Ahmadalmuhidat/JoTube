import { Storage } from '@google-cloud/storage';

export default class GoogleStorage {
  constructor() {
    this.storage = new Storage(
      {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      }
    );
  }

  async upload(fileObject, fileName, bucketPath) {
    const [bucketName, ...prefixParts] = bucketPath.split('/');
    const prefix = prefixParts.length > 0 ? prefixParts.join('/') + '/' : '';
    
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(prefix + Date.now() + '-' + fileName);
    
    await file.save(fileObject.buffer, {
      metadata: {
        contentType: fileObject.mimetype,
      },
    });

    return file.publicUrl();
  }

  async delete(fileName, bucketPath) {
    const [bucketName, ...prefixParts] = bucketPath.split('/');
    const prefix = prefixParts.length > 0 ? prefixParts.join('/') + '/' : '';
    
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(prefix + fileName);
    await file.delete();
  }
}