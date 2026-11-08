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

// Buat function buatKartuProduk
function buatKartuProduk(produk) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);
    const unggulan = labelUnggulan(produk.unggulan);
    // gunakan ternary untuk keputusan dua cabang yang pendek
    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
    // challenge tambahkan properti diskonPersen pada satu produk // harga setelah diskon, dihitung oleh hitungHargaPromo
    const hargaPromo = hitungHargaPromo(produk);

    return `
        <article class="js-product-card">
            <p class="product-feature">${unggulan}</p>
            <h3>${produk.nama}</h3>
            <p>${kategori}</p>
            <p>${produk.deskripsi}</p>
               
            <p class="price">
                ${produk.diskonPersen > 0 && produk.diskonPersen <= 100
                    ? `<span class="discount-badge">Diskon ${produk.diskonPersen}%</span>
                        <del>${formatRupiah(produk.harga)}</del> 
                        <strong>${formatRupiah(hargaPromo)}</strong>`
                    : formatRupiah(produk.harga)}
            </p>
            <span class="stock-badge ${status.className}">${status.label}</span>
            <p>${labelAksi}</p>
        </article>
    `;
}

// Render data ke DOM dengan aman
function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");
    const unggulan = document.querySelector("#produk-unggulan");
    
    if (!grid) {
        return;
    }

    if (!ringkasan || !unggulan) {
        console.warn("Target render produk belum lengkap.");
        return;
    }

    const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
    const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
    const markupProduk = produkUmkm.map(buatKartuProduk).join("");

    grid.innerHTML = markupProduk;
    ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
    unggulan.textContent = produkUnggulan
        ? `Produk unggulan: ${produkUnggulan.nama}`
        : "Belum ada produk unggulan.";
}

document.addEventListener("DOMContentLoaded", renderProduk);