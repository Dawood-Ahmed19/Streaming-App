import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ value, onChange, placeholder = "Search videos..." }) => {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-muted" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
      />
    </div>
  );
};

export default SearchBar;
