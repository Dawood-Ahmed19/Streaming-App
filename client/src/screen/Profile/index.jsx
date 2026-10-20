import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Input, Button, ConfirmDialog } from "../../components";
import { useAuthStore } from "../../store/useAuthStore";
import { useVideoStore } from "../../store/useVideoStore";

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const myVideoCount = useVideoStore(
    (s) => s.videos.filter((v) => v.uploaderId === currentUser.id).length,
  );

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: currentUser.username,
    email: currentUser.email,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchMine = useVideoStore((s) => s.fetchMine);
  useEffect(() => {
    fetchMine();
  }, [fetchMine]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = () => {
    setForm({ username: currentUser.username, email: currentUser.email });
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateProfile(form);
      setEditing(false);
      setSuccess("Profile updated");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount();
      useVideoStore.getState().clear();
      navigate("/signup");
    } catch (err) {
      setConfirmDelete(false);
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-text">Profile</h1>
        <p className="text-sm text-muted">Manage your account details.</p>
      </div>

      {/* Info card */}
      <div className="flex flex-col gap-6 rounded-3xl border border-line bg-cardBg p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-semibold text-accent">
            {currentUser.username[0].toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold text-text">
              {currentUser.username}
            </p>
            <p className="truncate text-sm text-muted">{currentUser.email}</p>
            <p className="text-xs text-muted">
              {myVideoCount} video{myVideoCount !== 1 && "s"} uploaded
            </p>
          </div>
        </div>

        {success && !editing && (
          <p className="text-sm text-emerald-400">{success}</p>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <Input
              name="username"
              label="Username"
              icon={<FontAwesomeIcon icon={faUser} />}
              value={form.username}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              label="Email"
              icon={<FontAwesomeIcon icon={faEnvelope} />}
              value={form.email}
              onChange={handleChange}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                label="Cancel"
                onClick={() => setEditing(false)}
              />
              <Button label="Save changes" />
            </div>
          </form>
        ) : (
          <Button
            variant="secondary"
            type="button"
            label="Edit profile"
            onClick={startEdit}
          />
        )}
      </div>

      {/* Danger zone */}
      <div className="flex flex-col gap-3 rounded-3xl border border-accent/30 bg-accent/5 p-6">
        <h2 className="text-lg font-semibold text-text">Delete account</h2>
        <p className="text-sm text-muted">
          This removes your account and all your uploaded videos. It can't be
          undone.
        </p>
        <Button
          type="button"
          label="Delete my account"
          onClick={() => setConfirmDelete(true)}
        />
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete your account?"
          message="Your account and all your videos will be removed permanently."
          confirmLabel="Delete account"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </section>
  );
};

export default Profile;
