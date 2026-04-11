"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const FILTER_OPTIONS = ["Peminjaman Bulanan", "Peminjaman Mingguan"];

function Avatar({ nama, size = "sm" }) {
  const initials = nama?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-xs";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function BadgeCount({ jumlah }) {
  return (
    <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">
      {jumlah}x
    </span>
  );
}

export default function Analisa() {
  const [filter, setFilter] = useState("Peminjaman Bulanan");
  const [chartData, setChartData] = useState([]);
  const [anggotaAktif, setAnggotaAktif] = useState([]);
  const [bukuPopuler, setBukuPopuler] = useState([]);
  const [dendaList, setDendaList] = useState([]);
  const [totalDenda, setTotalDenda] = useState(0);

  useEffect(() => {
    fetch("/api/transaksi")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];

        if (filter === "Peminjaman Bulanan") {
          const bulanMap = {};
          arr.forEach((t) => {
            const bulan = new Date(t.tanggalPinjam).toLocaleDateString("id-ID", { month: "short" });
            bulanMap[bulan] = (bulanMap[bulan] || 0) + 1;
          });
          setChartData(Object.entries(bulanMap).map(([bulan, jumlah]) => ({ bulan, jumlah })));
        } else {
          const mingguMap = {};
          arr.forEach((t) => {
            const date = new Date(t.tanggalPinjam);
            const minggu = `Mg ${Math.ceil(date.getDate() / 7)}`;
            mingguMap[minggu] = (mingguMap[minggu] || 0) + 1;
          });
          setChartData(Object.entries(mingguMap).map(([bulan, jumlah]) => ({ bulan, jumlah })));
        }

        const userMap = {};
        arr.forEach((t) => {
          const uid = t.userId;
          if (!userMap[uid]) userMap[uid] = { user: t.user, jumlah: 0 };
          userMap[uid].jumlah += 1;
        });
        setAnggotaAktif(Object.values(userMap).sort((a, b) => b.jumlah - a.jumlah));

        const bukuMap = {};
        arr.forEach((t) => {
          t.detailTrans?.forEach((d) => {
            const bid = d.bukuId;
            if (!bukuMap[bid]) bukuMap[bid] = { buku: d.buku, jumlah: 0 };
            bukuMap[bid].jumlah += 1;
          });
        });
        setBukuPopuler(Object.values(bukuMap).sort((a, b) => b.jumlah - a.jumlah));
      })
      .catch(console.error);

    fetch("/api/denda")
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setDendaList(arr);
        setTotalDenda(arr.reduce((acc, d) => acc + (d.nilaiDenda ?? 0), 0));
      })
      .catch(console.error);
  }, [filter]);

  return (
    <main className="flex-1 min-h-[550px] font-sans">
      <div className="grid grid-cols-2 gap-4">

        {/* Statistik Utama */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-gray-700">Statistik Utama</span>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="text-[11px] border border-gray-200 rounded-md px-2 py-1 text-gray-600"
            >
              {FILTER_OPTIONS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={20}>
              <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                cursor={{ fill: "#f3f4f6" }}
              />
              <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Anggota Paling Aktif */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">👥</span>
            <span className="text-sm font-semibold text-gray-700">Anggota Paling Aktif</span>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
            {anggotaAktif.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar nama={a.user?.nama} size="sm" />
                  <div>
                    <p className="text-[11px] font-semibold text-gray-800">{a.user?.nama}</p>
                    <p className="text-[10px] text-gray-400">
                      {a.user?.siswa?.nisn ?? a.user?.guru?.nip ?? "-"}
                    </p>
                  </div>
                </div>
                <BadgeCount jumlah={a.jumlah} />
              </div>
            ))}
          </div>
        </Card>

        {/* Laporan Denda */}
        <Card>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">↗</span>
            <span className="text-sm font-semibold text-gray-700">Laporan Denda</span>
          </div>
          <p className="text-xl font-bold text-gray-800 mt-2">
            Total Denda: Rp {totalDenda.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-gray-400 mb-4">{dendaList.length} transaksi dengan denda</p>
          <table className="w-full text-[11px] text-gray-600">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Anggota</th>
              </tr>
            </thead>
          </table>
          <div className="max-h-[150px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-[11px] text-gray-600">
              <tbody>
                {dendaList.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50">
                    <td className="py-2 font-semibold">{d.transaksi?.user?.nama ?? "-"}</td>
                    <td className="py-2 text-gray-400">Rp {d.nilaiDenda?.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Buku Paling Sering Dipinjam */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">📘</span>
            <span className="text-sm font-semibold text-gray-700">Buku Paling Sering Dipinjam</span>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
            {bukuPopuler.map((b, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-gray-800">{b.buku?.judul}</p>
                  <p className="text-[10px] text-gray-400">{b.buku?.pengarang}</p>
                </div>
                <BadgeCount jumlah={b.jumlah} />
              </div>
            ))}
          </div>
        </Card>

      </div>
    </main>
  );
}