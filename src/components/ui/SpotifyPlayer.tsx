"use client";

export default function SpotifyPlayer() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl overflow-hidden shadow-xl bg-white/90 backdrop-blur">
      <iframe
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/track/6G9YlbU3ByPJQvOFDRdwyM?utm_source=generator"
        width="320"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
