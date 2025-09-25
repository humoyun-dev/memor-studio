"use client";

import React from "react";
import ReactPlayer from "react-player";

interface YouTubePlayerProps {
  url: string;
  autoplay?: boolean;
  controls?: boolean;
}

const YoutubePlayer: React.FC<YouTubePlayerProps> = ({
  url,
  autoplay = false,
  controls = true,
}) => {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
      <ReactPlayer
        src={url}
        playing={autoplay}
        controls={controls}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default YoutubePlayer;
