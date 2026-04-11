"use client";
import { useState, useEffect, useRef } from "react"; 

const books = [
  {
    title: "Misty Mountain Morning",
    author: "Elena Fisher",
    stock: 128, interested: "2.4k",
    description: "Sebuah novel yang memukau tentang perjalanan menemukan jati diri di tengah kabut pegunungan yang misterius.",
    format: "Hardcover", pages: 342, language: "Indonesia", released: "Oct 2023",
    genre: "Literary Fiction",
    cover: "/images1.png",
    accent: "#e2b96f",
    spineColor: "#0f3460",
  },
  {
    title: "Silent Ocean",
    author: "James Carter",
    stock: 84, interested: "1.1k",
    description: "Kisah penuh makna tentang kedamaian hidup di tepi samudra tak bertepi.",
    format: "Paperback", pages: 280, language: "English", released: "Jan 2022",
    genre: "Contemporary",
    cover: "/images2.png",
    accent: "#2a9d8f",
    spineColor: "#0a6e8a",
  },
  {
    title: "Golden Horizon",
    author: "Maria Hill",
    stock: 54, interested: "980",
    description: "Perjalanan inspiratif mengejar mimpi yang terasa mustahil, hingga fajar keemasan itu akhirnya tiba.",
    format: "Hardcover", pages: 310, language: "English", released: "May 2021",
    genre: "Inspirational",
    cover: "/images3.png",
    accent: "#e9a800",
    spineColor: "#7a4500",
  },
  {
    title: "Deep Forest",
    author: "Robert Blake",
    stock: 39, interested: "760",
    description: "Petualangan mendebarkan menyusuri hutan misterius yang menyimpan rahasia purba.",
    format: "Hardcover", pages: 290, language: "Indonesia", released: "Aug 2020",
    genre: "Adventure",
    cover: "/images4.png",
    accent: "#2d8653",
    spineColor: "#0d4a1a",
  },
  {
    title: "Calm Sky",
    author: "Anna Lee",
    stock: 200, interested: "3.2k",
    description: "Novel ringan tentang makna ketenangan hidup — bahwa langit selalu biru di balik awan yang paling gelap.",
    format: "Paperback", pages: 250, language: "English", released: "Dec 2023",
    genre: "Mindfulness",
    cover: "/images5.png",
    accent: "#4361b8",
    spineColor: "#2d2d6e",
  },
];

// Naik ~23% dari asli, proporsi 2:3 tetap terjaga (130→160, 195→240)
const BOOK_W  = 160;
const BOOK_H  = 240;
const SPINE_W = 22;

