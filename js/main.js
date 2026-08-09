document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize New Arrival Swiper Carousel
    if (document.querySelector('.newarrival_btm_wrap')) {
        const newArrivalSwiper = new Swiper('.newarrival_btm_wrap', {
            slidesPerView: 'auto',
            spaceBetween: 12,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.btn_next',
                prevEl: '.btn_prev',
            },
        });
    }

    // 2. Initialize Sub Category Swiper Carousel
    if (document.querySelector('.sub_category_btm')) {
        const subCategorySwiper = new Swiper('.sub_category_btm', {
            slidesPerView: 'auto',
            spaceBetween: 48,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.sub_category_btn_right',
                prevEl: '.sub_category_btn_left',
            },
        });
    }

    // 3. Sticky Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('sticky_active');
            } else {
                header.classList.remove('sticky_active');
            }
        });
    }

    // 4. Scroll Reveal Fade-in Observer
    const observerOptions = {
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
