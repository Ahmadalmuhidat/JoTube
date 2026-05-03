"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";

import axios from "@/config/axios";
import { useAuth } from "@clerk/nextjs";

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  videoId: string;
}

export const VideoPlayer = ({ 
  videoUrl, 
  thumbnailUrl, 
  videoId 
}: VideoPlayerProps) => {
  const { getToken } = useAuth();
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const viewVideo = async () => {
    if (!videoId) return;

    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.post(`/videos/view`, { videoId }, { headers });
    } catch (error) {
      console.error("Failed to record view:", error);
    }
  };

  useEffect(() => {
    // We need to make sure the video element is available
    if (!videoRef.current) return;

    const sourceUrl = videoUrl;

    if (!sourceUrl) return;

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-custom-theme");
    videoRef.current.appendChild(videoElement);

    const player = playerRef.current = videojs(videoElement, {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      poster: thumbnailUrl,
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        children: [
            "playToggle",
            "volumePanel",
            "currentTimeDisplay",
            "timeDivider",
            "durationDisplay",
            "progressControl",
            "playbackRateMenuButton",
            "subsCapsButton",
            "audioTrackButton",
            "fullscreenToggle",
        ],
      },
      sources: [{
        src: sourceUrl,
        type: 'video/mp4'
      }]
    }, () => {
    });

    player.on('play', viewVideo);

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, thumbnailUrl, videoId]);

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group border border-slate-800">

      
      <div data-vjs-player ref={videoRef} className="w-full h-full" />

      <style jsx global>{`
        .vjs-custom-theme.video-js {
          background-color: transparent;
          font-family: inherit;
        }
        .vjs-custom-theme .vjs-control-bar {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%) !important;
          height: 4.5em;
          display: flex;
          align-items: center;
          padding: 0 10px;
        }
        
        /* YouTube-like Progress Bar */
        .vjs-custom-theme .vjs-progress-control {
          position: absolute;
          width: calc(100% - 20px);
          top: -1em;
          height: 1.5em;
          left: 10px;
        }
        .vjs-custom-theme .vjs-play-progress {
          background-color: #ef4444;
        }
        .vjs-custom-theme .vjs-play-progress:before {
            display: none;
        }
        .vjs-custom-theme .vjs-load-progress {
            background-color: rgba(255,255,255,0.2) !important;
        }
        .vjs-custom-theme .vjs-slider {
          background-color: rgba(255,255,255,0.1);
          height: 4px;
          transition: height 0.1s;
        }
        .vjs-custom-theme .vjs-progress-control:hover .vjs-slider {
            height: 6px;
        }



        .vjs-custom-theme .vjs-big-play-button {
          background-color: rgba(239, 68, 68, 0.95);
          border: none;
          height: 1.5em;
          width: 1.5em;
          line-height: 1.5em;
          border-radius: 50%;
          transition: all 0.3s;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
        }
        .vjs-custom-theme:hover .vjs-big-play-button {
          background-color: #ef4444;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};
