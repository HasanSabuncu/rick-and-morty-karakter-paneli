# Rick and Morty Karakter Paneli

Bu proje, Massive Bioinformatics şirketinin staj değerlendirmesi için geliştirilmiş bir web uygulamasıdır. Uygulama, Rick and Morty API'sini kullanarak karakterleri listeler ve filtreleme özellikleri sunar.

## Özellikler

- Karakter listesi görüntüleme
- Sayfalama (10, 20, 50 karakter/sayfa)
- Gelişmiş filtreleme özellikleri:
  - İsim ile arama
  - Durum filtresi
  - Tür filtresi
  - Cinsiyet filtresi
  - Konum filtresi
  - Bölüm filtresi
- Karakter detay görüntüleme
- Responsive tasarım

## Kullanılan Teknolojiler

- React.js
- Redux Toolkit (State yönetimi)
- Material-UI (Arayüz bileşenleri)
- Rick and Morty API

## Kurulum

1. Projeyi klonlayın:
```bash
git clone [proje-url]
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

## Geliştirme Süreci

### Karşılaşılan Zorluklar ve Çözümler

1. **API Sayfalama Sınırlaması**
   - Sorun: API her sayfada maksimum 20 karakter dönüyor
   - Çözüm: 50 karakter gösterimi için birden fazla sayfa çekip birleştirme

2. **Filtreleme Optimizasyonu**
   - Sorun: Çok sayıda filtre seçeneği performansı etkileyebilir
   - Çözüm: Debounce tekniği ile API çağrılarını optimize etme

### Öğrenilen Yeni Konular

- Redux Toolkit ile modern state yönetimi
- Material-UI ile profesyonel arayüz geliştirme
- API entegrasyonu ve veri yönetimi
- React hooks ve custom hooks kullanımı

## Gelecek Geliştirmeler

- [ ] Favorilere ekleme özelliği
- [ ] Türkçe/İngilizce dil desteği
- [ ] Karakter karşılaştırma özelliği
- [ ] Offline kullanım desteği

## İletişim

[Adınız Soyadınız] - [email@example.com]
