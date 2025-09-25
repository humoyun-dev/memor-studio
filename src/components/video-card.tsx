"use client";

import { type FC, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Play, Loader2, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-900">
      <Loader2 className="w-8 h-8 animate-spin text-white" />
    </div>
  ),
});

export interface VideoBannerType {
  id: number;
  title: string;
  video_url: string;
}

interface VideoCardProps {
  data: VideoBannerType;
}

const VideoCard: FC<VideoCardProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleReady = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  };

  return (
    <div className="relative w-full aspect-video overflow-hidden">
      <ReactPlayer
        src={data.video_url}
        muted
        loop
        width="100%"
        height="100%"
        controls={false}
        className="absolute inset-0"
        style={{ objectFit: "cover" }}
        onReady={handleReady}
        onError={handleError}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <button
              className="group flex items-center justify-center w-16 h-16 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all"
              aria-label={`Play ${data.title} video`}
            >
              <Play className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            </button>
          </DialogTrigger>

          <DialogContent className="min-w-[95%] h-[95%] p-0 bg-black border-0">
            <DialogTitle className="sr-only">{data.title}</DialogTitle>

            <div className="relative w-full h-full">
              {/* Close Button */}
              <DialogClose asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 size-10 rounded-full z-50"
                >
                  <XIcon className="size-7" />
                </Button>
              </DialogClose>

              {/* Loading/Error states */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                  <p>Failed to load video. Please try again.</p>
                </div>
              )}

              {/* Main Player */}
              <ReactPlayer
                src={data.video_url}
                playing={open}
                controls
                width="100%"
                height="100%"
                onReady={handleReady}
                onError={handleError}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Title */}
        <h2 className="mt-6 text-white text-xl md:text-2xl lg:text-3xl font-semibold uppercase tracking-wide drop-shadow-lg">
          {data.title}
        </h2>
      </div>
    </div>
  );
};

export default VideoCard;
