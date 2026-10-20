import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faFilm, faTrash } from "@fortawesome/free-solid-svg-icons";

const sourceStyles = {
  youtube: "bg-red-500/15 text-red-400",
  twitch: "bg-purple-500/15 text-purple-400",
  local: "bg-emerald-500/15 text-emerald-400",
  link: "bg-sky-500/15 text-sky-400",
};

const VideoCard = ({ video, onClick, onDelete }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line bg-cardBg transition hover:-translate-y-1 hover:border-text/20 hover:shadow-lg hover:shadow-accent/10">
      <button
        type="button"
        onClick={() => onClick?.(video)}
        className="block w-full cursor-pointer text-left"
      >
        <div className="relative flex aspect-video items-center justify-center bg-linear-to-br from-red-600/40 to-zinc-900">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faFilm}
              size="2x"
              className="text-white/30"
            />
          )}

          {video.duration && (
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-xs text-white">
              {video.duration}
            </span>
          )}

          <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-white">
              <FontAwesomeIcon icon={faPlay} />
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-text">
            {video.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent">
                {video.uploader?.[0]?.toUpperCase()}
              </span>
              <span className="truncate text-sm text-muted">
                {video.uploader}
              </span>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${sourceStyles[video.source]}`}
            >
              {video.source}
            </span>
          </div>
        </div>
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(video)}
          aria-label="Delete video"
          title="Delete video"
          className="absolute right-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-accent"
        >
          <FontAwesomeIcon icon={faTrash} size="sm" />
        </button>
      )}
    </div>
  );
};

export default VideoCard;
