"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import UserManagement from "../components/admin/UserManagement";
import BookManagement from "../components/admin/BookManagement";
import JenisBooks from "../components/admin/JenisBooksManagement";
import DetailJenis from "../components/admin/detailJenisManagement";
import TransactionDetail from "../components/admin/transactionManagement";
import Analisa from "../components/admin/analisa";

export default function AdminPage(params) {
  const [activePage, setActivePage] = useState("landingjenis");
  const [filterJenisId, setFilterJenisId] = useState(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };
  
  return (
    <>
      <div className="bg-white shadow-md">
        <div className="flex justify-center items-center">
          <div className="flex items-center">
            <Image src="/logo_web.png" alt="logo_web" width={80} height={80} />
          </div>
          <div className="font-semibold text-black">ExpoBook</div>
        </div>
      </div>

      <div className="px-14 py-8 flex gap-8 min-h-[550px]">
        {/* SIDEBAR */}
        <aside className="w-[215px] bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            <img
              src="https://i.pravatar.cc/70"
              className="w-14 h-14 rounded-full mb-3"
              alt="profile"
            />
            <div className="text-sm font-semibold text-gray-700">
              Dwi Annisa
            </div>
            <div className="text-[10px] mt-1 px-3 py-1 bg-green-100 text-green-600 rounded-full">
              Administrator
            </div>
          </div>

          <div className="mt-8 space-y-3 text-xs">
            {[
              { name: "User Management", onclick:"user" },
              { name: "Book Management", onclick:"landingjenis" },
              { name: "Transaction", onclick: "transaction" },
              { name: "Analisa", onclick: "analisa" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setActivePage(item.onclick)}
                className="text-center block w-full  bg-[#e3e7f2] px-4 py-2 rounded-full text-gray-600 hover:bg-[#d4d9ec] transition"
              >
                {item.name}
              </button>
            ))}
            <button onClick={handleLogout} className="text-center block w-full bg-[#e3e7f2] px-4 py-2 rounded-full text-gray-600 hover:bg-[#d4d9ec] transition">
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 flex-col">
          <h1 className="text-lg font-semibold text-[#334155] mb-8">
            { activePage === "user" && "User Management" }
            { activePage === "landingjenis" && "Book Management" }
            { activePage === "detailjenis" && "Jenis Book Management" }
            { activePage === "books" && "Book Management" }
            { activePage === "transaction" && "Transaction Management" }
            { activePage === "analisa" && "Analisa" }
          </h1>
          {/* <UserManagement></UserManagement> */}
          {/* <BookManagement></BookManagement> */}
          {activePage === "user" && (
            <UserManagement></UserManagement>
          )}
          {activePage === "transaction" && (
            <TransactionDetail></TransactionDetail>
          )}
          {activePage === "analisa" && (
            <Analisa></Analisa>
          )}
          {activePage === "landingjenis" && (
            <JenisBooks
              onSelectJenisBuku ={(id) => {
                setFilterJenisId(id);
                setActivePage("books");
              }}
              onViewAll= {() => setActivePage("detailjenis")}
            />
          )}
          {activePage === "books" && (
            <BookManagement filterJenisId={filterJenisId} 
              onSelectJenisBuku={() => setActivePage("landingjenis")}
            />
          )}
          {activePage === "detailjenis" && (
            <DetailJenis  onSelectJenisBuku ={(id) => {
                setFilterJenisId(id);
                setActivePage("books");
              }}
              onViewAll = {() => setActivePage("landingjenis")}
            />
          )}
        </div>
      </div>
    </>
  );
}
