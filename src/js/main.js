/* Your JS here. */
console.log("MP1 JS loaded!");

/* Helper Functions */
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

document.addEventListener('DOMContentLoaded', () => {

    /* Navbar & Scroll Indicator */
    const navbar = $('#navbar');
    const navLinks = $$('.nav-link');
    const sections = $$('.nav-link')
        .map(a => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);
    const progress = $('.read-progress-bar');

    const onScroll = () => {
        const y = window.scrollY || window.pageYOffset;

        /* Navbar shrink */
        navbar?.classList.toggle('shrink', y > 10);

        /* Read progress bar */
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (y / docH) * 100 : 0;
        if (progress) progress.style.width = `${pct}%`;

        /* Active link highlight */
        const navBottom = (navbar?.getBoundingClientRect().bottom || 0) + window.scrollY;
        let currentId = sections.length ? sections[0].id : null;

        for (const sec of sections) {
            if (!sec) continue;
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            if (navBottom >= top && navBottom < bottom) {
                currentId = sec.id;
                break;
            }
        }

        /* Force highlight last link when at bottom */
        if (sections.length && Math.ceil(y + window.innerHeight) >= Math.floor(document.documentElement.scrollHeight)) {
            currentId = sections[sections.length - 1].id;
        }

        if (currentId) {
            navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`));
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Smooth scrolling on click */
    navLinks.forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const id = a.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', `#${id}`);
        });
    });

    /* Carousel */
    const carouselEl = $('.carousel');
    const track = $('.carousel .carousel-track');
    const slides = $$('.carousel .slide');
    const btnPrev = $('.carousel .prev');
    const btnNext = $('.carousel .next');
    let idx = 0;

    const updateCarousel = () => {
        if (!track || !carouselEl) return;
        const slideW = carouselEl.clientWidth;     // ← 单屏宽度
        track.style.transform = `translateX(${-idx * slideW}px)`;
    };
    const go = d => {
        if (!slides.length) return;
        idx = (idx + d + slides.length) % slides.length;
        updateCarousel();
    };

    btnPrev?.addEventListener('click', () => go(-1));
    btnNext?.addEventListener('click', () => go(1));
    window.addEventListener('resize', updateCarousel);
    updateCarousel();

    /* Modal */
    const modal = $('#modal');
    const openBtn = $('#open-modal');
    const closeEls = $$('[data-close]', modal || document);

    const openModal = () => {
        if (!modal) return;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    };
    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    };

    openBtn && openBtn.addEventListener('click', openModal);
    closeEls.forEach(el => el.addEventListener('click', closeModal));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
    });

});

