class Video {
  constructor(id, title, description, videoUrl, thumbnailUrl, views, duration, isPublished, createdAt, updatedAt, authorId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.videoUrl = videoUrl;
    this.thumbnailUrl = thumbnailUrl;
    this.views = views;
    this.duration = duration;
    this.isPublished = isPublished;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.authorId = authorId;
  }
}

export default Video;