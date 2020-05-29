import gsap, { Expo } from "gsap";
import { withinViewport } from "./reveal-helper";
import * as imgUrl from "../assets/img/search-illustration.png";
import faqIt from "../res/faq/faq_it.json";
import faqEn from "../res/faq/faq_en.json";
import faqDe from "../res/faq/faq_en.json";
import faqEs from "../res/faq/faq_en.json";
import faqFr from "../res/faq/faq_en.json";
import faqPt from "../res/faq/faq_en.json";
const resources = {
  it: faqIt,
  en: faqEn,
  de: faqEn,
  es: faqEn,
  fr: faqEn,
  pt: faqEn,
};

const empty = {
  it: "Nessun risultato trovato",
  en: "No matches found",
  de: "de",
  es: "es",
  fr: "fr",
  pt: "pt",
};

export function handleFaq() {
  const lang = localStorage.getItem("language");
  const faq = resources[lang];
  const list = document.querySelector(".accordion-wrapper");
  const search = document.querySelector(".search__input");
  const clearBtn = document.querySelector(".search__clear");
  const renderFaq = (elements) => {
    let li = "";

    if (Object.entries(elements).length !== 0) {
      Object.keys(elements).forEach((el) => {
        // Commented until we have the categories back
        // li += `<h5 class="tagline tagline__faq"><div class="text-wrapper revealer">${el}</div></h5>`;
        elements[el].forEach((value) => {
          li += `<div class="accordion"><button class="accordion__button">${value.title}</button><div class="accordion__panel">${value.content}</div></div>`;
        });
      });
    } else {
      li = `<div class="no-results revealer"><p>${empty[lang]}</p><img src="${imgUrl.default}" alt="Illustration of two text bubbles saying nothing found" class="search-illustration"/></div>`;
    }
    list.innerHTML = li;

    withinViewport();
    const animateList = [...document.querySelectorAll(".accordion")];
    let delayTime = 0.1;
    animateList.forEach((el) => {
      gsap.from(el, 0.4, {
        autoAlpha: 0,
        y: 20,
        duration: 0.2,
        delay: delayTime,
        ease: Expo.easeInOut,
      });
      delayTime += 0.04;
    });
  };
  renderFaq(faq);
  handleAccordion();

  const filterList = (event) => {
    let keyword = search.value.toLowerCase();
    clearBtn.style.visibility = keyword.length ? "visible" : "hidden";
    const filterQuestions = (list) => {
      let filteredList = {};
      Object.keys(list).forEach((category) => {
        const filteredValue = list[category].filter((value) => {
          let title = value.title.toLowerCase();
          let content = value.content.toLowerCase();
          return title.indexOf(keyword) > -1 || content.indexOf(keyword) > -1;
        });
        if (filteredValue.length) {
          filteredList[category] = filteredValue;
        }
      });
      return filteredList;
    };
    renderFaq(filterQuestions(faq));
    handleAccordion();
  };

  search.addEventListener("keyup", filterList);

  clearBtn.onclick = () => {
    clearBtn.style.visibility = "hidden";
    search.value = "";
    filterList();
  };
}

export function handleAccordion() {
  const acc = [...document.getElementsByClassName("accordion__button")];

  acc.forEach((el) => {
    el.addEventListener("click", function () {
      this.parentElement.classList.toggle("active");
      this.classList.toggle("active");
      let panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.style.opacity = "0";
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.opacity = "1";
      }
    });
  });
}
