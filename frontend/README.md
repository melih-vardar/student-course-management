# 🎓 Öğrenci ve Ders Yönetimi Sistemi - Frontend (React.js)

## 📋 Proje Hakkında
Bu proje, öğrenci ve ders yönetimini kapsayan kapsamlı bir web uygulamasının **frontend** kısmıdır. Sistem, öğrencilerin derslere kaydolmasını, admin kullanıcıların öğrenci ve ders yönetimini yapmasını sağlayan modern bir React.js platformudur.

## 👥 Kullanıcı Rolleri ve Yetkiler

### 👨‍💼 Admin Rolü
- ➕ Öğrenci ekleme, güncelleme ve silme
- 📚 Ders ekleme, güncelleme ve silme  
- 🔄 Öğrenci-ders eşleştirmelerini yönetme
- 📊 Tüm öğrenci ve ders listelerini görüntüleme
- 📝 Sistem genelinde tam yetki

### 👨‍🎓 Öğrenci Rolü
- 📝 Kendi profilini görüntüleme ve güncelleme
- 📚 Mevcut derslere kayıt olma
- ❌ Kayıtlı derslerden çıkma
- 📋 Kendi ders kayıtlarını görüntüleme

## 🛡️ Validasyonlar ve İş Kuralları

### 👤 Kullanıcı Validasyonları (Admin & Öğrenci)

**📧 Email adresi:**
- Benzersiz olmalıdır (aynı email ile birden fazla kayıt yapılamaz)
- Geçerli email formatında olmalıdır

**🔐 Şifre:**
- En az 6 karakter olmalıdır
- En az bir büyük harf içermelidir
- En az bir küçük harf içermelidir
- En az bir rakam içermelidir

**👤 İsim ve Soyisim:**
- Boş bırakılamaz
- En az 3 karakter olmalıdır
- String tipinde olmalıdır

**📅 Doğum Tarihi:**
- Kullanıcı en az 18 yaşında olmalıdır
- Gelecek tarih olamaz

### 📚 Ders Validasyonları

**📝 Ders Adı:**
- Boş bırakılamaz
- String tipinde olmalıdır
- Benzersiz olmalıdır (aynı isimde iki ders oluşturulamaz)

**📄 Ders Açıklaması:**
- Opsiyonel alan (boş bırakılabilir)
- String tipinde olmalıdır

**⭐ Kredi:**
- 1-10 arasında olmalıdır
- Zorunlu alan

## ⚡ İş Kuralları ve Kısıtlamalar

- 🚫 Öğrenci aynı derse birden fazla kez kayıt olamaz
- 🔒 Öğrenci sadece kendi profilini güncelleyebilir
- 📝 Öğrenci sadece kendi derslerini görüntüleyebilir
- ❌ Öğrenci sadece kayıtlı olduğu dersten çıkabilir
- 👮‍♂️ Admin tüm öğrenci ve dersleri yönetebilir
- 🔄 Admin öğrencileri derslere ekleyip çıkarabilir
- 📊 Admin tüm öğrenci-ders ilişkilerini görüntüleyebilir

## 🛠️ Kullanılan Teknolojiler

### Frontend
- ⚛️ **React.js** (v19.1.0)
- 🎨 **TailwindCSS** (v4.1.8) - Modern CSS framework
- 🚀 **Vite** (v6.3.5) - Hızlı build tool
- 📝 **React Hook Form** (v7.57.0) - Form yönetimi
- 🛣️ **React Router DOM** (v7.6.2) - Sayfa yönlendirme
- 🔄 **Axios** (v1.9.0) - HTTP istekleri
- 📅 **date-fns** (v4.1.0) - Tarih işlemleri

### Geliştirme Araçları
- 🔧 **ESLint** (v9.25.0) - Kod kalitesi
- 📦 **Vite Plugin React** (v4.4.1) - React desteği

### Güvenlik ve Kimlik Doğrulama
- 🔐 **JWT (JSON Web Tokens)** - Token tabanlı kimlik doğrulama
- 👮‍♂️ **Role-based access control** - Rol tabanlı yetkilendirme
- 🛡️ **Protected Routes** - Korumalı sayfa yönlendirmeleri
- 🔑 **Context API** - Global state yönetimi

## 🏗️ Proje Mimarisi

```
src/
├── assets/           # Statik dosyalar (resimler, ikonlar vb.)
├── components/       # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/          # Temel UI bileşenleri (Toast, LoadingSpinner, Pagination)
│   ├── Navbar.jsx   # Navigasyon bileşeni
│   └── ProtectedRoute.jsx # Korumalı rota bileşeni
├── contexts/         # React context yapıları
│   └── AuthContext.jsx # Kimlik doğrulama context'i
├── pages/           # Sayfa bileşenleri
│   ├── admin/       # Admin sayfaları
│   │   ├── Dashboard.jsx      # Admin dashboard
│   │   ├── StudentsPage.jsx   # Öğrenci yönetimi
│   │   ├── CoursesPage.jsx    # Ders yönetimi
│   │   └── EnrollmentsPage.jsx # Kayıt yönetimi
│   ├── student/     # Öğrenci sayfaları
│   │   ├── Dashboard.jsx      # Öğrenci dashboard
│   │   ├── Profile.jsx        # Profil yönetimi
│   │   ├── AvailableCourses.jsx # Mevcut dersler
│   │   └── MyEnrollments.jsx  # Kayıtlı dersler
│   └── auth/        # Kimlik doğrulama sayfaları
│       ├── Login.jsx    # Giriş sayfası
│       └── Register.jsx # Kayıt sayfası
├── services/        # API servis dosyaları
│   ├── api.js           # Axios konfigürasyonu
│   ├── authService.js   # Kimlik doğrulama servisleri
│   ├── userService.js   # Kullanıcı servisleri
│   ├── courseService.js # Ders servisleri
│   └── enrollmentService.js # Kayıt servisleri
├── utils/           # Yardımcı fonksiyonlar
│   └── dateUtils.js # Tarih işleme fonksiyonları
├── App.jsx          # Ana uygulama bileşeni
├── main.jsx         # Uygulama giriş noktası
└── index.css        # Global CSS dosyası
```

