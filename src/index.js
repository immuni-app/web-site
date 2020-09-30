import "./styles/index.scss";
import { handleHamburger, fixNav, anchorScroll } from "./scripts/menu-helper";
import { withinViewport } from "./scripts/reveal-helper";
import { handleCookies } from "./scripts/cookies-helper";
import { handleFaq } from "./scripts/faq-helper";
import { animateTitle } from "./scripts/text-animation";
import { cssVarSupport } from "./scripts/browser-helper";
import { selectSupport } from "./scripts/drop-down-helper";
import Translator, { handleHomeImage } from "./scripts/translation-helper";
import smoothscroll from "smoothscroll-polyfill";
import cssVars from "css-vars-ponyfill";


cssVarSupport();

// Node forEach Polyfill
if ("NodeList" in window && !NodeList.prototype.forEach) {
  console.info("polyfill for IE11");
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

// css vars support for IE and older browsers
cssVars({
  // Treat all browsers as legacy if false
  onlyLegacy: true,
  // preserve static values
  preserveStatic: false,
  // preserve variables
  preserveVars: false,
});

// smoothscroll polyfill
smoothscroll.polyfill();

const translator = new Translator({
  persist: true,
  languages: ["it", "en", "de", "es", "fr"],
  defaultLanguage: "it",
  detectLanguage: true,
});

translator.load();

selectSupport(translator);

const selectors = [...document.querySelectorAll("select.cs-select")];

selectors.forEach(function (el) {
  new SelectFx(el);
});

const intro = document.querySelectorAll(".intro");

handleCookies();
handleHamburger();
anchorScroll();
intro.forEach((el) => {
  animateTitle(el);
});
handleHomeImage();
if (window.location.href.indexOf("faq") != -1) {
  handleFaq();
}
withinViewport();
window.addEventListener("scroll", fixNav);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
