# 🎓 Öğrenci ve Ders Yönetimi Sistemi - Fullstack Web Uygulaması

## 📋 Proje Hakkında
Bu proje, öğrenci ve ders yönetimini kapsayan kapsamlı bir web uygulamasıdır. Sistem, öğrencilerin derslere kaydolmasını, admin kullanıcıların öğrenci ve ders yönetimini yapmasını sağlayan modern bir fullstack platformudur. Backend .NET 8 Web API, frontend React.js teknolojileri ile geliştirilmiştir.

## 👥 Kullanıcı Rolleri ve Yetkiler

### 👨‍💼 Admin Rolü
- ➕ Öğrenci ekleme, güncelleme ve silme
- 📚 Ders ekleme, güncelleme ve silme  
- 🔄 Öğrenci-ders eşleştirmelerini yönetme
- 📊 Tüm öğrenci ve ders listelerini görüntüleme
- 📝 Sistem genelinde tam yetki
- 🔄 Kullanıcı rollerini değiştirme (Student ↔ Admin)

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
- En fazla 100 karakter olabilir

**🔐 Şifre:**
- En az 6 karakter olmalıdır
- En az bir büyük harf içermelidir
- En az bir küçük harf içermelidir
- En az bir rakam içermelidir
- En fazla 100 karakter olabilir

**👤 İsim ve Soyisim:**
- Boş bırakılamaz
- En az 3, en fazla 30 karakter olabilir
- String tipinde olmalıdır

**📅 Doğum Tarihi:**
- Kullanıcı en az 18 yaşında olmalıdır
- Gelecek tarih olamaz
- 100 yaşından büyük olamaz

### 📚 Ders Validasyonları

**📝 Ders Adı:**
- Boş bırakılamaz
- String tipinde olmalıdır
- Benzersiz olmalıdır (aynı isimde iki ders oluşturulamaz)
- En fazla 50 karakter olabilir

**📄 Ders Açıklaması:**
- Opsiyonel alan (boş bırakılabilir)
- En fazla 800 karakter olabilir

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
- 🗑️ Öğrencisi olan ders silinemez

---

# 🔧 Backend (.NET 8 Web API)

## 🛠️ Kullanılan Teknolojiler

### Backend
- ⚡ **.NET 8** (Web API)
- 🔐 **JWT** tabanlı kimlik doğrulama
- 🎯 **C#** programlama dili
- 📊 **PostgreSQL** veritabanı
- 📝 **Swagger** API dokümantasyonu

### Güvenlik
- 🔒 **JWT (JSON Web Tokens)**
- 👮‍♂️ **Role-based access control (RBAC)**
- 🛡️ **Authorization policies** ile yetkilendirme
- 🔑 **BCrypt** ile şifreleme

### Veritabanı
- 🐘 **PostgreSQL**
- 🔄 **Entity Framework Core** ile veritabanı yönetimi
- 🏗️ **Code-First** yaklaşımı

### Konteynerizasyon
- 🐳 **Docker**
- 🎭 **Docker Compose**
- 📦 **Container** tabanlı deployment

### Test
- 🧪 **xUnit** test framework
- 🎯 **Moq** ile unit testing
- ✅ **15 adet** controller unit testi

## 🌐 API Endpoints

### 🔐 Kimlik Doğrulama
- `POST /api/Auth/register` - Kullanıcı kaydı
- `POST /api/Auth/login` - Kullanıcı girişi
- `POST /api/Auth/logout` - Kullanıcı çıkışı
- `GET /api/Auth/me` - Mevcut kullanıcı bilgisi

### 👥 Kullanıcı Yönetimi
- `GET /api/User/profile` - Kendi profilini görüntüleme
- `PUT /api/User/profile` - Kendi profilini güncelleme
- `GET /api/User` - Tüm kullanıcılar (Admin)
- `GET /api/User/students` - Sadece öğrenci listesi (Admin)
- `GET /api/User/admins` - Sadece admin listesi (Admin)
- `GET /api/User/{id}` - Kullanıcı detayı (Admin)
- `POST /api/User` - Yeni kullanıcı oluşturma (Admin)
- `PUT /api/User/{id}` - Kullanıcı güncelleme (Admin)
- `DELETE /api/User/{id}` - Kullanıcı silme (Admin)
- `GET /api/User/{id}/enrollments` - Kullanıcının kayıtları (Admin)