## 🎯 Özellikler ve Sayfalar

### 🔐 Kimlik Doğrulama
- **Giriş Yapma** - JWT token ile güvenli giriş
- **Kayıt Olma** - Otomatik giriş ile kayıt
- **Çıkış Yapma** - Güvenli oturum sonlandırma
- **Korumalı Rotalar** - Yetkisiz erişimi engelleme

### 👨‍💼 Admin Özellikleri
- **Dashboard** - Sistem geneli istatistikler
- **Öğrenci Yönetimi** - CRUD operasyonları, rol değiştirme
- **Ders Yönetimi** - CRUD operasyonları, detaylı bilgiler
- **Kayıt Yönetimi** - Öğrenci-ders eşleştirmeleri
- **Detay Modalları** - Öğrenci ve ders detayları

### 👨‍🎓 Öğrenci Özellikleri
- **Dashboard** - Kişisel istatistikler
- **Profil Yönetimi** - Kişisel bilgi güncelleme
- **Mevcut Dersler** - Kayıt olunabilir dersler
- **Kayıtlı Dersler** - Mevcut kayıtlar ve çıkma

### 🎨 UI/UX Özellikleri
- **Responsive Tasarım** - Mobil uyumlu
- **Toast Bildirimleri** - Kullanıcı geri bildirimleri
- **Loading Durumları** - Yükleme göstergeleri
- **Pagination** - Sayfalama sistemi
- **Arama ve Filtreleme** - Gelişmiş arama
- **Form Validasyonları** - Gerçek zamanlı doğrulama

## 🚀 Kurulum ve Çalıştırma

### 📋 Ön Gereksinimler
- **Node.js** (v18 veya üzeri) - [İndir](https://nodejs.org/)
- **npm** (Node.js ile birlikte gelir)
- **Git** - [İndir](https://git-scm.com/downloads)
- **Backend API** - Çalışır durumda olmalı (http://localhost:5000)

### 🔧 Kurulum Adımları

#### 1. Projeyi bilgisayarınıza indirin:
```bash
git clone [repo-url]
cd student-course-management/frontend
```

#### 2. Node.js'in kurulu olduğunu kontrol edin:
```bash
node --version
npm --version
```

#### 3. Gerekli paketleri yükleyin:
```bash
npm install
```

#### 4. Backend API'nin çalıştığını kontrol edin:
- Backend API'nin `http://localhost:5000` adresinde çalıştığından emin olun
- Swagger dokümantasyonu: `http://localhost:5000/swagger`

#### 5. Frontend uygulamasını başlatın:
```bash
npm run dev
```

#### 6. Tarayıcınızda kontrol edin:
- **Frontend:** http://localhost:5173
- Uygulama otomatik olarak tarayıcıda açılacaktır

## 🔑 Varsayılan Kullanıcı Bilgileri

### Admin Hesabı:
```
Email: admin@admin.com
Password: Admin123!
```

### Öğrenci Hesabı:
```
Email: student@student.com
Password: Student123!
```

> **💡 İpucu:** Yeni hesap oluşturduğunuzda otomatik olarak "Student" rolü atanır. Admin yetkisi vermek için mevcut admin hesabı ile giriş yapıp kullanıcı rolünü değiştirin.

## 🎨 Kullanılan UI Bileşenleri

### Temel Bileşenler
- **Toast** - Bildirim sistemi (başarı, hata, uyarı)
- **LoadingSpinner** - Yükleme göstergesi
- **Pagination** - Sayfalama kontrolü
- **Navbar** - Navigasyon menüsü
- **ProtectedRoute** - Korumalı rota wrapper'ı

### Form Bileşenleri
- **React Hook Form** ile form yönetimi
- **Gerçek zamanlı validasyon** ile kullanıcı dostu hata mesajları
- **Responsive form tasarımları**

### Modal ve Detay Sayfaları
- **Öğrenci Detay Modalı** - Kişisel bilgiler ve kayıtlı dersler
- **Ders Detay Modalı** - Ders bilgileri ve kayıtlı öğrenciler
- **Düzenleme Modalları** - Inline düzenleme özellikleri

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Projeyi production için derle
npm run build

# Derlenen projeyi önizle
npm run preview

# Kod kalitesi kontrolü
npm run lint
```

## 🆘 Sorun Giderme

### Frontend çalışmıyor:
```bash
# Node modules'ları temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install

# Cache'i temizle
npm run dev -- --force
```

### Backend bağlantı sorunu:
- Backend API'nin `http://localhost:5000` adresinde çalıştığından emin olun
- `src/services/api.js` dosyasındaki base URL'i kontrol edin
- CORS ayarlarının doğru olduğundan emin olun

## 👨‍💻 Geliştirici

**Melih Vardar** - Fullstack Developer

---

## 📝 Notlar

- Proje **Vite** ile oluşturulmuştur
- **TailwindCSS v4** kullanılmaktadır (en güncel versiyon)
- **React Hook Form** ile form yönetimi sağlanmaktadır
- **Axios** ile API istekleri yönetilmektedir
- **React Router v7** ile sayfa yönlendirmeleri yapılmaktadır
- **date-fns** ile tarih işlemleri gerçekleştirilmektedir
- **Context API** ile global state yönetimi yapılmaktadır
