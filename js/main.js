/**
 * Patagonia Interactive JavaScript
 * - Maintains exact HTML & CSS structure without color modifications
 * - Adds New Arrival Slider / Carousel with Touch & Button Navigation
 * - Adds Sub Category Scroll Carousel
 * - Adds Smooth Scroll Reveals, Header Transitions, Search Modal, Quick View & Toast Alerts
 */

document.addEventListener('DOMContentLoaded', () => {
    initNewArrivalCarousel();
    initSubCategoryCarousel();
    initHeaderScroll();
    initAddToCartInteraction();
    initWishlistToggle();
    initSearchModal();
    initMobileMenuDrawer();
    initQuickViewModal();
    initScrollReveal();
    initVideoObserver();
});

/**
 * 1. New Arrival Section Carousel (index.html)
 */
function initNewArrivalCarousel() {
    const btmWrap = document.querySelector('.newarrival_btm_wrap');
    const prevBtn = document.querySelector('.icon_arrow_left');
    const nextBtn = document.querySelector('.icon_arrow_right');
    const btmContainer = document.querySelector('.newarrival_btm');

    if (!btmWrap || !prevBtn || !nextBtn) return;

    const items = btmWrap.querySelectorAll('.newarrival_list');
    if (items.length === 0) return;

    let currentIndex = 0;

    function getVisibleCount() {
        const width = window.innerWidth;
        if (width <= 600) return 1;
        if (width <= 1024) return 2;
        return 4;
    }

    function getMaxIndex() {
        const visible = getVisibleCount();
        return Math.max(0, items.length - visible);
    }

    function updateCarousel() {
        const maxIndex = getMaxIndex();
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const firstCard = items[0];
        const style = window.getComputedStyle(btmWrap);
        const gap = parseFloat(style.gap) || 20;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const moveDistance = (cardWidth + gap) * currentIndex;

        btmWrap.style.transform = `translateX(-${moveDistance}px)`;
        btmWrap.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
    }

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const maxIndex = getMaxIndex();
        if (maxIndex === 0) {
            currentIndex = 0;
        } else {
            currentIndex = (currentIndex < maxIndex) ? currentIndex + 1 : 0;
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const maxIndex = getMaxIndex();
        if (maxIndex === 0) {
            currentIndex = 0;
        } else {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
        }
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);

    // Touch & Drag Swipe Support
    let startX = 0;
    let isDragging = false;

    if (btmContainer) {
        btmContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        btmContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diffX = startX - e.changedTouches[0].clientX;
            const maxIndex = getMaxIndex();

            if (Math.abs(diffX) > 40 && maxIndex > 0) {
                if (diffX > 0 && currentIndex < maxIndex) currentIndex++;
                else if (diffX < 0 && currentIndex > 0) currentIndex--;
                updateCarousel();
            }
        });
    }
}

/**
 * 2. Sub Category Scroll Slider (sub.html)
 */
