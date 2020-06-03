import { handleFaq } from "./faq-helper";
import { updateCookiesLang } from "./cookies-helper";
import { handleHomeImage } from "./translation-helper";

export function selectSupport(translator) {
  /**
   * based on from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
   */
  function hasParent(e, p) {
    if (!e) return false;
    var el = e.target || e.srcElement || e || false;
    while (el && el != p) {
      el = el.parentNode || false;
    }
    return el !== false;
  }

  /**
   * extend obj function
   */
  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /**
   * SelectFx function
   */
  function SelectFx(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }

  /**
   * SelectFx options
   */
  SelectFx.prototype.options = {
    // if true all the links will open in a new tab.
    // if we want to be redirected when we click an option, we need to define a data-link attr on the option of the native select element
    newTab: true,
    // when opening the select element, the default placeholder (if any) is shown
    stickyPlaceholder: true,
    // callback when changing the value
    onChange: function (val) {
      return false;
    },
  };

  /**
   * init function
   * initialize and cache some vars
   */
  SelectFx.prototype._init = function () {
    // check if we are using a placeholder for the native select box
    // we assume the placeholder is disabled and selected by default
    var setDefaultLang = (options, lang) => {
      [...options].forEach((opt) => {
        if (opt.value === lang) {
          opt.setAttribute("selected", "");
        }
      });
    };

    setDefaultLang(
      this.el.querySelectorAll("option"),
      localStorage.getItem("language")
    );

    var selectedOpt = this.el.querySelector("option[selected]");
    this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;

    // get selected option (either the first option with attr selected or just the first option)
    this.selectedOpt = selectedOpt || this.el.querySelector("option");

    // create structure
    this._createSelectEl();

    // all options
    this.selOpts = [].slice.call(
      this.selEl.querySelectorAll("li[data-option]")
    );

    // total options
    this.selOptsCount = this.selOpts.length;

    // current index
    this.current =
      this.selOpts.indexOf(this.selEl.querySelector("li.cs-selected")) || -1;

    // placeholder elem
    this.selPlaceholder = this.selEl.querySelector("span.cs-placeholder");

    // init events
    this._initEvents();
  };

  /**
   * creates the structure for the select element
   */
  SelectFx.prototype._createSelectEl = function () {
    var self = this,
      options = "",
      createOptionHTML = function (el) {
        var optclass = "",
          classes = "",
          link = "";

        if (
          el.selectedOpt &&
          !this.foundSelected &&
          !this.hasDefaultPlaceholder
        ) {
          classes += "cs-selected ";
          this.foundSelected = true;
        }
        // extra classes
        if (el.getAttribute("data-class")) {
          classes += el.getAttribute("data-class");
        }
        // link options
        if (el.getAttribute("data-link")) {
          link = "data-link=" + el.getAttribute("data-link");
        }

        if (classes !== "") {
          optclass = 'class="' + classes + '" ';
        }

        return (
          "<li " +
          optclass +
          link +
          ' data-option data-value="' +
          el.value +
          '"><span>' +
          el.textContent +
          "</span></li>"
        );
      };

    [].slice.call(this.el.children).forEach(function (el) {
      if (el.disabled) {
        return;
      }

      var tag = el.tagName.toLowerCase();

      if (tag === "option") {
        options += createOptionHTML(el);
      } else if (tag === "optgroup") {
        options += '<li class="cs-optgroup"><span>' + el.label + "</span><ul>";
        [].slice.call(el.children).forEach(function (opt) {
          options += createOptionHTML(opt);
        });
        options += "</ul></li>";
      }
    });

    var opts_el = '<div class="cs-options"><ul>' + options + "</ul></div>";
    this.selEl = document.createElement("div");
    this.selEl.className = this.el.className;
    this.selEl.tabIndex = this.el.tabIndex;
    this.selEl.innerHTML =
      '<span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#2F4F75"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.48679 12.986C10.0861 11.7875 10.5 10.0268 10.5 8C10.5 5.97324 10.0861 4.2125 9.48679 3.01397C8.84266 1.72571 8.23033 1.5 8 1.5C7.76967 1.5 7.15734 1.72571 6.51321 3.01397C5.91395 4.2125 5.5 5.97324 5.5 8C5.5 10.0268 5.91395 11.7875 6.51321 12.986C7.15734 14.2743 7.76967 14.5 8 14.5C8.23033 14.5 8.84266 14.2743 9.48679 12.986ZM8 16C10.2091 16 12 12.4183 12 8C12 3.58172 10.2091 0 8 0C5.79086 0 4 3.58172 4 8C4 12.4183 5.79086 16 8 16Z" fill="#2F4F75"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8.75H1.5V7.25H14.5V8.75Z" fill="#2F4F75"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.21605 3.55365C5.07844 3.8986 6.35893 4.25001 8 4.25001C9.64107 4.25001 10.9216 3.8986 11.784 3.55365C12.2155 3.38104 12.5421 3.21009 12.7562 3.08579C12.8632 3.02367 12.9419 2.97332 12.9912 2.94042C13.0159 2.92398 13.0332 2.91191 13.043 2.90493L13.0522 2.89837L13.0516 2.8988L13.0509 2.89934L13.0505 2.89965C13.0502 2.89983 13.05 2.90001 13.5 3.50001C13.95 4.10001 13.9497 4.1002 13.9495 4.10039L13.9489 4.10081L13.9477 4.10176L13.9446 4.10405L13.9361 4.11024L13.9103 4.12878C13.8892 4.14377 13.8601 4.16393 13.8233 4.1885C13.7496 4.23763 13.6446 4.30447 13.5094 4.38297C13.2391 4.53993 12.847 4.74397 12.341 4.94636C11.3284 5.35141 9.85893 5.75001 8 5.75001C6.14107 5.75001 4.67157 5.35141 3.65896 4.94636C3.15298 4.74397 2.7609 4.53993 2.49059 4.38297C2.35538 4.30447 2.25045 4.23763 2.17675 4.1885C2.1399 4.16393 2.11083 4.14377 2.08967 4.12878L2.06387 4.11024L2.05544 4.10405L2.05235 4.10176L2.05108 4.10081L2.05052 4.10039C2.05026 4.1002 2.05 4.10001 2.5 3.50001C2.95 2.90001 2.94976 2.89983 2.94953 2.89965L2.94911 2.89934L2.94839 2.8988L2.94749 2.89813C2.94713 2.89787 2.94724 2.89795 2.94782 2.89837L2.95697 2.90493C2.96681 2.91191 2.98413 2.92398 3.0088 2.94042C3.05815 2.97332 3.13681 3.02367 3.24379 3.08579C3.45786 3.21009 3.78453 3.38104 4.21605 3.55365ZM13.0525 2.89813C13.0529 2.89787 13.0528 2.89795 13.0522 2.89837Z" fill="#2F4F75"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.21605 12.4464C5.07844 12.1014 6.35893 11.75 8 11.75C9.64107 11.75 10.9216 12.1014 11.784 12.4464C12.2155 12.619 12.5421 12.7899 12.7562 12.9142C12.8632 12.9763 12.9419 13.0267 12.9912 13.0596C13.0159 13.076 13.0332 13.0881 13.043 13.0951L13.0522 13.1016L13.0516 13.1012L13.0509 13.1007L13.0505 13.1003C13.0502 13.1002 13.05 13.1 13.5 12.5C13.95 11.9 13.9497 11.8998 13.9495 11.8996L13.9489 11.8992L13.9477 11.8982L13.9446 11.8959L13.9361 11.8898L13.9103 11.8712C13.8892 11.8562 13.8601 11.8361 13.8233 11.8115C13.7496 11.7624 13.6446 11.6955 13.5094 11.617C13.2391 11.4601 12.847 11.256 12.341 11.0536C11.3284 10.6486 9.85893 10.25 8 10.25C6.14107 10.25 4.67157 10.6486 3.65896 11.0536C3.15298 11.256 2.7609 11.4601 2.49059 11.617C2.35538 11.6955 2.25045 11.7624 2.17675 11.8115C2.1399 11.8361 2.11083 11.8562 2.08967 11.8712L2.06387 11.8898L2.05544 11.8959L2.05235 11.8982L2.05108 11.8992L2.05052 11.8996C2.05026 11.8998 2.05 11.9 2.5 12.5C2.95 13.1 2.94976 13.1002 2.94953 13.1003L2.94911 13.1007L2.94839 13.1012L2.94749 13.1019C2.94713 13.1021 2.94724 13.1021 2.94782 13.1016L2.95697 13.0951C2.96681 13.0881 2.98413 13.076 3.0088 13.0596C3.05815 13.0267 3.13681 12.9763 3.24379 12.9142C3.45786 12.7899 3.78453 12.619 4.21605 12.4464ZM13.0525 13.1019C13.0529 13.1021 13.0528 13.1021 13.0522 13.1016Z" fill="#2F4F75"/></svg><span  class="cs-placeholder">' +
      this.selectedOpt.textContent +
      "</span></span>" +
      opts_el;
    this.el.parentNode.appendChild(this.selEl);
    this.selEl.appendChild(this.el);
  };

  /**
   * initialize the events
   */
  SelectFx.prototype._initEvents = function () {
    var self = this;

    // open/close select
    this.selPlaceholder.addEventListener("click", function () {
      self._toggleSelect();
    });

    // clicking the options
    this.selOpts.forEach(function (opt, idx) {
      opt.addEventListener("click", function () {
        self.current = idx;
        self._changeOption();
        // close select elem
        self._toggleSelect();
      });
    });

    // close the select element if the target it´s not the select element or one of its descendants..
    document.addEventListener("click", function (ev) {
      var target = ev.target;
      if (
        self._isOpen() &&
        target !== self.selEl &&
        !hasParent(target, self.selEl)
      ) {
        self._toggleSelect();
      }
    });
  };

  /**
   * open/close select
   * when opened show the default placeholder if any
   */
  SelectFx.prototype._toggleSelect = function () {
    // remove focus class if any..
    this._removeFocus();

    if (this._isOpen()) {
      if (this.current !== -1) {
        // update placeholder text
        this.selPlaceholder.textContent = this.selOpts[
          this.current
        ].textContent;
      }
      this.selEl.classList.remove("cs-active");
    } else {
      if (this.hasDefaultPlaceholder && this.options.stickyPlaceholder) {
        // everytime we open we wanna see the default placeholder text
        this.selPlaceholder.textContent = this.selectedOpt.textContent;
      }
      this.selEl.classList.add("cs-active");
    }
  };

  /**
   * change option - the new value is set
   */
  SelectFx.prototype._changeOption = function () {
    // if pre selected current (if we navigate with the keyboard)...
    if (typeof this.preSelCurrent != "undefined" && this.preSelCurrent !== -1) {
      this.current = this.preSelCurrent;
      this.preSelCurrent = -1;
    }

    // current option
    var opt = this.selOpts[this.current];

    // update current selected value
    this.selPlaceholder.textContent = opt.textContent;

    // change native select element´s value
    this.el.value = opt.getAttribute("data-value");

    // remove class cs-selected from old selected option and add it to current selected option
    var oldOpt = this.selEl.querySelector("li.cs-selected");
    if (oldOpt) {
      oldOpt.classList.remove("cs-selected");
    }
    opt.classList.add("cs-selected");

    // if there´s a link defined
    if (opt.getAttribute("data-link")) {
      // open in new tab?
      if (this.options.newTab) {
        window.open(opt.getAttribute("data-link"), "_blank");
      } else {
        window.location = opt.getAttribute("data-link");
      }
    }

    // callback
    this.options.onChange(this.el.value);
    translator.load(this.el.value);
    updateCookiesLang();
    handleHomeImage();
    if (window.location.href.indexOf("faq") != -1) {
      handleFaq();
    }
  };

  /**
   * returns true if select element is opened
   */
  SelectFx.prototype._isOpen = function (opt) {
    return this.selEl.classList.contains("cs-active");
  };

  /**
   * removes the focus class from the option
   */
  SelectFx.prototype._removeFocus = function (opt) {
    var focusEl = this.selEl.querySelector("li.cs-focus");
    if (focusEl) {
      focusEl.classList.remove("cs-focus");
    }
  };

  /**
   * add to global namespace
   */
  window.SelectFx = SelectFx;
}
