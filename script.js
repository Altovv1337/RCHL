document.addEventListener('DOMContentLoaded', function() {
    
    // --- ЛОГИКА PRELOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // --- ЛОГИКА КНОПКИ "НАВЕРХ" ---
    const toTopBtn = document.getElementById('toTopBtn');
    if (toTopBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                toTopBtn.classList.remove('opacity-0', 'invisible');
                toTopBtn.classList.add('opacity-100', 'visible');
            } else {
                toTopBtn.classList.remove('opacity-100', 'visible');
                toTopBtn.classList.add('opacity-0', 'invisible');
            }
        });
    }

    // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА ---
    const langToggle = document.getElementById('lang-toggle');
    const ruElements = document.querySelectorAll('.lang-ru');
    const enElements = document.querySelectorAll('.lang-en');
    const htmlTag = document.documentElement;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    
    const descriptions = {
        ru: {
            meta: "Reichlich Community - дружное игровое сообщество для Valorant, CS2, Minecraft и ETS2. Присоединяйтесь к нам в Discord!",
            og: "Сообщество для совместных побед. Твой лучший уголок в игровом мире."
        },
        en: {
            meta: "Reichlich Community - a friendly gaming community for Valorant, CS2, Minecraft, and ETS2. Join us on Discord!",
            og: "A community for joint victories. Your best corner in the gaming world."
        }
    };

    function setLanguage(lang) {
        if (lang === 'en') {
            enElements.forEach(el => el.classList.remove('hidden'));
            ruElements.forEach(el => el.classList.add('hidden'));
            htmlTag.lang = 'en';
            if(metaDescription) metaDescription.content = descriptions.en.meta;
            if(ogDescription) ogDescription.content = descriptions.en.og;
            if (langToggle) langToggle.checked = true;
        } else {
            ruElements.forEach(el => el.classList.remove('hidden'));
            enElements.forEach(el => el.classList.add('hidden'));
            htmlTag.lang = 'ru';
            if(metaDescription) metaDescription.content = descriptions.ru.meta;
            if(ogDescription) ogDescription.content = descriptions.ru.og;
            if (langToggle) langToggle.checked = false;
        }
        localStorage.setItem('language', lang);
    }

    if (langToggle) {
        langToggle.addEventListener('change', () => {
            setLanguage(langToggle.checked ? 'en' : 'ru');
        });
    }

    const savedLang = localStorage.getItem('language') || 'ru';
    setLanguage(savedLang);

    
    // ------------------------------
    // --- НОВЫЙ JS (GSAP и Карусель) ---
    // ------------------------------

    // --- 1. ЛОГИКА 3D-КАРУСЕЛИ ---
    const carousel = document.getElementById('game-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (carousel && prevBtn && nextBtn) {
        const panels = document.querySelectorAll('.carousel-panel');
        const panelCount = panels.length;
        const angle = 360 / panelCount;
        let currentRotation = 0;
        let autoRotateInterval; // Для setInterval
        let autoRotateTimer; // Для setTimeout (таймер отложенного старта)

        // Функция поворота
        function rotateCarousel() {
            carousel.style.transform = `rotateY(${currentRotation}deg)`;
        }

        // Остановка вращения (и таймера отложенного старта)
        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
            clearTimeout(autoRotateTimer);
        }

        // Автоматическое вращение
        function startAutoRotate() {
            stopAutoRotate(); 
            autoRotateInterval = setInterval(() => {
                currentRotation -= angle; // Вращение по часовой
                rotateCarousel();
            }, 3000); // каждые 3 секунды
        }

        // Функция для сброса и возобновления авто-вращения
        function resetAutoRotateTimer() {
            stopAutoRotate();
            // Возобновить авто-вращение через 5 секунд после последнего взаимодействия
            autoRotateTimer = setTimeout(startAutoRotate, 5000); 
        }

        // Кнопка "Вперед"
        nextBtn.addEventListener('click', () => {
            currentRotation -= angle;
            rotateCarousel();
            resetAutoRotateTimer(); // Возобновление с задержкой
        });

        // Кнопка "Назад"
        prevBtn.addEventListener('click', () => {
            currentRotation += angle;
            rotateCarousel();
            resetAutoRotateTimer(); // Возобновление с задержкой
        });

        // Пауза при наведении
        carousel.addEventListener('mouseenter', stopAutoRotate);
        // Возобновление при уходе мыши (после 5 секунд)
        carousel.addEventListener('mouseleave', resetAutoRotateTimer);

        // Запускаем авто-вращение
        startAutoRotate();
    }


    // --- 2. ЛОГИКА GSAP АНИМАЦИЙ ПРИ СКРОЛЛЕ ---
    if (typeof gsap !== 'undefined') {
        // Регистрация плагина
        gsap.registerPlugin(ScrollTrigger);

        // --- НОВЫЕ АНИМАЦИИ ---

        // 1. Анимация Хедера при Скролле (скрывается/появляется)
        gsap.to("header", {
            y: -50, 
            opacity: 0.8,
            ease: "power2.in",
            scrollTrigger: {
                trigger: "body",
                start: "top -100px", 
                end: "top -150px", 
                scrub: true,
                toggleActions: "play none reverse none" 
            }
        });

        // 2. Параллакс для текста главного экрана
        gsap.to(".fade-in", {
            y: -100, 
            opacity: 0.5,
            ease: "power1.in",
            scrollTrigger: {
                trigger: "#home",
                start: "top top", 
                end: "bottom top", 
                scrub: true,
            }
        });
        
        // 3. Плавный Скролл для Ссылок (Заменяет стандартный скролл)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    gsap.to(window, {
                        duration: 1.2, 
                        scrollTo: {
                            y: targetId,
                            offsetY: document.querySelector('header').offsetHeight // Учитываем высоту фиксированного хедера
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        });

        // --- СУЩЕСТВУЮЩИЕ АНИМАЦИИ ---

        // Анимация для заголовков (gsap-fade-up)
        gsap.utils.toArray('.gsap-fade-up').forEach(el => {
            const delay = el.dataset.delay || 0;
            gsap.fromTo(el, 
                { opacity: 0, y: 50 }, 
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1,
                    delay: delay,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%', // Начать, когда 90% верха элемента в окне
                        toggleActions: 'play none none none' // Проиграть один раз
                    }
                }
            );
        });

        // Анимация для карточек (gsap-card)
        gsap.utils.toArray('.gsap-card').forEach(card => {
            const delay = card.dataset.delay || 0;
            gsap.fromTo(card,
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: delay,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

    } else {
        console.warn("GSAP is not loaded.");
    }

});
