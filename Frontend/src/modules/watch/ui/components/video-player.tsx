"use client";

export const VideoPlayer = () => {
  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group border border-slate-800">
      <iframe
        src="https://www.youtube.com/embed/ig26iRcMavQ?autoplay=0&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
};
