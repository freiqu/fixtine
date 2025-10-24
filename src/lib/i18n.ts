import { createI18n } from 'vue-i18n';
import * as en from './locales/en.json';
import * as de from './locales/de.json';

const messages = {
  en,
  de,
};
let locale = navigator.languages.find((l: string) => {
  Object.keys(messages).includes(l);
});
if (!locale)
  navigator.languages.forEach((lang: string) => {
    if (!locale) {
      locale = Object.keys(messages).find((l: string) => lang.startsWith(l));
    }
  });
if (!locale) {
  locale = 'en';
}
const i18n = createI18n({
  messages,
  locale,
});

export const i18nLocale = locale;

export default i18n;
