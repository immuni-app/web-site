import gsap, { Expo } from "gsap";

// Wrap every letter in a span

export function separateLetters(textWrapper) {
  for (let i = 0; i < textWrapper.length; i++) {
    textWrapper[i].innerHTML = textWrapper[i].textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );
  }
}

export function separateWords(textWrapper) {
  for (let i = 0; i < textWrapper.length; i++) {
    textWrapper[i].innerHTML = textWrapper[i].textContent.replace(
      /\b(\w+)\b/g,
      "<span class='word'>$&</span>"
    );
  }
}

// ANIMATE ON SCROLL

export function animateTitle(element) {
  let delayTime = 0.1;
  if (element.classList.contains("delayed")) {
    gsap.from(element, {
      autoAlpha: 0,
      y: 40,
      duration: 0.9,
      ease: Expo.easeInOut,
      delay: delayTime,
    });
  } else if (element.classList.contains("staggered")) {
    const items = [...element.children];
    items.forEach((el) => {
      gsap.from(el, 1, {
        autoAlpha: 0,
        y: 60,
        duration: 1,
        ease: Expo.easeInOut,
        delay: delayTime,
      });
      delayTime += 0.15;
    });
  } else {
    gsap.from(element, {
      autoAlpha: 0,
      y: 60,
      duration: 0.8,
      ease: Expo.easeInOut,
    });
  }
}

// AVAILABLE BUTTON ANIM

export function animateButton() {
  let isHovering = false;
  const el = document.querySelector(".hoverable");
  const tooltip = document.querySelector(".tooltip");
  if (el) {
    tooltip.addEventListener("mouseenter", () => {
      isHovering = true;
    });
    tooltip.addEventListener("mouseleave", () => {
      isHovering = false;
    });
    el.addEventListener("mouseenter", () => {
      const contet = [...tooltip.children];
      if (!gsap.isTweening(tooltip)) {
        gsap.to(tooltip, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: Expo.easeOut,
        });
        if (!isHovering) {
          contet.forEach((el) => {
            gsap.from(el, 0.3, {
              autoAlpha: 0,
              y: -10,
              delay: 0.2,
            });
          });
        }
      }
      isHovering = true;
    });
    el.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!isHovering) {
          gsap.to(tooltip, {
            autoAlpha: 0,
            scale: 0,
            duration: 0.3,
            ease: Expo.easeInOut,
          });
        }
      }, 200);
      isHovering = false;
    });
  }
}
