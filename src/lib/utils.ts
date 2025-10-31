function decodeHtmlEntities(text: string): string {
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  return text.replace(/&#(\d+);/g, (_, dec) => {
    return String.fromCharCode(Number.parseInt(dec, 10));
  }).replace(/&#x([a-f\d]+);/gi, (_, hex) => {
    return String.fromCharCode(Number.parseInt(hex, 16));
  }).replace(/&(amp|lt|gt|quot|apos|#39);/g, (_, entity) => {
    const entityMap: Record<string, string> = {
      amp: "&",
      lt: "<",
      gt: ">",
      quot: '"',
      apos: "'",
      "#39": "'",
    };
    return entityMap[entity] || `&${entity};`;
  });
}

export function stripHtml(html: string | null): string {
  if (!html) return "";

  const withoutTags = html.replace(/<[^>]*>/g, "").trim();
  return decodeHtmlEntities(withoutTags);
}

