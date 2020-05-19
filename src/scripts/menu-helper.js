import gsap, { Expo } from "gsap";

export function handleHamburger() {
  const menu = document.querySelector(".hamburger");
  const overlay = document.querySelector(".menu-mobile__overlay");
  const list = document.querySelectorAll(".menu-mobile__list li");
  const anchor = document.querySelectorAll(".close-nav");

  menu.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    animateMenu(menu, overlay, list);
  });
  anchor.forEach((el) => {
    el.addEventListener("click", () => {
      setTimeout(() => {
        menu.classList.toggle("is-active");
        animateMenu(menu, overlay, list);
      }, 600);
    });
  });
}

const animateMenu = (ham, overlay, list) => {
  let vw = window.innerWidth;
  let delayTime = 0;
  const nav = document.querySelector(".navigation--mobile");

  if (ham.classList.contains("is-active")) {
    nav.classList.add("colored");
    gsap.to(overlay, 1, {
      x: -vw,
      ease: Expo.easeInOut,
    });

    list.forEach((el) => {
      gsap.to(el, 1.2, {
        autoAlpha: 1,
        x: -vw,
        opacity: 1,
        delay: delayTime,
        ease: Expo.easeInOut,
      });
      delayTime += 0.04;
    });
  } else {
    nav.classList.remove("colored");
    gsap.to(overlay, 1.2, {
      x: 0,
      ease: Expo.easeInOut,
    });
    list.forEach((el) => {
      gsap.to(el, 0.8, {
        autoAlpha: 0,
        x: 0,
        opacity: 0,
        delay: delayTime,
        ease: Expo.easeInOut,
      });
      delayTime += 0.02;
    });
  }
};

export const fixNav = () => {
  const nav = document.querySelector(".navigation--desktop");
  if (window.scrollY >= 30) {
    nav.classList.add("fixed");
  } else {
    nav.classList.remove("fixed");
  }
};

export const anchorScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
};
