export type Locale = 'en' | 'es';

interface Strings {
  readMore: string;
  read: string;
  relatedReading: string;
  goToFirstPage: string;
  goToPreviousPage: string;
  goToNextPage: string;
  goToLastPage: string;
  pageOf: (current: number, last: number) => string;
}

const STRINGS: Record<Locale, Strings> = {
  en: {
    readMore: 'Read More',
    read: 'Read',
    relatedReading: 'Related reading',
    goToFirstPage: 'Go to first page',
    goToPreviousPage: 'Go to previous page',
    goToNextPage: 'Go to next page',
    goToLastPage: 'Go to last page',
    pageOf: (current, last) => `Page ${current} of ${last}`,
  },
  es: {
    readMore: 'Leer más',
    read: 'Leer',
    relatedReading: 'Lecturas relacionadas',
    goToFirstPage: 'Ir a la primera página',
    goToPreviousPage: 'Ir a la página anterior',
    goToNextPage: 'Ir a la página siguiente',
    goToLastPage: 'Ir a la última página',
    pageOf: (current, last) => `Página ${current} de ${last}`,
  },
};

export function t(locale: Locale = 'en'): Strings {
  return STRINGS[locale];
}

const DATE_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  es: 'es',
};

export function formatDate(date: Date, locale: Locale = 'en', options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString(DATE_LOCALE[locale], options ?? { year: 'numeric', month: 'long', day: 'numeric' });
}
