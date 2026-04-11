"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { BookOpen, Calendar, Clock } from "lucide-react";

export default function BukuSayaPage() {
  const [search, setSearch] = useState("");
  const [transaksi, setTransaksi] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [diterima, setDiterima] = useState(() => {
    if (typeof window === "undefined") return {};
    return JSON.parse(localStorage.getItem("diterima") || "{}");
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState({});

  const fetchTransaksi = () => {
    fetch("/api/transaksi/my")
      .then((r) => r.json())
      .then((data) => setTransaksi(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  const fetchBooking = () => {
    fetch("/api/booking/my")
      .then((r) => r.json())
      .then((data) => setBookingList(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTransaksi();
    fetchBooking();
  }, []);

  const handleDiterima = (id) => {
    setDiterima((prev) => {
      const next = { ...prev, [id]: true };
      localStorage.setItem("diterima", JSON.stringify(next));
      return next;
    });
  };

  const handleKembalikan = (book) => {
    setSelectedBook(book);
    setForm({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/transaksi/${selectedBook.transaksiId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "MENUNGGU_CEKADMIN",
        keterangan: form.keterangan,
        kondisiBuku: form.kondisiBuku,
      }),
    });
    setShowModal(false);
    fetchTransaksi();
  };

  const books = transaksi
    .flatMap((t) =>
      t.detailTrans.map((d) => ({
        id: d.id,
        transaksiId: t.id,
        category: d.buku.jenisBuku?.nama ?? "-",
        title: d.buku.judul,
        author: d.buku.pengarang,
        image: d.buku.image_buku,
        jumlah: d.jumlah,
        status: t.status,
        dipesan: new Date(t.tanggalPinjam).toLocaleDateString("id-ID", {
          day: "2-digit", month: "short", year: "numeric",
        }),
        ambilSebelum: t.tanggalKembali
          ? new Date(t.tanggalKembali).toLocaleDateString("id-ID", {
              day: "2-digit", month: "short", year: "numeric",
            })
          : "-",
      })),
    )
    .filter((b) => b.status !== "SELESAI" && b.status !== "BOOKED");

  const bookingBooks = bookingList
    .filter((b) => b.status === "MENUNGGU")
    .map((b) => ({
      id: `booking-${b.id}`,
      bookingId: b.id,
      transaksiId: b.transaksiId,
      category: b.buku?.jenisBuku?.nama ?? "-",
      title: b.buku?.judul ?? "-",
      author: b.buku?.pengarang ?? "-",
      image: b.buku?.image_buku,
      jumlah: b.transaksi?.detailTrans?.[0]?.jumlah ?? 1,
      status: "BOOKED",
      dipesan: new Date(b.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      ambilSebelum: "-",
    }));

  const allBooks = [...books, ...bookingBooks];

  const filtered = allBooks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filtered.reduce((acc, book) => {
    if (!acc[book.category]) acc[book.category] = [];
    acc[book.category].push(book);
    return acc;
  }, {});

  const renderButton = (book) => {
    if (book.status === "BOOKED") {
      return (
        <button disabled className="text-xs font-semibold px-4 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0 self-end bg-blue-100 text-blue-500 cursor-default">
          Menunggu Konfirmasi
        </button>
      );
    }

    if (book.status === "MENUNGGU_CEKADMIN" || book.status === "TERLAMBAT") {
      return (
        <button disabled className="text-xs font-semibold px-4 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0 self-end bg-yellow-100 text-yellow-600 cursor-default">
          Menunggu Admin
        </button>
      );
    }

    return (
      <button
        onClick={() => !diterima[book.id] ? handleDiterima(book.id) : handleKembalikan(book)}
        className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition whitespace-nowrap flex-shrink-0 self-end ${
          diterima[book.id] ? "bg-red-500 text-white hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600 text-white"
        }`}
      >
        {diterima[book.id] ? "Kembalikan" : "Sudah Diterima"}
      </button>
    );
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex justify-center">
          <div className="w-[840px]">
            <div className="mb-6 flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="text-subtitle text-birutua">Buku Saya</div>
                <div className="text-normal-desc text-gray-500">Temukan buku favoritmu dari koleksi perpustakaan.</div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center h-fit gap-2 border border-birutua text-[#2f3a56] text-[11px] px-6 py-2 rounded-md">
                  Filter ▼
                </button>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for reports"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 text-black bg-white text-[11px] pl-8 pr-3 py-2 rounded-md w-56"
                  />
                  <span className="absolute left-2 top-2 text-black text-xs">
                    <Icon icon="material-symbols:search" className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </div>

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-3 mb-4 bg-blue-50/60 px-3 py-2 rounded-md">
                  <div className="w-[3px] h-5 bg-birutua rounded-full" />
                  <span className="text-sm font-bold text-gray-700">{category}</span>
                </div>

                <div className="space-y-3">
                  {items.map((book) => (
                    <div key={book.id} className="bg-white rounded-2xl px-5 py-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-[90px] h-[125px] rounded-xl overflow-hidden flex-shrink-0 shadow">
                        <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] text-blue-500 font-semibold bg-blue-100 px-2 py-0.5 rounded">
                            {book.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[11px] font-semibold text-gray-500">{book.jumlah} dipinjam</span>
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            book.status === "PINJAM" ? "bg-blue-100 text-blue-500" :
                            book.status === "TERLAMBAT" ? "bg-red-100 text-red-500" :
                            book.status === "MENUNGGU_CEKADMIN" ? "bg-yellow-100 text-yellow-600" :
                            book.status === "BOOKED" ? "bg-purple-100 text-purple-500" :
                            "bg-gray-100 text-gray-500"
                          }`}>
                            {book.status === "MENUNGGU_CEKADMIN" ? "Menunggu Cek Admin" :
                             book.status === "BOOKED" ? "Booking" :
                             book.status}
                          </span>
                        </div>

                        <h3 className="text-[15px] font-bold text-gray-800 leading-tight">{book.title}</h3>
                        <p className="text-xs text-gray-400 mb-3">{book.author}</p>

                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs text-gray-500">Dipesan:</span>
                            <span className="text-xs font-semibold text-gray-700">{book.dipesan}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-xs text-gray-500">Ambil sebelum:</span>
                            <span className="text-xs font-semibold text-gray-700">{book.ambilSebelum}</span>
                          </div>
                        </div>
                      </div>

                      {renderButton(book)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
          <div className="card-f w-[450px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-title-desc">Kembalikan Buku</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Tanggal Kembali</label>
                <input type="date" value={new Date().toISOString().split("T")[0]} readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-gray-50 text-gray-500" />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">Kondisi Buku</label>
                <select value={form.kondisiBuku || ""} onChange={(e) => setForm({ ...form, kondisiBuku: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs">
                  <option value="">Pilih kondisi</option>
                  <option value="BAIK">Baik</option>
                  <option value="RUSAK_RINGAN">Rusak Ringan</option>
                  <option value="RUSAK_BERAT">Rusak Berat</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">Keterangan</label>
                <textarea value={form.keterangan || ""} onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs" rows={3}
                  placeholder="Tambahkan keterangan jika ada..." />
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="text-xs px-4 py-2 bg-birutua text-white rounded-md">Kembalikan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}