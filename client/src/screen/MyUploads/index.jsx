import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { VideoCard, VideoModal, ConfirmDialog } from "../../components";
import { useVideoStore } from "../../store/useVideoStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

const MyUploads = () => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const videos = useVideoStore((s) => s.videos);
  const fetchMine = useVideoStore((s) => s.fetchMine);
  const deleteVideo = useVideoStore((s) => s.deleteVideo);

  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const myVideos = useMemo(
    () => videos.filter((v) => v.uploaderId === currentUser?.id),
    [videos, currentUser],
  );

  const handleDelete = async () => {
    try {
      await deleteVideo(toDelete.id);
    } catch (err) {
      alert(err.message);
    }
    setToDelete(null);
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-text">My Uploads</h1>
          <p className="text-sm text-muted">
            {myVideos.length} video{myVideos.length !== 1 && "s"} uploaded by
            you.
          </p>
        </div>
        <Link
          to="/upload"
          className="rounded-lg bg-accent px-5 py-3 text-sm text-white"
        >
          Upload new
        </Link>
      </div>

      {myVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={setSelected}
              onDelete={setToDelete}
            />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted">
          You haven't uploaded anything yet.
        </p>
      )}

      {selected && (
        <VideoModal video={selected} onClose={() => setSelected(null)} />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this video?"
          message={`"${toDelete.title}" will be removed permanently.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </section>
  );
};

export default MyUploads;
