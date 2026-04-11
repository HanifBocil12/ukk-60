"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronDown, Clock, FileText } from "lucide-react";

export default function StatusReservasiPage() {
  const [bookingList, setBookingList] = useState([]);

  useEffect(() => {
    fetch("/api/booking/my")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setBookingList(arr.filter((b) => b.status === "MENUNGGU"));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <div className="flex justify-center">
        <div className="w-[840px]">
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-2xl px-7 py-8 mb-6 flex items-center justify-between shadow-md">
            <div>
              <h1 className="text-white text-[24px] font-bold mb-2">Status Reservasi</h1>
              <p className="text-blue-100 text-[13px]">
                Kamu memiliki {bookingList.length} reservasi aktif saat ini.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-white text-gray-700 text-[11px] font-semibold px-5 py-2 rounded-lg shadow-sm hover:shadow transition">
              Filter <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {bookingList.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-10">Tidak ada reservasi aktif.</div>
          )}

          <div className="space-y-3">
            {bookingList.map((item) => {
              const buku = item.buku;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl px-5 py-4 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-[60px] h-[85px] rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                    <img src={buku?.image_buku} alt={buku?.judul} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[14px] font-bold text-gray-800">{buku?.judul ?? "-"}</h3>
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-0.5 rounded-full bg-yellow-100 text-yellow-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                        Menunggu
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{buku?.pengarang ?? "-"}</p>

                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs text-gray-500">Reservasi:</span>
                        <span className="text-xs font-semibold text-gray-700">
                          {new Date(item.tanggalBooking).toLocaleDateString("id-ID", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Akan diproses setelah buku tersedia
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-yellow-50 hover:border-yellow-300 transition text-gray-500 hover:text-yellow-500">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}