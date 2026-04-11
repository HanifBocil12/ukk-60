"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [isGuru, setIsGuru] = useState(false);
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  // const [kelasId, setKelasId] = useState("");

  // TAMBAH INI
  const [form, setForm] = useState({
    nip: "",
    nisn: "",
    email: "",
    nama: "",
    password: "",
    kelasId: "",
  });

  // TAMBAH INI
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
    if (res.ok) router.push("/login");
  };

  // INI yang fetch dari DB
  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then(setClasses);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="relative hidden md:block md:w-1/2">
        <Image
          src="/kanan2.png"
          alt="Bookshelf"
          fill
          className="object-cover"
        />

        <Link
          href="/"
          className="absolute top-6 left-6 bg-slate-600 text-white p-3 rounded-full hover:bg-slate-700 transition"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100 px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-end mb-10 items-center gap-2">
            <Image src="/logo_web.png" width={40} height={40} alt="logo" />
            <span className="font-semibold text-black">ExpoBook</span>
          </div>

          <h1 className="text-3xl text-black font-semibold text-center mb-2">
            {isGuru ? "Register Guru" : "Register Siswa"}
          </h1>

          <p className="text-sm text-gray-500 text-center mb-8">
            {isGuru ? "Daftarkan akun guru anda" : "Daftarkan akun siswa anda"}
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NIP / NISN + EMAIL */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {isGuru ? "NIP" : "NISN"}
                </label>
                <input
                  required
                  type="text"
                  value={isGuru ? form.nip : form.nisn}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [isGuru ? "nip" : "nisn"]: e.target.value,
                    })
                  }
                  placeholder={isGuru ? "Enter your NIP" : "Enter your NISN"}
                  className="w-full px-4 py-2 border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({...form, email: e.target.value})
                  }
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>

            {/* NAMA + KELAS / WALAS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nama
                </label>
                <input
                  required
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({...form, nama: e.target.value})}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {isGuru ? "Walas" : "Kelas"}
                </label>

                <select
                  value={form.kelasId}
                  onChange={(e) => setForm({ ...form, kelasId: e.target.value })}
                  className="w-full px-4 py-2 border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  {isGuru && <option value="">None</option>}
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.tingkat} {cls.namaKelas}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            {/* TOGGLE ROLE */}
            <div className="text-sm text-gray-600 text-center">
              <button
                type="button"
                onClick={() => setIsGuru(!isGuru)}
                className="hover:underline"
              >
                {isGuru ? "Register sebagai Siswa" : "Register sebagai Guru"}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700 transition"
            >
              Register
            </button>

            {/* LOGIN LINK */}
            <p className="text-sm text-center text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
