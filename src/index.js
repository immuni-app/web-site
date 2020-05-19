import "./styles/index.scss";
import { handleHamburger, fixNav, anchorScroll } from "./scripts/menu-helper";
import { withinViewport } from "./scripts/reveal-helper";
import { handleFaq } from "./scripts/faq-helper";
import { animateTitle } from "./scripts/text-animation";
import { cssVarSupport } from "./scripts/browser-helper";
import smoothscroll from "smoothscroll-polyfill";
import cssVars from "css-vars-ponyfill";
import faq from "./res/faq_it.json";

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

const intro = document.querySelectorAll(".intro");

handleHamburger();
anchorScroll();
intro.forEach((el) => {
  animateTitle(el);
});
if (window.location.href.indexOf("faq") != -1) {
  handleFaq(faq);
}
withinViewport();
window.addEventListener("scroll", fixNav);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
