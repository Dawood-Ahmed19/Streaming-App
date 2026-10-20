import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useThemeStore } from "../../store/useThemeStore";

const ThemeToggle = () => {
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-text/5 hover:text-text"
    >
      <FontAwesomeIcon
        icon={mode === "dark" ? faSun : faMoon}
        className="w-4"
      />
      {mode === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
};

export default ThemeToggle;
