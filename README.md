# Ozibilet Admin Paneli

Bu proje, Supabase entegrasyonu ile sürükle-bırak destekli bir sayfa yönetimi paneli sunar.

## Özellikler

-   **Sayfa Yönetimi:** Sayfaları oluşturun, düzenleyin, kopyalayın ve silin.
-   **Sürükle-Bırak Sıralama:** Sayfa listesindeki sayfaları ve sayfa içeriğindeki blokları sürükle-bırak ile yeniden sıralayın.
-   **İçerik Blokları:** Metin, görsel, buton, hero, promosyon, etkinlik ve grafik gibi çeşitli blok tipleriyle sayfa içeriği oluşturun.
-   **Blok Düzenleme:** Her bloğun içeriğini ve stilini ayrı ayrı düzenleyin.
-   **Versiyon Geçmişi:** Sayfa versiyonlarını görüntüleyin ve önceki bir versiyona geri dönün.
-   **Kaydet ve Yayınla:** Sayfa taslaklarını kaydedin veya sayfaları yayınlayın.
-   **Mobil Uyumlu:** Duyarlı tasarım sayesinde mobil cihazlarda da kullanılabilir.
-   **Katmanlar Paneli:** Sayfa yapısını hiyerarşik olarak görüntüleyin.
-   **Stil Paneli:** Seçili blokların stil özelliklerini kapsamlı bir şekilde düzenleyin.
-   **Halka Açık Sayfalar:** Oluşturduğunuz sayfaları benzersiz slug'ları aracılığıyla halka açık olarak görüntüleyin.

## Kurulum

1.  **Supabase Projesi Oluşturma:**
    *   [database.new](https://database.new) adresine gidin ve yeni bir Supabase projesi oluşturun.
    *   Projeniz hazır olduğunda, Supabase kontrol panelinizdeki "SQL Editor" bölümüne gidin.

2.  **Veritabanı Şemasını Oluşturma:**
    *   Bu projedeki `scripts/drop-pages-table.sql` dosyasının içeriğini kopyalayın ve Supabase SQL Editor'da çalıştırın. Bu, önceki tabloları temizleyecektir.
    *   Ardından, `scripts/create-pages-table.sql` dosyasının içeriğini kopyalayın ve Supabase SQL Editor'da çalıştırın. Bu, gerekli tabloları ve RLS (Row Level Security) politikalarını oluşturacaktır.

3.  **Ortam Değişkenlerini Ayarlama:**
    *   Supabase projenizin "Project Settings" -> "API" bölümünden `Project URL` ve `Service Role Key` değerlerini alın.
    *   Bu değerleri Vercel projenizin ortam değişkenlerine ekleyin:
        *   `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
        *   `SUPABASE_SERVICE_ROLE_KEY` (Service Role Key)

4.  **Uygulamayı Çalıştırma:**
    *   Uygulamayı yerel olarak çalıştırmak için: `npm install` ve `npm run dev`
    *   Uygulamayı Vercel'e dağıtmak için: Vercel CLI veya GitHub entegrasyonunu kullanın.

## Kullanım

-   Admin paneline `/admin/pages` adresinden erişebilirsiniz.
-   Sol kenar çubuğunda mevcut sayfaları ve diğer navigasyon öğelerini göreceksiniz.
-   "Sayfalarım" dashboard'unda yeni bir sayfa oluşturabilir, mevcut sayfaları düzenleyebilir, kopyalayabilir veya silebilirsiniz.
-   Bir sayfayı düzenlemek için kart üzerindeki "Düzenle" butonuna tıklayın. Bu sizi sayfa düzenleyiciye yönlendirecektir.
-   Sayfa düzenleyicide:
    *   Sol panelde sayfanın "Katmanlarını" (blok yapısını) görebilirsiniz.
    *   Sağ panelde seçili blokların "Stillerini" düzenleyebilirsiniz.
    *   Blokları sürükleyerek sıralarını değiştirebilirsiniz.
    *   Bir bloğu kopyalamak veya silmek için ilgili ikonları kullanın.
    *   Sayfa başlığını ve slug'ını düzenleyici alanının üst kısmından değiştirebilirsiniz.
    *   Değişikliklerinizi kaydetmek için üstteki "Taslağı Kaydet" butonunu kullanın.
    *   Sayfayı herkese açık hale getirmek için "Yayınla" butonuna tıklayın.
    *   Sayfa versiyon geçmişini görmek ve geri yüklemek için sayfa öğesinin yanındaki "Saat" ikonuna tıklayın.
-   Yayınlanmış sayfalarınıza `/[sayfa-slugunuz]` adresinden erişebilirsiniz (örn. `http://localhost:3000/anasayfa`).