function initSubCategoryCarousel() {
    const container = document.querySelector('.sub_category_btm');
    const leftBtn = document.querySelector('.sub_category_btn_left');
    const rightBtn = document.querySelector('.sub_category_btn_right');

    if (!container) return;

    const scrollAmount = 450;

    if (leftBtn) {
        leftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    if (rightBtn) {
        rightBtn.addEventListener('click', (e) => {
            e.preventDefault();
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // Drag to scroll support
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'default';
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'default';
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
}

/**
 * 3. Header Scroll Glassmorphism & Position
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.position = 'fixed';
            header.style.background = 'rgba(0, 0, 0, 0.85)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            header.style.transition = 'all 0.3s ease';
        } else {
            header.style.position = 'absolute';
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'none';
        }
    }, { passive: true });
}

/**
 * 4. Toast Notification Renderer
 */
function showToast(message) {
    let container = document.querySelector('.toast_container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast_container';
        container.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; z-index: 10000;
            display: flex; flex-direction: column; gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        background: #111; color: #fff; padding: 14px 24px; border-radius: 30px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3); font-size: 14px; font-weight: 500;
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        opacity: 0; transform: translateY(20px); transition: all 0.3s ease;
    `;
    toast.innerHTML = `
        <span>${message}</span>
        <span style="cursor:pointer; opacity:0.6; margin-left:12px;" onclick="this.parentElement.remove()">✕</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 5. Add to Cart Interaction
 */
function initAddToCartInteraction() {
    const cartBtns = document.querySelectorAll('.newarrival_list_btn');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.newarrival_list');
            const title = card ? card.querySelector('.contents_title_small_bold')?.textContent.trim() : '선택한 상품';
            showToast(`🛒 [${title}] 이(가) 장바구니에 담겼습니다.`);
        });
    });
}

/**
 * 6. Wishlist Toggle
 */
function initWishlistToggle() {
    const heartImg = document.querySelector('.util_menu img[alt="heart"]');
    if (!heartImg) return;
    const parentA = heartImg.closest('a');
    let isLiked = false;

    if (parentA) {
        parentA.addEventListener('click', (e) => {
            e.preventDefault();
            isLiked = !isLiked;
            if (isLiked) {
                heartImg.style.transform = 'scale(1.2)';
                heartImg.style.transition = 'transform 0.2s ease';
                showToast('❤️ 위시리스트에 등록되었습니다.');
            } else {
                heartImg.style.transform = 'scale(1)';
                showToast('🤍 위시리스트에서 삭제되었습니다.');
            }
        });
    }
}

/**
 * 7. Search Modal
 */
function initSearchModal() {
    const searchBoxes = document.querySelectorAll('.search_box');
    if (searchBoxes.length === 0) return;

    const searchModal = document.createElement('div');
    searchModal.className = 'search_modal_overlay';
    searchModal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 9999; display: none;
        align-items: center; justify-content: center; backdrop-filter: blur(8px);
    `;
    searchModal.innerHTML = `
        <div style="position:relative; width: 90%; max-width: 600px; background:#111; padding:32px; border-radius:16px; color:#fff; box-shadow:0 20px 40px rgba(0,0,0,0.5);">
            <span class="search_modal_close" style="position:absolute; top:16px; right:20px; font-size:24px; cursor:pointer; color:#aaa;">✕</span>
            <h3 style="margin-bottom:16px; font-size:20px;">파타고니아 통합 검색</h3>
            <div style="display:flex; gap:8px;">
                <input type="text" placeholder="검색어를 입력하세요 (예: 캐필린, R1, 그래니트...)" style="flex:1; padding:12px 16px; border-radius:8px; border:1px solid #333; background:#222; color:#fff; font-size:16px; outline:none;">
                <button type="button" style="padding:12px 24px; background:#f37b3c; border:none; border-radius:8px; color:#fff; font-weight:bold; cursor:pointer;">검색</button>
            </div>
        </div>
    `;
    document.body.appendChild(searchModal);

    const input = searchModal.querySelector('input');
    const closeBtn = searchModal.querySelector('.search_modal_close');
    const searchBtn = searchModal.querySelector('button');

    searchBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.style.display = 'flex';
            setTimeout(() => input.focus(), 100);
        });
    });

    const closeModal = () => { searchModal.style.display = 'none'; };
    closeBtn.addEventListener('click', closeModal);
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeModal();
    });

    const triggerSearch = () => {
        if (input.value.trim()) {
            showToast(`🔍 '${input.value.trim()}' 검색 결과로 이동합니다.`);
            closeModal();
            input.value = '';
        }
    };

    searchBtn.addEventListener('click', triggerSearch);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') triggerSearch();
    });
}

/**
 * 8. Mobile Menu Drawer
 */
function initMobileMenuDrawer() {
    const sideMenuBtns = document.querySelectorAll('.util_menu img[alt="sidemenu"]');
    if (sideMenuBtns.length === 0) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.6); z-index: 9998; display:none; backdrop-filter: blur(4px);
    `;

    const drawer = document.createElement('div');
    drawer.style.cssText = `
        position: fixed; top:0; right:-320px; width:300px; height:100%;
        background: #111; z-index: 9999; transition: right 0.35s ease;
        padding: 32px 24px; color: #fff; display: flex; flex-direction: column; justify-content: space-between;
    `;
    drawer.innerHTML = `
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <img src="images/logo.png" alt="파타고니아" style="height:22px;">
                <span class="mobile_menu_close" style="font-size:24px; cursor:pointer; color:#aaa;">✕</span>
            </div>
            <ul style="display:flex; flex-direction:column; gap:20px; font-size:18px; font-weight:bold;">
                <li><a href="#" style="color:#fff; text-decoration:none;">Collection</a></li>
                <li><a href="#" style="color:#fff; text-decoration:none;">Men's</a></li>
                <li><a href="#" style="color:#fff; text-decoration:none;">Women's</a></li>
                <li><a href="#" style="color:#fff; text-decoration:none;">Kid's & Baby</a></li>
                <li><a href="#" style="color:#fff; text-decoration:none;">Packs & Gear</a></li>
                <li><a href="#" style="color:#fff; text-decoration:none;">Sports</a></li>
            </ul>
        </div>
        <div style="font-size:13px; color:#888; border-top:1px solid #333; padding-top:20px; line-height:1.6;">
            <p style="font-weight:bold; color:#ccc;">(주)파타고니아코리아</p>
            <p>대표번호: 1544-1876</p>
            <p>E-mail: patagoniakorea@patagonia.kr</p>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    const closeBtn = drawer.querySelector('.mobile_menu_close');

    sideMenuBtns.forEach(btn => {
        btn.closest('a').addEventListener('click', (e) => {
            e.preventDefault();
            overlay.style.display = 'block';
            setTimeout(() => { drawer.style.right = '0'; }, 10);
        });
    });

    const closeDrawer = () => {
        drawer.style.right = '-320px';
        setTimeout(() => { overlay.style.display = 'none'; }, 350);
    };

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
}

/**
 * 9. Quick View Modal on Card Click
 */
function initQuickViewModal() {
    const cards = document.querySelectorAll('.newarrival_list');
    if (cards.length === 0) return;

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.75); z-index: 9999; display: none;
        align-items: center; justify-content: center; backdrop-filter: blur(6px);
    `;
    modal.innerHTML = `
        <div style="position:relative; width:90%; max-width:500px; background:#fff; border-radius:16px; overflow:hidden; color:#111; box-shadow:0 25px 50px rgba(0,0,0,0.3);">
            <span class="quickview_close" style="position:absolute; top:16px; right:20px; font-size:24px; cursor:pointer; color:#333; z-index:10;">✕</span>
            <div class="qv_img" style="width:100%; height:260px; background-size:cover; background-position:center;"></div>
            <div style="padding:24px;">
                <span class="qv_category" style="font-size:12px; color:#f37b3c; font-weight:bold; text-transform:uppercase;">PATAGONIA COLLECTION</span>
                <h3 class="qv_title" style="font-size:22px; font-weight:700; margin:8px 0 12px; color:#111;">상품 제목</h3>
                <p style="font-size:14px; color:#666; line-height:1.6; margin-bottom:20px;">
                    파타고니아의 이 제품은 100% 재활용 및 친환경 유기농 원단을 사용하여 최고의 아웃도어 퍼포먼스를 제공합니다.
                </p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:20px; font-weight:bold; color:#111;">₩ 189,000</span>
                    <button class="qv_add_btn" style="padding:12px 24px; background:#111; color:#fff; border:none; border-radius:24px; font-weight:bold; cursor:pointer; transition:background 0.2s;">장바구니 담기</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.quickview_close');
    const qvImg = modal.querySelector('.qv_img');
    const qvTitle = modal.querySelector('.qv_title');
    const qvCategory = modal.querySelector('.qv_category');
    const qvAddBtn = modal.querySelector('.qv_add_btn');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.newarrival_list_btn')) return;

            const category = card.querySelector('.contents_article_xsmall')?.textContent || 'PATAGONIA';
            const title = card.querySelector('.contents_title_small_bold')?.textContent || '친환경 아웃도어 컬렉션';
            const bgImage = window.getComputedStyle(card).backgroundImage;

            qvCategory.textContent = category;
            qvTitle.textContent = title;
            qvImg.style.backgroundImage = bgImage;

            modal.style.display = 'flex';
        });
    });

    const closeModal = () => { modal.style.display = 'none'; };
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    qvAddBtn.addEventListener('click', () => {
        showToast(`🛒 [${qvTitle.textContent}] 이(가) 장바구니에 담겼습니다.`);
        closeModal();
    });
}

/**
 * 10. Scroll Reveal Effect
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.newarrival, .promotion, .campaign, .magazine, .membership, .sub_main, .sub_program, .sub_category, .sub_campaign, .sub_info');
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 11. Video Play Observer
 */
function initVideoObserver() {
    const videos = document.querySelectorAll('video');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.play().catch(() => {});
            else entry.target.pause();
        });
    }, { threshold: 0.25 });

    videos.forEach(v => observer.observe(v));
}
