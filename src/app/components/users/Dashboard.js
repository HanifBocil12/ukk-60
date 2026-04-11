"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const GENRE_COLOR = {
  Fiksi: "bg-teal-500",
  "Self-Help": "bg-pink-500",
  Psikologi: "bg-teal-500",
  Pelajaran: "bg-violet-500",
};

function buildDendaStat(data) {
  const list = Array.isArray(data) ? data : [];
  const total = list.reduce((sum, d) => sum + (d.nilaiDenda ?? 0), 0);
  return {
    label: "Denda Aktif",
    value: total > 0 ? `Rp ${total.toLocaleString("id-ID")}` : "Tidak ada denda",
    sub: total > 0 ? "Lihat detail" : "Semua bersih ✓",
    subColor: "text-teal-500",
    iconBg: "bg-red-50",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-400" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V10h16v8zm0-10H4V6h16v2z" />
      </svg>
    ),
  };
}

function buildPinjamStat(data) {
  const list = Array.isArray(data) ? data : [];
  const aktif = list.filter((t) => t.status === "PINJAM" || t.status === "TERLAMBAT");
  const terlambat = list.filter((t) => t.status === "TERLAMBAT");
  return {
    label: "Buku Dipinjam",
    value: `${aktif.length} Buku`,
    sub: terlambat.length > 0 ? `⚠ ${terlambat.length} Judul terlambat` : "Semua tepat waktu",
    subColor: terlambat.length > 0 ? "text-yellow-500" : "text-green-500",
    iconBg: "bg-blue-50",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-400" fill="currentColor">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z" />
      </svg>
    ),
  };
}

const STATIC_STATS = [
  null, // slot pinjam — diisi dari API
  null, // slot denda — diisi dari API
  {
    label: "Pesan Baru",
    value: "1 Pesan",
    sub: "dari Admin Perpustakaa...",
    subColor: "text-teal-500",
    iconBg: "bg-teal-50",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-400" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
];

// ---- CARDS ----
function BookCard({ book }) {
  const badgeColor = GENRE_COLOR[book.jenisBuku?.nama] ?? "bg-slate-500";

  return (
    <div
      className="w-[180px] h-[420px] rounded-xl shadow-lg flex flex-col overflow-hidden bg-birutua"
      style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
    >
      <div className="h-[240px] p-0.5 mx-auto relative w-full">
        <div className="absolute top-2 items-center gap-1 flex right-2 bg-white text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm font-medium">
          <Icon icon="ic:round-inventory-2" width={15} height={15} />
          {book.stok} Stok
        </div>
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img src={book.image_buku} alt={book.judul} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex-1 px-4 pt-6 pb-6 flex flex-col">
        <span className={`h-fit w-fit inline-block ${badgeColor} text-white text-xs px-3 py-1 rounded-lg font-medium mb-4`}>
          {book.jenisBuku?.nama}
        </span>
        <h3 className="text-white text-title-desc leading-snug mb-3">{book.judul}</h3>
        <p className="text-slate-300 text-normal-desc mt-auto">{book.pengarang}</p>
      </div>
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-50 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
        {stat.icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{stat.value}</p>
        <p className="text-[10px] text-gray-400">{stat.label}</p>
        <p className={`text-[10px] ${stat.subColor} mt-0.5`}>{stat.sub}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [trending, setTrending] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [dendaStat, setDendaStat] = useState(buildDendaStat([]));
  const [pinjamStat, setPinjamStat] = useState(buildPinjamStat([]));

  useEffect(() => {
    fetch("/api/denda/my")
      .then((r) => r.json())
      .then((data) => setDendaStat(buildDendaStat(data)))
      .catch(console.error);

    fetch("/api/transaksi/my")
      .then((r) => r.json())
      .then((data) => setPinjamStat(buildPinjamStat(data)))
      .catch(console.error);

    fetch("/api/books/trending")
      .then((r) => r.json())
      .then(setTrending)
      .catch(console.error);

    fetch("/api/books")
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setNewBooks(sorted.slice(0, 4));
      })
      .catch(console.error);
  }, []);

  const stats = STATIC_STATS.map((s, i) => {
    if (i === 0) return pinjamStat;
    if (i === 1) return dendaStat;
    return s;
  });

  return (
    <>
      <main className="flex-1 overflow-y-auto flex justify-center px-6 py-5">
        <div className="w-fit">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              {/* Hero */}
              <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-2xl px-8 py-7 mb-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-teal-500/15 to-transparent pointer-events-none" />
                <h1 className="text-xl font-bold text-white mb-1.5">
                  Jelajahi Dunia Pengetahuan
                </h1>
                <p className="text-gray-300 text-xs mb-4 max-w-xs leading-relaxed">
                  Ribuan koleksi buku digital dan fisik tersedia untuk menunjang
                  prestasimu.
                </p>
                <button className="bg-teal-500 hover:bg-teal-400 text-white text-xs px-5 py-2 rounded-full transition-colors">
                  Lihat Katalog Terbaru →
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                {stats.map((s) => (
                  <StatCard key={s.label} stat={s} />
                ))}
              </div>
            </div>
          </div>

          {/* Trending Now */}
          <div className="mb-6 flex justify-center">
            <div className="w-fit">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-800">Trending Now</span>
                  <span className="text-orange-400 text-xs">🔥</span>
                  <span className="text-[10px] text-gray-400">Most borrowed books this week</span>
                </div>
              </div>
              <div className="flex justify-center gap-10">
                {trending.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </div>
          </div>

          {/* New Book */}
          <div className="mb-6 flex justify-center">
            <div className="w-fit">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-800">NewBook</span>
                  <span className="text-[10px] text-gray-400">Most borrowed books this week</span>
                </div>
              </div>
              <div className="flex justify-center gap-10">
                {newBooks.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}