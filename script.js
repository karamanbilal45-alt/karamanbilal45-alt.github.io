const brandData = {
    "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan"],
    "BMW": ["320i", "520d", "M4", "M5", "X5"],
    "Fiat": ["Egea", "500", "Doblo"],
    "Ford": ["Focus", "Fusion", "Transit"],
    "Opel": ["Astra", "Corsa", "Vectra"],
    "Renault": ["Clio", "Megane", "Austral"],
    "Mercedes-Benz": ["A Serisi", "C Serisi", "E Serisi", "G Serisi"]
};

let cars = JSON.parse(localStorage.getItem('cars')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initBrandDropdowns();
    initFilterBrandDropdown();
    renderGallery(cars);
});

function initBrandDropdowns() {
    const adminBrand = document.getElementById('brand');
    if(adminBrand) {
        adminBrand.innerHTML = '<option value="">Marka Seçin</option>';
        Object.keys(brandData).forEach(brand => {
            adminBrand.innerHTML += `<option value="${brand}">${brand}</option>`;
        });
    }
}

function initFilterBrandDropdown() {
    const filterBrand = document.getElementById('filterBrand');
    if (!filterBrand) return;
    filterBrand.innerHTML = '<option value="">Tüm Markalar</option>';
    Object.keys(brandData).forEach(brand => {
        filterBrand.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
}

function updateModelOptions() {
    const brand = document.getElementById('brand').value;
    const modelSelect = document.getElementById('model');
    modelSelect.innerHTML = '<option value="">Model Seçin</option>';
    if(brand) brandData[brand].forEach(m => modelSelect.innerHTML += `<option value="${m}">${m}</option>`);
}

function applyFilters() {
    const brand = document.getElementById('filterBrand').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const maxKm = document.getElementById('maxKm').value;
    const sortType = document.getElementById('sortOptions').value;

    let filteredCars = cars.filter(car => {
        const matchBrand = brand === "" || car.brand === brand;
        const matchMinPrice = minPrice === "" || Number(car.price) >= Number(minPrice);
        const matchMaxPrice = maxPrice === "" || Number(car.price) <= Number(maxPrice);
        const matchMaxKm = maxKm === "" || Number(car.km) <= Number(maxKm);
        
        return matchBrand && matchMinPrice && matchMaxPrice && matchMaxKm;
    });

    filteredCars.sort((a, b) => {
        switch (sortType) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'km-asc': return a.km - b.km;
            case 'km-desc': return b.km - a.km;
            case 'year-asc': return a.year - b.year;
            case 'year-desc': return b.year - a.year;
            default: return 0;
        }
    });

    renderGallery(filteredCars);
}

function handleFileUpload(event) {
    const files = event.target.files;
    const currentCount = document.querySelectorAll('.img-url-wrapper').length;

    if (currentCount + files.length > 10) {
        alert("Toplam fotoğraf sayısı 10'u geçemez!");
        return;
    }

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => addPhotoInput(e.target.result);
        reader.readAsDataURL(file);
    });
    event.target.value = ""; 
}

function addPhotoInput(value = "") {
    const container = document.getElementById('urlInputs');
    if (!container || container.children.length >= 10) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'img-url-wrapper';
    wrapper.innerHTML = `
        <input type="text" class="img-url" placeholder="Görsel URL veya Verisi" value="${value}" required>
        <button type="button" onclick="this.parentElement.remove()" class="btn-remove">X</button>
    `;
    container.appendChild(wrapper);
}

function renderGallery(data) {
    const gallery = document.getElementById('gallery');
    if(!gallery) return;
    gallery.innerHTML = data.length ? "" : "<p style='text-align:center; padding:50px;'>Sonuç bulunamadı veya henüz ilan eklenmemiş.</p>";
    
    data.forEach((car) => {
        const realIndex = cars.indexOf(car);
        gallery.innerHTML += `
            <div class="car-row" onclick="viewDetail(${realIndex})">
                <img src="${car.images && car.images[0] ? car.images[0] : 'https://via.placeholder.com/150'}" onerror="this.src='https://via.placeholder.com/150'">
                <div class="car-info-cols">
                    <div class="col-main">
                        <h3>${car.brand} ${car.model}</h3>
                        <p style="font-size:0.8rem; color:#888;">${car.description ? car.description.substring(0, 40) : ''}...</p>
                    </div>
                    <div class="col-specs">${car.year}</div>
                    <div class="col-specs">${Number(car.km).toLocaleString()} KM</div>
                    <div class="col-price">${Number(car.price).toLocaleString()} TL</div>
                </div>
            </div>
        `;
    });
}

