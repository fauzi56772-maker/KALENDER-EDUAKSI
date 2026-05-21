// Database Acara Bersejarah Tahun 1 Bawaan Awal
const databaseSejarah = {
    masehi: [
        { tahun: 1, tanggal: "01-01", acara: "Tahun Baru Kalender Julian Pertama di Romawi", tipe: "Hari Besar" },
        { tahun: 1, tanggal: "25-12", acara: "Perayaan Kelahiran Musim Dingin Klasik", tipe: "Spesial" }
    ],
    hijriyah: [
        { tahun: 1, tanggal: "01-01", acara: "1 Muharram: Hijrah Nabi Muhammad SAW dari Mekkah ke Madinah", tipe: "Hari Besar" }
    ],
    jawa: [
        { tahun: 1, tanggal: "01-01", acara: "1 Suro: Penyelarasan Kalender Jawa Mataram Sultan Agung", tipe: "Hari Besar" }
    ]
};

let kalenderAktif = "masehi"; 
// Catatan: Jika server Render kamu sudah aktif, ganti URL di bawah ini dengan link dari Render!
const URL_SERVER_PYTHON = "http://127.0.0.1:5000"; 

// SISTEM LOGIN & SECURITY VERIFIKASI
function prosesLoginSederhana(platform) {
    alert(`Mencoba mengontak server otentikasi aman ${platform}...`);
    document.getElementById('halamanLogin').classList.add('hidden');
    document.getElementById('halamanVerifikasi').classList.remove('hidden');
}

function mintaVerifikasiTinggi() {
    const email = document.getElementById('emailInput').value;
    if(!email) { alert("Tolong masukkan email kamu dulu!"); return; }
    
    fetch(`${URL_SERVER_PYTHON}/api/verifikasi-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email })
    })
    .then(res => res.json())
    .then(data => {
        alert("BOOM! " + data.pesan);
        document.getElementById('halamanLogin').classList.add('hidden');
        document.getElementById('halamanVerifikasi').classList.remove('hidden');
    })
    .catch(() => {
        alert("Gagal terhubung ke Python, menggunakan gerbang masuk cadangan.");
        document.getElementById('halamanLogin').classList.add('hidden');
        document.getElementById('halamanVerifikasi').classList.remove('hidden');
    });
}

function boomMasukHalamanUtama() {
    document.getElementById('halamanVerifikasi').classList.add('hidden');
    alert("BOOM! Selamat datang di Dashboard Kalender!");
    gantiTipeKalender('masehi');
}

// SISTEM NAVIGASI 3 KALENDER & PERGANTIAN WARNA LANDING PAGE
function gantiTipeKalender(tipe) {
    kalenderAktif = tipe;
    const btnM = document.getElementById('btn-masehi');
    const btnH = document.getElementById('btn-hijriyah');
    const btnJ = document.getElementById('btn-jawa');
    const judul = document.getElementById('judulKalenderAktif');

    [btnM, btnH, btnJ].forEach(btn => btn.className = "py-2 rounded-lg text-xs font-bold transition cursor-pointer text-stone-600 hover:bg-white/50");

    if(tipe === "masehi") {
        btnM.className = "py-2 rounded-lg text-xs font-bold transition cursor-pointer bg-blue-600 text-white shadow";
        judul.innerHTML = `<i class="fa-solid fa-calendar-days mr-1.5"></i> Kalender Masehi`;
        document.body.className = "bg-blue-50 text-stone-900 font-sans min-h-screen pb-24 transition-colors duration-500";
    } else if(tipe === "hijriyah") {
        btnH.className = "py-2 rounded-lg text-xs font-bold transition cursor-pointer bg-emerald-600 text-white shadow";
        judul.innerHTML = `<i class="fa-solid fa-moon mr-1.5"></i> Kalender Hijriyah`;
        document.body.className = "bg-emerald-50 text-stone-900 font-sans min-h-screen pb-24 transition-colors duration-500";
    } else {
        btnJ.className = "py-2 rounded-lg text-xs font-bold transition cursor-pointer bg-amber-800 text-white shadow";
        judul.innerHTML = `<i class="fa-solid fa-wheat-awn mr-1.5"></i> Kalender Jawa`;
        document.body.className = "bg-amber-50 text-stone-900 font-sans min-h-screen pb-24 transition-colors duration-500";
    }
    tampilkanAngkaTahun();
    muatDataDariPython(1); 
}

function tampilkanAngkaTahun() {
    const box = document.getElementById('boxAngkaTahun');
    box.innerHTML = "";
    for(let i = 1; i <= 5; i++) {
        box.innerHTML += `
            <button onclick="muatDataDariPython(${i})" class="bg-white border border-stone-300 text-stone-800 p-2 text-xs font-bold rounded-xl text-center hover:border-stone-800 cursor-pointer transition">
                Thn ${i}
            </button>`;
    }
}

// BACA DATA REAL-TIME DARI BACKEND PYTHON FLASK
function muatDataDariPython(tahun) {
    const container = document.getElementById('listHariBesar');
    container.innerHTML = "<p class='text-xs text-stone-400 animate-pulse'>Mengambil data dari inti Python...</p>";

    fetch(`${URL_SERVER_PYTHON}/api/get-jadwal?kalender=${kalenderAktif}&tahun=${tahun}`)
    .then(res => res.json())
    .then(dataPython => {
        let bawaan = databaseSejarah[kalenderAktif].filter(item => item.tahun === tahun);
        let gabungan = [...bawaan, ...dataPython];

        if(gabungan.length === 0) {
            container.innerHTML = `<p class="text-xs text-stone-400 italic bg-stone-50 p-3 rounded-xl border border-stone-200">Belum ada acara di tahun ini.</p>`;
            return;
        }

        container.innerHTML = "";
        gabungan.forEach(item => {
            let warna = item.tipe === "Hari Besar" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800";
            container.innerHTML += `
                <div class="bg-stone-50 border border-stone-200 p-3 rounded-xl flex justify-between items-center shadow-xs">
                    <div>
                        <h5 class="text-xs font-bold text-stone-800">${item.acara}</h5>
                        <p class="text-[10px] text-stone-400 mt-0.5">Tanggal: ${item.tanggal} (Tahun ${tahun})</p>
                    </div>
                    <span class="text-[9px] px-2 py-0.5 rounded font-bold uppercase ${warna}">${item.tipe}</span>
                </div>`;
        });
    })
    .catch(() => {
        // Tampilan penyelamat apabila Python belum dihosting/aktif
        let bawaan = databaseSejarah[kalenderAktif].filter(item => item.tahun === tahun);
        container.innerHTML = "";
        bawaan.forEach(item => {
            container.innerHTML += `
                <div class="bg-stone-50 border border-stone-200 p-3 rounded-xl flex justify-between items-center">
                    <div><h5 class="text-xs font-bold text-stone-800">${item.acara}</h5><p class="text-[10px] text-stone-400">Tanggal: ${item.tanggal}</p></div>
                    <span class="text-[9px] px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold uppercase">${item.tipe}</span>
                </div>`;
        });
        container.innerHTML += `<p class="text-[10px] text-rose-500 bg-rose-50 p-2 rounded-lg text-center border border-rose-100 mt-2">Koneksi Python Offline. Jalankan app.py agar bisa tambah jadwal!</p>`;
    });
}

// KIRIM JADWAL MANDIRI KE SERVER PYTHON
function simpanAgendaMandiri() {
    const nama = document.getElementById('inputNamaKegiatan').value;
    const tanggalMentah = document.getElementById('inputTanggalKegiatan').value;

    if(!nama || !tanggalMentah) { alert("Isi nama kegiatan dan tanggal!"); return; }

    const bagian = tanggalMentah.split("-");
    const tahunTarget = parseInt(bagian[0]) - 2025 <= 0 ? 1 : parseInt(bagian[0]) - 2025;
    const tglBln = `${bagian[2]}-${bagian[1]}`;

    const dataKegiatan = {
        kalender: kalenderAktif,
        tahun: tahunTarget,
        tanggal: tglBln,
        acara: nama,
        tipe: "Mandiri"
    };

    fetch(`${URL_SERVER_PYTHON}/api/simpan-jadwal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataKegiatan)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.pesan);
        document.getElementById('inputNamaKegiatan').value = "";
        muatDataDariPython(tahunTarget);
    })
    .catch(() => alert("Gagal menyimpan! Nyalakan server Python kamu terlebih dahulu."));
}