### 📚 Ders Yönetimi
- `GET /api/Course` - Ders listesi (Admin)
- `GET /api/Course/{id}` - Ders detayı (Admin)
- `GET /api/Course/{id}/info` - Ders temel bilgisi (Admin)
- `POST /api/Course` - Ders oluşturma (Admin)
- `PUT /api/Course/{id}` - Ders güncelleme (Admin)
- `DELETE /api/Course/{id}` - Ders silme (Admin)
- `GET /api/Course/available` - Mevcut dersler (Öğrenci)
- `GET /api/Course/{id}/enrollments` - Ders kayıtları (Admin)

### 📝 Kayıt İşlemleri
- `GET /api/Enrollment` - Tüm kayıtlar (Admin)
- `POST /api/Enrollment/enroll` - Derse kayıt (Öğrenci)
- `POST /api/Enrollment/admin-enroll` - Admin kayıt (Admin)
- `DELETE /api/Enrollment/unenroll/{courseId}` - Dersten çıkma (Öğrenci)
- `DELETE /api/Enrollment/{enrollmentId}` - Admin kayıt silme (Admin)
- `GET /api/Enrollment/my-enrollments` - Kendi kayıtları (Öğrenci)

## 🧪 Backend Testleri Çalıştırma

> **⚠️ Gereksinim:** Bu komutlar için bilgisayarınızda **.NET 8 SDK** kurulu olması gerekir.

```bash
# Test klasörüne git
cd backend.Tests

# Testleri çalıştır
dotnet test
```

**Test Kapsamı:**
- ✅ 15 adet unit test
- 🔐 AuthController testleri (3 test)
- 📚 CourseController testleri (4 test)
- 📝 EnrollmentController testleri (4 test)
- 👥 UserController testleri (4 test)

## 🔧 Backend Geliştirme Komutları

```bash
# Uygulamayı çalıştır
dotnet run

# Otomatik yeniden başlatma ile çalıştır
dotnet watch run

# Projeyi derle
dotnet build

# Testleri çalıştır
dotnet test

# Docker container'ları durdur
docker-compose down
```

---

# 🎨 Frontend (React.js)

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

## 🏗️ Frontend Proje Mimarisi

