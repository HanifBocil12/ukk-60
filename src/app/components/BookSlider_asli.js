"use client";
import { useState, useEffect, useRef } from "react";

const images = [
  "/images1.png",
  "/images2.png",
  "/images3.png",
  "/images4.png",
  "/images5.png",
];

const books = [
  {
    title: "Misty Mountain Morning",
    author: "Elena Fisher",
    stock: 128,
    interested: "2.4k",
    description:
      "Sebuah novel yang memukau tentang perjalanan menemukan jati diri di tengah kabut pegunungan yang misterius.",
    format: "Hardcover",
    pages: 342,
    language: "Indonesia",
    released: "Oct 2023",
  },
  {
    title: "Silent Ocean",
    author: "James Carter",
    stock: 84,
    interested: "1.1k",
    description: "Kisah penuh makna tentang kedamaian hidup.",
    format: "Paperback",
    pages: 280,
    language: "English",
    released: "Jan 2022",
  },
  {
    title: "Golden Horizon",
    author: "Maria Hill",
    stock: 54,
    interested: "980",
    description: "Perjalanan inspiratif mengejar mimpi.",
    format: "Hardcover",
    pages: 310,
    language: "English",
    released: "May 2021",
  },
  {
    title: "Deep Forest",
    author: "Robert Blake",
    stock: 39,
    interested: "760",
    description: "Petualangan mendebarkan menyusuri hutan misterius.",
    format: "Hardcover",
    pages: 290,
    language: "Indonesia",
    released: "Aug 2020",
  },
  {
    title: "Calm Sky",
    author: "Anna Lee",
    stock: 200,
    interested: "3.2k",
    description: "Novel ringan tentang makna ketenangan hidup.",
    format: "Paperback",
    pages: 250,
    language: "English",
    released: "Dec 2023",
  },
];

export default function BookSlider() {
  const [active, setActive] = useState(2);
  const [scale, setScale] = useState(1);

  const mainRef = useRef(null);
  const sliderRef = useRef(null);

  const dragStartX = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      const baseHeight = 1150;
      setScale(window.innerHeight / baseHeight);
    };

    const handleKey = (e) => {
      if (e.key === "ArrowRight")
        setActive((a) => (a < images.length - 1 ? a + 1 : a));
      if (e.key === "ArrowLeft") setActive((a) => (a > 0 ? a - 1 : a));
    };

    updateScale();
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", updateScale);
    mainRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  /* ⭐ TOUCHPAD / MOUSE DRAG SWIPE ⭐ */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let isScrolling = false;

    const wheel = (e) => {
      if (isScrolling) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      // tentuin arah dominan
      if (absY > absX) {
        if (e.deltaY > 5) {
          setActive((a) => (a < images.length - 1 ? a + 1 : a));
        }
        if (e.deltaY < -5) {
          setActive((a) => (a > 0 ? a - 1 : a));
        }
      } else {
        if (e.deltaX > 5) {
          setActive((a) => (a < images.length - 1 ? a + 1 : a));
        }
        if (e.deltaX < -5) {
          setActive((a) => (a > 0 ? a - 1 : a));
        }
      }

      isScrolling = true;

      setTimeout(() => {
        isScrolling = false;
      }, 250); // lebih cepat reset
    };

    el.addEventListener("wheel", wheel, { passive: true });

    return () => el.removeEventListener("wheel", wheel);
  }, []);

  const next = () => setActive((a) => (a < images.length - 1 ? a + 1 : a));

  const prev = () => setActive((a) => (a > 0 ? a - 1 : a));

  const book = books[active];

  return (
    <main
      ref={mainRef}
      tabIndex={0}
      className="h-screen bg-white flex justify-center overflow-hidden"
    >
      <div className="origin-top" style={{ transform: `scale(${scale})` }}>
        <div className="flex flex-col items-center py-20 px-6">
          {/* SLIDER */}
          <div
            ref={sliderRef}
            className="relative w-[340px] h-[500px] mb-10 cursor-grab active:cursor-grabbing"
          >
            {images.map((src, i) => {
              const offset = i - active;

              return (
                <div
                  key={i}
                  className="absolute inset-0 rounded-3xl bg-cover bg-center transition-all duration-500 shadow-2xl"
                  style={{
                    backgroundImage: `url(${src})`,
                    transform:
                      offset === 0
                        ? "translateX(0) scale(1)"
                        : `translateX(${offset * 160}px)
                           scale(${1 - 0.18 * Math.abs(offset)})
                           rotateY(${offset > 0 ? -8 : 8}deg)`,
                    filter: offset === 0 ? "none" : "blur(4px)",
                    opacity: Math.abs(offset) > 2 ? 0 : 0.6,
                    zIndex: 50 - Math.abs(offset),
                  }}
                />
              );
            })}
          </div>

          {/* BUTTON */}
          <div className="flex gap-8 mb-12">
            <button
              onClick={prev}
              className="px-8 py-3 bg-slate-800 text-white rounded-xl shadow-md"
            >
              ← Prev
            </button>

            <button
              onClick={next}
              className="px-8 py-3 bg-slate-800 text-white rounded-xl shadow-md"
            >
              Next →
            </button>
          </div>

          {/* DETAIL */}
          <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-12 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <span className="text-sm bg-blue-100 text-blue-600 px-5 py-1 rounded-full font-medium">
                BEST SELLER
              </span>

              <h1 className="text-5xl font-bold leading-tight">{book.title}</h1>

              <p className="text-gray-500 text-xl">by {book.author}</p>

              <p className="text-gray-600 text-lg">{book.description}</p>
            </div>

            <div className="bg-gray-50 p-10 rounded-3xl shadow-inner">
              <h3 className="font-semibold mb-6 text-lg">Book Details</h3>
              <div className="text-base space-y-3">
                <div className="flex justify-between">
                  <span>Format</span>
                  <span>{book.format}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pages</span>
                  <span>{book.pages}</span>
                </div>
                <div className="flex justify-between">
                  <span>Language</span>
                  <span>{book.language}</span>
                </div>
                <div className="flex justify-between">
                  <span>Released</span>
                  <span>{book.released}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
