// import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Login from "./login/page";
import BookSlider from "./components/BookSlider";

export default function name() {
  return (
    <>
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center gap-1">
            <Image
              src="/logo_web.png"
              width={80}
              height={80}
              alt="logo_web"
              className="block h-auto relative top-0.5"
            />
            <span className="font-semibold text-black">ExpoBook</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-600">
            <a href="#Jam" className="hover:text-black text-nav">
              Jam Operasional
            </a>
            <a href="#Fasilitas" className="hover:text-black text-nav">
              Fasilitas
            </a>
            <a href="#Layanan" className="hover:text-black text-nav">
              Layanan
            </a>
            <a href="#Koleksi" className="hover:text-black text-nav">
              Koleksi
            </a>
            <a href="#FAQ" className="hover:text-black text-nav">
              FAQ
            </a>
          </div>

          <div className="flex gap-3">
            <Link href="/register" className="border border-birutua hover:text-white hover:bg-birutua px-4 text-birutua py-1 rounded-card">
              Register
            </Link>
            <Link href="/login" className="bg-birutua text-white px-4 py-1 rounded-card">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto text-black flex flex-col md:flex-row items-start mb-24 gap-5 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1/2">
            <h1 className="text-title font-semibold text-black">
              Temukan dan pinjam buku pelajaran tanpa ribet langsung dari sini.
            </h1>
            <p className="text-subtitle text-black">
              mulyono pria solo jawa nyawit termul anjay xxxxxx meme spongebob
              tanpa celah
            </p>
            <div className="flex justify-between gap-12 md:gap-16">
              <div className="card overflow-hidden group relative">
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 
                  shadow-[inset_0_-4px_0_var(--color-birutua)] rounded-lg"
                ></div>
                <Image
                  src="/sca.png"
                  alt="search"
                  width={80}
                  height={80}
                />
                <div className="text-title-desc text-black">Cari Buku</div>
                <div className="text-desc text-black">
                  Temukan buku pelajaran, novel, dan referensi dengan cepat
                </div>
              </div>
              <div className="card overflow-hidden group relative">
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 
                  shadow-[inset_0_-4px_0_var(--color-birutua)] rounded-lg"
                ></div>
                <Image
                  src="/reservasi.png"
                  alt="search"
                  width={80}
                  height={80}
                />
                <div className="text-title-desc text-black">
                  Pinjam & Reservasi
                </div>
                <div className="text-desc text-black">
                  Pinjam buku langsung atau reservasi sebelum datang ke
                  perpustakaan
                </div>
              </div>
              <div className="card overflow-hidden group relative">
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 
                  shadow-[inset_0_-4px_0_var(--color-birutua)] rounded-lg"
                ></div>
                <Image src="/cekstok.png" alt="search" width={80} height={80} />
                <div className="text-title-desc text-black hov">
                  Cek Ketersediaan
                </div>
                <div className="text-desc text-black">
                  Lihat stok buku dan status peminjaman secara langsung
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1/3 flex justify-center">
            <Image 
              src="/buku.png"
              width={200}
              height={200}
              alt="buku"
              className=""
            />
          </div>
        </div>
      </div>

      {/* jam operasi */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-16 mb-24 mt-10">
        {/* LEFT */}
        <div className="w-full md:w-[480px]">
          <h1 className="text-title font-bold text-black mb-6" id="Jam">Jam Operasi</h1>
          <div className="flex gap-8">
            <Image
              src="/kanan.png"
              width={450}
              height={680}
              alt="bg"
              className="rounded-card-big object-cover"
            />
            <div className="w-full md:w-[568px]">
              <div className="gap-10 flex flex-col text-black w-[568px] h-[364px]">
                <div className="gap-4 flex flex-col">
                  <div className="flex items-center text-subtitle">
                    Jadwal Pelayanan
                  </div>
                  {/* CARD 1 */}
                  <div className="rounded-card-big border-2 border-black flex gap-4 items-center w-full h-[100px] px-6">
                    <div className="w-[140px] h-[56px] rounded-full bg-blue-100 flex items-center pl-6">
                      <Image
                        src="/calender.png"
                        height={24}
                        width={24}
                        alt="calender"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-title-desc">32</div>
                      <div className="flex items-center gap-2">
                        <Image src="/jam.png" height={8} width={8} alt="jam" />
                        <div className="text-normal-desc  opacity-40">
                          07.00 – 15.00
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2 */}
                  <div className="rounded-card-big border-2 border-black flex gap-4 items-center w-full h-[100px] px-6">
                    <div className="w-[140px] h-[56px] rounded-full bg-yellow-100 flex items-center pl-6">
                      <Image
                        src="/weekend.png"
                        height={24}
                        width={24}
                        alt="calender"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-title-desc">32</div>
                      <div className="flex items-center gap-2">
                        <Image src="/jam.png" height={8} width={8} alt="jam" />
                        <div className="text-normal-desc  opacity-40">
                          08.00 – 12.00
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3 */}
                  <div className="rounded-card-big border-2 border-black flex gap-4 items-center w-full h-[100px] px-6">
                    <div className="w-[140px] h-[56px] rounded-full bg-red-100 flex items-center pl-6">
                      <Image
                        src="/libur.png"
                        height={24}
                        width={24}
                        alt="calender"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-title-desc">32</div>
                      <div className="flex items-center gap-2">
                        <Image
                          src="/lock.png"
                          height={8}
                          width={8}
                          alt="ngembok"
                        />
                        <div className="text-nor text-red-600">Tutup</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card text-black">
                  <div className="flex justify-start gap-3">
                    <div className="flex items-start">
                      <Image
                        src="/coffe.png"
                        height={24}
                        width={24}
                        alt="calender"
                      />
                    </div>
                    <div className="flex gap-2 flex-col">
                      <div className="text-title-desc">Jam Istirahat</div>
                      <div className="text-normal-desc opacity-40">
                        12.00 – 13.00
                      </div>
                    </div>
                  </div>

                  {/* Divider Section */}
                  <div className="flex justify-start gap-3 border-t border-gray-300 pt-4 mt-4">
                    <div className="flex items-start">
                      <Image
                        src="/info.png"
                        height={18}
                        width={18}
                        alt="info"
                      />
                    </div>
                    <div className="text-normal-desc text- opacity-40">
                      Layanan peminjaman buku akan ditutup sebelum jam
                      operasional berakhir untuk proses rekapitulasi harian.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
      </div>
      {/* Fasilitas */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-5 mb-24 mt-10" >
        <div className="flex flex-col text-black gap-6">
          <div className="text-title font-bold" id="Fasilitas">Fasilitas</div>
          <div className="flex gap-6">
            <div className="flex card-f items-center drop-shadow-2xl">
              <div className="flex items-center">
                <Image
                  src="/printer.png"
                  height={100}
                  width={100}
                  alt="printer"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-title-desc">Printer Station</div>
                <div className="mt-3 text-normal-desc text-gray-600 text-center max-w-xs mx-auto leading-relaxed">
                  Tersedia fasilitas printer laser jet warna berkualitas tinggi
                  untuk mencetak dokumen, skripsi, dan tugas dengan cepat.
                </div>
              </div>
            </div>

            <div className="flex card-f items-center drop-shadow-2xl">
              <div className="flex items-center">
                <Image src="/ac.png" height={100} width={100} alt="ngembok" />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-title-desc">Full AC</div>
                <div className="mt-3 text-normal-desc text-gray-600 text-center max-w-xs mx-auto leading-relaxed">
                  Seluruh ruang baca dilengkapi pendingin ruangan sentral untuk
                  menciptakan suasana sejuk dan nyaman saat belajar.
                </div>
              </div>
            </div>

            <div className="flex card-f items-center drop-shadow-2xl">
              <div className="flex items-center">
                <Image
                  src="/loker.png"
                  height={100}
                  width={100}
                  alt="ngembok"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-title-desc">Locker Penyimpanan</div>
                <div className="mt-3 text-normal-desc text-gray-600 text-center max-w-xs mx-auto leading-relaxed">
                  Fasilitas rak penyimpanan tas disediakan demi kenyamanan dan
                  kerapian ruang baca
                </div>
              </div>
            </div>

            <div className="flex card-f items-center drop-shadow-2xl">
              <div className="flex items-center">
                <Image
                  src="/private.png"
                  height={100}
                  width={100}
                  alt="ngembok"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-title-desc">Private Desk</div>
                <div className="mt-3 text-normal-desc text-gray-600 text-center max-w-xs mx-auto leading-relaxed">
                  Tersedia meja belajar untuk menunjang kenyamanan membaca dan
                  belajar.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layanan */}
      <div className="max-w-6xl mx-auto text-black flex flex-col gap-6 mb-24 mt-10" >
        {/* TITLE */}
        <div className="text-title font-bold" id="Layanan">Layanan</div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* LEFT IMAGE */}
          <div className="flex justify-center md:justify-start w-full md:w-1/2">
            <Image
              src="/orang.png"
              width={600}
              height={400}
              alt="ngembok"
              className="object-contain"
            />
          </div>

          {/* RIGHT CARDS */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            {/* TOP ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="card relative p-6 flex flex-col items-start w-full max-w-lg rounded-lg">
                {/* BLUE BOTTOM LINE */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-100
                  shadow-[inset_0_-4px_0_var(--color-birutua)] rounded-lg"
                ></div>

                <Image src="/reservasi.png" height={50} width={50} alt="ngembok" />

                <div className="text-title-desc mt-3">Pinjam & Reservasi</div>

                <div className="text-normal-desc leading-relaxed mt-2">
                  Pinjam buku langsung atau reservasi sebelum datang ke
                  perpustakaan
                </div>
              </div>
              <div className="card relative p-6 flex flex-col items-start w-full max-w-lg rounded-lg">
                {/* BLUE BOTTOM LINE */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-100
                  shadow-[inset_0_-4px_0_var(--color-birutua)] rounded-lg"
                ></div>

                <Image src="/cekstok.png" height={50} width={50} alt="ngembok" />

                <div className="text-title-desc mt-3">Perpanjang Online</div>

                <div className="text-normal-desc leading-relaxed mt-2">
                  Perpanjang masa pinjam buku secara online tanpa perlu datang
                  langsung ke perpustakaan.
                </div>
              </div>
            </div>

            {/* BOTTOM CENTER CARD */}
            <div className="flex justify-center">
              <div className="card relative p-6 flex flex-col items-start w-full sm:w-1/2 rounded-lg">
                <div
                  className="absolute inset-0 pointer-events-none opacity-100
                  shadow-[inset_0_-4px_0_var(--color-birutua)] rounded-lg"
                ></div>
                <Image src="/sca.png" height={50} width={50} alt="ngembok" />
                <div className="text-title-desc mt-3">Cari Buku Instan</div>
                <div className="text-normal-desc leading-relaxed mt-2">
                  Temukan buku yang Anda butuhkan dengan cepat melalui fitur pencarian buku.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Koeksi */}
      <div className="max-w-6xl mx-auto text-black flex flex-col gap-6 mb-24 mt-10">
        <div className="text-title font-bold" id="Koleksi">Koleksi</div>
        <BookSlider></BookSlider>
      </div>

      {/* FAQ */}
      <div className="max-w-6xl mx-auto text-black flex flex-col gap-6 mb-24 mt-10">
        {/* TITLE */}
        <div className="text-title font-bold" id="FAQ">FAQ</div>

        {/* CONTENT ROW */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* LEFT IMAGE / MAP */}
          <div className="w-full md:w-1/2">
            <Image
              src="/orang.png" // ganti ke map kamu
              width={600}
              height={400}
              alt="map"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>

          {/* RIGHT FAQ CARDS */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            {/* CARD */}
            <div className="rounded-card border border-gray-400 shadow-sm p-6 bg-white">
              <div className="text-normal-desc font-medium">
                Apa yang harus dilakukan jika buku rusak atau hilang?
              </div>
              <div className="text-normal-desc mt-2 text-gray-600">
                Jika buku rusak atau hilang ....
              </div>
            </div>

            {/* CARD */}
            <div className="rounded-card border border-gray-400 shadow-sm p-6 bg-white">
              <div className="text-normal-desc font-medium">
                Apakah masa peminjaman buku bisa diperpanjang?
              </div>
              <div className="text-normal-desc mt-2 text-gray-600">
                Ya, masa peminjaman dapat diperpanjang selama buku tidak....
              </div>
            </div>

            {/* CARD */}
            <div className="rounded-card border border-gray-400 shadow-sm p-6 bg-white">
              <div className="text-normal-desc font-medium">
                Apakah masa peminjaman buku bisa diperpanjang?
              </div>
              <div className="text-normal-desc mt-2 text-gray-600">
                Ya, masa peminjaman dapat diperpanjang selama buku tidak....
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (punya kamu — cuma spacing dikit) */}
      </div>
      <footer className="bg-white drop-shadow-2xl mt-10 w-full">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo_web.png"
              width={80}
              height={80}
              alt="logo_web"
              className="block h-auto relative top-0.5"
            />
            <span className="font-semibold text-black text-lg">ExpoBook</span>
          </div>

          <div className="flex items-center gap-6 text-black">
            <div className="flex items-center gap-2">
              <Image src="/IG.png" width={35} height={35} alt="instagram" />
              <span className="text-normal-desc">@JawaIreng</span>
            </div>

            <div className="flex items-center gap-2">
              <Image src="/WA.png" width={35} height={35} alt="whatsapp" />
              <span className="text-normal-desc">+62888888</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-normal-desc px-4 pb-4 flex items-center text-black opacity-40">
          Jl. Contoh No. X, Kec. Contoh, Kota Contoh 12345
        </div>

        <div className="border-t" />

        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600 gap-2">
          <div>
            <div>Jl. Contoh No. X, Kec. Contoh, Kota Contoh 12345</div>
            <div>Made with ❤️ by M. Hanif</div>
          </div>

          <div className="flex gap-4 underline">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Settings</a>
          </div>
        </div>
      </footer>

      {/* .item>h1+p+a.button{Lorem} */}
    </>
  );
}
