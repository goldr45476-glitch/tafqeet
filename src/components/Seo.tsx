import { useEffect } from 'react';
import { useLocale } from '../i18n';

/** Lightweight client-side SEO: updates document title & meta description per route. */
export default function Seo({ title, description }: { title: string; description?: string }) {
  const { locale } = useLocale();

  useEffect(() => {
    const fullTitle = `${title} | ${locale === 'ar' ? 'Tafqeit' : 'Tafqeit'}`;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', fullTitle);
  }, [title, description, locale]);

  return null;
}
