import lang_it from "../res/i18n/it.json";
import lang_en from "../res/i18n/en.json";
import lang_de from "../res/i18n/de.json";
import lang_es from "../res/i18n/es.json";
import lang_fr from "../res/i18n/fr.json";

import * as feat_it from "../assets/img/feat-illustration-it.png";
import * as feat_it_mobile from "../assets/img/feat-illustration-mobile-it.png";
import * as feat_en from "../assets/img/feat-illustration-en.png";
import * as feat_en_mobile from "../assets/img/feat-illustration-mobile-en.png";
import * as feat_de from "../assets/img/feat-illustration-de.png";
import * as feat_de_mobile from "../assets/img/feat-illustration-mobile-de.png";
import * as feat_fr from "../assets/img/feat-illustration-fr.png";
import * as feat_fr_mobile from "../assets/img/feat-illustration-mobile-fr.png";
import * as feat_es from "../assets/img/feat-illustration-es.png";
import * as feat_es_mobile from "../assets/img/feat-illustration-mobile-es.png";

const image = {
  it: feat_it,
  en: feat_en,
  de: feat_de,
  fr: feat_fr,
  es: feat_es,
};

const imageMobile = {
  it: feat_it_mobile,
  en: feat_en_mobile,
  de: feat_de_mobile,
  fr: feat_fr_mobile,
  es: feat_es_mobile,
};

class Translator {
  constructor(options = {}) {
    this._options = Object.assign({}, this.defaultConfig, options);
    this._lang = this.getLanguage();
    this._elements = document.querySelectorAll("[data-i18n]");
  }

  getLanguage() {
    if (!this._options.detectLanguage) {
      return this._options.defaultLanguage;
    }

    var stored = localStorage.getItem("language");

    if (this._options.persist && stored) {
      return stored;
    }

    var lang = navigator.languages
      ? navigator.languages[0]
      : navigator.language;

    return lang.substr(0, 2);
  }

  load(lang = null) {
    if (lang) {
      if (!this._options.languages.includes(lang)) {
        return;
      }

      this._lang = lang;
    }

    var resources = {
      it: lang_it,
      en: lang_en,
      de: lang_de,
      es: lang_es,
      fr: lang_fr,
    };

    var translation = resources[this._lang];

    this.translate(translation);
    this.toggleLangTag();
    if (this._options.persist) {
      localStorage.setItem("language", this._lang);
    }
  }

  toggleLangTag() {
    if (document.documentElement.lang !== this._lang) {
      document.documentElement.lang = this._lang;
    }
  }

  translate(translation) {
    function replace(element) {
      var text = element.dataset.i18n
        .split(".")
        .reduce((obj, i) => obj[i], translation);

      if (text) {
        element.innerHTML = text;
      }
    }

    this._elements.forEach(replace);
  }

  get defaultConfig() {
    return {
      persist: false,
      languages: ["it"],
      defaultLanguage: "it",
    };
  }
}

export default Translator;

export function handleHomeImage() {
  const lang = localStorage.getItem("language");
  const featImg = document.querySelector(".feat-illustration");
  const featImgMobile = document.querySelector(".feat-illustration--mobile");
  const imgUrl = image[lang].default;
  const imgUrlMobile = imageMobile[lang].default;
  if (featImg || featImgMobile) {
    featImg.innerHTML = `<img src="${imgUrl}" alt="Screenshot of the main Immuni App dashboard"/>`;
    featImgMobile.innerHTML = `<img src="${imgUrlMobile}" alt="Screenshot of the main Immuni App dashboard"/>`;
  }
}
