import { useDetailUIStore } from "../store/useDetailUIStore";

interface VideoPlayerProps {
  videoKey: string | null;
}

export const VideoPlayer = ({ videoKey }: VideoPlayerProps) => {
  const { play, playerNonce } = useDetailUIStore();

  if (!videoKey) {
    return (
      <div className="no-video">
        <p>재생할 영상이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="media-box">
      <iframe
        key={`${videoKey}-${playerNonce}`}
        className="trailer-video"
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=${
          play ? 1 : 0
        }&mute=1&playsinline=1&nonce=${playerNonce}`}
        title="YouTube trailer"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};
export default VideoPlayer;
