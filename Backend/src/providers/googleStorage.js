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

  async uploadLocalFile(localPath, destinationPath) {
    const [bucketName, ...prefixParts] = destinationPath.split('/');
    const bucket = this.storage.bucket(bucketName);
    const destination = prefixParts.join('/');
    
    await bucket.upload(localPath, {
      destination,
    });
    
    return `https://storage.googleapis.com/${bucketName}/${destination}`;
  }

  async uploadDirectory(sourceDir, destinationDir) {
    const fs = await import('fs');
    const path = await import('path');
    
    const [bucketName, ...prefixParts] = destinationDir.split('/');
    const bucket = this.storage.bucket(bucketName);
    const prefix = prefixParts.length > 0 ? prefixParts.join('/') + '/' : '';

    const files = fs.readdirSync(sourceDir);
    const uploadPromises = files.map(async (fileName) => {
      const localPath = path.join(sourceDir, fileName);
      if (fs.lstatSync(localPath).isDirectory()) {
         // Recursive upload if needed, but for HLS it's usually flat segments or nested v%v folders
         return this.uploadDirectory(localPath, destinationDir + '/' + fileName);
      }
      
      return bucket.upload(localPath, {
        destination: prefix + fileName,
      });
    });

    await Promise.all(uploadPromises);
    return `https://storage.googleapis.com/${bucketName}/${prefix}`;
  }

  async getSignedUrl(fullUrl, expiresIn = 3600) {
    if (!fullUrl) return null;
    
    // Extract bucket and destination from URL
    // Format: https://storage.googleapis.com/bucketName/prefix/fileName
    try {
      const urlMatch = fullUrl.match(/https:\/\/storage\.googleapis\.com\/([^\/]+)\/(.+)/);
      if (!urlMatch) return fullUrl; // Pass through if not a GCS URL

      const bucketName = urlMatch[1];
      const destination = decodeURIComponent(urlMatch[2]);
      
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(destination);

      const [signedUrl] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresIn * 1000, // expiresIn is in seconds
      });

      return signedUrl;
    } catch (error) {
      console.error("[Storage] Failed to generate signed URL:", error);
      return fullUrl; // Fallback to original URL
    }
  }

  async delete(fileName, bucketPath) {
    const [bucketName, ...prefixParts] = bucketPath.split('/');
    const prefix = prefixParts.length > 0 ? prefixParts.join('/') + '/' : '';
    
    const bucket = this.storage.bucket(bucketName);
    const file = bucket.file(prefix + fileName);
    
    try {
      await file.delete();
    } catch (error) {
      if (error.code === 404) {
        console.warn(`File not found in storage, skipping deletion: ${prefix + fileName}`);
      } else {
        throw error;
      }
    }
  }
}