import { Icon } from "@iconify/react";
import { useState } from "react";

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  return (
    <>
      {/* MAIN CARD */}
      <main className="flex-1 bg-white rounded-lg shadow-md px-10 py-8 min-h-[550px]">
        {/* ACTION BAR */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-birutua text-white text-[11px] px-4 py-2 rounded-full"
            >
              Add Users
            </button>

            <button className="flex items-center gap-2 border border-birutua text-[#2f3a56] text-[11px] px-6 py-2 rounded-md">
              Filter ▼
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search for reports"
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

        {/* TABLE */}
        <table className="w-full text-[11px] text-gray-600">
          <thead className="text-gray-400">
            <tr>
              <th className="text-left pb-4">No</th>
              <th className="text-left pb-4">Nama</th>
              <th className="text-left pb-4">Nisn</th>
              <th className="text-left pb-4">Class</th>
              <th className="text-left pb-4">Walas</th>
              <th className="text-left pb-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4].map((item) => (
              <tr key={item}>
                <td className="py-3">1</td>
                <td>Asep</td>
                <td>900</td>
                <td>XII Rpl</td>
                <td>Tanya</td>
                <td className="text-gray-400">✏</td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="card w-[450px] bg-white">
              <div className="text-black flex justify-between">
                <div className="">Add Users</div>
                <button onClick={() => setShowModal(false)} className="">
                  X
                </button>
              </div>
              {/* form */}
              <form action="" className="space-y-3 text-black">
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
                <div className="">
                  <label className="text-normal-desc text-grey-600 mb-1 block">
                    Nisn
                  </label>
                  <input
                    value={form.nisn}
                    onChange={(e) => setForm({ ...form, nisn: e.target.value })}
                    className="w-full border border-gray-300 rouded-card px-3 py-1.5 text-normal-desc"
                  />
                </div>
                {/* Drop down */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-normasl-desc text-gray-600 mb-1 block">
                      Role
                    </label>
                    <select
                      name=""
                      id=""
                      value={form.jenisBukuId}
                      onChange={(e) =>
                        setForm({ ...form, jenisBukuId: e.target.value })
                      }
                      className="w-full border text-gray-600 border-gray-300 rounded-md px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Jenis</option>
                    </select>
                  </div>
                  {/* class */}
                  <div className="flex-1">
                    <label className="text-normasl-desc text-gray-600 mb-1 block">
                      Class
                    </label>
                    <select
                      name=""
                      id=""
                      value={form.jenisBukuId}
                      onChange={(e) =>
                        setForm({ ...form, jenisBukuId: e.target.value })
                      }
                      className="w-full border text-gray-600 border-gray-300 rounded-md px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Jenis</option>
                    </select>
                  </div>
                </div>

                <div className="">
                  <label className="text-normal-desc text-grey-600 mb-1 block">
                    Email
                  </label>
                  <input
                    value={form.nisn}
                    onChange={(e) => setForm({ ...form, nisn: e.target.value })}
                    className="w-full border border-gray-300 rouded-card px-3 py-1.5 text-normal-desc"
                  />
                </div>

                <div className="">
                  <label className="text-normal-desc text-grey-600 mb-1 block">
                    Password
                  </label>
                  <input
                    value={form.nisn}
                    onChange={(e) => setForm({ ...form, nisn: e.target.value })}
                    className="w-full border border-gray-300 rouded-card px-3 py-1.5 text-normal-desc"
                  />
                </div>

                {/* footer */}
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs border text-black rounded-md"
                  >
                    Batal
                  </button>
                  <button className="bg-birutua text-white px-4 text-xs rounded-md py-2">
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
