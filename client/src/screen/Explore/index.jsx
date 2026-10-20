import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar, VideoCard, VideoModal } from "../../components";
import { useVideoStore } from "../../store/useVideoStore";
import { useEffect } from "react";

const sources = ["all", "youtube", "twitch", "local", "link"];

const Explore = () => {
  const videos = useVideoStore((s) => s.videos);
  const loading = useVideoStore((s) => s.loading);
  const fetchVideos = useVideoStore((s) => s.fetchVideos);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [uploader, setUploader] = useState("all");
  const [selected, setSelected] = useState(null);
  const uploaders = useMemo(
    () => ["all", ...new Set(videos.map((v) => v.uploader))],
    [videos],
  );

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesSource = source === "all" || v.source === source;
      const matchesUploader = uploader === "all" || v.uploader === uploader;
      const matchesQuery =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.uploader?.toLowerCase().includes(q);
      return matchesSource && matchesUploader && matchesQuery;
    });
  }, [videos, query, source, uploader]);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text">Explore</h1>
        <p className="text-sm text-muted">
          Discover videos uploaded by everyone on StreamForge.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="lg:max-w-md lg:flex-1">
          <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sources.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm capitalize transition ${
                source === s
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-muted hover:border-text/30 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}

          <select
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
            className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-sm text-text outline-none focus:border-accent"
          >
            {uploaders.map((u) => (
              <option key={u} value={u}>
                {u === "all" ? "All uploaders" : u}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading && videos.length === 0 ? (
        <p className="py-20 text-center text-muted">Loading videos...</p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} onClick={setSelected} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line py-20 text-center">
          <p className="text-lg font-semibold text-text">
            {videos.length === 0 ? "No videos yet" : "No videos found"}
          </p>
          <p className="text-sm text-muted">
            {videos.length === 0
              ? "Be the first to share something."
              : "Try a different search or filter."}
          </p>
          {videos.length === 0 && (
            <Link
              to="/upload"
              className="rounded-lg bg-accent px-5 py-2 text-sm text-white"
            >
              Upload a video
            </Link>
          )}
        </div>
      )}

      {selected && (
        <VideoModal video={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default Explore;
