"use client";
import { useState } from "react";
import Dashboard from "@/app/components/users/Dashboard";
import Katalog_Book from "@/app/components/users/katalog_book";
import BookDetailPage from "@/app/components/users/book/Book";
import BukuSayaPage from "@/app/components/users/book/My_book";
import StatusReservasiPage from "@/app/components/users/reservasi";
import RiwayatTransaksiPage from "@/app/components/users/riwayat";
import DendaPage from "@/app/components/users/denda";
import Image from "next/image";
import { Icon } from "@iconify/react";

// ========================\

// MAIN
// ========================
export default function UserDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookId, setSelectedBookId] = useState(null);

  const NAV_ITEMS = [
    { icon: "material-symbols:dashboard", label: "Dashboard" },
    { icon: "material-symbols-light:menu-book", label: "Katalog Buku" },
    { icon: "mdi:book-multiple", label: "Buku Saya" },
    { icon: "carbon:time", label: "Reservasi" },
    { icon: "mdi:history", label: "Riwayat" },
    { icon: "ri:bank-card-2-line", label: "Denda" },
  ];

  return (
    <div
      className="flex h-screen bg-gray-50 overflow-hidden"
      style={{ fontFamily: "system-ui,sans-serif" }}
    >
      {/* SIDEBAR */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} bg-white border-r border-gray-100 flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300`}
      >
        {/* User */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                AF
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  Ahmad Fauzi
                </p>
                <p className="text-[9px] text-gray-400">Nilai: 4.5 (76 s.)</p>
              </div>
            </div>
            {/* CLOSE BUTTON — KEPT */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-300 hover:text-gray-500 text-sm leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                active === item.label
                  ? "bg-teal-50 text-teal-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon
                icon={item.icon}
                height={25}
                width={25}
                className="text-sm w-4 text-center"
              ></Icon>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-50 transition-colors">
            <span>↩</span> Keluar
          </button>
        </div>
      </aside>

      {/* Floating reopen button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-3 left-3 z-50 bg-white border border-gray-200 shadow-md w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-xs"
        >
          ☰
        </button>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-6">
          <div className="w-8 h-8" />
          <div className="flex items-center gap-2">
            <Image src="/logo_web.png" width={70} height={70} alt="logo" />
            <span className="font-semibold text-black">ExpoBook</span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/notif.png"
              width={30}
              height={30}
              alt="notif"
              unoptimized
            />
          </div>
        </header>
        {active == "Dashboard" && <Dashboard></Dashboard>}
        {active == "Katalog Buku" && (
          <Katalog_Book
            onViewAll={(id) => {
              setSelectedBookId(id);
              setActive("Detail Buku");
            }}
          ></Katalog_Book>
        )}
        {active == "Detail Buku" && (
          <BookDetailPage
            bookId={bookId}
            onViewAll={() => setActive("Katalog Buku")}
          ></BookDetailPage>
        )}
        {active == "Buku Saya" && <BukuSayaPage></BukuSayaPage>}
        {active == "Reservasi" && <StatusReservasiPage></StatusReservasiPage>}
        {active == "Riwayat" && <RiwayatTransaksiPage></RiwayatTransaksiPage>}
        {active == "Denda" && <DendaPage></DendaPage>}
      </div>
    </div>
  );
}
