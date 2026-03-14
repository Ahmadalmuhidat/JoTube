interface VideoIdProps {
  params: {
    videoId: string;
  };
}

export default async function VideoId({ params }: VideoIdProps) {
  const { videoId } = await params;

  return (
    <div>
      <p className="text-xl font-semibold tracking-tight">
        JoTube Video {videoId}
      </p>
    </div>
  );
}