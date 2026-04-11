"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, BookOpen, Clock } from "lucide-react";

export default function BookDetailPage({ bookId, onViewAll }) {
  const [borrowed, setBorrowed] = useState(false);
  const [book, setBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!bookId) return;
    fetch(`/api/books`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((b) => b.id === bookId);
        setBook(found);
      })
      .catch((err) => console.error(err));
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (book.stok === 0) {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bukuId: bookId,
          jumlah: Number(form.jumlah),
          durasi: Number(form.durasi),
        }),
      });
      if (res.ok) { setShowModal(false); setBorrowed(true); }
      return;
    }

    const tanggalPinjam = new Date();
    const tanggalKembali = new Date();
    tanggalKembali.setDate(tanggalKembali.getDate() + Number(form.durasi));

    const res = await fetch("/api/transaksi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipe: "SISWA",
        tanggalPinjam,
        tanggalKembali,
        status: "PINJAM",
        detailTrans: {
          bukuId: bookId,
          jumlah: Number(form.jumlah),
          kondisiBuku: "BAIK",
        },
      }),
    });

    if (res.ok) { setShowModal(false); setBorrowed(true); }
  };

  if (!book) return null;

  return (
    <div className="flex-1 p-8">
      {/* Top Section */}
      <div className="flex items-start gap-4 mb-10">
        <div className="flex items-start h-[215px]">
          <button
            onClick={onViewAll}
            className="w-10 h-10 rounded-full bg-birutua shadow flex items-center justify-center hover:shadow-md transition flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex-shrink-0 w-[155px] h-[215px] rounded-2xl overflow-hidden relative bg-teal-500 shadow-md">
          <img src={book.image_buku} alt={book.judul} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 pt-1 pl-2">
          <span className="inline-block text-xs text-blue-500 font-semibold bg-blue-100 px-2 py-0.5 rounded mb-2">
            {book.jenisBuku?.nama}
          </span>
          <h1 className="text-[30px] font-bold text-gray-800 tracking-tight mb-1">
            {book.judul}
          </h1>
          <div className="flex items-center gap-1 mb-5">
            <span className="text-sm text-gray-500">Oleh</span>
            <span className="text-sm font-semibold text-gray-700 ml-1">{book.pengarang}</span>
            <svg className="w-4 h-4 text-blue-500 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
            </svg>
          </div>
          <div className="bg-white rounded-xl px-5 py-3 inline-flex items-center gap-6 shadow-sm">
            <div>
              <p className="text-xs text-gray-400 mb-1">Dipinjam</p>
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-blue-400 fill-blue-400" />
                <span className="text-sm font-bold text-gray-800">458</span>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400 mb-1">Tersisa</p>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-600">{book.stok} Stok</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 w-[240px] bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Informasi Pinjaman</h2>
          <div className="space-y-3 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span className="text-xs text-gray-500">Status Stok</span>
              </div>
              <span className={`text-xs font-bold ${book.stok === 0 ? "text-red-500" : "text-emerald-500"}`}>
                {book.stok === 0 ? "HABIS" : `TERSEDIA (${book.stok})`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                <span className="text-xs text-gray-500">Lokasi Rak</span>
              </div>
              <span className="text-xs font-bold text-gray-700">RAK 04 - B / FIKSI</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Maks. Pinjam</span>
              </div>
              <span className="text-xs font-bold text-gray-700">7 HARI</span>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              borrowed ? "bg-emerald-500 text-white" : "bg-birutua text-white"
            }`}
          >
            <Bookmark className="w-4 h-4 fill-white" />
            {borrowed
              ? book.stok === 0 ? "Sudah Dibooking!" : "Sudah Dipinjam!"
              : book.stok === 0 ? "Booking Now" : "Pinjam Sekarang"}
          </button>
        </div>
      </div>

      {/* Sinopsis */}
      <div className="flex gap-4">
        <div className="w-10 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[3px] h-6 bg-blue-500 rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">Sinopsis</h2>
          </div>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-3">{book.deskripsi}</p>
        </div>
        <div className="w-[240px] flex-shrink-0" />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
          <div className="card-f w-[450px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-title-desc">
                {book.stok === 0 ? "Booking Buku" : "Pinjam Buku"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {book.stok === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3">
                  <p className="text-xs text-yellow-600">
                    Stok habis. Booking akan menunggu konfirmasi admin sebelum diproses.
                  </p>
                </div>
              )}

              {book.stok > 0 && (
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Tanggal Pinjam</label>
                  <input
                    type="date"
                    value={new Date().toISOString().split("T")[0]}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-gray-50 text-gray-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Durasi Pinjam (maks. 7 hari)</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={form.durasi || ""}
                    onChange={(e) => setForm({ ...form, durasi: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Jumlah Pinjam</label>
                  <input
                    type="number"
                    min={1}
                    value={form.jumlah || ""}
                    onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs px-4 py-2 border rounded-md">
                  Batal
                </button>
                <button type="submit" className="text-xs px-4 py-2 bg-birutua text-white rounded-md">
                  {book.stok === 0 ? "Konfirmasi Booking" : "Pinjam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}