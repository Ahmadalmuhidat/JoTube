import { ChannelView } from "@/modules/channels/ui/sections/channel-view";

interface ChannelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { id } = await params;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950/20 relative z-0">
      <ChannelView channelId={id} />
    </div>
  );
}
