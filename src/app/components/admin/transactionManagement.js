"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const TIPE_STYLE = {
  Peminjaman: "border border-blue-300 text-blue-600",
  Pengembalian: "border border-yellow-300 text-yellow-600",
  Terlambat: "border border-red-300 text-red-500",
  Booking: "border border-purple-300 text-purple-600",
};

const STATUS_STYLE = {
  PINJAM: "bg-green-500 text-white",
  SELESAI: "bg-blue-500 text-white",
  TERLAMBAT: "bg-red-500 text-white",
  MENUNGGU_CEKADMIN: "bg-yellow-400 text-white",
  BOOKED: "bg-purple-500 text-white",
};

const FILTER_OPTIONS = ["Semua", "Peminjaman", "Pengembalian", "Terlambat", "Booking"];
const TABLE_COLUMNS = ["Nama Buku", "Tanggal pinjam", "Tanggal kembali", "Kondisi Buku", "Status", "Aksi"];
const BOOKING_COLUMNS = ["Nama Buku", "Tanggal Booking", "Jumlah", "Durasi", "Status", "Aksi"];

function Avatar({ nama }) {
  const initials = nama?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${STATUS_STYLE[status] ?? "bg-gray-400 text-white"}`}>
      {status}
    </span>
  );
}

function getTipe(status) {
  if (status === "TERLAMBAT") return "Terlambat";
  if (status === "MENUNGGU_CEKADMIN") return "Pengembalian";
  if (status === "BOOKED") return "Booking";
  return "Peminjaman";
}

function getKelas(user) {
  if (user?.siswa?.class) return `${user.siswa.class.tingkat} ${user.siswa.class.namaKelas}`;
  if (user?.guru) return "Guru";
  return "-";
}

function getWaktu(createdAt) {
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return new Date(createdAt).toLocaleDateString("id-ID");
}

function RequestItem({ req, isSelected, onClick }) {
  const transaksiTipes = [...new Set((req.transaksis ?? []).map((t) => getTipe(t.status)))];
  const hasBooking = (req.bookings ?? []).length > 0;

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors ${
        isSelected ? "border-l-[3px] border-l-blue-500 bg-blue-50/40" : "hover:bg-gray-50"
      }`}
    >
      <p className="text-[9px] text-gray-400 mb-0.5">{getWaktu(req.transaksis?.[0]?.createdAt)}</p>
      <p className="text-[11px] font-bold text-gray-800">{req.user?.nama}</p>
      <p className="text-[10px] text-gray-400 mb-1.5">{getKelas(req.user)}</p>
      <div className="flex flex-wrap gap-1">
        {transaksiTipes.map((tipe) => (
          <span key={tipe} className={`text-[10px] px-2 py-0.5 rounded-sm ${TIPE_STYLE[tipe] ?? "border border-gray-300 text-gray-500"}`}>
            {tipe}
          </span>
        ))}
        {hasBooking && (
          <span className="text-[10px] px-2 py-0.5 rounded-sm border border-purple-300 text-purple-600">
            Booking
          </span>
        )}
      </div>
    </div>
  );
}

