import {
  type TI18NImportData,
  type TMessageTranslations,
  parseChunkImport,
} from '@commercetools-frontend/i18n';

const getChunkImport = (locale: string): Promise<TI18NImportData> => {
  switch (locale) {
    case 'de':
      return import(
        /* webpackChunkName: "app-i18n-de" */
        './i18n/data/de.json'
      );
    case 'en-GB':
      return import(
        /* webpackChunkName: "app-i18n-de" */
        './i18n/data/en-GB.json'
      );
    default:
      return import(
        /* webpackChunkName: "app-i18n-en" */
        './i18n/data/core.json'
      );
  }
};

const loadMessages = async (locale: string): Promise<TMessageTranslations> => {
  try {
    const chunkImport = await getChunkImport(locale);
    return parseChunkImport(chunkImport);
  } catch (error) {
    console.warn(
      `Something went wrong while loading the app messages for ${locale}`,
      error
    );
    return {};
  }
};

export default loadMessages;
