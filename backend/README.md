# 🎓 Öğrenci ve Ders Yönetimi Sistemi - Backend (.NET 8 Web API)

## 📋 Proje Hakkında
Bu proje, öğrenci ve ders yönetimini kapsayan kapsamlı bir web uygulamasının **backend** kısmıdır. Sistem, öğrencilerin derslere kaydolmasını, admin kullanıcıların öğrenci ve ders yönetimini yapmasını sağlayan modern bir REST API platformudur.

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
- En fazla 100 karakter olabilir

**🔐 Şifre:**
- En az 6 karakter olmalıdır
- En az bir büyük harf içermelidir
- En az bir küçük harf içermelidir
- En az bir rakam içermelidir

**👤 İsim ve Soyisim:**
- Boş bırakılamaz
- En fazla 30 karakter olabilir
- String tipinde olmalıdır

**📅 Doğum Tarihi:**
- Kullanıcı en az 18 yaşında olmalıdır
- Gelecek tarih olamaz
- UTC formatında saklanır

### 📚 Ders Validasyonları

**📝 Ders Adı:**
- Boş bırakılamaz
- String tipinde olmalıdır
- Benzersiz olmalıdır (aynı isimde iki ders oluşturulamaz)
- En fazla 100 karakter olabilir

**📄 Ders Açıklaması:**
- Opsiyonel alan
- En fazla 500 karakter olabilir

**⭐ Kredi:**
- 1-10 arasında olmalıdır
- Pozitif sayı olmalıdır

## ⚡ İş Kuralları ve Kısıtlamalar

- 🚫 Öğrenci aynı derse birden fazla kez kayıt olamaz
- 🔒 Öğrenci sadece kendi profilini güncelleyebilir
- 📝 Öğrenci sadece kendi derslerini görüntüleyebilir
- ❌ Öğrenci sadece kayıtlı olduğu dersten çıkabilir
- 👮‍♂️ Admin tüm öğrenci ve dersleri yönetebilir
- 🔄 Admin öğrencileri derslere ekleyip çıkarabilir
- 📊 Admin tüm öğrenci-ders ilişkilerini görüntüleyebilir
- 🗑️ Öğrencisi olan ders silinemez
- 📝 Kayıt limiti bulunmamaktadır (öğrenci istediği kadar derse kayıt olabilir)

## 🛠️ Kullanılan Teknolojiler

### Kullanılan Kütüphaneler
- 🏗️ **Microsoft.AspNetCore.OpenApi** (8.0.17) - OpenAPI desteği
- 📝 **Swashbuckle.AspNetCore** (6.4.0) - Swagger UI
- 🗃️ **Microsoft.EntityFrameworkCore** (8.0.0) - ORM framework
- 🐘 **Npgsql.EntityFrameworkCore.PostgreSQL** (8.0.0) - PostgreSQL provider
- 🔧 **Microsoft.EntityFrameworkCore.Tools** (8.0.0) - EF Core araçları
- 🎨 **Microsoft.EntityFrameworkCore.Design** (8.0.0) - Design-time araçları
- 🔐 **Microsoft.AspNetCore.Authentication.JwtBearer** (8.0.0) - JWT authentication
- 👤 **Microsoft.AspNetCore.Identity.EntityFrameworkCore** (8.0.0) - Identity framework
- 🎫 **System.IdentityModel.Tokens.Jwt** (7.0.3) - JWT token işlemleri
- 🔒 **BCrypt.Net-Next** (4.0.3) - Şifreleme

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
- 🔐 **256-bit güvenli JWT secret key**

### Veritabanı
- 🐘 **PostgreSQL**
- 🔄 **Entity Framework Core** ile veritabanı yönetimi
- 🏗️ **Code-First** yaklaşımı
- 🔄 **Automatic migrations**

### Konteynerizasyon
- 🐳 **Docker**
- 🎭 **Docker Compose**
- 📦 **Container** tabanlı deployment

### Test
- 🧪 **Test framework** - Henüz eklenmedi

## 📁 Proje Mimarisi