export default function TransactionDetail() {
  const [transaksi, setTransaksi] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterKiri, setFilterKiri] = useState("Semua");
  const [filterKanan, setFilterKanan] = useState("Semua");
  const [search, setSearch] = useState("");
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [showModalDenda, setShowModalDenda] = useState(false);
  const [showModalBooking, setShowModalBooking] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formDenda, setFormDenda] = useState({});

  const fetchData = () => {
    Promise.all([
      fetch("/api/transaksi/admin").then((r) => r.json()),
      fetch("/api/booking/admin").then((r) => r.json()),
    ]).then(([transaksiData, bookingData]) => {
      const arr = Array.isArray(transaksiData) ? transaksiData : [];
      const bookings = Array.isArray(bookingData) ? bookingData : [];

      const grouped = arr.reduce((acc, t) => {
        const uid = t.userId;
        if (!acc[uid]) acc[uid] = { user: t.user, transaksis: [] };
        acc[uid].transaksis.push(t);
        return acc;
      }, {});
      const list = Object.values(grouped);

      setTransaksi(list);
      setBookingList(bookings);

      const merged = [...list];
      bookings.forEach((b) => {
        const uid = b.userId;
        const existing = merged.find((u) => u.user?.id === uid);
        if (existing) {
          if (!existing.bookings) existing.bookings = [];
          existing.bookings.push(b);
        } else {
          merged.push({ user: b.user, transaksis: [], bookings: [b] });
        }
      });

      setSelected((prev) => {
        if (!prev && merged.length > 0) return merged[0];
        const updated = merged.find((l) => l.user?.id === prev?.user?.id);
        return updated ?? prev;
      });
    }).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const kondisiBuku = selectedTransaksi?.detailTrans?.[0]?.kondisiBuku;
  const isTerlambat = selectedTransaksi?.status === "TERLAMBAT";
  const isBukuBaik = kondisiBuku === "BAIK";

  const handleKonfirmasi = (t) => {
    setSelectedTransaksi(t);
    const dendaTerlambat = t.status === "TERLAMBAT" ? (t.denda?.nilaiDenda ?? 0) : 0;
    setFormDenda({ dendaTerlambat, dendaRusak: "", alasan: "" });
    setShowModalDenda(true);
  };

  const handleKonfirmasiBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModalBooking(true);
  };

  const handleBatalBooking = async (bookingId) => {
    if (!confirm("Yakin mau batalkan booking ini?")) return;
    await fetch(`/api/booking/${bookingId}`, { method: "DELETE" });
    fetchData();
  };

  const handleSubmitKonfirmasi = async (e) => {
    e.preventDefault();
    const totalDenda = (formDenda.dendaTerlambat || 0) + Number(formDenda.dendaRusak || 0);
    await fetch(`/api/transaksi/${selectedTransaksi.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "SELESAI",
        nilaiDenda: totalDenda > 0 ? totalDenda : null,
        alasan: formDenda.alasan || null,
      }),
    });
    setShowModalDenda(false);
    fetchData();
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    await fetch(`/api/booking/${selectedBooking.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setShowModalBooking(false);
    fetchData();
  };

  const allUsers = [...transaksi];
  bookingList.forEach((b) => {
    const uid = b.userId;
    const existing = allUsers.find((u) => u.user?.id === uid);
    if (existing) {
      if (!existing.bookings) existing.bookings = [];
      existing.bookings.push(b);
    } else {
      allUsers.push({ user: b.user, transaksis: [], bookings: [b] });
    }
  });

  const filtered = allUsers.filter((t) => {
    const tipes = [
      ...new Set([
        ...(t.transaksis ?? []).map((tr) => getTipe(tr.status)),
        ...(t.bookings ?? []).map(() => "Booking"),
      ]),
    ];
    const matchTipe = filterKiri === "Semua" || tipes.includes(filterKiri);
    const matchSearch = t.user?.nama?.toLowerCase().includes(search.toLowerCase());
    return matchTipe && matchSearch;
  });

  const selectedBookings = bookingList.filter((b) => b.userId === selected?.user?.id && b.status === "MENUNGGU");

  if (!selected) return <div className="p-4 text-sm text-gray-400">Belum ada request.</div>;

  return (
    <div className="flex flex-col min-h-[550px] gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <button onClick={() => setShowModalFilter(!showModalFilter)}
              className="flex items-center gap-2 border border-birutua text-[#2f3a56] text-[11px] px-6 py-2 rounded-md">
              Filter ▼
            </button>
            {showModalFilter && (
              <div className="absolute text-gray-600 top-10 left-0 bg-white border border-gray-200 rounded-md shadow-md p-3 z-50 w-48 space-y-2">
                <div className="flex justify-end">
                  <button onClick={() => setShowModalFilter(false)}>X</button>
                </div>
                {FILTER_OPTIONS.map((f) => (
                  <button key={f} onClick={() => { setFilterKiri(f); setShowModalFilter(false); }}
                    className="w-full text-left text-xs px-2 py-1.5 hover:bg-gray-50 rounded">
                    {filterKiri === f ? `✓ ${f}` : f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <input type="text" placeholder="Search for reports" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 text-black bg-white text-[11px] pl-8 pr-3 py-2 rounded-md w-56" />
          <span className="absolute left-2 top-2 text-black items-center text-xs">
            <Icon icon="material-symbols:search" className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border flex-1 border-gray-100 flex overflow-hidden">
        {/* LEFT */}
        <div className="w-[210px] border-r border-gray-100 flex-shrink-0">
          <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-800">Incoming Request</span>
            <span className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded-full">New {filtered.length}</span>
          </div>
          <div>
            {filtered.map((req, i) => (
              <RequestItem key={i} req={req} isSelected={selected.user?.id === req.user?.id} onClick={() => setSelected(req)} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar nama={selected.user?.nama} />
              <div>
                <p className="text-sm font-bold text-gray-800">{selected.user?.nama}</p>
                <p className="text-[10px] text-gray-400">Kelas : {getKelas(selected.user)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-400 inline-block"></span>
              <span className="text-[11px] text-gray-500">{selected.transaksis?.length} Request</span>
            </div>
          </div>

          <div className="px-5 py-4 flex-1 overflow-auto">
            <p className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase mb-2">Riwayat Peminjaman</p>

            <div className="flex gap-2 mb-4">
              {FILTER_OPTIONS.map((f) => (
                <button key={f} onClick={() => setFilterKanan(f)}
                  className={`text-[10px] px-2.5 py-1 rounded-sm border transition-colors ${
                    filterKanan === f ? "border-gray-400 text-gray-700 bg-white" : "border-transparent text-gray-400 hover:border-gray-200"
                  }`}>
                  {filterKanan === f ? `✓ ${f}` : f}
                </button>
              ))}
            </div>

            {/* Tabel Transaksi */}
            {(filterKanan === "Semua" || filterKanan !== "Booking") && (
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-[11px] text-gray-600 min-w-[580px]">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      {TABLE_COLUMNS.map((col) => (
                        <th key={col} className="text-left pb-2 font-medium pr-6">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.transaksis
                      ?.filter((t) => filterKanan === "Semua" || getTipe(t.status) === filterKanan)
                      .flatMap((t) =>
                        t.detailTrans?.map((d, i) => (
                          <tr key={`${t.id}-${i}`} className="border-b border-gray-50">
                            <td className="py-2.5 pr-6">{d.buku?.judul}</td>
                            <td className="pr-6">{new Date(t.tanggalPinjam).toLocaleDateString("id-ID")}</td>
                            <td className="pr-6">{t.tanggalKembali ? new Date(t.tanggalKembali).toLocaleDateString("id-ID") : "-"}</td>
                            <td className="pr-6">{t.status === "MENUNGGU_CEKADMIN" || t.status === "TERLAMBAT" ? (d.kondisiBuku ?? "-") : "-"}</td>
                            <td className="pr-6"><StatusBadge status={t.status} /></td>
                            <td>
                              {(t.status === "MENUNGGU_CEKADMIN" || t.status === "TERLAMBAT") && (
                                <button onClick={() => handleKonfirmasi(t)}
                                  className="text-[10px] bg-birutua text-white px-3 py-1 rounded-md hover:opacity-80 transition">
                                  Konfirmasi
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tabel Booking */}
            {(filterKanan === "Semua" || filterKanan === "Booking") && selectedBookings.length > 0 && (
              <>
                <p className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase mb-2">Booking Menunggu</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-gray-600 min-w-[580px]">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-100">
                        {BOOKING_COLUMNS.map((col) => (
                          <th key={col} className="text-left pb-2 font-medium pr-6">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBookings.map((b) => (
                        <tr key={b.id} className="border-b border-gray-50">
                          <td className="py-2.5 pr-6">{b.buku?.judul ?? "-"}</td>
                          <td className="pr-6">{new Date(b.tanggalBooking).toLocaleDateString("id-ID")}</td>
                          <td className="pr-6">{b.transaksi?.detailTrans?.[0]?.jumlah ?? "-"}</td>
                          <td className="pr-6">{b.durasi ?? "-"} hari</td>
                          <td className="pr-6">
                            <span className="text-[10px] px-2 py-0.5 rounded-sm font-medium bg-purple-500 text-white">MENUNGGU</span>
                          </td>
                          <td className="flex gap-2 py-2.5">
                            <button onClick={() => handleKonfirmasiBooking(b)}
                              className="text-[10px] bg-birutua text-white px-3 py-1 rounded-md hover:opacity-80 transition">
                              Konfirmasi
                            </button>
                            <button onClick={() => handleBatalBooking(b.id)}
                              className="text-[10px] bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-md hover:opacity-80 transition">
                              Batal
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Pengembalian */}
      {showModalDenda && (
        <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
          <div className="card-f w-[450px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-title-desc">Konfirmasi Pengembalian</h2>
              <button onClick={() => setShowModalDenda(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleSubmitKonfirmasi} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Kondisi Buku</label>
                <p className="text-xs font-semibold text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50">{kondisiBuku ?? "-"}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Keterangan dari User</label>
                <p className="text-xs text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50">{selectedTransaksi?.keterangan ?? "-"}</p>
              </div>
              {isTerlambat && isBukuBaik && (
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Denda Keterlambatan (Rp)</label>
                  <input type="text" readOnly value={`Rp ${(formDenda.dendaTerlambat ?? 0).toLocaleString("id-ID")}`}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-gray-50 text-gray-500" />
                </div>
              )}
              {isTerlambat && !isBukuBaik && (
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Denda Keterlambatan + Kerusakan (Rp)</label>
                  <input type="text" value={formDenda.dendaRusak || ""}
                    onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); setFormDenda({ ...formDenda, dendaRusak: val }); }}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs"
                    placeholder={`Denda terlambat Rp ${(formDenda.dendaTerlambat ?? 0).toLocaleString("id-ID")} + kerusakan`} />
                </div>
              )}
              {!isTerlambat && (
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Denda Kerusakan (Rp) — kosongkan jika tidak ada</label>
                  <input type="text" value={formDenda.dendaRusak || ""}
                    onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ""); setFormDenda({ ...formDenda, dendaRusak: val }); }}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs" placeholder="Contoh: 5000" />
                </div>
              )}
              {((formDenda.dendaTerlambat > 0) || formDenda.dendaRusak) && (
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Total Denda (Rp)</label>
                  <input type="text" readOnly
                    value={`Rp ${((formDenda.dendaTerlambat || 0) + Number(formDenda.dendaRusak || 0)).toLocaleString("id-ID")}`}
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-gray-50 font-semibold text-gray-700" />
                </div>
              )}
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Alasan Denda</label>
                <textarea value={formDenda.alasan || ""} onChange={(e) => setFormDenda({ ...formDenda, alasan: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs" rows={3} placeholder="Kosongkan jika tidak ada denda..." />
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowModalDenda(false)} className="text-xs px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="text-xs px-4 py-2 bg-birutua text-white rounded-md">Konfirmasi Selesai</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Booking */}
      {showModalBooking && (
        <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
          <div className="card-f w-[450px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-title-desc">Konfirmasi Booking</h2>
              <button onClick={() => setShowModalBooking(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleSubmitBooking} className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Buku</label>
                <p className="text-xs font-semibold text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50">
                  {selectedBooking?.buku?.judul ?? "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Peminjam</label>
                <p className="text-xs text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50">
                  {selectedBooking?.user?.nama ?? "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Durasi Pinjam</label>
                <p className="text-xs font-semibold text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50">
                  {selectedBooking?.durasi ?? "-"} hari
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Jumlah</label>
                <p className="text-xs font-semibold text-gray-700 border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50">
                  {selectedBooking?.transaksi?.detailTrans?.[0]?.jumlah ?? "-"} buku
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button type="button" onClick={() => setShowModalBooking(false)} className="text-xs px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="text-xs px-4 py-2 bg-birutua text-white rounded-md">Konfirmasi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}