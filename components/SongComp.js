import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify";
import { millisToMinutesAndSeconds } from "@/lib/time";
import React from "react";

function Song({ order, track }) {
  const spotifyAPI = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyAPI.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className="grid grid-cols-2 py-4 px-6 rounded-lg cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 hover:bg-gray-200 duration-300"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="w-10 h-10 rounded-lg"
          src={track.track.album.images[0].url}
          alt="Album Img"
        />
        <div>
          <p className="w-32 lg:w-64 truncate text-gray-900 font-semibold">
            {track.track.name}
          </p>
          <p className="w-32 lg:w-64 truncate">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-64 truncate hidden md:inline">
          {track.track.album.name}
        </p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;