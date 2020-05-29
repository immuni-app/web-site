import lang_it from "../res/i18n/it.json";
import lang_en from "../res/i18n/en.json";
import lang_de from "../res/i18n/de.json";
import lang_es from "../res/i18n/es.json";
import lang_fr from "../res/i18n/fr.json";
import lang_pt from "../res/i18n/pt.json";

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
      pt: lang_pt,
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
