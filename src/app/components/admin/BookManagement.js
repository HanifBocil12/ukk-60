"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { ArrowLeft } from "lucide-react";

// fieldConfig dikelompokkan sesuai posisi di layout
const fieldSingle = [
  { key: "judul", label: "Judul Buku", type: "text" },
];

const fieldGrid1 = [
  { key: "pengarang", label: "Pengarang", type: "text" },
  { key: "penerbit", label: "Penerbit", type: "text" },
];

const fieldGrid2 = [
  { key: "tahun", label: "Tahun", type: "number" },
  { key: "stok", label: "Stok", type: "number" },
];

const fieldBottom = [
  { key: "deskripsi", label: "Deskripsi", type: "textarea" },
];

const renderField = (config, form, setForm) => (
  <div key={config.key}>
    <label className="text-xs text-gray-600 mb-1 block">{config.label}</label>
    {config.type === "textarea" ? (
      <textarea
        value={form[config.key] || ""}
        onChange={(e) => setForm({ ...form, [config.key]: e.target.value })}
        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs"
        rows={3}
      />
    ) : (
      <input
        type={config.type}
        value={form[config.key] || ""}
        onChange={(e) => setForm({ ...form, [config.key]: e.target.value })}
        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs"
      />
    )}
  </div>
);

export default function BookManagement({ filterJenisId, onSelectJenisBuku }) {
  const [books, setBooks] = useState([]);
  const [jenisBuku, setJenisBuku] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({});
  useEffect(() => {
    fetch("/api/schema/Buku")
      .then((res) => res.json())
      .then(setForm);
  }, []);

  const filteredBooks = books.filter((book) =>
    book.judul.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await fetch("/api/books", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setShowModal(false);
      fetch("/api/books")
        .then((r) => r.json())
        .then((data) => {
          if (filterJenisId) {
            setBooks(data.filter((b) => b.jenisBukuId === filterJenisId));
          } else {
            setBooks(data);
          }
        });
    }
  };

  const handleDelet = async (id) => {
    if (!confirm("Yakin mau hapus buku ini ?")) return;

    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  useEffect(() => {
    fetch("/api/jenis-buku")
      .then((res) => res.json())
      .then(setJenisBuku);
  }, []);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (filterJenisId) {
          setBooks(data.filter((b) => b.jenisBukuId === filterJenisId));
        } else {
          setBooks(data);
        }
      });
  }, [filterJenisId]);

  return (
    <>
      <main className="flex flex-col flex-1 min-h-[550px] gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => onSelectJenisBuku()}
              className="text-white p-3 rounded-full bg-birutua"
            >
              <ArrowLeft size={10} />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-birutua text-white text-[11px] px-4 py-2 rounded-full"
            >
              Add Buku
            </button>
            <button className="flex items-center gap-2 border border-birutua text-[#2f3a56] text-[11px] px-6 py-2 rounded-md">
              Filter ▼
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for reports"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 text-black bg-white text-[11px] pl-8 pr-3 py-2 rounded-md w-56"
            />
            <span className="absolute left-2 top-2 text-black items-center text-xs">
              <Icon icon="material-symbols:search" className=" h-5 w-5"></Icon>
            </span>
          </div>
        </div>
        <div className="h-[600px] overflow-y-auto pr-1">
          <div className="grid grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={book.image_buku}
                    alt={book.judul}
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-birutua text-white text-[10px] px-2 py-0.5 rounded-full">
                    {book.stok} tersedia
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-title-desc text-black mb-1">{book.judul}</p>
                  <p className="text-xs text-gray-500">Penulis : {book.pengarang}</p>
                  <p className="text-xs text-gray-500">Kategori : {book.jenisBuku?.nama}</p>
                  <p className="text-xs text-gray-500">Penerbit : {book.penerbit}</p>
                  <p className="text-xs text-gray-500">Tahun terbit : {book.tahun}</p>
                </div>
                <div className="flex gap-2 px-3 pb-3">
                  <button className="flex-1 flex border items-center justify-center gap-1 border-gray-400 text-black text-sm py-1 rounded-lg">
                    <Icon icon="mdi:pencil-outline" className="w-4 h-4"></Icon> Edit
                  </button>
                  <button
                    onClick={() => handleDelet(book.id)}
                    className="flex-1 flex bg-red-50 text-red-500 border items-center justify-center gap-1 border-red-200 text-sm py-1 rounded-lg"
                  >
                    <Icon icon="material-symbols:delete-rounded" className="w-4 h-4"></Icon> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
            <div className="card-f w-[450px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-title-desc">Add Buku</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Judul */}
                {fieldSingle.map((c) => renderField(c, form, setForm))}

                {/* Dropdown Jenis Buku — tetap manual karena data dari DB */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Jenis Buku</label>
                  <select
                    value={form.jenisBukuId}
                    onChange={(e) => setForm({ ...form, jenisBukuId: e.target.value })}
                    className="w-full border text-gray-600 border-gray-300 rounded-md px-3 py-1.5 text-xs"
                  >
                    <option value="">Pilih Jenis</option>
                    {jenisBuku.map((j) => (
                      <option key={j.id} value={j.id}>{j.nama}</option>
                    ))}
                  </select>
                </div>

                {/* Pengarang & Penerbit */}
                <div className="grid grid-cols-2 gap-3">
                  {fieldGrid1.map((c) => renderField(c, form, setForm))}
                </div>

                {/* Tahun & Stok */}
                <div className="grid grid-cols-2 gap-3">
                  {fieldGrid2.map((c) => renderField(c, form, setForm))}
                </div>

                {/* Gambar — tetap manual karena tipe file */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Gambar Buku</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, image_buku: e.target.files[0] })}
                    className="w-full text-gray-600 border border-gray-300 rounded-md px-3 py-1.5 text-xs"
                  />
                </div>

                {/* Deskripsi */}
                {fieldBottom.map((c) => renderField(c, form, setForm))}

                <div className="flex justify-end gap-2 mt-5">
                  <button type="button" onClick={() => setShowModal(false)} className="text-xs px-4 py-2 border rounded-md">
                    Batal
                  </button>
                  <button type="submit" className="text-xs px-4 py-2 bg-birutua text-white rounded-md">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}