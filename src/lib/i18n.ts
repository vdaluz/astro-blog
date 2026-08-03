export type Locale = 'en' | 'es' | 'pt';

interface Strings {
  readMore: string;
  read: string;
  relatedReading: string;
  goToFirstPage: string;
  goToPreviousPage: string;
  goToNextPage: string;
  goToLastPage: string;
  pageOf: (current: number, last: number) => string;
  onThisPage: string;
  minRead: (minutes: number) => string;
  blogPagination: string;
  filterPosts: string;
  photoCredit: string;
  via: string;
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
    onThisPage: 'On this page',
    minRead: (minutes) => `${minutes} min read`,
    blogPagination: 'Blog pagination',
    filterPosts: 'Filter posts',
    photoCredit: 'Photo:',
    via: 'via',
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
    onThisPage: 'En esta página',
    minRead: (minutes) => `${minutes} min de lectura`,
    blogPagination: 'Paginación del blog',
    filterPosts: 'Filtrar publicaciones',
    photoCredit: 'Foto:',
    via: 'vía',
  },
  pt: {
    readMore: 'Leia Mais',
    read: 'Ler',
    relatedReading: 'Leitura relacionada',
    goToFirstPage: 'Ir para a primeira página',
    goToPreviousPage: 'Ir para a página anterior',
    goToNextPage: 'Ir para a próxima página',
    goToLastPage: 'Ir para a última página',
    pageOf: (current, last) => `Página ${current} de ${last}`,
    onThisPage: 'Nesta página',
    minRead: (minutes) => `${minutes} min de leitura`,
    blogPagination: 'Paginação do blog',
    filterPosts: 'Filtrar publicações',
    photoCredit: 'Foto:',
    via: 'via',
  },
};

export function t(locale: Locale = 'en'): Strings {
  return STRINGS[locale];
}

const DATE_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  es: 'es',
  pt: 'pt-BR',
};

export function formatDate(date: Date, locale: Locale = 'en', options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString(DATE_LOCALE[locale], options ?? { year: 'numeric', month: 'long', day: 'numeric' });
}
