"use client";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { HexColorPicker } from "react-colorful";
import { fetchData } from "@/lib/fetch";

export default function DetailJenis({ onSelectJenisBuku, onViewAll }) {
  const [search, setSearch] = useState("");
  const [jenisBuku, setJenisBuku] = useState([]);
  const [modal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  const [colorOpen, setColorOpen] = useState(false);

  const [iconOpen, setIconOpen] = useState(false);
  const [iconQuery, setIconQuery] = useState("");
  const [iconList, setIconList] = useState([]);

  useEffect(() => {
    if (!iconQuery) return;
    const t = setTimeout(async () => {
      const res = await fetch(
        `https://api.iconify.design/search?query=${iconQuery}&limit=120`,
      );
      const data = await res.json();
      setIconList(data.icons || []);
    }, 400);
    return () => clearTimeout(t);
  }, [iconQuery]);

  const filterJenisBuku = jenisBuku.filter((jenis) =>
    jenis.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", form.nama);
    formData.append("icon", form.icon);
    formData.append("deskripsi", form.deskripsi);
    formData.append("color", form.color);

    const res = await fetch("/api/jenis-buku", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setShowModal(false);
      fetchData("/api/jenis-buku",setJenisBuku)
    }
  };

  const handleDelet = async (id) => {
    if(!confirm("Yakin mau hapus ?")) return

    const res = await fetch(`/api/jenis-buku/${id}`, {
        method: "DELETE",
    })

    if (res.ok) {
       setJenisBuku(jenisBuku.filter((b) => b.id !== id))
    }
  }

  useEffect(() => {
    fetchData("/api/jenis-buku",setJenisBuku)
  }, []);
  
  return (
    <>
      <div className="flex-1 flex flex-col min-h-[550px] gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-birutua text-white text-[11px] px-4 py-2 rounded-full"
            >
              Add Category
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for reports"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 text-black bg-white text-[11px] pl-8 pr-3 py-2 rounded-md w-56"
              />
              <span className="absolute left-2 top-2 text-black items-center text-xs">
                <Icon
                  icon="material-symbols:search"
                  alt="a"
                  className="h-5 w-5"
                ></Icon>
              </span>
            </div>
          </div>
          <button
            onClick={() => onViewAll()}
            className="flex items-center text-birumuda gap-2 font-semibold text-normal-desc"
          >
            Close View all
            <Image src="arrow_forward.svg" width={16} height={16}></Image>
          </button>
        </div>

        <div className="h-[600px] overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-4">
            {filterJenisBuku.map((jenis) => (
              <div
                key={jenis.id}
                onClick={() => onSelectJenisBuku(jenis.id)}
                className="card text-black overflow-hidden"
              >
                <div className="flex items-center text-title-desc gap-2">
                  <div
                    className="flex items-center justify-center rounded-sm h-6 w-6 "
                    style={{ background: `${jenis.color}40` }}
                  >
                    <Icon
                      icon={jenis.icon}
                      className="text-red-500  w-5 h-5"
                      style={{ color: `${jenis.color}` }}
                    />
                  </div>
                  {jenis.nama}
                </div>
                <div className="text-gray-500">{jenis.deskripsi}</div>
                {/* Footer */}
                <div className="flex gap-2 items-center pb-3 justify-start">
                  <button className="flex-1 flex border items-center justify-center gap-1 border-gray-400 text-black text-sm py-1 rounded-lg">
                    <Icon icon="mdi:pencil-outline" className="w-4 h-4"></Icon>{" "}
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                        e.stopPropagation(); // ← tambah ini
                        handleDelet(jenis.id);
                    }}
                    className="flex-1 flex bg-red-50 text-red-500 border items-center justify-center gap-1 border-red-200 text-sm py-1 rounded-lg"
                  >
                    <Icon
                      icon="material-symbols:delete-rounded"
                      className="w-4 h-4"
                    ></Icon>{" "}
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {modal && (
          <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
            <div className="card-f w-[450px]">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-title-desc">Add Category</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {/* form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="">
                  <label className="text-normal-desc text-grey-600 mb-1 block">
                    Nama
                  </label>
                  <input
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full border border-gray-300 rouded-card px-3 py-1.5 text-normal-desc"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Icon Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setIconOpen(true)}
                    className="w-full flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-xs"
                  >
                    {form.icon ? (
                      <>
                        <Icon icon={form.icon} className="w-4 h-4" />
                        {form.icon}
                      </>
                    ) : (
                      "Pilih icon..."
                    )}
                  </button>
                </div>
                {/* Modal icon */}
                {iconOpen && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[500px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                      <div className="flex justify-between px-4 py-3 border-b">
                        <span className="text-sm font-semibold">
                          Pilih Icon
                        </span>
                        <button
                          type="button"
                          onClick={() => setIconOpen(false)}
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search..."
                        value={iconQuery}
                        onChange={(e) => setIconQuery(e.target.value)}
                        className="mx-4 my-3 border rounded-md px-3 py-1.5 text-sm"
                      />
                      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-10 gap-1">
                        {iconList.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            title={icon}
                            onClick={() => {
                              setForm({ ...form, icon });
                              setIconOpen(false);
                            }}
                            className="p-2 rounded hover:bg-gray-100"
                          >
                            <Icon
                              icon={icon}
                              className="w-5 h-5 text-gray-700"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Color */}
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Warna
                  </label>

                  {/* Trigger */}
                  <button
                    type="button"
                    onClick={() => setColorOpen(!colorOpen)}
                    className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5 text-xs w-full"
                  >
                    <div
                      className="w-4 h-4 rounded-sm border"
                      style={{ background: form.color || "#f59e0b" }}
                    />
                    <span className="text-gray-600">
                      {form.color || "#f59e0b"}
                    </span>
                  </button>

                  {/* Color picker */}
                  {colorOpen && (
                    <div className="mt-2">
                      <HexColorPicker
                        color={form.color || "#f59e0b"}
                        onChange={(color) => setForm({ ...form, color })}
                      />
                    </div>
                  )}
                </div>
                {/* desc */}
                <div className="">
                  <label className="text-xs text-gray-600 mb-1 block">
                    Deskripsi
                  </label>
                  <textarea
                    value={form.deskripsi}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs"
                    rows={3}
                  />
                </div>
                {/* Footer */}
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-xs px-4 py-2 border rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-4 py-2 bg-birutua text-white rounded-md"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