```
backend/
├── Controllers/        # 🎮 API Controllers
│   ├── AuthController.cs
│   ├── CourseController.cs
│   ├── EnrollmentController.cs
│   └── UserController.cs
├── Data/              # 🗃️ Veritabanı context
│   └── ApplicationDbContext.cs
├── DTOs/              # 📦 Data Transfer Objects
│   ├── AuthDTOs.cs
│   ├── CourseDTOs.cs
│   ├── EnrollmentDTOs.cs
│   └── UserDTOs.cs
├── Exceptions/        # ⚠️ Özel exception sınıfları
│   └── BusinessException.cs
├── Middleware/        # 🔧 Middleware components
│   └── GlobalExceptionMiddleware.cs
├── Models/           # 🏗️ Entity models
│   ├── Course.cs
│   ├── Enrollment.cs
│   ├── User.cs
│   └── UserRole.cs
├── Properties/       # ⚙️ Proje ayarları
│   └── launchSettings.json
├── Services/         # 🔧 Business logic services
│   ├── AuthService.cs
│   ├── BusinessRuleService.cs
│   ├── CourseService.cs
│   ├── EnrollmentService.cs
│   ├── TokenService.cs
│   └── UserService.cs
├── backend.Tests/    # 🧪 Test projesi (henüz eklenmedi)
├── Program.cs        # 🚀 Uygulama giriş noktası
├── appsettings.json  # ⚙️ Konfigürasyon dosyası
└── docker-compose.yml # 🐳 Docker compose
```

## 🚀 Kurulum ve Çalıştırma

