const message = {
  it: {
    message:
      "Questo sito utilizza cookie tecnici e di analytics. Cliccando su “Accetto”, accetti l’utilizzo dei cookie descritto nell’informativa privacy.",
    policy: "Informativa privacy",
    button: "Accetto",
  },
  en: {
    message:
      "This site uses technical and analytics cookies. By clicking ‘I agree’, you agree to the usage of cookies as described in the privacy notice.",
    policy: "Privacy notice",
    button: "I agree",
  },
};

const okWithCookies = () => {
  // Dismiss banner and save choice
  const cookieBanner = document.getElementById("cookie-banner");
  cookieBanner.classList.add("dismissed");
  localStorage.setItem("CookieClosed", true);

  ga("set", "anonymizeIp", true);
  ga("send", "pageview");
};

const checkStatus = (cookieBanner, acceptButton) => {
  // If the banner has never been dismissed, show it
  if (!localStorage.getItem("CookieClosed")) {
    setTimeout(function () {
      cookieBanner.classList.remove("dismissed");
    }, 500);
    acceptButton.addEventListener("click", okWithCookies);
  } else okWithCookies();
};

export function handleCookies() {
  const addCookieBanner = () => {
    const lang = localStorage.getItem("language");
    const bannerStyle = document.createElement("style");
    bannerStyle.innerHTML =
      "#cookie-banner{background:#6D72A6;opacity:.95;font-size:14px;line-height:1.6;width:100%;position:fixed;z-index:50;bottom:0;left:0;padding:1em;display:flex;align-self:center;justify-content:flex-start;transition:.5s all cubic-bezier(.3,0,.2,1);color:#fff}#cookie-banner span{max-width:65%;}@media (max-width:700px){#cookie-banner{justify-content:center}}#cookie-banner.dismissed{bottom:-.5em;opacity:0;pointer-events:none}#cookie-banner>div{justify-content: space-between;max-width:960px;margin:0 auto;padding:1em;display:flex;align-items:center}.pn-link{color:#fff!important;font-size:16px;margin:auto 16px;font-weight:700;text-decoration:none;}@media screen and (max-width:1024px){#cookie-banner>div{flex-direction:column}#cookie-banner .pn-link,#cookie-banner span{max-width:100%;margin-bottom:8px}}";
    const bannerCookie = document.createElement("div");
    bannerCookie.innerHTML = `<div id="cookie-banner" class="dismissed"><div><span>${message[lang].message}</span><a href="/pn.html" class="pn-link">${message[lang].policy}</a><button class="button cookies" id="accept-btn">${message[lang].button}</button></div>`;

    // Create and append CSS for the banner
    document.head.appendChild(bannerStyle);

    // Create and append banner div
    document.body.appendChild(bannerCookie);
  };

  addCookieBanner();

  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-btn");
  checkStatus(cookieBanner, acceptButton);
}

export function updateCookiesLang() {
  const lang = localStorage.getItem("language");
  const cookieBanner = document.getElementById("cookie-banner");
  cookieBanner.innerHTML = `<div><span>${message[lang].message}</span><a href="/pn.html" class="pn-link">${message[lang].policy}</a><button class="button cookies" id="accept-btn">${message[lang].button}</button>`;
  const acceptButton = document.getElementById("accept-btn");
  acceptButton.addEventListener("click", okWithCookies);
}
