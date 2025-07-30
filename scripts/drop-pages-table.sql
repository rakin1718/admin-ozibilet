-- Önce mevcut politikaları sil (eğer varsa)
DROP POLICY IF EXISTS "Allow authenticated users to select ozibilet_pages" ON public.ozibilet_pages;
DROP POLICY IF EXISTS "Allow authenticated users to insert ozibilet_pages" ON public.ozibilet_pages;
DROP POLICY IF EXISTS "Allow authenticated users to update ozibilet_pages" ON public.ozibilet_pages;
DROP POLICY IF EXISTS "Allow authenticated users to delete ozibilet_pages" ON public.ozibilet_pages;
DROP POLICY IF EXISTS "Allow authenticated users to select ozibilet_page_versions" ON public.ozibilet_page_versions;
DROP POLICY IF EXISTS "Allow authenticated users to insert ozibilet_page_versions" ON public.ozibilet_page_versions;
DROP POLICY IF EXISTS "Allow authenticated users to update ozibilet_page_versions" ON public.ozibilet_page_versions;
DROP POLICY IF EXISTS "Allow authenticated users to delete ozibilet_page_versions" ON public.ozibilet_page_versions;
DROP POLICY IF EXISTS "Allow authenticated users to select ozibilet_settings" ON public.ozibilet_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert ozibilet_settings" ON public.ozibilet_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update ozibilet_settings" ON public.ozibilet_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete ozibilet_settings" ON public.ozibilet_settings;

-- Trigger'ları sil (eğer varsa)
DROP TRIGGER IF EXISTS update_ozibilet_pages_updated_at ON public.ozibilet_pages;
DROP TRIGGER IF EXISTS update_ozibilet_settings_updated_at ON public.ozibilet_settings;

-- Fonksiyonları sil (eğer varsa)
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS update_page_order_after_insert(UUID, INT);

-- Tabloları CASCADE ile sil
DROP TABLE IF EXISTS public.ozibilet_settings CASCADE;
DROP TABLE IF EXISTS public.ozibilet_page_versions CASCADE;
DROP TABLE IF EXISTS public.ozibilet_pages CASCADE;

-- Enum'u sil (eğer varsa)
DROP TYPE IF EXISTS ozibilet_block_type;
