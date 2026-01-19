(function ($) {
  const media = '(max-width: 768px) and (orientation: portrait)';

  $(document).ready(function () {
    $('.preloader').fadeOut(1000);

    if ($('[data-fancybox]').length > 0) {
      Fancybox.bind("[data-fancybox]", {
        placeFocusBack: false,
      });
    }

    //functions init
    fixedHeaderActions();
    menuActions();
    tabsSwitcher('.content-tabs__items-nav button', '.content-tabs', '.content-tabs__items-list .tab-item');
    accordionInit('.accordion-item', '.accordion-item__head');

    // Blog filter
    filterItems('.blog-filter button', '.blog-grid .post-item');
  });

  //slider each START--------------------------------------------
  const defaultSliders = () => {
    let sliders = document.querySelectorAll('.default-slider');
    let prevArrow = document.querySelectorAll('.default-prev');
    let nextArrow = document.querySelectorAll('.default-next');
    let pagination = document.querySelectorAll('.default-pagination');
    if (sliders.length == 0) return false;

    sliders.forEach((slider, index) => {
      let initial = parseInt(slider.getAttribute('data-initial')) || 0;
      let offset = slider.getAttribute('data-offset');
      let loop = slider.getAttribute('data-loop') === 'true';
      let effect = slider.getAttribute('data-effect') || 'slide';
      let autoplay = slider.getAttribute('data-autoplay') === 'true';
      let speed = parseInt(slider.getAttribute('data-speed')) || 5000;
      let duration = parseInt(slider.getAttribute('data-duration')) || 1000;
      let useActiveClass = slider.getAttribute('data-active-class') === 'true';

      let swiperOptions = {
        observe: true,
        observeParents: true,
        speed: duration,
        loop: loop,
        effect: effect,
        slidesPerView: 'auto',
        spaceBetween: offset,
        initialSlide: initial,
        navigation: {
          nextEl: nextArrow[index],
          prevEl: prevArrow[index],
        },
        pagination: {
          el: pagination[index],
          clickable: true,
        },
      };

      if (autoplay) {
        swiperOptions.autoplay = {
          delay: speed,
          disableOnInteraction: true,
        };
      }

      const swiper = new Swiper(slider, swiperOptions);

      if (useActiveClass) {
        const clearIsActive = () => {
          swiper.slides.forEach(s => s.classList.remove('isActive'));
        };
        const setIsActive = () => {
          clearIsActive();
          const current = slider.querySelector('.swiper-slide-active');
          if (current) current.classList.add('isActive');
        };
        setIsActive();
        swiper.on('slideChangeTransitionStart', clearIsActive);
        swiper.on('slideChangeTransitionEnd', setIsActive);
        swiper.on('resize', setIsActive);
        swiper.on('update', setIsActive);
      }
    });
  };

  window.addEventListener('load', defaultSliders);

  // const dualSliders = () => {
  //   const mainSliders = document.querySelectorAll('.main-slider');
  //   const secondarySliders = document.querySelectorAll('.secondary-slider');
  //   const prevBtns = document.querySelectorAll('.main-slider-prev');
  //   const nextBtns = document.querySelectorAll('.main-slider-next');

  //   if (!mainSliders.length || !secondarySliders.length) return;

  //   mainSliders.forEach((mainEl, index) => {
  //     const secondaryEl = secondarySliders[index];
  //     if (!secondaryEl) return;
  //     const effect = mainEl.getAttribute('data-effect') || 'slide';

  //     let mainSwiper;
  //     let secondarySwiper;
  //     let isSyncing = false;

  //     const updateActiveThumb = (activeIndex) => {
  //       const allThumbs = secondaryEl.querySelectorAll('.swiper-slide');

  //       allThumbs.forEach((slide, i) => {
  //         slide.classList.toggle('isActive', i === activeIndex);
  //       });

  //       if (secondarySwiper && secondarySwiper.activeIndex !== activeIndex) {
  //         secondarySwiper.slideTo(activeIndex);
  //       }
  //     };

  //     secondarySwiper = new Swiper(secondaryEl, {
  //       speed: 500,
  //       slidesPerView: 'auto',
  //       spaceBetween: '10%',
  //       watchSlidesProgress: true,
  //       slideToClickedSlide: true,
  //       on: {
  //         init(swiper) {
  //           updateActiveThumb(swiper.activeIndex);
  //         },
  //         slideChange(swiper) {
  //           if (isSyncing || !mainSwiper) return;
  //           isSyncing = true;
  //           mainSwiper.slideTo(swiper.activeIndex);
  //           updateActiveThumb(swiper.activeIndex);
  //           isSyncing = false;
  //         }
  //       }
  //     });

  //     mainSwiper = new Swiper(mainEl, {
  //       speed: 500,
  //       slidesPerView: 'auto',
  //       spaceBetween: '3.3%',
  //       effect: effect,
  //       navigation: {
  //         nextEl: nextBtns[index],
  //         prevEl: prevBtns[index]
  //       },
  //       on: {
  //         slideChange(swiper) {
  //           if (isSyncing || !secondarySwiper) return;
  //           isSyncing = true;
  //           secondarySwiper.slideTo(swiper.activeIndex);
  //           updateActiveThumb(swiper.activeIndex);
  //           isSyncing = false;
  //         }
  //       }
  //     });

  //     secondarySwiper.on('click', (swiper) => {
  //       const clickedIndex = swiper.clickedIndex;
  //       if (clickedIndex == null) return;

  //       mainSwiper.slideTo(clickedIndex);
  //       updateActiveThumb(clickedIndex);
  //     });
  //   });
  // };

  // window.addEventListener('load', dualSliders);

  $(window).on('load', function () {
    if ($('[data-aos]').length > 0) {
      AOS.init({
        once: true,
        delay: 100,
        duration: 1000,
      });
    }
  });

  //general functions
  let ticking = false;

  $(window).on('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      fixedHeaderActions();
      ticking = false;
    });
  });
  $(window).on('resize orientationchange', fixedHeaderActions);

  function fixedHeaderActions() {
    const $header = $('.header');

    // Hysteresis thresholds: add at a deeper point, remove a bit earlier
    const ADD_AT = 80;    // when scrolling down past this Y -> add .fixed
    const REMOVE_AT = 40;  // when scrolling up above this Y -> remove .fixed

    const y = $(window).scrollTop();
    const has = $header.hasClass('fixed');

    // Decide next state using hysteresis window to prevent flicker
    if (!has && y >= ADD_AT) {
      // Add only once we are clearly past the add threshold
      $header.addClass('fixed');
    } else if (has && y <= REMOVE_AT) {
      // Remove only once we are clearly above the remove threshold
      $header.removeClass('fixed');
    }

    // Note: no body padding/top updates — header uses position: sticky.
    // If .fixed changes header height, consider doing the height transition via CSS transform
    // (e.g., scale, translate, or padding animation) to avoid layout thrash.
  }

  function accordionInit(item, button) {
    let elem = $(item);
    let btn = elem.find(button);
    btn.on('click', function (e) {
      let items = $(this).parent();
      if ($(this).hasClass('isActive')) {
        $(this).removeClass('isActive');
        $(this).parent(elem).removeClass('isActive');
        $(this).next().slideUp();
      } else {
        items.siblings().find(button).removeClass('isActive');
        items.siblings().find(button).next().slideUp();
        items.siblings().removeClass('isActive');
        $(this).addClass('isActive');
        $(this).parent(elem).addClass('isActive');
        $(this).next().slideDown();
      }
    });
  }

  function menuActions() {
    $('.burger-btn').on('click', function (e) {
      e.preventDefault();
      $('.burger-btn').toggleClass('isActive');
      $('.mobile-menu').toggleClass('isActive');
      $('body').toggleClass('fixed');
    });

    if (window.matchMedia(media).matches) {
      initSlideToggles('.footer-menus .menu-item-has-children > a', {
        duration: 500,
        openedClass: 'opened'
      });
      initSlideToggles('.footer-contacts__title', {
        duration: 500,
        openedClass: 'opened'
      });
    }
  }

  function tabsSwitcher(button, wrapper, tabs, buttonBox = false) {
    let tabsBtn = $(button);
    tabsBtn.on('click', function () {
      let index;
      if (buttonBox) {
        index = $(this).parent().index();
      } else {
        index = $(this).index();
      }
      let tabsContent = $(this).parents(wrapper).find(tabs);
      $(this).parents(wrapper).find(tabsBtn).removeClass('isActive');
      $(this).addClass('isActive');

      tabsContent.hide();
      tabsContent.eq(index).show();
    });
  }

  function filterItems(button, items, parent = false) {
    $(document).on('click', button, function (e) {
      e.preventDefault();

      const $btn = $(this);
      const filterOption = $btn.data('id').toString();
      const $wrapper = $btn.closest('section');

      $(button).removeClass('isActive');
      $btn.addClass('isActive');

      const $targets = $wrapper.find(items);

      if (filterOption === 'all') {
        if (parent) {
          $targets.each(function () {
            $(this).parent().fadeIn().addClass('show');
          });
          defaultSliders();
        } else {
          $targets.fadeIn().addClass('show');
        }
        return;
      }

      if (parent) {
        $targets.each(function () {
          $(this).parent().hide().removeClass('show');
        });
        defaultSliders();
      } else {
        $targets.hide().removeClass('show');
      }

      $targets.each(function () {
        const dataId = $(this).data('id');
        if (!dataId) return;

        const idList = dataId.toString().split(',').map(s => s.trim());

        if (idList.includes(filterOption)) {
          if (parent) {
            $(this).parent().fadeIn().addClass('show');
          } else {
            $(this).fadeIn().addClass('show');
          }
        }
      });
    });
  }

  // Init smooth slide toggles on any trigger selector.
  // Example:
  //   initSlideToggles('.footer-menus .menu-item-has-children > a', {
  //     duration: 250,
  //     openedClass: 'opened',
  //     // how to find the panel for each trigger:
  //     // 1) default: nextElementSibling
  //     // 2) data-target on trigger: <a data-target=".sub-menu">
  //     // 3) href="#panelId"
  //     // 4) or pass a function: target: (trigger) => trigger.parentElement.querySelector('.sub-menu')
  //     target: null,
  //     preventDefault: true,
  //     updateAria: true
  //   })
  function initSlideToggles(selector, opts = {}) {
    const duration = Number.isFinite(opts.duration) ? opts.duration : 300
    const openedClass = opts.openedClass || 'opened'
    const preventDefault = opts.preventDefault !== false
    const updateAria = opts.updateAria !== false

    // --- internal helpers (scoped) ---
    const withScrollBehaviorOff = (fn) => {
      const html = document.documentElement
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      try { fn() } finally { html.style.scrollBehavior = prev }
    }

    const slideUp = (el) => {
      if (!el || el.dataset.sliding === '1') return
      el.dataset.sliding = '1'

      el.style.removeProperty('display')
      const cs = window.getComputedStyle(el)
      if (cs.display === 'none') el.style.display = 'block'

      const startHeight = el.offsetHeight
      el.style.overflow = 'hidden'
      el.style.height = startHeight + 'px'
      el.style.transitionProperty = 'height'
      el.style.transitionDuration = duration + 'ms'

      withScrollBehaviorOff(() => {
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        el.offsetHeight
        el.style.height = '0px'
      })

      const onEnd = (e) => {
        if (e.target !== el || e.propertyName !== 'height') return
        el.removeEventListener('transitionend', onEnd)
        el.style.display = 'none'
        el.style.removeProperty('height')
        el.style.removeProperty('overflow')
        el.style.removeProperty('transition-property')
        el.style.removeProperty('transition-duration')
        el.dataset.sliding = '0'
      }
      el.addEventListener('transitionend', onEnd)
    }

    const slideDown = (el) => {
      if (!el || el.dataset.sliding === '1') return
      el.dataset.sliding = '1'

      el.style.removeProperty('display')
      let display = window.getComputedStyle(el).display
      if (display === 'none') display = 'block'
      el.style.display = display

      const targetHeight = el.scrollHeight
      el.style.overflow = 'hidden'
      el.style.height = '0px'
      el.style.transitionProperty = 'height'
      el.style.transitionDuration = duration + 'ms'

      withScrollBehaviorOff(() => {
        // force reflow
        // eslint-disable-next-line no-unused-expressions
        el.offsetHeight
        el.style.height = targetHeight + 'px'
      })

      const onEnd = (e) => {
        if (e.target !== el || e.propertyName !== 'height') return
        el.removeEventListener('transitionend', onEnd)
        el.style.removeProperty('height')
        el.style.removeProperty('overflow')
        el.style.removeProperty('transition-property')
        el.style.removeProperty('transition-duration')
        el.dataset.sliding = '0'
      }
      el.addEventListener('transitionend', onEnd)
    }

    const slideToggle = (el) => {
      const hidden = window.getComputedStyle(el).display === 'none' || el.offsetHeight === 0
      hidden ? slideDown(el) : slideUp(el)
    }

    const resolveTarget = (trigger) => {
      // 1) explicit function/string from options
      if (typeof opts.target === 'function') return opts.target(trigger)
      if (typeof opts.target === 'string') return document.querySelector(opts.target)

      // 2) data-target on trigger
      const dataSel = trigger.getAttribute('data-target')
      if (dataSel) {
        try {
          // prefer relative search within the same parent tree
          return trigger.closest(':scope')?.querySelector(dataSel) || document.querySelector(dataSel)
        } catch {
          return document.querySelector(dataSel)
        }
      }

      // 3) href="#id"
      const href = trigger.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) {
        const byId = document.getElementById(href.slice(1))
        if (byId) return byId
      }

      // 4) fallback: next sibling
      return trigger.nextElementSibling
    }

    const onClick = (e) => {
      if (preventDefault) e.preventDefault()
      const trigger = e.currentTarget
      const panel = resolveTarget(trigger)
      if (!panel) return

      trigger.classList.toggle(openedClass)
      if (updateAria) {
        const expanded = trigger.classList.contains(openedClass)
        trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false')
        if (panel.id) trigger.setAttribute('aria-controls', panel.id)
      }
      slideToggle(panel)
    }

    // Attach listeners
    const triggers = typeof selector === 'string' ? document.querySelectorAll(selector) : selector
    const list = Array.from(triggers || [])
    list.forEach((t) => t.addEventListener('click', onClick))

    // API for manual control / cleanup
    return {
      destroy() { list.forEach((t) => t.removeEventListener('click', onClick)) },
      open(triggerEl) { const p = resolveTarget(triggerEl); if (p) slideDown(p) },
      close(triggerEl) { const p = resolveTarget(triggerEl); if (p) slideUp(p) },
      toggle(triggerEl) { const p = resolveTarget(triggerEl); if (p) slideToggle(p) }
    }
  }

})(jQuery);

