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

/* Report positivity Images */
import * as report_it_left_top from "../assets/img/report-illustration-it.png";
import * as report_en_left_top from "../assets/img/report-illustration-en.png";
import * as report_de_left_top from "../assets/img/report-illustration-de.png";
import * as report_fr_left_top from "../assets/img/report-illustration-fr.png";
import * as report_es_left_top from "../assets/img/report-illustration-es.png";

import * as report_it_right from "../assets/img/report-illustration-op-it.png";
import * as report_en_right from "../assets/img/report-illustration-op-en.png";
import * as report_de_right from "../assets/img/report-illustration-op-de.png";
import * as report_fr_right from "../assets/img/report-illustration-op-fr.png";
import * as report_es_right from "../assets/img/report-illustration-op-es.png";

import * as report_it_right_mobile from "../assets/img/report-illustration-mobile-op-it.png";
import * as report_en_right_mobile from "../assets/img/report-illustration-mobile-op-en.png";
import * as report_de_right_mobile from "../assets/img/report-illustration-mobile-op-de.png";
import * as report_fr_right_mobile from "../assets/img/report-illustration-mobile-op-fr.png";
import * as report_es_right_mobile from "../assets/img/report-illustration-mobile-op-es.png";

import * as report_it_left_bottom from "../assets/img/report-illustration-cun-it.png";
import * as report_en_left_bottom from "../assets/img/report-illustration-cun-en.png";
import * as report_de_left_bottom from "../assets/img/report-illustration-cun-de.png";
import * as report_fr_left_bottom from "../assets/img/report-illustration-cun-fr.png";
import * as report_es_left_bottom from "../assets/img/report-illustration-cun-es.png";


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

const repo_image_left_top = {
  it: report_it_left_top,
  en: report_en_left_top,
  de: report_de_left_top,
  fr: report_fr_left_top,
  es: report_es_left_top,
};

const repo_image_right = {
  it: report_it_right,
  en: report_en_right,
  de: report_de_right,
  fr: report_fr_right,
  es: report_es_right,
};

const repo_image_right_mobile = {
  it: report_it_right_mobile,
  en: report_en_right_mobile,
  de: report_de_right_mobile,
  fr: report_fr_right_mobile,
  es: report_es_right_mobile,
};

const repo_image_left_bottom = {
  it: report_it_left_bottom,
  en: report_en_left_bottom,
  de: report_de_left_bottom,
  fr: report_fr_left_bottom,
  es: report_es_left_bottom,
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

   /* script button de */
   if (document.getElementsByClassName("label_de")[0]) {
    if (lang == "de") {
      document.getElementsByClassName("label_de")[0].style.display = "block";
      document.getElementsByClassName("label_not_de")[0].style.display = "none";
    } else {
      document.getElementsByClassName("label_de")[0].style.display = "none";
      document.getElementsByClassName("label_not_de")[0].style.display = "block";
    }
  }


}

export function handleReportImage() {
  const lang = localStorage.getItem("language");

  const reportImg_left_top = document.querySelector(".repo_image_left_top");
  const reportImgRight = document.querySelector(".repo_image_right");
  const reportImgRight_mobile = document.querySelector(".repo_image_right_mobile");
  const reportImg_left_bottom = document.querySelector(".repo_image_left_bottom");

  const imgUrl_left_top = repo_image_left_top[lang].default;
  const imgUrl_right = repo_image_right[lang].default;
  const imgUrl_right_mobile = repo_image_right_mobile[lang].default;
  const imgUrl_left_bottom = repo_image_left_bottom[lang].default;

  if (reportImg_left_top) {
    reportImg_left_top.innerHTML = `<img src="${imgUrl_left_top}" class="report-illustration" alt="Screenshot of the report Immuni App"/>`;
  }
  if (reportImgRight) {
    reportImgRight.innerHTML = `<img src="${imgUrl_right}" class="report-illustration report-illustration__right" alt="Screenshot of the report Immuni App"/>`;
  }
  if (reportImgRight_mobile) {
    reportImgRight_mobile.innerHTML = `<img src="${imgUrl_right_mobile}" class="report-illustration report-illustration__right" alt="Screenshot of the report Immuni App"/>`;
  }
  if (reportImg_left_bottom) {
    reportImg_left_bottom.innerHTML = `<img src="${imgUrl_left_bottom}" class="report-illustration" alt="Screenshot of the report Immuni App"/>`;
  }
}

