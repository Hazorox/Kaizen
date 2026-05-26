'use client';
//  Premade player component by video.js
import '@videojs/react/video/minimal-skin.css';
import { createPlayer, videoFeatures } from '@videojs/react';
import { MinimalVideoSkin, Video } from '@videojs/react/video';

const Player = createPlayer({ features: videoFeatures });

interface MyPlayerProps {
  src: string;
}

export const MyPlayer = ({ src }: MyPlayerProps) => {
  return (
    <Player.Provider>
      <MinimalVideoSkin>
        <Video src={src} playsInline width={"full"} height={"full"} />
      </MinimalVideoSkin>
    </Player.Provider>
  );
};