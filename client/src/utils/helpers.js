export const getYouTubeId = (url) => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
};

export const detectSource = (url) => {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/twitch\.tv/.test(url)) return "twitch";
  return "link";
};
