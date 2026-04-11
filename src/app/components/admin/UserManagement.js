import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/fetch";

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [isGuru, setIsGuru] = useState(false);
  const [form, setForm] = useState({});
  const [roles, setRole] = useState([]);
  const [guru, setGuru] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [classes, setClasses] = useState([]);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const users = (isGuru ? guru : siswa).filter((user) => {
    if (!form.kelasId) return true;
    if (isGuru) {
      return user.guru?.walas?.kelas?.[0]?.id === parseInt(form.kelasId);
    } else {
      return user.siswa?.classId === parseInt(form.kelasId);
    }
  });

  const filterSearchUser = users.filter((user) => user.nama.toLowerCase().includes(search.toLowerCase()))

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isGuru
      ? "/api/auth/register/guru"
      : "/api/auth/register/siswa";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: form.nama,
        email: form.email,
        password: form.password,
        nip: form.nip,
        nisn: form.nisn,
        walasKelasId: form.kelasId || null,
        kelasId: form.kelasId || null,
      }),
    });
    if (res.ok) {
      setShowModal(false);
      if (isGuru) {
        fetchData("api/guru",setGuru)
      } else {
        fetchData("/api/siswa",setSiswa)
      }
    }
  };

  useEffect(() => {
    fetchData("/api/guru",setGuru);
    fetchData("/api/siswa",setSiswa);
    fetchData("/api/enums/role",setRole)
    fetchData("/api/classes",setClasses)
  }, []);

  // useEffect(() => {
  //   fetch("/api/auth/register/guru")
  //     .then(res => res.json())
  //     .then()
  // })

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

            <div className="relative">
              <button
                onClick={() => setShowModalFilter(true)}
                className="flex items-center gap-2 border border-birutua text-[#2f3a56] text-[11px] px-6 py-2 rounded-md"
              >
                Filter ▼
              </button>
              {showModalFilter && (
                <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-md shadow-md p-3 z-50 w-48 space-y-2">
                  <div className="text-black flex justify-end">
                    <button
                      onClick={() => setShowModalFilter(false)}
                      className=""
                    >
                      X
                    </button>
                  </div>
                  <select
                    value={form.role}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, role: val });
                      setIsGuru(val === "GURU");
                    }}
                    className="w-full border text-gray-600 border-gray-300 rounded-md px-2 py-1.5 text-xs"
                  >
                    <option value="">Semua Role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <select
                    value={form.kelasId}
                    onChange={(e) =>
                      setForm({ ...form, kelasId: e.target.value })
                    }
                    className="w-full border text-gray-600 border-gray-300 rounded-md px-2 py-1.5 text-xs"
                  >
                    <option value="">Semua Kelas</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.tingkat} {cls.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
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
            {filterSearchUser.map((user) => (
              <tr key={user.id}>
                <td className="py-3">{user.id}</td>
                <td>{user.nama}</td>
                <td>{isGuru ? user.guru?.nip : user.siswa?.nisn}</td>
                <td>
                  {isGuru
                    ? `${user.guru?.walas?.kelas?.[0]?.tingkat ?? "-"} ${user.guru?.walas?.kelas?.[0]?.namaKelas ?? ""}`
                    : `${user.siswa?.class?.tingkat ?? "-"} ${user.siswa?.class?.namaKelas ?? ""}`}
                </td>
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
              <form onSubmit={handleSubmit} className="space-y-3 text-black">
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
                    {isGuru ? "NIP" : "NISN"}
                  </label>
                  <input
                    value={isGuru ? form.nip : form.nisn}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [isGuru ? "nip" : "nisn"]: e.target.value,
                      })
                    }
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
                      name="role"
                      id=""
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="w-full border text-gray-600 border-gray-300 rounded-md px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Jenis</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* class */}
                  <div className="flex-1">
                    <label className="text-normasl-desc text-gray-600 mb-1 block">
                      {isGuru ? "Walas" : "Class"}
                    </label>
                    <select
                      name="classes"
                      id=""
                      value={form.kelasId}
                      onChange={(e) =>
                        setForm({ ...form, kelasId: e.target.value })
                      }
                      className="w-full border text-gray-600 border-gray-300 rounded-md px-3 py-1.5 text-xs"
                    >
                      <option value="">Pilih Jenis</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.tingkat} {cls.namaKelas}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="">
                  <label className="text-normal-desc text-grey-600 mb-1 block">
                    Email
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rouded-card px-3 py-1.5 text-normal-desc"
                  />
                </div>

                <div className="">
                  <label className="text-normal-desc text-grey-600 mb-1 block">
                    Password
                  </label>
                  <input
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full border border-gray-300 rouded-card px-3 py-1.5 text-normal-desc"
                  />
                </div>

                <div className="text-sm text-gray-600 text-center">
                  <button
                    type="button"
                    onClick={() => setIsGuru(!isGuru)}
                    className="hover:underline"
                  >
                    {isGuru
                      ? "Register sebagai Siswa"
                      : "Register sebagai Guru"}
                  </button>
                </div>

                {/* footer */}
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs border text-black rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-birutua text-white px-4 text-xs rounded-md py-2"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        ,
      </main>
    </>
  );
}
