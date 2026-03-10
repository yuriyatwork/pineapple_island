document.addEventListener('DOMContentLoaded', () => {
    
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 50);
    });

    const nav = document.querySelector('.header__nav');
    const menuBtn = document.querySelector('.header__menu-btn');
    const navClose = document.querySelector('.header__nav-close');
    const navLinks = document.querySelectorAll('.header__nav a');

    const toggleMenu = (isOpen) => {
        nav.classList.toggle('header__nav--active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (menuBtn && nav) {
        menuBtn.onclick = () => toggleMenu(true);
        navClose.onclick = () => toggleMenu(false);
        navLinks.forEach(link => {
            link.onclick = () => toggleMenu(false);
        });
    }

    const modal = document.getElementById('contactModal');
    const openButtons = document.querySelectorAll('.hero__button, .become__button');
    const closeBtn = modal?.querySelector('.modal__close');

    if (modal && openButtons.length > 0) {
        const toggleModal = (isOpen) => {
            modal.classList.toggle('modal--active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        openButtons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                toggleModal(true);
            };
        });

        closeBtn.onclick = () => toggleModal(false);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) toggleModal(false);
        });
    }

    const box = document.querySelector('.about__text');
    const btnL = document.querySelector('.scroll-container__btn--left');
    const btnR = document.querySelector('.scroll-container__btn--right');

    if (box && btnL && btnR) {
        const originalItems = box.querySelectorAll('p');
        if (originalItems.length > 0) {
            const firstClone = originalItems[0].cloneNode(true);
            const lastClone = originalItems[originalItems.length - 1].cloneNode(true);

            box.appendChild(firstClone);
            box.insertBefore(lastClone, originalItems[0]);

            const items = box.querySelectorAll('p');
            let currentIndex = 1;

            const jumpTo = (index) => {
                const width = box.getBoundingClientRect().width;
                box.style.scrollBehavior = 'auto';
                box.scrollLeft = width * index;
                box.style.scrollBehavior = 'smooth';
            };

            jumpTo(currentIndex);

            const scrollStep = (direction) => {
                const width = box.getBoundingClientRect().width;
                if (direction === 'right') {
                    currentIndex++;
                    box.scrollTo({ left: width * currentIndex, behavior: 'smooth' });
                    if (currentIndex === items.length - 1) {
                        setTimeout(() => { currentIndex = 1; jumpTo(currentIndex); }, 500);
                    }
                } else {
                    currentIndex--;
                    box.scrollTo({ left: width * currentIndex, behavior: 'smooth' });
                    if (currentIndex === 0) {
                        setTimeout(() => { currentIndex = items.length - 2; jumpTo(currentIndex); }, 500);
                    }
                }
            };

            btnR.onclick = (e) => { e.preventDefault(); scrollStep('right'); };
            btnL.onclick = (e) => { e.preventDefault(); scrollStep('left'); };
            let touchStartX = 0;
            let touchStartY = 0;

            box.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            box.addEventListener('touchmove', (e) => {
                const touchMoveX = e.changedTouches[0].screenX;
                const touchMoveY = e.changedTouches[0].screenY;
                
                // Если движение по горизонтали больше, чем по вертикали — блокируем скролл страницы
                if (Math.abs(touchStartX - touchMoveX) > Math.abs(touchStartY - touchMoveY)) {
                    if (e.cancelable) e.preventDefault();
                }
            }, { passive: false }); 

            box.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const swipeThreshold = 30; // Уменьшенный порог для быстрого отклика
                
                if (touchStartX - touchEndX > swipeThreshold) {
                    scrollStep('right');
                } else if (touchEndX - touchStartX > swipeThreshold) {
                    scrollStep('left');
                }
            }, { passive: true });
            window.addEventListener('resize', () => jumpTo(currentIndex));
        }
    }

});


