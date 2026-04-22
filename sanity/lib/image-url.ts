export function sanityImg(url?: string, w = 1600, q = 75): string | undefined {
  if (!url) return undefined;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=${w}&q=${q}&auto=format&fit=max`;
}
