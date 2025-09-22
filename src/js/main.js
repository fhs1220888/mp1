/* Your JS here. */
console.log("MP1 JS loaded!");

/* Helpers */
const $  = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

document.addEventListener('DOMContentLoaded', () => {
    /* Nav / sections / progress */
    const navbar   = $('#navbar');
    const navLinks = $$('.nav-link');
    const sections = navLinks
        .map(a => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);
    const progress = $('.read-progress-bar');

    /* Keep content offset equal to current nav height */
    const setNavOffset = () => {
        if (!navbar) return;
        document.body.style.setProperty('--navH', navbar.offsetHeight + 'px');
    };

    /* Scroll handler */
    const onScroll = () => {
        const y = window.scrollY || window.pageYOffset;

        // shrink nav
        navbar && navbar.classList.toggle('shrink', y > 10);

        // read progress
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct  = docH > 0 ? (y / docH) * 100 : 0;
        if (progress) progress.style.width = `${pct}%`;

        // active link (use navBottom; pick the last section with top <= navBottom)
        if (!sections.length) return;
        const navBottom = navbar.getBoundingClientRect().bottom + window.scrollY;
        let currentId = sections[0].id;
        for (const sec of sections) {
            if (navBottom >= sec.offsetTop) currentId = sec.id;
        }
        // force last at page bottom
        if (Math.ceil(window.scrollY + window.innerHeight) >= Math.floor(document.documentElement.scrollHeight)) {
            currentId = sections[sections.length - 1].id;
        }
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
        });
    };

    setNavOffset();
    window.addEventListener('resize', setNavOffset);
    window.addEventListener('scroll', setNavOffset, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Smooth scrolling */
    navLinks.forEach(a => {
        a.addEventListener('click', e => {
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
    const track  = $('.carousel .carousel-track');
    const slides = $$('.carousel .slide');
    const btnPrev = $('.carousel .prev');
    const btnNext = $('.carousel .next');
    let idx = 0;

    const updateCarousel = () => {
        if (!track || !carouselEl) return;
        const slideW = carouselEl.clientWidth;
        track.style.transform = `translateX(${-idx * slideW}px)`;
    };
    const go = d => {
        if (!slides.length) return;
        idx = (idx + d + slides.length) % slides.length;
        updateCarousel();
    };

    btnPrev && btnPrev.addEventListener('click', () => go(-1));
    btnNext && btnNext.addEventListener('click', () => go(1));
    window.addEventListener('resize', updateCarousel);
    updateCarousel();

    /* Modal */
    const modal   = $('#modal');
    const openBtn = $('#open-modal');
    const closeEls = $$('[data-close]', modal || document);

    const openModal = () => {
        if (!modal) return;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open'); // lock scroll
    };
    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open'); // unlock scroll
    };

    openBtn && openBtn.addEventListener('click', openModal);
    closeEls.forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
    });
});