const BookCover = ({ book, index, active, onClick }) => {
  const offset        = index - active;
  const abs           = Math.abs(offset);
  const tx            = offset * 117; // scale dari 95 sesuai rasio buku baru
  const scale         = 1 - 0.15 * abs;
  const tiltY         = offset > 0 ? -15 : offset < 0 ? 15 : 0;
  const opacity       = abs > 2 ? 0 : abs === 0 ? 1 : 0.5;
  const blurPx        = abs > 0 ? abs * 3 : 0;
  const bookOpenAngle = offset === 0 ? -20 : 0;

  return (
    <div
      onClick={onClick}
      className="book-card absolute"
      style={{
        left: "50%", top: "50%",
        width: `${BOOK_W + SPINE_W}px`,
        height: `${BOOK_H}px`,
        marginLeft: `-${(BOOK_W + SPINE_W) / 2}px`,
        marginTop: `-${BOOK_H / 2}px`,
        perspective: "900px",
        transform: `translateX(${tx}px) scale(${scale}) rotateY(${tiltY}deg)`,
        filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        opacity,
        zIndex: 20 - abs,
        cursor: abs > 0 ? "pointer" : "default",
      }}
    >
      <div
        className="book-wrap relative w-full h-full"
        style={{ transform: `rotateY(${bookOpenAngle}deg)` }}
      >
        {/* Spine */}
        <div
          className="book-spine absolute top-0 left-0 flex items-center justify-center overflow-hidden rounded-l-sm"
          style={{
            width: `${SPINE_W}px`, height: `${BOOK_H}px`,
            background: `linear-gradient(to right, ${book.spineColor}bb, ${book.spineColor})`,
            transformOrigin: "right center",
            transform: `rotateY(-90deg) translateX(-${SPINE_W}px)`,
            boxShadow: "-6px 0 16px rgba(0,0,0,0.6)",
          }}
        >
          <span className="spine-text rotate-180 text-[7px] tracking-[0.15em] text-white/60 uppercase whitespace-nowrap overflow-hidden max-h-[215px]">{book.title}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
        </div>

        {/* Cover */}
        <div
          className="book-front absolute top-0 overflow-hidden rounded-r-sm"
          style={{
            left: `${SPINE_W}px`, width: `${BOOK_W}px`, height: `${BOOK_H}px`,
            boxShadow: offset === 0 ? "10px 16px 48px rgba(0,0,0,0.75)" : "4px 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover block"
            onError={e => { e.target.style.display = "none"; e.target.parentNode.style.background = "#1a1a2e"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
            <p className="text-[10px] font-medium mb-1" style={{ color: book.accent }}>
              {book.author}
            </p>
            <p className="text-sm font-semibold text-white leading-tight drop-shadow">
              {book.title}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default function BookSlider() {
  const [active, setActive] = useState(2);
  const sliderRef           = useRef(null);
  const isScrolling         = useRef(false);
  const book                = books[active];

  const goTo = (idx) => {
    if (idx < 0 || idx >= books.length || idx === active) return;
    setActive(idx);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft")  goTo(active - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const wheel = (e) => {
      if (isScrolling.current) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta > 5) goTo(active + 1);
      if (delta < -5) goTo(active - 1);
      isScrolling.current = true;
      setTimeout(() => { isScrolling.current = false; }, 350);
    };
    el.addEventListener("wheel", wheel, { passive: true });
    return () => el.removeEventListener("wheel", wheel);
  }, [active]);

  return (
    <section className="w-full flex flex-col items-center">
      <style>{`
        .book-card  { transition: all 0.55s cubic-bezier(0.34, 1.4, 0.64, 1); }
        .book-wrap  { transform-style: preserve-3d; transition: transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1); }
        .book-spine { backface-visibility: hidden; }
        .book-front { backface-visibility: hidden; }
        .spine-text { writing-mode: vertical-rl; text-orientation: mixed; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        .anim-fade { animation: fadeUp .35s ease forwards; }
      `}</style>

      {/* max-w-3xl → max-w-4xl, semua padding & spacing ikut naik */}
      <div className="w-full max-w-4xl px-6">

        {/* Slider — height ikut BOOK_H baru */}
        <div ref={sliderRef} className="relative mb-6" style={{ height: `${BOOK_H + 50}px` }}>
          {books.map((b, i) => (
            <BookCover key={i} book={b} index={i} active={active} onClick={() => goTo(i)} />
          ))}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <button
            onClick={() => goTo(active - 1)} disabled={active === 0}
            className="w-8 h-8 rounded-full border border-gray-200 text-gray-400 text-sm flex items-center justify-center hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >←</button>

          <div className="flex items-center gap-2">
            {books.map((_, i) => (
              <button
                key={i} onClick={() => goTo(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === active ? "20px" : "6px", background: i === active ? book.accent : "#d1d5db" }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(active + 1)} disabled={active === books.length - 1}
            className="w-8 h-8 rounded-full border border-gray-200 text-gray-400 text-sm flex items-center justify-center hover:border-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >→</button>
        </div>

        {/* Detail Card — padding lebih lega, teks sedikit lebih besar */}
        <div key={active} className="bg-white border border-gray-200 rounded-2xl shadow-sm grid grid-cols-[1fr_auto] anim-fade overflow-hidden">

          {/* Left */}
          <div className="p-6 border-r border-gray-100">
            <div className="flex gap-2 mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${book.accent}20`, color: book.accent }}>
                Best Seller
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                {book.genre}
              </span>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-1">{book.title}</h2>
            <p className="text-sm text-gray-400 mb-4">by {book.author}</p>

            <div className="border-t border-gray-100 mb-4" />

            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-sm">{book.description}</p>

            <div className="flex gap-6">
              {[["Stock", book.stock], ["Interested", book.interested]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-base font-bold text-gray-800">{val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="p-6 flex flex-col min-w-[180px]">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Detail Buku</p>

            <div className="space-y-3 mb-5">
              {[["Format", book.format], ["Bahasa", book.language], ["Rilis", book.released]].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center gap-4">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm font-medium text-gray-700">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <button
                className="w-full py-2.5 rounded-card text-sm font-semibold text-white transition-opacity hover:opacity-90 border-none cursor-pointer"
                style={{ background: book.accent }}
              >
                Pinjam Sekarang
              </button>
              <button className="w-full py-2.5 rounded-card text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border-none cursor-pointer">
                Lihat Detail
              </button>
            </div>
          </div>

        </div>

        <p className="text-center mt-3 text-xs text-gray-300">
          ← Gunakan arrow keys atau scroll untuk navigasi →
        </p>
      </div>
    </section>
  );
}