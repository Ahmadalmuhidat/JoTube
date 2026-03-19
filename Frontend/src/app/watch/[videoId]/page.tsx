import { WatchView } from "@/modules/watch/ui/sections/watch-view";

interface WatchPageProps {
    params: Promise<{
        videoId: string;
    }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { videoId } = await params;
  
  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950/20 relative z-0">
        <WatchView videoId={videoId} />
    </div>
  );
}