(() => {
  'use strict';

  // ===== CONFIG you can tweak =====
  const CONFIG = {
    selector: '.number',
    startDelayMs: 100,       // delay before starting after entering the viewport
    viewThreshold: 0.75,     // fraction of the element that must be visible (0..1)
    rootMargin: '0px 0px -10% 0px', // trim the viewport bottom so the start happens later
    duration: 3000,          // duration of the roll for a single column
    stepDelay: 60            // stagger delay between columns
  };

  // --- minimal styles (added once) ---
  const STYLE_ID = 'num-roller-style';
  if (!document.getElementById(STYLE_ID)) {
    const css = `
      .num-roller{display:inline-flex;gap:.02em;align-items:flex-end}
      .num-roller-col{display:inline-block;overflow:hidden;height:1em;line-height:1;text-align:center}
      .num-roller-inner{display:block;will-change:transform;transform:translateY(100%)}
      .num-roller-cell{display:block;height:1em;}
    `;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Build DOM for one .number element
  const buildRoller = (el) => {
    const raw = (el.textContent || '').trim();
    el.textContent = '';
    el.classList.add('num-roller');

    [...raw].forEach((ch) => {
      const col = document.createElement('span');
      col.className = 'num-roller-col';

      const inner = document.createElement('span');
      inner.className = 'num-roller-inner';
      col.appendChild(inner);

      const isDigit = /\d/.test(ch);

      if (isDigit && ch !== '0') {
        const target = Number(ch);
        for (let d = 0; d <= target; d++) {
          const cell = document.createElement('span');
          cell.className = 'num-roller-cell';
          cell.textContent = String(d);
          inner.appendChild(cell);
        }
        col.dataset.type = 'digit';
        col.dataset.target = String(target);
        inner.style.transform = 'translateY(0)';
      } else {
        const cell = document.createElement('span');
        cell.className = 'num-roller-cell';
        cell.textContent = isDigit ? '0' : ch;
        inner.appendChild(cell);
        col.dataset.type = 'symbol';
        inner.style.transform = 'translateY(100%)';
      }

      el.appendChild(col);
    });
  };

  // Animate one .number element
  const animateRoller = (el) => {
    const cols = el.querySelectorAll('.num-roller-col');

    cols.forEach((col, i) => {
      const inner = col.querySelector('.num-roller-inner');
      const firstCell = inner.querySelector('.num-roller-cell');
      const cellHeight =
        (firstCell?.getBoundingClientRect().height ||
          col.getBoundingClientRect().height || 0);

      inner.style.transition =
        `transform ${CONFIG.duration}ms cubic-bezier(.22,1,.36,1) ${i * CONFIG.stepDelay}ms`;

      requestAnimationFrame(() => {
        if (col.dataset.type === 'digit') {
          const target = Number(col.dataset.target || 0);
          inner.style.transform = `translateY(-${target * cellHeight}px)`;
        } else {
          inner.style.transform = 'translateY(0)';
        }
      });
    });
  };

  // Init all .number
  const initCounters = () => {
    const nodes = [...document.querySelectorAll(CONFIG.selector)];
    if (!nodes.length) return;

    nodes.forEach(buildRoller);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => animateRoller(el), CONFIG.startDelayMs);
            io.unobserve(el);
          }
        });
      },
      {
        threshold: CONFIG.viewThreshold,
        rootMargin: CONFIG.rootMargin
      }
    );

    nodes.forEach((n) => io.observe(n));
  };

  document.addEventListener('DOMContentLoaded', initCounters);
})();