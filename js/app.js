"use strict";

console.log("P09 JavaScript aktif");

// P09 Tulis data produk sebagai array of object, bagian unggulan n deskripsi itu tugas mandiri p09, bagian diskonPersen itu challenge p09
const produkUmkm = [
    { nama: "Soto Tauto Ayam", kategori: "Makanan", harga: 15000, stok: 10, unggulan: true, diskonPersen: 0, deskripsi: "Soto ayam dengan kuah tauco khas Pekalongan yang gurih." },
    { nama: "Soto Tauto Daging", kategori: "Makanan", harga: 20000, stok: 5, unggulan: true, diskonPersen: 0, deskripsi: "Soto tauco dengan potongan daging sapi yang nikmat." },
    { nama: "Soto Tauto Ayam + Daging", kategori: "Paket", harga: 25000, stok: 8, unggulan: false, diskonPersen: 10, deskripsi: "Kombinasi ayam dan daging sapi dalam satu porsi." },
    { nama: "Sate Telur Puyuh", kategori: "Pelengkap", harga: 3000, stok: 0, unggulan: false, diskonPersen: 0, deskripsi: "Sate telur puyuh bercita rasa gurih sebagai pendamping soto." },
];

console.table(produkUmkm);

// P10 Tambahkan forEach untuk debugging terarah
produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});

// P10 Challenge: ringkasan kategori dengan forEach atau reduce sederhana.
const jumlahPerKategori = {};

produkUmkm.forEach((produk) => {
    jumlahPerKategori[produk.kategori] = (jumlahPerKategori[produk.kategori] || 0) + 1;
});

const daftarKategori = [];

for (const kategori in jumlahPerKategori) {
    daftarKategori.push(`${kategori}: ${jumlahPerKategori[kategori]} produk`);
}

console.log(daftarKategori.join(", "));

// P09 Buat formatter rupiah // P10 Buat function formatRupiah
function formatRupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(nilai);
}

// P09 Tes cepat:
console.log(formatRupiah(produkUmkm[0].harga));

// P09 Buat conditional status stok, Tambahkan function:
function statusStok(stok) {
    if (stok === 0) {
        return { label: "Habis", className: "empty" };
    }

    if (stok <= 5) {
        return { label: "Stok terbatas", className: "warning" };
    }

    return { label: "Tersedia", className: "" };
}

// Tes tiga kemungkinan:
console.log(statusStok(0));
console.log(statusStok(3));
console.log(statusStok(12));

// Tugas mandiri P09 gunakan conditional untuk minimal dua keputusan, misalnya status stok dan label produk unggulan
function labelUnggulan(unggulan) {
    if (unggulan) {
        return "Produk unggulan";
    } else {
        return "Produk reguler";
    }
}

// Tambahkan conditional ringkas dengan ternary dan switch
function labelKategori(kategori) {
    switch (kategori) {
        case "Makanan":
            return "Produk makanan pilihan";
        case "Paket":
            return "Paket pilihan";
        case "Pelengkap":
            return "Produk pelengkap pilihan";
        default:
            return "Produk UMKM";
    }
}

// P10 Pengayaan: hitung harga setelah diskon
function hitungHargaPromo(produk) {
    if (produk.diskonPersen > 0 && produk.diskonPersen <= 100) {
        return produk.harga - (produk.harga * produk.diskonPersen) / 100;
    }
    return produk.harga;
}

// P11 Buat DOM selection dan guard
const produkGrid = document.querySelector("#produk-dinamis");
const produkStatus = document.querySelector("#produk-ringkasan");
const unggulanInfo = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");
const tombolFilterStok = document.querySelectorAll("[data-filter-stok]"); // pengayaan: tombol filter stok
const kategoriInfo = document.querySelector("#produk-kategori-info"); // challenge: penghitung kategori aktif

// pengayaan: menyimpan pilihan filter yang sedang aktif
let kategoriDipilih = "Semua";
let stokDipilih = "Semua";

console.log("Grid produk:", produkGrid);
console.log("Status produk:", produkStatus);
console.log("Jumlah tombol filter:", tombolFilter.length);
console.log("Jumlah tombol stok:", tombolFilterStok.length);

// P11 Buat function buatElemenProduk
function buatElemenProduk(produk) {
    const card = document.createElement("article");
    card.classList.add("js-product-card");

    const title = document.createElement("h3");
    title.textContent = produk.nama;

    const category = document.createElement("p");
    category.classList.add("category-note");
    category.textContent = produk.kategori;

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = formatRupiah(produk.harga);

    const stock = document.createElement("span");
    const status = statusStok(produk.stok);
    stock.classList.add("stock-badge");
    if (status.className) {
        stock.classList.add(status.className);
    }
    stock.textContent = status.label;

    // P11 Uji remove element dan debugging
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Sembunyikan";
    removeButton.classList.add("ghost-button");

    removeButton.addEventListener("click", () => {
        card.remove();
        produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
    });

    card.append(title, category, price, stock, removeButton); 
    return card;
}

// P11 Buat empty state dan rendering data
function buatEmptyState(kategori) {
    const empty = document.createElement("p");
    empty.classList.add("empty-state");
    empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
    return empty;
}

// P11 Pasang event listener dan classList
tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
        const tombolAktif = event.currentTarget;
        const kategori = tombolAktif.dataset.filter;

        kategoriDipilih = kategori; // pengayaan: simpan kategori yang dipilih

        tombolFilter.forEach((item) => item.classList.remove("is-active"));
        tombolAktif.classList.add("is-active");

        renderProduk(kategori);
    });
});

// P11 Pengayaan: Event listener filter stok
tombolFilterStok.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
        const tombolAktif = event.currentTarget;
        stokDipilih = tombolAktif.dataset.filterStok;

        tombolFilterStok.forEach((item) => item.classList.remove("is-active"));
        tombolAktif.classList.add("is-active");

        renderProduk(kategoriDipilih);
    });
});

// Render data ke DOM dengan aman
function renderProduk(kategoriAktif = "Semua") {
    if (!produkGrid) {
        return;
    }

    if (!produkGrid || !produkStatus) {
        console.warn("Target render produk tidak ditemukan.");
        return;
    }

    const produkTampil = kategoriAktif === "Semua"
        ? produkUmkm
        : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

    // Pengayaan: filter stok
    const statustokTampil = stokDipilih === "Semua"
        ? produkTampil
        : produkTampil.filter((produk) => statusStok(produk.stok).label === stokDipilih);

    // Challenge: penghitung kategori aktif
    if (kategoriInfo) {
        kategoriInfo.textContent = `Kategori ${kategoriAktif} menampilkan ${statustokTampil.length} produk dari ${produkUmkm.length} total produk.`;
    }
        

    const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
    if (unggulanInfo) {
        unggulanInfo.textContent = produkUnggulan
            ? `Produk unggulan: ${produkUnggulan.nama}`
            : "Belum ada produk unggulan.";
    }
    
    produkGrid.replaceChildren();

    if (produkTampil.length === 0) {
        produkGrid.append(buatEmptyState(kategoriAktif));
        produkStatus.textContent = "0 produk ditemukan.";
        return;
    }

    // Periksa hasil filter stok
    if (statustokTampil.length === 0) {
        produkGrid.append(buatEmptyState(`${kategoriAktif} (${stokDipilih.toLowerCase()})`));
        produkStatus.textContent = "0 produk ditemukan.";
        return;
    }

    statustokTampil.forEach((produk) => {
        produkGrid.append(buatElemenProduk(produk));
    });

    produkStatus.textContent = `${statustokTampil.length} produk ditampilkan.`;
}

renderProduk();