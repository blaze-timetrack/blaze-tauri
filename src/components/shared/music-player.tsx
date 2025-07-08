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
import { searchMusic } from "@/components/music/music.tsx";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(120); // 2 minutes in seconds
  const [genre, setGenre] = useState("lo-fi");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const adjustTime = (amount: number) => {
    setTime((prev) => Math.max(0, Math.min(3600, prev + amount)));
  };

  useEffect(() => {
    searchMusic().then();
  }, []);

  return (
    <div className="flex max-w-xl items-center justify-between gap-2">
      <div className="flex items-center">
        <Disc3
          className={`h-8 w-8 text-purple-400 ${isPlaying ? "animate-spin" : ""}`}
        />
        {/*<div className="flex flex-col">*/}
        {/*  /!*<div className="font-mono text-2xl tracking-wider text-white">*!/*/}
        {/*  /!*  {formatTime(time)}*!/*/}
        {/*  /!*</div>*!/*/}
        {/*  /!*<div className="mt-1 flex gap-2">*!/*/}
        {/*  /!*  <Button*!/*/}
        {/*  /!*    variant="ghost"*!/*/}
        {/*  /!*    size="sm"*!/*/}
        {/*  /!*    onClick={() => adjustTime(-60)}*!/*/}
        {/*  /!*    className="h-6 px-2 text-gray-400 hover:bg-white/10 hover:text-white"*!/*/}
        {/*  /!*  >*!/*/}
        {/*  /!*    <Minus className="h-4 w-4" />*!/*/}
        {/*  /!*  </Button>*!/*/}
        {/*  /!*  <Button*!/*/}
        {/*  /!*    variant="ghost"*!/*/}
        {/*  /!*    size="sm"*!/*/}
        {/*  /!*    onClick={() => adjustTime(60)}*!/*/}
        {/*  /!*    className="h-6 px-2 text-gray-400 hover:bg-white/10 hover:text-white"*!/*/}
        {/*  /!*  >*!/*/}
        {/*  /!*    <Plus className="h-4 w-4" />*!/*/}
        {/*  /!*  </Button>*!/*/}
        {/*  /!*</div>*!/*/}
        {/*</div>*/}
      </div>

      <div className="flex items-center gap-4">
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-[180px] border-gray-800 bg-black/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lo-fi">Lo-fi Hip Hop</SelectItem>
            <SelectItem value="ambient">Ambient</SelectItem>
            <SelectItem value="classical">Classical</SelectItem>
            <SelectItem value="jazz">Jazz</SelectItem>
            <SelectItem value="nature">Nature Sounds</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-12 w-12 rounded-full bg-purple-400 text-white hover:bg-purple-500"
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
