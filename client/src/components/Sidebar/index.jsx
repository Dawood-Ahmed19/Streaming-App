import { NavLink, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faCloudArrowUp,
  faFilm,
  faUser,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeToggle } from "../../components";
import { useAuthStore } from "../../store/useAuthStore";
import { useVideoStore } from "../../store/useVideoStore";

const links = [
  { to: "/explore", label: "Explore", icon: faCompass, auth: false },
  { to: "/upload", label: "Upload", icon: faCloudArrowUp, auth: true },
  { to: "/dashboard/uploads", label: "My Uploads", icon: faFilm, auth: true },
  { to: "/dashboard/profile", label: "Profile", icon: faUser, auth: true },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);

  const visibleLinks = links.filter((l) => !l.auth || currentUser);

  const signout = useAuthStore((s) => s.signout);

  const handleSignout = () => {
    signout();
    useVideoStore.getState().clear();
    onClose();
    navigate("/signin");
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity lg:hidden
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-8 border-r border-line bg-surface p-5 transition-transform duration-300
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/explore"
            className="flex items-center gap-2"
            onClick={onClose}
          >
            <span className="text-lg font-semibold text-text">
              <span className="text-red-500">S</span>tream
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="cursor-pointer text-muted hover:text-white lg:hidden"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1">
          {visibleLinks.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition
                ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:bg-text/5 hover:text-text"
                }`
              }
            >
              <FontAwesomeIcon icon={icon} className="w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />

        {/* Bottom: user or sign in */}
        <div className="border-t border-line pt-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent">
                {currentUser.username[0].toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                  {currentUser.username}
                </p>
                <p className="truncate text-xs text-muted">
                  {currentUser.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignout}
                aria-label="Sign out"
                title="Sign out"
                className="cursor-pointer text-muted transition hover:text-accent"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              onClick={onClose}
              className="block rounded-xl bg-accent py-3 text-center text-sm font-medium text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