// TEMPEL BERITA DETAIL JAM MENIT DETIK KE PYTHON
function tempelBeritaSejarah() {
    const isi = document.getElementById('isiBerita').value;
    const tgl = document.getElementById('beritaTgl').value;
    const thn = document.getElementById('beritaThn').value;
    const jam = document.getElementById('beritaJam').value || "00";
    const min = document.getElementById('beritaMenit').value || "00";
    const det = document.getElementById('beritaDetik').value || "00";

    if(!isi || !tgl || !thn) { alert("Isi teks berita, tanggal, dan tahun!"); return; }

    const bagian = tgl.split("-");
    const tglBln = `${bagian[2]}-${bagian[1]}`;

    const dataBerita = {
        kalender: kalenderAktif,
        tahun: parseInt(thn),
        tanggal: tglBln,
        acara: `[BERITA ${jam}:${min}:${det}] - ${isi}`,
        tipe: "Lini Berita"
    };

    fetch(`${URL_SERVER_PYTHON}/api/simpan-jadwal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBerita)
    })
    .then(res => res.json())
    .then(data => {
        alert("BOOM! " + data.pesan);
        document.getElementById('isiBerita').value = "";
        muatDataDariPython(parseInt(thn));
    })
    .catch(() => alert("Gagal menempel berita! Cek server Python backend-mu."));
}

// FITUR PENCARIAN INSTAN
function cariKejadianSejarah() {
    const keyword = document.getElementById('inputCariKalender').value.toLowerCase();
    const container = document.getElementById('listHariBesar');
    container.innerHTML = "<p class='text-xs text-stone-400'>Mencari di pusaran waktu...</p>";

    fetch(`${URL_SERVER_PYTHON}/api/get-jadwal?kalender=${kalenderAktif}&tahun=1`)
    .then(res => res.json())
    .then(dataPython => {
        let bawaan = databaseSejarah[kalenderAktif];
        let gabungan = [...bawaan, ...dataPython];

        let hasilFilter = gabungan.filter(item => {
            return item.acara.toLowerCase().includes(keyword) || 
                   item.tanggal.toLowerCase().includes(keyword) || 
                   item.tahun.toString().includes(keyword);
        });

        if(hasilFilter.length === 0) {
            container.innerHTML = `<p class="text-xs text-stone-400 italic bg-stone-50 p-3 rounded-xl border border-stone-200">Data waktu tidak ditemukan.</p>`;
            return;
        }

        container.innerHTML = "";
        hasilFilter.forEach(item => {
            container.innerHTML += `
                <div class="bg-stone-50 border border-stone-200 p-3 rounded-xl flex justify-between items-center">
                    <div>
                        <h5 class="text-xs font-bold text-stone-800">${item.acara}</h5>
                        <p class="text-[10px] text-stone-400 mt-0.5">Tahun: ${item.tahun} | Tanggal: ${item.tanggal}</p>
                    </div>
                    <span class="text-[8px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded font-mono uppercase">${item.tipe}</span>
                </div>`;
        });
    });
}

