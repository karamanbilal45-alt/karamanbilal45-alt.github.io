// 1. ADIM: Sayfa açıldığında verileri hafızadan çekiyoruz
// Eğer hafıza boşsa boş bir liste ([]) oluşturuyoruz
let ogrenciler = JSON.parse(localStorage.getItem('kuranKursuKayitlari')) || [];
let editIndex = -1;

const kayitFormu = document.getElementById('kayitFormu');
const ogrenciTablosu = document.querySelector('#ogrenciTablosu tbody');
const toplamOgrenciSpan = document.getElementById('toplamOgrenci');
const kaydetBtn = document.getElementById('kaydetBtn');

// Sayfa ilk açıldığında listeyi ekrana bastır
listele();

// 2. ADIM: Verileri tarayıcı hafızasına kaydeden yardımcı fonksiyon
function hafizayaKaydet() {
    localStorage.setItem('kuranKursuKayitlari', JSON.stringify(ogrenciler));
}

// Sınırları güncelleme fonksiyonu (Elif-Ba 55, Kur'an 30)
window.sinirlariGuncelle = function() {
    const grupElemani = document.querySelector('input[name="grup"]:checked');
    if(!grupElemani) return;

    const grup = grupElemani.value;
    const cuzNoInput = document.getElementById('cuzNo');
    const cuzEtiket = document.getElementById('cuzEtiket');

    if (grup === "Elif-Ba") {
        cuzEtiket.innerText = "Bulunduğu Sayfa (1-55)";
        cuzNoInput.max = 55;
        if (parseInt(cuzNoInput.value) > 55) cuzNoInput.value = 55;
    } else {
        cuzEtiket.innerText = "Bulunduğu Cüz (1-30)";
        cuzNoInput.max = 30;
        if (parseInt(cuzNoInput.value) > 30) cuzNoInput.value = 30;
    }
};

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
        ogrenciler.push(yeniOgrenci);
    } else {
        ogrenciler[editIndex] = yeniOgrenci;
        editIndex = -1;
        kaydetBtn.innerText = "KAYDI TAMAMLA VE LİSTEYE EKLE";
        kaydetBtn.style.backgroundColor = "";
    }

    hafizayaKaydet(); // Veriyi hafızaya ekle
    kayitFormu.reset();
    sinirlariGuncelle();
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
                    <button onclick="duzenle(${index})" style="background:#ffc107; color:black; border:none; padding:5px 10px; cursor:pointer; border-radius:3px; margin-right:5px;">Düzenle</button>
                    <button onclick="sil(${index})" style="background:#dc3545; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Sil</button>
                </td>
            </tr>
        `;
        ogrenciTablosu.innerHTML += row;
    });
    toplamOgrenciSpan.innerText = `Toplam Kayıt: ${ogrenciler.length}`;
}

// Düzenle Fonksiyonu
window.duzenle = function(index) {
    const ogrenci = ogrenciler[index];
    document.getElementById('adSoyad').value = ogrenci.adSoyad;
    document.getElementById('telNo').value = ogrenci.telNo;
    document.getElementById('hocaSecimi').value = ogrenci.hoca;
    
    const radyolar = document.getElementsByName('grup');
    radyolar.forEach(r => {
        if(r.value === ogrenci.grup) r.checked = true;
    });

    sinirlariGuncelle();
    document.getElementById('cuzNo').value = ogrenci.cuz;

    editIndex = index;
    kaydetBtn.innerText = "BİLGİLERİ GÜNCELLE";
    kaydetBtn.style.backgroundColor = "#28a745";
    window.scrollTo(0, 0);
};

// Silme Fonksiyonu
window.sil = function(index) {
    if(confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
        ogrenciler.splice(index, 1);
        hafizayaKaydet(); // Silme işleminden sonra hafızayı güncelle
        listele();
    }
};

// Slider Fonksiyonu
let currentSlide = 0;
window.changeSlide = function(n) {
    const slides = document.querySelectorAll('.slide');
    if(slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
};

// Sayfa açılışında sınırları ayarla
sinirlariGuncelle();
