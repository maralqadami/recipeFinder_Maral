export function stripHtml(html = ""): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max = 150): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/** Spoonacular images look like .../recipes/123-312x231.jpg — swap the size. */
export function imageSize(url: string | undefined, size: string): string {
  if (!url) return "";
  return url.replace(/-\d+x\d+\./, `-${size}.`);
}
