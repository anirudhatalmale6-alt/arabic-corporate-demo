/* ==========================================================================
   Front-end behaviours for the Arabic corporate demo.
   No dependencies — everything here maps onto a theme's main.js later.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------- demo bar height -> --dbh var */
  // The bar is fixed and wraps to two lines on narrow screens, so its height
  // has to be measured rather than assumed; the fixed header and the body
  // padding both hang off it. Delete the bar and --dbh simply stays 0.
  var bar = document.querySelector('.demo-bar');
  if (bar) {
    var setDbh = function () {
      document.documentElement.style.setProperty('--dbh', bar.offsetHeight + 'px');
    };
    setDbh();
    window.addEventListener('resize', setDbh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setDbh);
  }

  /* ------------------------------------------------- sticky header on scroll */
  // Inner pages ship .is-stuck in the markup and never leave it. On the home
  // page the bar is transparent over the video until you scroll — or until the
  // drawer opens, which needs the opaque treatment to stay readable.
  var head = document.querySelector('.site-head');
  var solid = head && head.classList.contains('site-head--solid');
  var syncHead = function () {
    if (!head || solid) return;
    head.classList.toggle(
      'is-stuck',
      window.scrollY > 40 || document.body.classList.contains('nav-open')
    );
  };
  if (head && !solid) {
    syncHead();
    window.addEventListener('scroll', syncHead, { passive: true });
  }

  /* --------------------------------------------------------- mobile drawer */
  var burger = document.querySelector('.burger');
  var scrim = document.querySelector('.nav-scrim');
  var closeNav = function () {
    document.body.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    syncHead();
  };
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      syncHead();
    });
  }
  if (scrim) scrim.addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });
  // a dropdown parent should open its submenu on tap instead of navigating
  document.querySelectorAll('.nav__has > .nav__link').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth <= 920 && !document.body.classList.contains('sub-open')) {
        // let the link work; the submenu is already expanded in the drawer
      }
      void e;
    });
  });

  /* ------------------------------------------------------- reveal on scroll */
  var rv = document.querySelectorAll('[data-rv]');
  if (rv.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      rv.forEach(function (el) { el.classList.add('rv-in'); });
    } else {
      var rvObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('rv-in');
            rvObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      rv.forEach(function (el) { rvObs.observe(el); });
    }
  }

  /* ---------------------------------------------------------- stats counter */
  function animateCount(el) {
    var target = parseFloat(el.dataset.to);
    var dec = (el.dataset.dec | 0);
    var dur = parseInt(el.dataset.dur || '1800', 10);
    if (reduced) { el.textContent = target.toFixed(dec); return; }
    var t0 = null;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      // easeOutExpo — fast then settles, reads as "counting up"
      var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec);
    };
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-to]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            animateCount(en.target);
            cObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { el.textContent = '0'; cObs.observe(el); });
    }
  }

  /* -------------------------------------------------------- hero video pause */
  var vid = document.querySelector('.hero__video');
  var vbtn = document.querySelector('.hero__vidbtn');
  if (vid && vbtn) {
    var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
    var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.2-6.8c.6-.4.6-1.4 0-1.8L9.6 4.3c-.7-.4-1.6 0-1.6.9z"/></svg>';
    var sync = function () {
      var playing = !vid.paused;
      vbtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      vbtn.setAttribute('aria-label', playing ? 'إيقاف الفيديو' : 'تشغيل الفيديو');
    };
    vbtn.addEventListener('click', function () {
      if (vid.paused) vid.play(); else vid.pause();
      sync();
    });
    sync();
    // some mobile browsers refuse autoplay even when muted — reflect reality
    var p = vid.play();
    if (p && typeof p.catch === 'function') p.catch(sync);
    if (reduced) { vid.pause(); sync(); }
  }

  /* ------------------------------------------------------- portfolio filter */
  var filters = document.querySelectorAll('[data-filter]');
  if (filters.length) {
    var items = document.querySelectorAll('[data-cat]');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var want = btn.dataset.filter;
        filters.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        items.forEach(function (it) {
          it.classList.toggle('is-hidden', want !== 'all' && it.dataset.cat !== want);
        });
      });
    });
  }

  /* ------------------------------------------------------------- accordions */
  document.querySelectorAll('.acc__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.closest('.acc');
      var open = acc.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ------------------------------------------------------------ demo forms */
  // The demo has no back end. Validate, then show the success state so the
  // client can see the real journey; WordPress will handle the actual send.
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = form.querySelector('.form-ok');
      if (ok) {
        ok.classList.add('is-on');
        ok.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      }
      form.reset();
    });
  });

  /* ------------------------------------------------- pricing -> quote prefill */
  // "اطلب عرض سعر" on a plan should arrive at the form with context filled in.
  document.querySelectorAll('[data-quote]').forEach(function (a) {
    a.addEventListener('click', function () {
      try {
        sessionStorage.setItem('quoteCtx', a.dataset.quote);
      } catch (err) { void err; }
    });
  });
  var ctxField = document.querySelector('[data-quote-target]');
  if (ctxField) {
    try {
      var ctx = sessionStorage.getItem('quoteCtx');
      if (ctx) {
        // only accept a value the select actually offers
        var match = Array.prototype.find.call(ctxField.options, function (o) { return o.value === ctx; });
        if (match) ctxField.value = ctx;
        sessionStorage.removeItem('quoteCtx');
      }
    } catch (err) { void err; }
  }

  /* --------------------------------------------- fake cart counter (demo) */
  // Stands in for WooCommerce's cart fragment so the buy flow feels complete.
  var cartCount = 0;
  document.querySelectorAll('[data-addcart]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      cartCount++;
      var badge = document.querySelector('[data-cart-badge]');
      if (badge) { badge.textContent = cartCount; badge.hidden = false; }
      var old = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> أُضيف إلى السلة';
      btn.disabled = true;
      setTimeout(function () { btn.innerHTML = old; btn.disabled = false; }, 2200);
    });
  });

  /* ----------------------------------------------------------- footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
