document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Header --- */
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky_active');
        } else {
            header.classList.remove('sticky_active');
        }
    });

    /* --- 2. Swiper Init for New Arrival (Main Page) --- */
    const newArrivalSwiperElem = document.querySelector('.newarrival_btm_wrap.swiper');
    if (newArrivalSwiperElem) {
        const newArrivalSwiper = new Swiper('.newarrival_btm_wrap.swiper', {
            slidesPerView: 1.2,
            spaceBetween: 16,
            navigation: {
                nextEl: '.btn_next',
                prevEl: '.btn_prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2.2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3.5,
                    spaceBetween: 24,
                },
                1400: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                }
            }
        });
    }

    /* --- 3. Swiper Init for Sub Category (Sub Page) --- */
    const subCategorySwiperElem = document.querySelector('.sub_category_btm.swiper');
    if (subCategorySwiperElem) {
        const subCategorySwiper = new Swiper('.sub_category_btm.swiper', {
            slidesPerView: 1.1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.sub_category_btn_right',
                prevEl: '.sub_category_btn_left',
            },
            breakpoints: {
                768: {
                    slidesPerView: 1.5,
                    spaceBetween: 30,
                },
                1200: {
                    slidesPerView: 2.2,
                    spaceBetween: 48,
                }
            }
        });
    }

    /* --- 4. Scroll Reveal Observer --- */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
