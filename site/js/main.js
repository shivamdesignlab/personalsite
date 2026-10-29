/* ==========================================================================
   SHIVAM SHUKLA — PORTFOLIO SCRIPTS
   You should not need to edit this file. It powers:
   1. Dark mode toggle (remembers your visitor's choice)
   2. Mobile menu
   3. Highlighting the current page in the navigation
   4. Scroll-in reveal animations
   5. Gallery category filters (only if a page has filter buttons)
   6. Gallery lightbox (fullscreen artwork viewer with arrow keys)
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 1. Dark mode ----------
     The saved theme is applied by a tiny script in each page's <head> (so there is
     no white flash). This part only handles clicking the moon/sun button. */
  var root = document.documentElement;
  var themeBtn = document.querySelector('.theme-btn');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyTheme() {
    var dark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      /* Browsers without View Transitions (or visitors who prefer less motion):
         switch instantly. An instant switch never flickers. */
      if (!document.startViewTransition || reduceMotion) { applyTheme(); return; }

      /* Otherwise the new theme spreads out in a circle from the button.
         Nothing fades half-way, so text never passes through low contrast. */
      var r = themeBtn.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      root.classList.add('theme-switching');
      var t = document.startViewTransition(applyTheme);
      t.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () {});
      t.finished.then(function () { root.classList.remove('theme-switching'); },
                      function () { root.classList.remove('theme-switching'); });
    });
  }

  /* Pages restored from the browser's back/forward cache keep the theme in sync */
  window.addEventListener('pageshow', function (ev) {
    if (!ev.persisted) return;                       // only for Back/Forward restores
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved) root.classList.toggle('dark', saved === 'dark');
  });

  /* ---------- 2. Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.querySelector('nav.main');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  /* ---------- 3. Current page in nav ----------
     Now written directly into each page's HTML (class="here"), so nothing to do here. */

  /* ---------- 4. Scroll reveal ----------
     Anything already on screen stays put. Only sections further down fade in. */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var below = [];
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('shown');
      else below.push(el);
    });
    root.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('shown'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    below.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Gallery filters ---------- */
  var filterBtns = document.querySelectorAll('.filters button');
  var items = document.querySelectorAll('.g-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var cat = btn.getAttribute('data-filter');
      items.forEach(function (it) {
        var show = cat === 'all' || it.getAttribute('data-cat') === cat;
        it.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- 6. Lightbox ---------- */
  var lb = document.querySelector('.lightbox');
  if (lb && items.length) {
    var lbImg = lb.querySelector('img');
    var lbTitle = lb.querySelector('.cap h3');
    var lbMeta = lb.querySelector('.cap p');
    var current = -1;

    function visibleItems() {
      return Array.prototype.filter.call(items, function (it) {
        return !it.classList.contains('hidden');
      });
    }

    function openAt(item) {
      var vis = visibleItems();
      current = vis.indexOf(item);
      if (current < 0) return;
      show(vis[current]);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    var lbCount = lb.querySelector('.lb-count');

    function show(item) {
      var img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt || '';
      lbTitle.textContent = item.getAttribute('data-title') || '';
      lbMeta.textContent = item.getAttribute('data-meta') || '';
      if (lbCount) {
        var vis = visibleItems();
        lbCount.textContent = (vis.indexOf(item) + 1) + ' / ' + vis.length;
      }
    }

    function step(dir) {
      var vis = visibleItems();
      if (!vis.length) return;
      current = (current + dir + vis.length) % vis.length;
      show(vis[current]);
    }

    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach(function (it) {
      it.addEventListener('click', function () { openAt(it); });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
})();
