class Video {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.videoUrl = data.videoUrl;
    this.thumbnailUrl = data.thumbnailUrl;
    this.viewCount = data.viewCount || 0;
    this.likeCount = data.likeCount || 0;
    this.dislikeCount = data.dislikeCount || 0;
    this.duration = data.duration || 0;
    this.isPublished = data.isPublished;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.channelId = data.channelId;
    this.channel = data.channel;
    this.categories = data.categories;
    this.comments = data.comments;

    // Interaction status for the current user
    this.isLiked = data.isLiked || false;
    this.isDisliked = data.isDisliked || false;
    this.isSubscribed = data.isSubscribed || false;
    this.viewedAt = data.viewedAt;
  }
}

export default Video;