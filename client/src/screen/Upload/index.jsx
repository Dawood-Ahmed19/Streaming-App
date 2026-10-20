import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeading,
  faLink,
  faCloudArrowUp,
  faXmark,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import { Input, Button } from "../../components";
import { getYouTubeId, detectSource } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { useVideoStore } from "../../store/useVideoStore";

const Upload = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", link: "" });
  const [mode, setMode] = useState("file");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const addVideo = useVideoStore((s) => s.addVideo);
  const MAX_SIZE = 200 * 1024 * 1024;

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const pickFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please choose a video file");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Video is too large. Max size is 200MB");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const ytId = getYouTubeId(form.link);
  const ytThumb = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    if (mode === "file" && !file) return setError("Please choose a video file");
    if (mode === "link" && !form.link.trim())
      return setError("Please paste a video link");

    const data = new FormData();
    data.append("title", form.title.trim());
    data.append("description", form.description.trim());
    data.append("source", mode === "file" ? "local" : detectSource(form.link));
    if (mode === "link") data.append("link", form.link.trim());
    if (ytThumb) data.append("thumbnail", ytThumb);
    if (mode === "file") data.append("file", file);

    setIsSubmitting(true);
    setProgress(0);
    try {
      await addVideo(data);
      navigate("/explore");
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text">Upload Video</h1>
        <p className="text-sm text-muted">
          Share a video from your device or add a streaming link.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-line bg-cardBg p-6 lg:col-span-3"
        >
          <Input
            name="title"
            label="Title"
            placeholder="Give your video a title"
            icon={<FontAwesomeIcon icon={faHeading} />}
            value={form.title}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="What is this video about?"
              className="resize-none rounded-2xl border border-line bg-surface px-4 py-3.5 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Source toggle */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium uppercase tracking-wider text-muted">
              Upload option
            </label>
            <div className="grid grid-cols-2 gap-1 rounded-full border border-line bg-surface p-1">
              {[
                { key: "file", label: "From device" },
                { key: "link", label: "Streaming link" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setMode(key);
                    setError("");
                  }}
                  className={`cursor-pointer rounded-full py-2.5 text-sm transition
                    ${
                      mode === key
                        ? "bg-text text-bg"
                        : "text-muted hover:text-text"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {mode === "file" ? (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition
                ${
                  dragging
                    ? "border-accent bg-accent/10"
                    : "border-text/20 bg-surface hover:border-text/30"
                }`}
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                <FontAwesomeIcon icon={faCloudArrowUp} size="lg" />
              </span>
              {file ? (
                <div className="flex items-center gap-2 text-sm text-text">
                  <FontAwesomeIcon icon={faFilm} className="text-muted" />
                  <span className="max-w-60 truncate">{file.name}</span>
                  <button
                    type="button"
                    aria-label="Remove file"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                    className="cursor-pointer text-muted hover:text-accent"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text">
                    Drag and drop a video, or{" "}
                    <span className="text-accent">browse</span>
                  </p>
                  <p className="text-xs text-muted">MP4, WebM or MOV</p>
                </>
              )}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => pickFile(e.target.files[0])}
              />
            </label>
          ) : (
            <Input
              name="link"
              type="url"
              label="Video link"
              placeholder="https://youtube.com/watch?v=..."
              icon={<FontAwesomeIcon icon={faLink} />}
              value={form.link}
              onChange={handleChange}
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Uploading Progress bar */}

          {isSubmitting && mode === "file" && (
            <div className="flex flex-col gap-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-text/10">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted">
                {progress < 100 ? `Uploading... ${progress}%` : "Processing..."}
              </p>
            </div>
          )}

          <Button
            disabled={isSubmitting}
            label={isSubmitting ? "Publishing..." : "Publish video"}
          />
        </form>

        {/* Live preview */}
        <aside className="flex flex-col gap-3 lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Preview
          </p>
          <div className="overflow-hidden rounded-3xl border border-line bg-cardBg">
            <div className="relative flex aspect-video items-center justify-center bg-linear-to-br from-red-600/40 to-zinc-900">
              {mode === "file" && previewUrl ? (
                <video
                  src={previewUrl}
                  muted
                  controls
                  className="size-full object-cover"
                />
              ) : mode === "link" && ytThumb ? (
                <img src={ytThumb} alt="" className="size-full object-cover" />
              ) : (
                <FontAwesomeIcon
                  icon={faFilm}
                  size="2x"
                  className="text-white/30"
                />
              )}
            </div>
            <div className="flex flex-col gap-1 p-4">
              <h3 className="line-clamp-2 font-semibold text-text">
                {form.title || "Your video title"}
              </h3>
              <p className="line-clamp-2 text-sm text-muted">
                {form.description || "Your description will appear here."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Upload;
