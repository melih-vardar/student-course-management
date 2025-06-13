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
- ✅ **15 adet controller unit testi**

## 🚀 Kurulum ve Çalıştırma

### 📋 Ön Gereksinimler
- **.NET 8 SDK** - [İndir](https://dotnet.microsoft.com/download)
- **Docker Desktop** - [İndir](https://www.docker.com/products/docker-desktop/)
- **Git** - [İndir](https://git-scm.com/downloads)
- **DBeaver** (Veritabanı yönetimi için) - [İndir](https://dbeaver.io/download/)

### 🔧 Kurulum Adımları

#### 1. Projeyi bilgisayarınıza indirin:
```bash
git clone [repo-url]
cd student-course-management/backend
```

#### 2. Docker'ın çalıştığını kontrol edin:
```bash
docker --version
docker-compose --version
```

### 🐳 Docker ile Çalıştırma (ÖNERİLEN)

#### 3. Uygulamayı Docker ile başlatın:
```bash
# PostgreSQL veritabanını Docker'da başlat
docker-compose up -d

# Uygulamayı çalıştır
dotnet run
```

#### 4. Tarayıcınızda kontrol edin:
- **API:** http://localhost:5000
- **Swagger Dokümantasyonu:** http://localhost:5000/swagger

### 💻 Docker'sız Çalıştırma (Alternatif)

#### 3. PostgreSQL'i bilgisayarınıza kurun:
- [PostgreSQL İndir](https://www.postgresql.org/download/)
- **Kurulum sırasında şifre olarak `postgres` yazın** (appsettings.json ile uyumlu olması için)
- **Port olarak 5435 seçin** (varsayılan 5432 yerine)

#### 4. Veritabanını oluşturun:
```bash
# PostgreSQL komut satırını açın ve şu komutu çalıştırın:
createdb studentmanagementdb
```

#### 5. Uygulamayı çalıştırın:
```bash
dotnet run
```

> **💡 İpucu:** PostgreSQL'i 5435 portunda kurduğunuz için `appsettings.json` dosyasını değiştirmenize gerek yok. Proje zaten 5435 portuna bağlanacak şekilde yapılandırılmış.

## 🗃️ Veritabanı Yönetimi (DBeaver)

### DBeaver Bağlantı Kurulumu:
1. **DBeaver'ı açın**
2. **"New Database Connection" butonuna tıklayın** (+ ikonu)
3. **PostgreSQL'i seçin** ve "Next"
4. **Bağlantı bilgilerini girin:**

**Docker ile çalıştırıyorsanız:**
- **Host:** localhost
- **Port:** 5435
- **Database:** studentmanagementdb
- **Username:** postgres
- **Password:** postgres

**Docker'sız çalıştırıyorsanız:**
- **Host:** localhost
- **Port:** 5435
- **Database:** studentmanagementdb
- **Username:** postgres
- **Password:** postgres

5. **"Test Connection" ile test edin**
6. **"Finish" ile kaydedin**

## 🌐 API Endpoints

### 🔐 Kimlik Doğrulama
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Kullanıcı çıkışı
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### 👥 Kullanıcı Yönetimi
- `GET /api/user/profile` - Kendi profilini görüntüleme
- `PUT /api/user/profile` - Kendi profilini güncelleme
- `GET /api/user` - Tüm kullanıcılar (Admin)
- `GET /api/user/students` - Sadece öğrenci listesi (Admin)
- `GET /api/user/admins` - Sadece admin listesi (Admin)
- `GET /api/user/{id}` - Kullanıcı detayı (Admin)
- `POST /api/user` - Yeni kullanıcı oluşturma (Admin)
- `PUT /api/user/{id}` - Kullanıcı güncelleme (Admin)
- `DELETE /api/user/{id}` - Kullanıcı silme (Admin)
- `GET /api/user/{id}/enrollments` - Kullanıcının kayıtları (Admin)

### 📚 Ders Yönetimi
- `GET /api/course` - Ders listesi (Admin)
- `GET /api/course/{id}` - Ders detayı (Admin)
- `GET /api/course/{id}/info` - Ders temel bilgisi (Admin)
- `POST /api/course` - Ders oluşturma (Admin)
- `PUT /api/course/{id}` - Ders güncelleme (Admin)
- `DELETE /api/course/{id}` - Ders silme (Admin)
- `GET /api/course/available` - Mevcut dersler (Öğrenci)
- `GET /api/course/{id}/enrollments` - Ders kayıtları (Admin)

### 📝 Kayıt İşlemleri
- `GET /api/enrollment` - Tüm kayıtlar (Admin)
- `POST /api/enrollment/enroll` - Derse kayıt (Öğrenci)
- `POST /api/enrollment/admin-enroll` - Admin kayıt (Admin)
- `DELETE /api/enrollment/unenroll/{courseId}` - Dersten çıkma (Öğrenci)
- `DELETE /api/enrollment/{enrollmentId}` - Admin kayıt silme (Admin)
- `GET /api/enrollment/my-enrollments` - Kendi kayıtları (Öğrenci)

## 🔑 Varsayılan Kullanıcı Bilgileri

### Admin Hesabı:
```
Email: admin@admin.com
Password: Admin123!
```

> **🔒 Güvenlik Notu:** Güvenlik nedeniyle doğrudan admin hesabı oluşturamazsınız. Yeni kullanıcılar varsayılan olarak "Student" rolü ile kaydolur. Admin yetkisi vermek için:
> 1. Yukarıdaki admin hesabı ile giriş yapın
> 2. İstediğiniz kullanıcıyı oluşturun veya mevcut bir kullanıcıyı güncelleyin
> 3. Kullanıcının rolünü "Admin" olarak değiştirin

### Öğrenci Hesabı:
```
Email: student@student.com
Password: Student123!
```

## 🧪 Testleri Çalıştırma

```bash
# Test klasörüne git
cd backend.Tests

# Testleri çalıştır
dotnet test
```

**Test Kapsamı:**
- ✅ **15 adet unit test**
- 🔐 **AuthController testleri** (3 test)
- 📚 **CourseController testleri** (4 test)
- 📝 **EnrollmentController testleri** (4 test)
- 👥 **UserController testleri** (4 test)

## 🔧 Geliştirme Komutları

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

## 🎯 Proje Özellikleri

- 🎯 **Tek Port**: `http://localhost:5000`
- 📝 **Hazır Konfigürasyon**: Ekstra ayar gerektirmez
- 🔑 **Güvenli JWT**: Production ready
- 🗑️ **Temiz Kod**: Gereksiz karmaşıklık yok
- 🚀 **Hızlı Başlangıç**: `git clone` → `docker-compose up -d` → `dotnet run`

## 🆘 Sorun Giderme

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
- Port çakışması varsa `docker-compose.yml`'deki portu değiştirin

## 👨‍💻 Geliştirici

**Melih Vardar** - Fullstack Developer
