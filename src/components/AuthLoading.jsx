import { useState, useEffect } from "react";

/* Inject animation CSS */
const BOOK_CSS = `
.book-scene { perspective: 1000px; }
.right-wrap  { perspective: 700px; }

.flip-page {
  position: absolute; inset: 0;
  transform-origin: left center;
  animation: flipPage 2.7s ease-in-out infinite;
}
.fp-1 { animation-delay: 0s; z-index: 9; }
.fp-2 { animation-delay: 0.9s; z-index: 8; }
.fp-3 { animation-delay: 1.8s; z-index: 7; }

@keyframes flipPage {
  0% { transform: rotateY(0deg); opacity: 1; }
  12% { transform: rotateY(-20deg); }
  75% { transform: rotateY(-162deg); }
  83% { opacity: 0; }
  100% { transform: rotateY(0deg); opacity: 1; }
}
`;

const DEFAULT_MESSAGES = [
  "Fetching your catalogue…",
  "Organising the shelves…",
  "Loading your session…",
  "Preparing your library…"
];

function PageLines() {
  return (
    <div className="flex flex-col gap-2 px-2 pt-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-1.5 bg-amber-300 rounded animate-pulse w-3/4" />
      ))}
    </div>
  );
}

function OpenBook() {
  return (
    <div className="book-scene">
      <div className="flex w-64 h-44">

        {/* Left */}
        <div className="w-1/2 bg-amber-50 border rounded-l overflow-hidden">
          <PageLines />
        </div>

        {/* Spine */}
        <div className="w-2 bg-amber-800" />

        {/* Right */}
        <div className="relative w-1/2 right-wrap">
          <div className="absolute inset-0 bg-amber-50 border rounded-r">
            <PageLines />
          </div>

          {[1,2,3].map(n => (
            <div key={n} className={`flip-page fp-${n} bg-amber-50 border rounded-r`}>
              <PageLines />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AuthLoading() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => (i + 1) % DEFAULT_MESSAGES.length);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    // Fixed classes here: removed grid, added justify-center and items-center
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-white">
      <style>{BOOK_CSS}</style>

      <OpenBook />

      <p className="text-sm text-gray-500 italic mt-2">
        {DEFAULT_MESSAGES[idx]}
      </p>

      <div className="flex gap-1 mt-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}