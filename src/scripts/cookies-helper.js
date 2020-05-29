export function handleCookies() {
  const addCookieBanner = () => {
    var bannerStyle = document.createElement("style");
    bannerStyle.innerHTML =
      "#cookie-banner{background:#f22959;opacity:.95;font-size:14px;line-height:1.6;width:100%;position:fixed;z-index:50;bottom:0;left:0;padding:1em;display:flex;align-self:center;justify-content:flex-start;transition:.5s all cubic-bezier(.3,0,.2,1);color:#fff}#cookie-banner a{color:#fff;text-decoration:underline}@media (max-width:700px){#cookie-banner{justify-content:center}}#cookie-banner.dismissed{bottom:-.5em;opacity:0;pointer-events:none}#cookie-banner>div{max-width:960px;margin:0 auto;padding:1em;display:flex;align-items:center}#cookie-banner a{text-decoration:underline}.pn-link{font-size:16px;margin:auto 16px;font-weight:700}@media screen and (max-width:1024px){#cookie-banner>div{flex-direction:column}#cookie-banner .pn-link,#cookie-banner span{margin-bottom:8px}}";

    var bannerCookie = document.createElement("div");
    bannerCookie.innerHTML =
      '<div id="cookie-banner" class="dismissed"><div><span>Questo sito utilizza cookie tecnici, di analytics e di terze parti. Proseguendo la navigazione accetti la nostra Informativa Privacy.</span><a href="/pn.html" class="pn-link">Informativa</a><button class="button cookies" id="accept-btn">Accetto</button></div>';

    // Create and append CSS for the banner
    document.head.appendChild(bannerStyle);

    // Create and append banner div
    document.body.appendChild(bannerCookie);
  };

  const okWithCookies = () => {
    // Dismiss banner and save choice
    cookieBanner.classList.add("dismissed");
    localStorage.setItem("CookieClosed", true);

    ga("set", "anonymizeIp", true);
    ga("send", "pageview");
  };

  addCookieBanner();

  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-btn");
  // If the banner has never been dismissed, show it
  if (!localStorage.getItem("CookieClosed")) {
    setTimeout(function () {
      cookieBanner.classList.remove("dismissed");
    }, 500);
    acceptButton.addEventListener("click", okWithCookies);
  } else okWithCookies();
}
