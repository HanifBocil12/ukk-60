import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import { useEffectCustom } from "@/lib/useEffectCustom";

const GENRE_COLOR = {
  Fiksi: "bg-teal-500",
  "Self-Help": "bg-pink-500",
  Psikologi: "bg-teal-500",
  Pelajaran: "bg-violet-500",
};

function BookCard({ book, onViewAll }) {
  const badgeColor = GENRE_COLOR[book.jenisBuku?.nama] ?? "bg-slate-500";

  return (
    <div
      onClick={() => onViewAll(book.id)}
      className="w-[180px] h-[420px] rounded-xl shadow-sm flex flex-col overflow-hidden bg-birutua cursor-pointer"
    >
      {/* IMAGE SECTION */}
      <div className="h-[240px] p-0.5 mx-auto relative">
        <div className="absolute top-2 items-center gap-1 flex right-2 bg-white text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm font-medium">
          <Icon icon="ic:round-inventory-2" className="" width={15} height={15}></Icon>{" "}
          {book.stok} Stok
        </div>
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img src={book.image_buku} alt={book.judul} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* INFO SECTION */}
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

export default function Katalog_Book({ onViewAll, filterJenisId }) {
  const [jenisBuku, setJenisBuku] = useState([]);
  const [buku, setBuku] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBook = useCallback(
    () =>
      fetch("/api/books")
        .then((r) => r.json())
        .then((data) => {
          if (filterJenisId) {
            setBuku(data.filter((b) => b.jenisBukuId === filterJenisId));
          } else {
            setBuku(data);
          }
        }),
    [filterJenisId],
  );

  const filteredBooks = buku.filter((book) =>
    book.judul.toLowerCase().includes(search.toLowerCase()),
  );

  useEffectCustom("/api/jenis-buku", setJenisBuku);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex justify-center">
          <div className="w-fit">
            {/* NAV */}
            <div className="mb-6 flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="text-subtitle text-birutua">Katalog Buku</div>
                <div className="text-normal-desc text-gray-500">
                  Temukan buku favoritmu dari koleksi perpustakaan.
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center h-fit gap-2 border border-birutua text-[#2f3a56] text-[11px] px-6 py-2 rounded-md">
                  Filter ▼
                </button>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for reports"
                    className="border border-gray-300 text-black bg-white text-[11px] pl-8 pr-3 py-2 rounded-md w-56"
                  />
                  <span className="absolute left-2 top-2 text-black text-xs">
                    <Icon icon="material-symbols:search" className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Section per Jenis Buku */}
            {jenisBuku.map((jenis) => {
              const bukuPerJenis = filteredBooks.filter(
                (b) => b.jenisBukuId === jenis.id,
              );

              if (bukuPerJenis.length === 0) return null;

              return (
                <div key={jenis.id} className="mb-6 flex justify-center">
                  <div className="w-fit">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-800">
                          {jenis.nama}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Koleksi buku {jenis.nama.toLowerCase()}
                        </span>
                      </div>
                      <button className="text-[10px] text-teal-500 hover:underline">
                        Lihat Semua
                      </button>
                    </div>
                    <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden w-[860px]">
                      <div className="flex gap-10 pb-2" style={{ width: "max-content" }}>
                        {bukuPerJenis.map((b) => (
                          <BookCard key={b.id} book={b} onViewAll={onViewAll} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </>
  );
}