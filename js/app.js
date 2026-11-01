"use strict";

console.log("P09 JavaScript aktif");

// P09 Tulis data produk sebagai array of object, bagian unggulan itu tugas mandiri p09
const produkUmkm = [
    { nama: "Soto Tauto Ayam", kategori: "Makanan", harga: 15000, stok: 10, unggulan: true, deskripsi: "Soto ayam dengan kuah tauco khas Pekalongan yang gurih." },
    { nama: "Soto Tauto Daging", kategori: "Makanan", harga: 20000, stok: 5, unggulan: true, deskripsi: "Soto tauco dengan potongan daging sapi yang nikmat." },
    { nama: "Soto Tauto Ayam + Daging", kategori: "Paket", harga: 25000, stok: 8, unggulan: false, deskripsi: "Kombinasi ayam dan daging sapi dalam satu porsi." },
    { nama: "Sate Telur Puyuh", kategori: "Pelengkap", harga: 3000, stok: 0, unggulan: false, deskripsi: "Sate telur puyuh bercita rasa gurih sebagai pendamping soto." },
];

console.table(produkUmkm);

// P09 Buat formatter rupiah
const formatRupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

// P09 Tes cepat:
console.log(formatRupiah.format(produkUmkm[0].harga));

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
        case "Pelengkap":
            return "Produk pelengkap pilihan";
        default:
            return "Produk UMKM";
    }
}

// Render data ke DOM dengan aman
function renderProduk() {
    const grid = document.querySelector("#produk-dinamis");
    const ringkasan = document.querySelector("#produk-ringkasan");

    if (!grid || !ringkasan) {
        return;
    }

    let jumlahTersedia = 0;
    let markup = "";

    for (const produk of produkUmkm) {
        const status = statusStok(produk.stok);
        const kategori = labelKategori(produk.kategori);
        const unggulan = labelUnggulan(produk.unggulan);
        // gunakan ternary untuk keputusan dua cabang yang pendek
        const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

        if (produk.stok > 0) {
            jumlahTersedia = jumlahTersedia + 1;
        }

        markup = markup + `
            <article class="js-product-card">
                <p class="product-feature">${unggulan}</p>
                <h3>${produk.nama}</h3>
                <p>${kategori}</p>
                <p>${produk.deskripsi}</p>
                <p class="price">${formatRupiah.format(produk.harga)}</p>
                <span class="stock-badge ${status.className}">${status.label}</span>
                <p>${labelAksi}</p>
            </article>
        `;
    }

    grid.innerHTML = markup;
    ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);