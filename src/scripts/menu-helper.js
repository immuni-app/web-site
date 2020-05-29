import gsap, { Expo } from "gsap";

export function handleHamburger() {
  const menu = document.querySelector(".hamburger");
  const overlay = document.querySelector(".menu-mobile__overlay");
  const list = document.querySelectorAll(".menu-mobile__list li");
  const legal = document.querySelectorAll(".menu-mobile__legal .legal-link");
  const anchor = document.querySelectorAll(".close-nav");

  menu.addEventListener("click", () => {
    if (!gsap.isTweening(list)) {
      menu.classList.toggle("is-active");
      animateMenu(menu, overlay, list, legal);
    }
  });
  anchor.forEach((el) => {
    el.addEventListener("click", () => {
      setTimeout(() => {
        menu.classList.toggle("is-active");
        animateMenu(menu, overlay, list, legal);
      }, 600);
    });
  });
}

const animateMenu = (ham, overlay, list, legal) => {
  let vw = window.innerWidth;
  let delayTime = 0;
  list = [...list];
  let menu = list.concat.apply(list, legal);
  const nav = document.querySelector(".navigation--mobile");

  if (ham.classList.contains("is-active")) {
    document.documentElement.style.overflow = "hidden";
    nav.classList.add("colored");
    gsap.to(overlay, 1, {
      x: -vw,
      ease: Expo.easeInOut,
    });

    menu.forEach((el) => {
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
    document.documentElement.style.overflow = "initial";
    nav.classList.remove("colored");
    gsap.to(overlay, 1.2, {
      x: 0,
      ease: Expo.easeInOut,
    });
    menu.forEach((el) => {
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
