import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getYouTubeId } from "../../utils/helpers";
import { API_URL } from "../../utils/api";

const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ytId = video.link ? getYouTubeId(video.link) : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full w-full max-w-3xl flex-col overflow-y-auto rounded-3xl border border-line bg-cardBg"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-accent"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="aspect-video w-full bg-black">
          {ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              title={video.title}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="size-full"
            />
          ) : video.source === "local" && video.fileUrl ? (
            <video
              src={`${API_URL}${video.fileUrl}`}
              controls
              autoPlay
              className="size-full"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted">
                This link can't be embedded here.
              </p>
              <a
                href={video.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-accent px-5 py-2 text-sm text-white"
              >
                Open video
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-6">
          <h2 className="text-xl font-bold text-text">{video.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="flex size-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
              {video.uploader?.[0]?.toUpperCase()}
            </span>
            {video.uploader}
            <span className="capitalize">· {video.source}</span>
          </div>
          {video.description && (
            <p className="text-sm text-muted">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
