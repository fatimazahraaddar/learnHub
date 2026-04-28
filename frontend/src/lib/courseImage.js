const IMAGE_BY_FILENAME = {
  "react.jpg":
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
  "php.jpg":
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  "js.jpg":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80";

export function resolveCourseImage(image, title = "") {
  const raw = String(image || "").trim();
  
  if (!raw) return DEFAULT_COURSE_IMAGE;

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:image")) {
    return raw;
  }

  if (!raw.includes("://")) {
    return `http://127.0.0.1:8000/storage/${raw}`;
  }

  const keyword = encodeURIComponent(title || "online course");
  return `https://source.unsplash.com/1200x700/?${keyword}`;
}