### 📋 Ön Gereksinimler
- **.NET 8 SDK** (veya üzeri) - [İndir](https://dotnet.microsoft.com/download)
- **Docker Desktop** - [İndir](https://www.docker.com/products/docker-desktop/)
  - Docker Desktop kurulumu Docker Compose'u da içerir
- **Git** - [İndir](https://git-scm.com/downloads)
- **DBeaver** (Veritabanı yönetimi için) - [İndir](https://dbeaver.io/download/)
- **Visual Studio 2022** veya **VS Code** (önerilen) - [VS Code İndir](https://code.visualstudio.com/)
- **PostgreSQL** (sadece yerel kurulum yapacaksanız) - [İndir](https://www.postgresql.org/download/)

### 🔧 Kurulum Adımları

#### 1. Docker'ın çalıştığını kontrol edin:
```bash
# Docker'ın çalışıp çalışmadığını kontrol edin
docker --version
docker-compose --version

# Docker Desktop'ın çalıştığından emin olun
docker ps
```

#### 2. Projeyi klonlayın:
```bash
git clone [repo-url]
cd [proje-dizini]
```

#### 3. Bağımlılıkları yükleyin:
```bash
dotnet restore
```

#### 4. Konfigürasyon:
Proje hazır konfigürasyonla gelir. `appsettings.json` dosyası önceden yapılandırılmıştır:
- ✅ **PostgreSQL bağlantısı** ayarlanmış (Docker için Port: 5435)
- ✅ **JWT güvenli anahtarı** yapılandırılmış
- ✅ **Tek dosya** - Development/Production ayrımı yok

#### 5. Uygulamayı başlatmanın iki yolu var:

**A) Docker ile Çalıştırma (Önerilen):**
```bash
# Docker container'larını başlat (PostgreSQL Port 5435'te çalışacak)
docker-compose up -d

# Container'ların çalıştığını kontrol edin
docker-compose ps

# Uygulamayı başlat
dotnet run
```

💡 **Not**: Docker container'ı çalışırken yerel PostgreSQL servisinin durdurulmuş olması önemlidir.

**Docker Container'ları Durdurmak İçin:**
```bash
# Container'ları durdur
docker-compose down

# Container'ları durdur ve volume'ları sil (veritabanı verilerini siler)
docker-compose down -v
```

**B) Yerel Geliştirme Ortamında Çalıştırma:**

**Seçenek 1: Docker ile PostgreSQL (Önerilen)**
```bash
# Docker container'larını başlat (PostgreSQL Port 5435'te çalışacak)
docker-compose up -d

# Uygulamayı başlat
dotnet run
```

**Seçenek 2: Yerel PostgreSQL ile**
```bash
# Yerel PostgreSQL'de veritabanını oluştur
createdb studentmanagementdb

# appsettings.json'da connection string'i yerel PostgreSQL'e göre ayarlayın
# "Host=localhost;Database=studentmanagementdb;Username=postgres;Password=postgres;Port=5432"

# Uygulamayı başlat
dotnet run
```

#### 6. DBeaver ile Veritabanı Bağlantısı
Docker üzerinden çalışan PostgreSQL veritabanına DBeaver ile bağlanmak için:

**DBeaver Bağlantı Kurulumu:**
1. **DBeaver'ı açın**
2. **Sol üstteki "New Database Connection" butonuna tıklayın** (+ ikonu)
3. **PostgreSQL'i seçin** ve "Next" butonuna tıklayın
4. **Aşağıdaki bilgileri girin:**

**Bağlantı Bilgileri:**
- **Host:** localhost
- **Port:** 5435 (Docker) / 5432 (Yerel PostgreSQL)
- **Database:** studentmanagementdb
- **Username:** postgres
- **Password:** postgres

5. **"Test Connection" butonuna tıklayarak bağlantıyı test edin**
6. **"Finish" butonuna tıklayarak bağlantıyı kaydedin**

**Veritabanı Bağlantısını Kontrol Etmek İçin:**
```bash
# Docker container'ının çalıştığını kontrol edin
docker-compose ps
```

💡 **İpucu:** DBeaver'da bağlantı kurduktan sonra sol panelde "studentmanagementdb" veritabanını genişleterek tabloları (Users, Courses, Enrollments) görebilirsiniz.

## 🌐 API Endpoints

API dokümantasyonuna aşağıdaki URL'den erişebilirsiniz:

**Swagger UI:** http://localhost:5268/swagger

### 🔐 Authentication Endpoints
- `POST /api/Auth/login` - Kullanıcı girişi
- `POST /api/Auth/register` - Kullanıcı kaydı
- `POST /api/Auth/logout` - Kullanıcı çıkışı
- `GET /api/Auth/me` - Mevcut kullanıcı bilgisi

### 👥 User Management Endpoints
- `GET /api/User` - Tüm kullanıcı listesi (Admin)
- `GET /api/User/students` - Sadece öğrenci listesi (Admin)
- `GET /api/User/admins` - Sadece admin listesi (Admin)
- `GET /api/User/{id}` - Kullanıcı detayı (Admin)
- `POST /api/User` - Yeni kullanıcı oluşturma (Admin)
- `PUT /api/User/{id}` - Kullanıcı güncelleme (Admin)
- `DELETE /api/User/{id}` - Kullanıcı silme (Admin)
- `GET /api/User/profile` - Kendi profili görüntüleme
- `PUT /api/User/profile` - Kendi profilini güncelleme

### 📚 Course Management Endpoints
- `GET /api/Course` - Ders listesi
- `GET /api/Course/{id}` - Ders detayı (Admin)
- `GET /api/Course/{id}/info` - Ders temel bilgisi
- `POST /api/Course` - Ders oluşturma (Admin)
- `PUT /api/Course/{id}` - Ders güncelleme (Admin)
- `DELETE /api/Course/{id}` - Ders silme (Admin)
- `GET /api/Course/available` - Mevcut dersler (Student)

### 📝 Enrollment Endpoints
- `GET /api/Enrollment` - Tüm kayıtlar (Admin)
- `POST /api/Enrollment/enroll` - Derse kayıt (Student)
- `POST /api/Enrollment/admin-enroll` - Admin kayıt (Admin)
- `DELETE /api/Enrollment/unenroll/{courseId}` - Dersten çıkma (Student)
- `DELETE /api/Enrollment/{enrollmentId}` - Admin kayıt silme (Admin)
- `GET /api/Enrollment/my-enrollments` - Kendi kayıtları (Student)

## 🔍 Test

### Test Durumu:
- 🚧 **Test projesi henüz eklenmedi**
- 📝 **Testler geliştirilme aşamasında**

### Planlanmış Test Kapsamı:
- 🔐 **Authentication Tests** - Kimlik doğrulama testleri
- 📚 **Course Management Tests** - Ders yönetimi testleri
- 📝 **Enrollment Tests** - Kayıt işlemleri testleri
- 🛡️ **Business Rules Tests** - İş kuralları testleri

## 🔑 Varsayılan Kullanıcı Bilgileri

### Admin Hesabı:
```
Email: admin@admin.com
Password: Admin123!
```

## 📊 API Response Formatları

### Başarılı Response:
```json
{
  "data": [...],
  "totalCount": 25,
  "page": 1,
  "pageSize": 10,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

### Hata Response:
```json
{
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

## 🐳 Docker Konfigürasyonu

### docker-compose.yml:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: studentmanagementdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5435:5432"  # DBeaver için Port 5435'te erişilebilir
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Docker + DBeaver Kullanım Avantajları:**
- 🚀 **Hızlı Kurulum** - Tek komutla PostgreSQL çalışır
- 🔒 **İzole Ortam** - Yerel PostgreSQL ile çakışmaz
- 🗃️ **Kolay Yönetim** - DBeaver ile görsel veritabanı yönetimi
- 🔄 **Temiz Başlangıç** - `docker-compose down -v` ile sıfırlama

## 🔧 Geliştirme Komutları

```bash
# Projeyi çalıştır (http://localhost:5268)
dotnet run

# Watch mode (otomatik yeniden başlatma)
dotnet watch run

# Build
dotnet build

# Test (henüz eklenmedi)
# dotnet test

# Migration oluştur
dotnet ef migrations add MigrationName

# Veritabanını güncelle
dotnet ef database update
```

## 🗃️ Veritabanı Yönetimi (DBeaver)

**DBeaver ile Yapabilecekleriniz:**
- 📊 **Tablo verilerini görüntüleme** - Users, Courses, Enrollments tablolarını inceleyin
- ✏️ **Veri düzenleme** - Tablolardaki verileri doğrudan düzenleyin
- 🔍 **SQL sorguları çalıştırma** - Özel sorgular yazıp çalıştırın
- 📈 **Veritabanı şemasını görüntüleme** - Tablo yapılarını ve ilişkileri inceleyin
- 📋 **Veri dışa aktarma** - Tabloları CSV, Excel formatlarında dışa aktarın

**Yararlı SQL Sorguları:**
```sql
-- Tüm kullanıcıları listele
SELECT * FROM "AspNetUsers";

-- Tüm kursları listele
SELECT * FROM "Courses";

-- Tüm kayıtları listele (JOIN ile)
SELECT 
    u."FirstName" || ' ' || u."LastName" as "Student Name",
    c."Name" as "Course Name",
    e."EnrollmentDate"
FROM "Enrollments" e
JOIN "AspNetUsers" u ON e."UserId" = u."Id"
JOIN "Courses" c ON e."CourseId" = c."Id";
```

## 🎯 Proje Özellikleri

### ✅ **Teknik Mülakat İçin Optimize Edilmiş:**
- 🎯 **Tek Port**: `http://localhost:5268` - Frontend için net URL
- 📝 **Tek Konfigürasyon**: `appsettings.json` - Development/Production karmaşası yok
- 🔑 **Güvenli JWT Key**: 256-bit hex key - Production ready
- 🗑️ **Temiz Kod**: Gereksiz dosyalar ve karmaşık profiller kaldırıldı

### 🚀 **Avantajlar:**
- 📦 **GitHub'dan Çek ve Çalıştır**: Ekstra konfigürasyon gerektirmez
- 🎯 **Mülakat Dostu**: Anlaşılır ve basit yapı
- 🔧 **Tek Komut**: `dotnet run` ile çalışır
- 🌐 **Frontend Ready**: Net API URL'si

## 📈 Performans ve Optimizasyon

- 📄 **Pagination** - Tüm listeleme endpoint'lerinde
- 🔄 **Async/Await** - Tüm veritabanı işlemlerinde
- 💾 **Connection Pooling** - Entity Framework Core ile
- 🔍 **Indexing** - Kritik alanlarda veritabanı indexleri
- ⚡ **Role-based Filtering** - Veritabanı seviyesinde filtreleme

## 🛡️ Güvenlik Özellikleri

- 🔐 **JWT Authentication** - Stateless kimlik doğrulama
- 👮‍♂️ **Role-based Authorization** - Rol tabanlı yetkilendirme
- 🔒 **Password Hashing** - BCrypt ile güvenli şifreleme
- 🛡️ **Input Validation** - Tüm endpoint'lerde veri doğrulama
- 🚫 **SQL Injection Protection** - Entity Framework Core ile
- 🔑 **Secure Headers** - HTTPS ve güvenlik başlıkları

## 📝 Projede Yapılan Tercihler

### 🏗️ **Mimari Tercihler:**
- **Clean Architecture** - Katmanlı mimari yapısı
- **Repository Pattern** - Entity Framework Core ile
- **Dependency Injection** - .NET Core built-in DI container
- **Global Exception Handling** - Merkezi hata yönetimi

### 🔧 **Teknoloji Tercihler:**
- **.NET 8** - En güncel LTS sürümü
- **PostgreSQL** - Güçlü ve açık kaynak veritabanı
- **JWT** - Stateless authentication için
- **Test Framework** - Henüz belirlenmedi
- **Docker** - Kolay deployment ve geliştirme ortamı

### 📦 **Kütüphane Tercihler:**
- **Entity Framework Core** - Microsoft'un resmi ORM'i
- **BCrypt** - Endüstri standardı şifreleme
- **Swagger** - API dokümantasyonu için
- **ASP.NET Core Identity** - Kullanıcı yönetimi için

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Melih Vardar** - Backend Developer