```
frontend/src/
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

## 🎯 Frontend Özellikleri ve Sayfalar

### 🔐 Kimlik Doğrulama
- **Giriş Yapma** - JWT token ile güvenli giriş
- **Kayıt Olma** - Otomatik giriş ile kayıt
- **Çıkış Yapma** - Güvenli oturum sonlandırma
- **Korumalı Rotalar** - Yetkisiz erişimi engelleme

### 👨‍💼 Admin Özellikleri
- **Dashboard** - Sistem geneli istatistikler
- **Öğrenci Yönetimi** - CRUD operasyonları, rol değiştirme, email güncelleme
- **Ders Yönetimi** - CRUD operasyonları, detaylı bilgiler
- **Kayıt Yönetimi** - Öğrenci-ders eşleştirmeleri
- **Detay Modalları** - Öğrenci ve ders detayları

### 👨‍🎓 Öğrenci Özellikleri
- **Dashboard** - Kişisel istatistikler
- **Profil Yönetimi** - Kişisel bilgi ve email güncelleme
- **Mevcut Dersler** - Kayıt olunabilir dersler
- **Kayıtlı Dersler** - Mevcut kayıtlar ve çıkma

### 🎨 UI/UX Özellikleri
- **Responsive Tasarım** - Mobil uyumlu
- **Toast Bildirimleri** - Detaylı hata mesajları ve kullanıcı geri bildirimleri
- **Loading Durumları** - Yükleme göstergeleri
- **Pagination** - Sayfalama sistemi
- **Arama ve Filtreleme** - Gelişmiş arama
- **Form Validasyonları** - Gerçek zamanlı doğrulama
- **Rol Rozetleri** - Renkli kullanıcı rol göstergeleri


## 🎨 Frontend UI Bileşenleri

### Temel Bileşenler
- **Toast** - Bildirim sistemi (başarı, hata, uyarı) - Çoklu hata mesajları desteği
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

## 🔧 Frontend Geliştirme Komutları

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

---

# 🎯 Proje Özellikleri

## Backend Özellikleri
- 🎯 **Tek Port:** http://localhost:5000
- 📝 **Hazır Konfigürasyon:** Ekstra ayar gerektirmez
- 🔑 **Güvenli JWT:** Production ready
- 🗑️ **Temiz Kod:** Gereksiz karmaşıklık yok
- 🚀 **Hızlı Başlangıç:** git clone → docker-compose up -d → dotnet run

## Frontend Özellikleri
- 🎯 **Modern React:** React 19.1.0 ile geliştirildi
- 🎨 **TailwindCSS v4:** En güncel CSS framework
- 📝 **Form Yönetimi:** React Hook Form ile
- 🔄 **API İstekleri:** Axios ile yönetiliyor
- 🛣️ **Routing:** React Router v7 ile
- 📅 **Tarih İşlemleri:** date-fns ile
- 🔑 **State Yönetimi:** Context API ile

---

# 👨‍💻 Geliştirici

**Melih Vardar** - Fullstack Developer

---

# 📝 Notlar

## Backend
- Proje **.NET 8** ile geliştirilmiştir
- **PostgreSQL** veritabanı kullanılmaktadır
- **Docker** ile kolay deployment sağlanmaktadır
- **JWT** ile güvenli kimlik doğrulama yapılmaktadır
- **xUnit** ile kapsamlı test coverage'ı mevcuttur

## Frontend
- Proje **Vite** ile oluşturulmuştur
- **TailwindCSS v4** kullanılmaktadır (en güncel versiyon)
- **React Hook Form** ile form yönetimi sağlanmaktadır
- **Axios** ile API istekleri yönetilmektedir
- **React Router v7** ile sayfa yönlendirmeleri yapılmaktadır
- **date-fns** ile tarih işlemleri gerçekleştirilmektedir
- **Context API** ile global state yönetimi yapılmaktadır
- **Detaylı hata yönetimi** ile kullanıcı dostu deneyim sağlanmaktadır

---

# 🔑 VARSAYILAN KULLANICI BİLGİLERİ

## Admin Hesabı:
```
Email: admin@admin.com
Password: Admin123!
```

## Öğrenci Hesabı:
```
Email: student@student.com
Password: Student123!
```

> **🔒 Güvenlik Notu:** Güvenlik nedeniyle doğrudan admin hesabı oluşturamazsınız. Yeni kullanıcılar varsayılan olarak "Student" rolü ile kaydolur. Admin yetkisi vermek için:
> 1. Yukarıdaki admin hesabı ile giriş yapın
> 2. İstediğiniz kullanıcıyı oluşturun veya mevcut bir kullanıcıyı güncelleyin
> 3. Kullanıcının rolünü "Admin" olarak değiştirin

> **💡 İpucu:** Yeni hesap oluşturduğunuzda otomatik olarak "Student" rolü atanır. Admin yetkisi vermek için mevcut admin hesabı ile giriş yapıp kullanıcı rolünü değiştirin.

---

# 🚀 KURULUM TALİMATLARI

## 🐳 YÖNTEMİ 1: Docker ile Çalıştırma (ÖNERİLEN)

> **✅ Avantajlar:** Bu yöntemle bilgisayarınızda sadece Docker yeterli! .NET SDK ve PostgreSQL kurmanıza gerek yok.

### 📋 Gereksinimler:
- **Docker Desktop** - [İndir](https://www.docker.com/products/docker-desktop)
- **Git** - [İndir](https://git-scm.com/downloads)
- **Node.js** (v18 veya üzeri) - [İndir](https://nodejs.org/)
- **npm** (Node.js ile birlikte gelir)

### 🔧 Adımlar:

#### 1. Projeyi indirin:
```bash
git clone [repo-url]
cd student-course-management
```

#### 2. Backend'i başlatın:
```bash
cd backend
docker-compose up -d
```
> **💡 Not:** Bu komut hem PostgreSQL hem de .NET API'yi otomatik başlatır!

#### 3. Frontend'i başlatın:
```bash
cd ../frontend
npm install
npm run dev
```

#### 4. Kontrol edin:
- **Backend API:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger
- **Frontend:** http://localhost:5173

#### 5. Yukarıdaki varsayılan kullanıcı bilgileri ile giriş yapın!

---

## 💻 YÖNTEMİ 2: Docker'sız Çalıştırma (Alternatif)

> **⚠️ Dikkat:** Bu yöntem daha karmaşıktır. Sadece Docker kullanamıyorsanız tercih edin.

### 📋 Gereksinimler:
- **.NET 8 SDK** (8.0.400 veya üzeri) - [İndir](https://dotnet.microsoft.com/download)
- **PostgreSQL** - [İndir](https://www.postgresql.org/download/)
- **Node.js** (v18 veya üzeri) - [İndir](https://nodejs.org/)
- **Git** - [İndir](https://git-scm.com/downloads)

### 🔧 Adımlar:

#### 1. PostgreSQL'i kurun:
- Port: **5435** (varsayılan 5432 değil!)
- Şifre: **postgres**
- Veritabanı adı: **studentmanagementdb**

#### 2. Projeyi indirin:
```bash
git clone [repo-url]
cd student-course-management
```

#### 3. Backend'i başlatın:
```bash
cd backend
dotnet run
```

#### 4. Frontend'i başlatın (yeni terminal):
```bash
cd frontend
npm install
npm run dev
```

#### 5. Kontrol edin:
- **Backend API:** http://localhost:5000
- **Frontend:** http://localhost:5173

#### 6. Yukarıdaki varsayılan kullanıcı bilgileri ile giriş yapın!

---

## 🗃️ Veritabanı Yönetimi (DBeaver) - İSTEĞE BAĞLI

> **💡 Not:** Veritabanını görsel olarak yönetmek istiyorsanız DBeaver kurabilirsiniz.

### DBeaver Kurulumu ve Bağlantısı:

#### 1. DBeaver'ı indirin ve kurun:
- [DBeaver İndir](https://dbeaver.io/download/)

#### 2. Bağlantı kurun:
1. **DBeaver'ı açın**
2. **"New Database Connection" butonuna tıklayın** (+ ikonu)
3. **PostgreSQL'i seçin** ve "Next"
4. **Bağlantı bilgilerini girin:**
   - **Host:** localhost
   - **Port:** 5435
   - **Database:** studentmanagementdb
   - **Username:** postgres
   - **Password:** postgres
5. **"Test Connection" ile test edin**
6. **"Finish" ile kaydedin**

---

## 🆘 Sorun mu Yaşıyorsunuz?

### Docker Sorunları:
```bash
# Container'ları kontrol et
docker-compose ps

# Yeniden başlat
docker-compose restart

# Tamamen sil ve yeniden başlat
docker-compose down -v
docker-compose up -d
```

### Genel Sorunlar:
- **Port 5000 kullanımda:** Diğer uygulamaları kapatın
- **Port 5173 kullanımda:** `npm run dev -- --port 3000` deneyin
- **PostgreSQL bağlanamıyor:** Port ve şifre ayarlarını kontrol edin

---

## Backend Sorunları

### Docker ile ilgili sorunlar:
```bash
# Docker container'larını kontrol et
docker-compose ps

# Container'ları yeniden başlat
docker-compose restart

# Container'ları tamamen sil ve yeniden oluştur
docker-compose down -v
docker-compose up -d
```

### Uygulama çalışmıyor:
```bash
# Bağımlılıkları yeniden yükle
dotnet restore

# Projeyi temizle ve yeniden derle
dotnet clean
dotnet build
```

### Veritabanı bağlantı sorunu:
- Docker container'ının çalıştığından emin olun: `docker-compose ps`
- DBeaver'da bağlantı ayarlarını kontrol edin
- Port çakışması varsa docker-compose.yml'deki portu değiştirin

## Frontend Sorunları

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

---