// --- YENİLENEN ETKİLEYİCİ ARAÇ DETAY ALANI ---
function viewDetail(index) {
    const car = cars[index];
    const content = document.getElementById('carDetailContent');
    if(!content) return;
    
    let thumbnailsHTML = car.images ? car.images.map((img, i) => `<img src="${img}" class="${i === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${img}')">`).join("") : "";

    content.innerHTML = `
        <div class="detail-container">
            <div class="detail-header-premium">
                <div>
                    <span class="detail-badge">${car.vehicleStatus || 'İkinci El'}</span>
                    <h2>${car.brand} <span style="color:#fff;">${car.model}</span></h2>
                </div>
                <div class="detail-price-tag">
                    ${Number(car.price).toLocaleString()} <span>TL</span>
                </div>
            </div>
            
            <div class="detail-main-grid">
                <!-- Sol Taraf Fotoğraflar -->
                <div class="gallery-side-premium">
                    <div class="main-img-box"><img src="${car.images && car.images[0] ? car.images[0] : 'https://via.placeholder.com/150'}" id="currentDetailImg"></div>
                    <div class="thumb-list-premium">${thumbnailsHTML}</div>
                </div>
                
                <!-- Sağ Taraf Özellik Kartları (Grid Yapısı) -->
                <div class="specs-grid-container">
                    <div class="spec-card">
                        <div class="spec-label">Model Yılı</div>
                        <div class="spec-value">${car.year}</div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-label">Kilometre</div>
                        <div class="spec-value">${Number(car.km).toLocaleString()} KM</div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-label">Vites Tipi</div>
                        <div class="spec-value">${car.transmission || 'Manuel'}</div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-label">Yakıt Türü</div>
                        <div class="spec-value">${car.fuelType || 'Benzin'}</div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-label">Kasa Tipi</div>
                        <div class="spec-value">${car.bodyType || 'Sedan'}</div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-label">Renk</div>
                        <div class="spec-value">${car.color}</div>
                    </div>
                    <div class="spec-card highlight">
                        <div class="spec-label">Hasar Kaydı</div>
                        <div class="spec-value">${car.damageRecord || 'Yok'}</div>
                    </div>
                    <div class="spec-card highlight">
                        <div class="spec-label">Takas</div>
                        <div class="spec-value">${car.tradeStatus || 'Yok'}</div>
                    </div>
                </div>
            </div>
            
            <div class="description-box-premium">
                <h4>📋 Satıcı Açıklaması</h4>
                <p>${car.description || "Bu araç için ilan açıklaması girilmemiştir."}</p>
            </div>
        </div>
    `;
    document.getElementById('detailModal').style.display = 'block';
}

function changeMainImage(el, src) {
    document.getElementById('currentDetailImg').src = src;
    document.querySelectorAll('.thumb-list-premium img').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

// --- FORM & ADMİN ---
document.getElementById('carForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = document.getElementById('editIndex').value;
    const imageUrls = Array.from(document.querySelectorAll('.img-url')).map(input => input.value);

    const carData = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        year: document.getElementById('year').value,
        km: document.getElementById('km').value,
        color: document.getElementById('color').value,
        price: document.getElementById('price').value,
        transmission: document.getElementById('transmission').value,
        bodyType: document.getElementById('bodyType').value,
        fuelType: document.getElementById('fuelType').value,
        vehicleStatus: document.getElementById('vehicleStatus').value,
        damageRecord: document.getElementById('damageRecord').value,
        tradeStatus: document.getElementById('tradeStatus').value,
        description: document.getElementById('description').value,
        images: imageUrls
    };

    if(idx === "") cars.push(carData);
    else cars[parseInt(idx)] = carData;

    localStorage.setItem('cars', JSON.stringify(cars));
    closeModal('adminModal');
    applyFilters(); 
    renderAdminList();
});

function renderAdminList() {
    const list = document.getElementById('adminList');
    if(!list) return;
    list.innerHTML = "";
    cars.forEach((car, index) => {
        const imgSrc = car.images && car.images[0] ? car.images[0] : 'https://via.placeholder.com/150';
        list.innerHTML += `
            <tr>
                <td><img src="${imgSrc}" width="50" style="height:35px; object-fit:cover; border-radius:4px;"></td>
                <td>${car.brand} ${car.model}</td>
                <td>${Number(car.price).toLocaleString()} TL</td>
                <td>
                    <button onclick="editCar(${index})" class="btn-mini" style="background:#3498db;">Düzenle</button>
                    <button onclick="deleteCar(${index})" class="btn-mini">Sil</button>
                </td>
            </tr>
        `;
    });
}

function editCar(index) {
    const car = cars[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('brand').value = car.brand;
    updateModelOptions();
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('km').value = car.km;
    document.getElementById('color').value = car.color;
    document.getElementById('price').value = car.price;
    
    document.getElementById('transmission').value = car.transmission || "";
    document.getElementById('bodyType').value = car.bodyType || "";
    document.getElementById('fuelType').value = car.fuelType || "";
    document.getElementById('vehicleStatus').value = car.vehicleStatus || "";
    document.getElementById('damageRecord').value = car.damageRecord || "";
    document.getElementById('tradeStatus').value = car.tradeStatus || "";
    
    document.getElementById('description').value = car.description || "";
    document.getElementById('urlInputs').innerHTML = "";
    if(car.images) car.images.forEach(img => addPhotoInput(img));
    document.getElementById('modalTitle').innerText = "İlanı Güncelle";
    document.getElementById('adminModal').style.display = 'block';
}

function deleteCar(index) {
    if(confirm('Bu ilan silinecek?')) {
        cars.splice(index, 1);
        localStorage.setItem('cars', JSON.stringify(cars));
        renderAdminList();
        applyFilters();
    }
}

function openAdmin() { if(prompt("Şifre:") === "1234") { showSection('admin-view'); renderAdminList(); } }
function showSection(id) { document.getElementById('user-view').style.display = id === 'user-view' ? 'block' : 'none'; document.getElementById('admin-view').style.display = id === 'admin-view' ? 'block' : 'none'; }
function openAddModal() { 
    document.getElementById('carForm').reset(); 
    document.getElementById('editIndex').value = ""; 
    document.getElementById('urlInputs').innerHTML = "";
    addPhotoInput();
    document.getElementById('modalTitle').innerText = "Yeni Araç Ekle"; 
    document.getElementById('adminModal').style.display = 'block'; 
}
function closeModal(id) { document.getElementById(id).style.display = 'none'; }