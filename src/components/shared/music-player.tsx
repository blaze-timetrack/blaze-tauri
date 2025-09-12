import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Disc3, Pause, Play } from "lucide-react";
import YouTube from "react-youtube";
import { useSettingStore } from "@/lib/zustand/setting-store.ts";
// @todo fail to properly render music ( glitch sound )
import { availableMusic } from "@/lib/constants/settings-const.tsx";

const MusicPlayer = () => {
  const [time, setTime] = useState(120); // 2 minutes in seconds
  const currentMusic = useSettingStore((state) => state.currentMusic);
  const setCurrentMusic = useSettingStore((state) => state.setCurrentMusic);
  const volume = useSettingStore((state) => state.volume);
  const setVolume = useSettingStore((state) => state.setVolume);
  const isPlaying = useSettingStore((state) => state.isPlaying);
  const setIsPlaying = useSettingStore((state) => state.setIsPlaying);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const adjustTime = (amount: number) => {
    setTime((prev) => Math.max(0, Math.min(3600, prev + amount)));
  };

  useEffect(() => {
    if (currentMusic.value == "silent") {
      setIsPlaying(false);
    }
    // searchMusic().then((v) => {
    //   if (v === "jfKfPfyJRdk") {
    //     console.log("same video ID true");
    //   }
    //   console.log("v:", v);
    //   setVideoId("jfKfPfyJRdk");
    //   console.log("setting videoId", "jfKfPfyJRdk");
    // });
  }, [currentMusic, isPlaying]);

  const opts = {
    height: "0", // Hide video
    width: "0",
    playerVars: {
      loop: 1,
      playlist: currentMusic.value,
      autoplay: 1,
      controls: 0,
    },
  };

  return (
    <div className="flex max-w-xl items-center justify-between gap-2">
      <div className="flex items-center">
        <Disc3
          className={`h-8 w-8 text-purple-400 ${isPlaying ? "animate-spin" : ""}`}
        />
        <div className="flex flex-col">
          {/*<div className="font-mono text-2xl tracking-wider text-white">*/}
          {/*  {formatTime(time)}*/}
          {/*</div>*/}
          {/*<div className="mt-1 flex gap-2">*/}
          {/*  <Button*/}
          {/*    variant="ghost"*/}
          {/*    size="sm"*/}
          {/*    onClick={() => adjustTime(-60)}*/}
          {/*    className="h-6 px-2 text-gray-400 hover:bg-white/10 hover:text-white"*/}
          {/*  >*/}
          {/*    <Minus className="h-4 w-4" />*/}
          {/*  </Button>*/}
          {/*  <Button*/}
          {/*    variant="ghost"*/}
          {/*    size="sm"*/}
          {/*    onClick={() => adjustTime(60)}*/}
          {/*    className="h-6 px-2 text-gray-400 hover:bg-white/10 hover:text-white"*/}
          {/*  >*/}
          {/*    <Plus className="h-4 w-4" />*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      </div>

      <div className="flex items-center">
        {/*        <audio src={"/music/BHUVI - HALDIGHA*/}
        {/*TI RAP 3.mp3"} autoPlay={false}>*/}
        {/*          localmusic*/}
        {/*        </audio>*/}

        {availableMusic.map((v, i) => {
          if (v.value === "silent") return;
          return (
            <span key={i}>
              {v.value === currentMusic.value && isPlaying && (
                <YouTube videoId={currentMusic.value} opts={opts} />
              )}
            </span>
          );
        })}

        <Select
          value={currentMusic.value}
          onValueChange={(v) => {
            const musicObject = {
              name: availableMusic[
                availableMusic.findIndex((value) => value.value === v)
              ].name,
              value: v,
            };
            setCurrentMusic(musicObject);
            if (v === "silent") {
              setIsPlaying(false);
              return;
            }
            setIsPlaying(true);
          }}
        >
          <SelectTrigger className="w-[180px] border-gray-800 bg-black/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableMusic.map((v, i) => (
              <SelectItem key={i} value={v.value}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="ml-2 h-12 w-12 rounded-full bg-purple-400 text-white hover:bg-purple-500"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="ml-1 h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MusicPlayer;
