-- Enum'u oluştur (eğer yoksa)
DO $$ BEGIN
    CREATE TYPE ozibilet_block_type AS ENUM ('text', 'image', 'button', 'promo', 'event', 'hero', 'chart');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Ana sayfalar tablosu
CREATE TABLE IF NOT EXISTS public.ozibilet_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sayfa versiyonları tablosu
CREATE TABLE IF NOT EXISTS public.ozibilet_page_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_id UUID REFERENCES public.ozibilet_pages(id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    version_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Genel ayarlar tablosu
CREATE TABLE IF NOT EXISTS public.ozibilet_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS'yi etkinleştir
ALTER TABLE public.ozibilet_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ozibilet_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ozibilet_settings ENABLE ROW LEVEL SECURITY;

-- Politikaları oluştur (herkes okuyabilir, sadece kimlik doğrulaması yapanlar yazabilir)
CREATE POLICY "Allow public read access to published pages" ON public.ozibilet_pages
    FOR SELECT USING (is_published = true);
CREATE POLICY "Allow authenticated users full access to ozibilet_pages" ON public.ozibilet_pages
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to ozibilet_page_versions" ON public.ozibilet_page_versions
    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to ozibilet_settings" ON public.ozibilet_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger'ları oluştur (updated_at otomatik güncellemesi için)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ozibilet_pages_updated_at
    BEFORE UPDATE ON public.ozibilet_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ozibilet_settings_updated_at
    BEFORE UPDATE ON public.ozibilet_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Örnek veri ekle (eğer yoksa)
INSERT INTO public.ozibilet_pages (title, slug, content, is_published, order_index)
VALUES ('Ana Sayfa', 'anasayfa', '[{"id":"hero-1","type":"hero","content":{"title":"Ozi Bilet Platformuna Hoş Geldiniz!","subtitle":"Şansınızı deneyin ve büyük ödüller kazanın","description":"Her 1000 TL yatırım için bilet kazanın"}}]'::jsonb, true, 1)
ON CONFLICT (slug) DO NOTHING;

-- Sayfa sıralama fonksiyonu
CREATE OR REPLACE FUNCTION update_page_order_after_insert(new_page_id UUID, new_order_idx INT)
RETURNS VOID AS $$
BEGIN
    -- Yeni sayfanın eklendiği sıradan sonraki tüm sayfaların order_index'ini artır
    UPDATE public.ozibilet_pages
    SET order_index = order_index + 1
    WHERE id != new_page_id AND order_index >= new_order_idx;
END;
$$ LANGUAGE plpgsql;
