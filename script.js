/* ==========================================================================
   Sarthak Shrestha — Portfolio  |  script.js  (vanilla JavaScript)
   1. Setup          4. Active link highlighting   7. Contact form
   2. Mobile menu    5. Scroll reveal              8. Footer year
   3. Smooth scroll  6. Back to top
   ========================================================================== */

(function () {
  "use strict";

  /* 1. SETUP ---------------------------------------------------------------- */
  // Flag that JS is running, so content is only hidden for reveal when it can be shown again.
  document.documentElement.classList.add("js");

  // Your email address: change this one line and the form + links will use it.
  var CONTACT_EMAIL = "your.email@example.com";

  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));

  /* 2. MOBILE MENU ---------------------------------------------------------- */
  function setMenu(open) {
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  navToggle.addEventListener("click", function () {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  // Close after choosing a section
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  // Close with the Escape key (and return focus to the button)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Close if the window grows back to desktop size
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* 3. SMOOTH SCROLL -------------------------------------------------------- */
  // CSS (scroll-behavior) handles the smooth scroll; this only keeps the URL tidy and moves
  // keyboard focus to the target section so screen-reader / keyboard users land there.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");

      // Buttons whose real link has not been added yet should do nothing.
      if (href === "#") { e.preventDefault(); return; }

      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* 4. ACTIVE LINK HIGHLIGHTING -------------------------------------------- */
  function setActive(id) {
    navLinks.forEach(function (link) {
      var on = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    // A section counts as "current" when it crosses a band near the top-middle of the viewport.
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* 5. SCROLL REVEAL -------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(".reveal, .timeline");

  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target); // animate once
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealTargets.forEach(function (el) { revealer.observe(el); });
  } else {
    // Very old browsers: just show everything
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 6. BACK TO TOP ---------------------------------------------------------- */
  document.getElementById("toTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
    var home = document.getElementById("home");
    home.setAttribute("tabindex", "-1");
    home.focus({ preventScroll: true });
  });

  /* 7. CONTACT FORM --------------------------------------------------------- */
  // This site has no backend. When the form is valid, it opens the visitor's own email app with
  // the message filled in (a mailto: link), and says so honestly. To send messages directly from
  // the page, connect a service such as Formspree or EmailJS and replace the mailto step below.
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Each rule returns an error message, or "" when the value is fine.
  var rules = {
    name: function (v) {
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Your name looks too short.";
      return "";
    },
    email: function (v) {
      if (!v) return "Please enter your email address.";
      if (!emailPattern.test(v)) return "That doesn't look like a valid email address.";
      return "";
    },
    subject: function (v) {
      if (!v) return "Please add a subject.";
      return "";
    },
    message: function (v) {
      if (!v) return "Please write a message.";
      if (v.length < 10) return "Please write at least 10 characters.";
      return "";
    }
  };

  function showError(input, message) {
    var field = input.closest(".field");
    field.classList.toggle("has-error", Boolean(message));
    document.getElementById(input.id + "-error").textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(input) {
    var message = rules[input.name](input.value.trim());
    showError(input, message);
    return !message;
  }

  // Validate as the visitor leaves a field, and clear the error once they fix it
  Array.prototype.forEach.call(form.elements, function (input) {
    if (!rules[input.name]) return;
    input.addEventListener("blur", function () { validateField(input); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.classList.remove("is-success");

    var firstInvalid = null;
    ["name", "email", "subject", "message"].forEach(function (name) {
      var input = form.elements[name];
      if (!validateField(input) && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      statusEl.textContent = "Please fix the highlighted fields.";
      return;
    }

    if (CONTACT_EMAIL === "your.email@example.com") {
      statusEl.textContent = "Form is valid, but no email address is set yet. The site owner needs to add one in script.js.";
      return;
    }

    var body = "From: " + form.elements.name.value.trim() +
               " (" + form.elements.email.value.trim() + ")\n\n" +
               form.elements.message.value.trim();
    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(form.elements.subject.value.trim()) +
      "&body=" + encodeURIComponent(body);

    statusEl.textContent = "Opening your email app. Press send there to deliver the message.";
    statusEl.classList.add("is-success");
  });

  // Keep the visible email links in sync with CONTACT_EMAIL
  if (CONTACT_EMAIL !== "your.email@example.com") {
    var emailLink = document.getElementById("emailLink");
    var footerEmail = document.getElementById("footerEmail");
    emailLink.href = "mailto:" + CONTACT_EMAIL;
    emailLink.textContent = CONTACT_EMAIL;
    footerEmail.href = "mailto:" + CONTACT_EMAIL;
  }

  /* 8. FOOTER YEAR ---------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
