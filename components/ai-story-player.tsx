"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  speaker?: string;
}

export interface AIStoryPlayerProps {
  title: string;
  audioUrl?: string;
  duration: number; // in seconds
  transcriptSegments: TranscriptSegment[];
  onDownload?: () => void;
  className?: string;
  aiGenerated?: boolean;
}

export function AIStoryPlayer({
  title,
  audioUrl,
  duration,
  transcriptSegments,
  onDownload,
  className = "",
  aiGenerated = true,
}: AIStoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  // Generate waveform data (simulated)
  const waveformBars = 60;
  const waveformData = Array.from({ length: waveformBars }, () =>
    Math.random() * 0.5 + 0.3
  );

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get current transcript segment
  const currentSegment = transcriptSegments.find(
    (segment) => currentTime >= segment.startTime && currentTime < segment.endTime
  );

  // Auto-scroll transcript
  useEffect(() => {
    if (currentSegment && transcriptRef.current) {
      const segmentElement = document.getElementById(
        `segment-${currentSegment.id}`
      );
      if (segmentElement) {
        segmentElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentSegment]);

  // Simulate audio playback (replace with actual audio element logic)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1;
          if (newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(percent * duration);
  };

  const progress = (currentTime / duration) * 100;

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Hidden audio element for future implementation */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} muted={isMuted} />
      )}

      {/* Header */}
      <div className="p-6 pb-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <div className="flex items-center gap-2">
              {aiGenerated && (
                <Badge variant="secondary" className="text-xs">
                  AI Generated
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="px-6 py-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div
          className="flex items-end justify-between gap-0.5 h-24 cursor-pointer"
          onClick={handleProgressClick}
        >
          {waveformData.map((height, index) => {
            const barProgress = (index / waveformBars) * 100;
            const isActive = barProgress <= progress;

            return (
              <motion.div
                key={index}
                className={`flex-1 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${height * 100}%` }}
                transition={{
                  delay: index * 0.01,
                  duration: 0.3,
                }}
                whileHover={{ height: `${Math.min(height * 1.2, 1) * 100}%` }}
              />
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div
            className="relative h-1 bg-muted rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 bg-muted/30">
        <div className="flex items-center justify-between">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSkipBack}
              className="h-9 w-9"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handlePlayPause}
              className="h-12 w-12"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSkipForward}
              className="h-9 w-9"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="h-9 w-9"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTranscript(!showTranscript)}
              className="h-9 w-9"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Transcript */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Transcript</h4>
                <Badge variant="outline" className="text-xs">
                  Auto-synced
                </Badge>
              </div>
              <div
                ref={transcriptRef}
                className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin"
              >
                {transcriptSegments.map((segment) => {
                  const isActive = segment.id === currentSegment?.id;

                  return (
                    <motion.div
                      key={segment.id}
                      id={`segment-${segment.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary/10 border-l-4 border-primary"
                          : "bg-muted/50 hover:bg-muted border-l-4 border-transparent"
                      }`}
                      onClick={() => setCurrentTime(segment.startTime)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs text-muted-foreground font-mono min-w-[3rem]">
                          {formatTime(segment.startTime)}
                        </span>
                        <div className="flex-1">
                          {segment.speaker && (
                            <span className="text-xs font-semibold text-primary mb-1 block">
                              {segment.speaker}
                            </span>
                          )}
                          <p
                            className={`text-sm ${
                              isActive
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {segment.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default AIStoryPlayer;
