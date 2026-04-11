"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Calendar, ChevronDown, SlidersHorizontal, BookCopy } from "lucide-react";

export default function RiwayatTransaksiPage() {
  const [search, setSearch] = useState("");
  const [transaksi, setTransaksi] = useState([]);

  useEffect(() => {
    fetch("/api/transaksi/my")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setTransaksi(arr.filter((t) => t.status === "SELESAI"));
      })
      .catch(console.error);
  }, []);

  const filtered = transaksi.filter((t) =>
    t.detailTrans?.some((d) =>
      d.buku?.judul?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <div className="flex justify-center">
        <div className="w-[840px]">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-subtitle text-birutua font-bold">Riwayat Transaksi</h1>
            <p className="text-normal-desc text-gray-500 mt-1">
              Pantau buku yang telah kamu pinjam dan kembalikan semester ini.
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Icon
                icon="material-symbols:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari judul buku, penulis, atau ID transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 bg-white text-[11px] text-gray-700 pl-9 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button className="w-10 h-10 border border-gray-200 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Transaction Cards */}
          <div className="space-y-3">
            {filtered.map((t) =>
              t.detailTrans?.map((d, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="bg-white rounded-2xl px-5 py-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-[60px] h-[85px] rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src={d.buku?.image_buku}
                      alt={d.buku?.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-gray-800">{d.buku?.judul}</h3>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Selesai
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{d.buku?.pengarang}</p>

                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5">
                        <BookCopy className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">Jumlah pinjaman:</span>
                        <span className="text-xs font-semibold text-gray-700">{d.jumlah} Buku</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs text-gray-500">Pinjam:</span>
                        <span className="text-xs font-semibold text-gray-700">
                          {new Date(t.tanggalPinjam).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-gray-500">Kembali:</span>
                        <span className="text-xs font-semibold text-gray-700">
                          {t.tanggalKembali
                            ? new Date(t.tanggalKembali).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Denda */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[11px] text-gray-400 mb-1">Denda Dibayar</p>
                    <p className={`text-[14px] font-bold ${t.denda ? "text-gray-800" : "text-gray-400"}`}>
                      {t.denda ? `Rp ${t.denda.nilaiDenda?.toLocaleString("id-ID")}` : "-"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}