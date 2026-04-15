"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowRight, Calendar } from "lucide-react";

export default function DendaPage() {
  const [dendaList, setDendaList] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("/api/denda/my")
      .then((r) => r.json())
      .then((data) => setDendaList(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const totalDenda = dendaList.reduce((acc, d) => acc + (d.nilaiDenda ?? 0), 0);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <div className="flex justify-center">
        <div className="w-[840px]">
          {/* Page Header */}
          <div className="mb-5">
            <h1 className="text-subtitle text-birutua font-bold">Denda</h1>
            <p className="text-normal-desc text-gray-500 mt-1">
              Pantau buku yang telah kamu pinjam dan kembalikan semester ini.
            </p>
          </div>

          {/* Top Row */}
          <div className="flex gap-4 mb-4">
            {/* LEFT: Payment Card */}
            <div className="flex-1 bg-white rounded-xl px-7 py-6 shadow-sm">
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                  Payment overdue
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-1">Total Outstanding</p>

              <div className="flex items-end gap-1.5 mb-6">
                <span className="text-[46px] font-bold text-gray-800 leading-none tracking-tight">
                  Rp {totalDenda.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[13px] font-bold text-gray-800">
                      {dendaList.length} Denda
                    </p>
                    <p className="text-[11px] text-gray-400">Aktif</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Horizontal Scroll Cards */}
            {dendaList.length > 0 && (
              <div
                className="w-[250px] overflow-x-auto [&::-webkit-scrollbar]:hidden flex gap-3"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {dendaList.map((d) => (
                  <div
                    key={d.id}
                    className="w-[250px] flex-shrink-0 bg-[#2f3a56] rounded-xl p-5 shadow-sm flex flex-col justify-between"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <div className="flex gap-3 mb-5">
                      <div className="w-[58px] h-[82px] rounded-md overflow-hidden flex-shrink-0 shadow-lg">
                        <img
                          src={d.transaksi?.detailTrans?.[0]?.buku?.image_buku}
                          alt={d.transaksi?.detailTrans?.[0]?.buku?.judul}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-[13px] font-bold leading-tight mb-1">
                          {d.transaksi?.detailTrans?.[0]?.buku?.judul ?? "-"}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-400/20 px-2 py-0.5 rounded-full mb-1.5">
                          <Calendar className="w-3 h-3" />
                          {d.alasan ?? "-"}
                        </span>
                        <p className="text-slate-400 text-[10px] mt-1">
                          {new Date(d.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-white/10 mb-4" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-[10px] mb-0.5">
                          Nilai Denda
                        </p>
                        <p className="text-white text-[20px] font-bold leading-none">
                          Rp {d.nilaiDenda?.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-[#2f3a56] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-[14px] font-bold">
                Riwayat Denda
              </h2>
            </div>

            <div className="grid grid-cols-4 px-4 py-2.5 bg-white/5 rounded-lg mb-1">
              <span className="text-[11px] text-slate-400 font-semibold">
                Tanggal
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Buku
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Alasan
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Nilai
              </span>
            </div>

            <div className="max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {dendaList.map((d, i) => (
                <div key={d.id}>
                  <div className="grid grid-cols-4 px-4 py-3.5 rounded-lg hover:bg-white/5 transition items-center">
                    <span className="text-[11px] text-slate-300">
                      {new Date(d.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    <span className="text-[11px] text-white font-medium">
                      {d.transaksi?.detailTrans
                        ?.map((dt) => dt.buku?.judul)
                        .join(", ") ?? "-"}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {d.alasan ?? "-"}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-red-400/20 text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Belum Bayar
                      </span>
                      <span className="text-[12px] font-bold text-white">
                        Rp {d.nilaiDenda?.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  {i < dendaList.length - 1 && (
                    <div className="h-px bg-white/5 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
