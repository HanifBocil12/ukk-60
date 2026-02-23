"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // TAMBAH
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // TAMBAH
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier, password }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.role === "GURU") router.push("/guru/dashboard");
      if (data.role === "SISWA") router.push("/siswa/dashboard");
      if (data.role === "ADMIN") router.push("/admin/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="relative hidden md:block md:w-1/2">
        <Image src="/kanan2.png" alt="Bookshelf" fill className="object-cover" />
        <Link href="/" className="absolute top-6 left-6 bg-slate-600 text-white p-3 rounded-full hover:bg-slate-700 transition">
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100 px-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-end mb-10 items-center gap-1">
            <Image src="/logo_web.png" width={45} height={45} alt="logo_web" />
            <span className="font-semibold text-black">ExpoBook</span>
          </div>

          <h1 className="text-3xl text-black font-semibold text-center mb-2">
            {isAdmin ? "Login Admin" : "Login User"}
          </h1>

          <p className="text-sm text-gray-500 text-center mb-8">
            {isAdmin
              ? "Enter your NIP and password to login as admin"
              : "Enter your NISN/email and password below to sign"}
          </p>

          {/* TAMBAH onSubmit */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {isAdmin ? "NIP" : "NISN"}
              </label>
              {/* TAMBAH value + onChange */}
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isAdmin ? "Enter your NIP" : "Enter your NISN/email"}
                className="w-full px-4 py-2 border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              {/* TAMBAH value + onChange */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-black text-black rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <button type="button" className="hover:underline" onClick={() => setIsAdmin(!isAdmin)}>
                {isAdmin ? "Login sebagai User" : "Login sebagai Admin"}
              </button>
              <button type="button" className="hover:underline">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700 transition">
              {isAdmin ? "Sign In as Admin" : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-sm text-center text-gray-500">
          Don't have an account?
          <Link href="/register" className="text-blue-600 hover:underline cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}