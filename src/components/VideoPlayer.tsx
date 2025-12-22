import { forwardRef, useImperativeHandle, useRef } from "react";
import { useDetailUIStore } from "../store/useDetailUIStore";

export type VideoPlayerHandle = {
  enterFullscreen: () => Promise<void>;
};

interface VideoPlayerProps {
  videoKey: string | null;
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ videoKey }, ref) => {
    const { play, playerNonce } = useDetailUIStore();
    const boxRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
      enterFullscreen: async () => {
        const el = boxRef.current;
        if (!el) return;

        // 이미 풀스크린이면 패스
        if (document.fullscreenElement) return;

        // requestFullscreen 지원 브라우저에서만
        if (el.requestFullscreen) {
          try {
            await el.requestFullscreen();
          } catch (e) {
            console.error("fullscreen 실패:", e);
          }
        }
      },
    }));

    if (!videoKey) {
      return (
        <div className="no-video">
          <p>재생할 영상이 없습니다.</p>
        </div>
      );
    }

    return (
      <div ref={boxRef} className="media-box">
        <iframe
          key={`${videoKey}-${playerNonce}`}
          className="trailer-video"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=${
            play ? 1 : 0
          }&mute=1&playsinline=1&nonce=${playerNonce}`}
          title="YouTube trailer"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
