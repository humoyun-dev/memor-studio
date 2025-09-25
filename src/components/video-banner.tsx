"use client";

import { type FC, useState, useCallback, useEffect } from "react";
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
  video: string;
}

interface VideoBannerProps {
  data: VideoBannerType;
}

const VideoBanner: FC<VideoBannerProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleReady = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setIsLoading(true);
        setHasError(false);
      }, 300);
    }
  }, []);

  return (
    <section className="relative w-full aspect-video overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <ReactPlayer
          src={data.video}
          playing
          muted
          loop
          width="100%"
          height="100%"
          controls={false}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover" }}
          onReady={handleReady}
          onError={handleError}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <button
              className="group cursor-pointer flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/80 hover:bg-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label={`Play ${data.title} video`}
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-black group-hover:scale-110 transition-transform duration-300" />
            </button>
          </DialogTrigger>

          <DialogContent
            showCloseButton={false}
            className="w-[95%] h-[95%] max-w-[95%] p-0 bg-black border-0"
          >
            <DialogTitle className="sr-only">{data.title}</DialogTitle>

            <div className="relative w-full h-full flex items-center justify-center">
              <DialogClose asChild>
                <Button
                  size={`icon`}
                  className={`size-8 sm:size-10 absolute top-2 right-2 sm:-top-5 sm:-right-12 z-50 rounded-full`}
                  variant={`secondary`}
                >
                  <XIcon className={`size-5 sm:size-7`} />
                </Button>
              </DialogClose>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-white" />
                </div>
              )}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-sm sm:text-base px-4 text-center">
                  <p>Failed to load video. Please try again.</p>
                </div>
              )}
              <ReactPlayer
                src={data.video}
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
        <h2 className="mt-4 sm:mt-6 text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold uppercase tracking-wide drop-shadow-lg px-2">
          {data.title}
        </h2>
      </div>
    </section>
  );
};

export default VideoBanner;
