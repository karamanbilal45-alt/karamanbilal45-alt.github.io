let ogrenciler = [];
let editIndex = -1;

const kayitFormu = document.getElementById('kayitFormu');
const ogrenciTablosu = document.querySelector('#ogrenciTablosu tbody');
const toplamOgrenciSpan = document.getElementById('toplamOgrenci');
const kaydetBtn = document.getElementById('kaydetBtn');

// Kaydet veya Güncelle Butonu İşlemi
kayitFormu.addEventListener('submit', (e) => {
    e.preventDefault();

    const yeniOgrenci = {
        adSoyad: document.getElementById('adSoyad').value,
        telNo: document.getElementById('telNo').value,
        hoca: document.getElementById('hocaSecimi').value,
        grup: document.querySelector('input[name="grup"]:checked').value,
        cuz: document.getElementById('cuzNo').value
    };

    if (editIndex === -1) {
        // Yeni Kayıt Ekle
        ogrenciler.push(yeniOgrenci);
    } else {
        // Mevcut Kaydı Güncelle
        ogrenciler[editIndex] = yeniOgrenci;
        editIndex = -1;
        kaydetBtn.innerText = "KAYDI TAMAMLA VE LİSTEYE EKLE";
        kaydetBtn.style.backgroundColor = ""; // Eski rengine döner
    }

    kayitFormu.reset();
    listele();
});

// Listeleme Fonksiyonu
function listele() {
    ogrenciTablosu.innerHTML = "";
    ogrenciler.forEach((ogrenci, index) => {
        const row = `
            <tr>
                <td>${ogrenci.adSoyad}</td>
                <td>${ogrenci.telNo}</td>
                <td>${ogrenci.hoca}</td>
                <td>${ogrenci.grup}</td>
                <td>${ogrenci.cuz}</td>
                <td>
                    <button onclick="duzenle(${index})" style="background:#ffc107; color:black; border:none; padding:5px; cursor:pointer;">Düzenle</button>
                    <button onclick="sil(${index})" style="background:#dc3545; color:white; border:none; padding:5px; cursor:pointer;">Sil</button>
                </td>
            </tr>
        `;
        ogrenciTablosu.innerHTML += row;
    });
    toplamOgrenciSpan.innerText = `Toplam Kayıt: ${ogrenciler.length}`;
}

// Düzenle Fonksiyonu (Verileri Form Alanına Geri Yükler)
window.duzenle = function(index) {
    const ogrenci = ogrenciler[index];
    document.getElementById('adSoyad').value = ogrenci.adSoyad;
    document.getElementById('telNo').value = ogrenci.telNo;
    document.getElementById('hocaSecimi').value = ogrenci.hoca;
    document.getElementById('cuzNo').value = ogrenci.cuz;
    
    // Radyo butonu seçimi
    const radyolar = document.getElementsByName('grup');
    radyolar.forEach(r => {
        if(r.value === ogrenci.grup) r.checked = true;
    });

    editIndex = index;
    kaydetBtn.innerText = "BİLGİLERİ GÜNCELLE";
    kaydetBtn.style.backgroundColor = "#28a745"; // Güncelleme modunda yeşil olur
    window.scrollTo(0, 0); // Sayfayı forma kaydırır
};

// Silme Fonksiyonu
window.sil = function(index) {
    if(confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
        ogrenciler.splice(index, 1);
        listele();
    }
};

// Basit Slider Fonksiyonu (Hata vermemesi için)
let currentSlide = 0;
window.changeSlide = function(n) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
};