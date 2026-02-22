// ========== ПРЕЛОАДЕР ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('fade-out');
    }, 500);
});

// ========== ТЕМА (СВЕТЛАЯ/ТЕМНАЯ) ==========
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Загружаем сохраненную тему
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
}

// Переключение темы
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    
    if (body.classList.contains('dark')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
    
    // Анимация переключения
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// ========== ПЛАВНАЯ ПРОКРУТКА ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Обновляем URL без перезагрузки
            history.pushState(null, null, targetId);
        }
    });
});

// ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ==========
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Если это карточка с возможностями, добавляем класс для анимации
            if (entry.target.classList.contains('card')) {
                entry.target.classList.add('animated');
            }
        }
    });
}, observerOptions);

// Наблюдаем за карточками
document.querySelectorAll('.card, .download-card, .author-card, .donate-card, .community-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========== ПАРАЛЛАКС ЭФФЕКТ ==========
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
    
    const platforms = document.querySelector('.platforms');
    if (platforms) {
        platforms.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    const donateIcon = document.querySelector('.donate-icon');
    if (donateIcon) {
        donateIcon.style.transform = `translate(${moveX/2}px, ${moveY/2}px)`;
    }
});

// ========== АНИМАЦИЯ ДЛЯ ИКОНОК ПЛАТФОРМ ==========
const platformIcons = document.querySelectorAll('.platforms i');
platformIcons.forEach((icon, index) => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ========== ПОДДЕРЖКА DONATIONALERTS ==========

// Данные для статистики
let donateStats = {
    clicks: parseInt(localStorage.getItem('donateClicks')) || 0,
    lastDonate: localStorage.getItem('lastDonate') || null,
    totalAmount: parseInt(localStorage.getItem('donateTotal')) || 0
};

// Обновляем статистику на странице
function updateDonateStats() {
    const statsElement = document.querySelector('.donate-stats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="stat">
                <span class="stat-value">${donateStats.clicks}</span>
                <span>нажатий</span>
            </div>
            <div class="stat">
                <span class="stat-value">${donateStats.totalAmount}₽</span>
                <span>всего</span>
            </div>
        `;
    }
}

// Кнопка DonationAlerts - главная
const daBtn = document.querySelector('.da-btn');
if (daBtn) {
    // Анимация пульсации
    setInterval(() => {
        daBtn.style.transform = 'scale(1.05)';
        daBtn.style.boxShadow = '0 10px 25px rgba(255, 77, 77, 0.4)';
        
        setTimeout(() => {
            daBtn.style.transform = 'scale(1)';
            daBtn.style.boxShadow = '0 5px 15px rgba(255, 77, 77, 0.3)';
        }, 200);
    }, 3000);
    
    // Обработчик клика
    daBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Увеличиваем счетчик
        donateStats.clicks++;
        localStorage.setItem('donateClicks', donateStats.clicks);
        
        // Показываем уведомление
        showDonateNotification('Спасибо за интерес к проекту! ❤️');
        
        // Открываем DonationAlerts в новом окне
        setTimeout(() => {
            window.open('https://www.donationalerts.com/r/gr33nyea_the_builder', '_blank');
        }, 500);
    });
}

// Быстрые кнопки сумм
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const amount = btn.textContent.replace('₽', '').trim();
        
        // Сохраняем в статистику (просто для примера)
        donateStats.totalAmount += parseInt(amount);
        localStorage.setItem('donateTotal', donateStats.totalAmount);
        
        // Показываем уведомление
        showDonateNotification(`Спасибо за поддержку ${amount}₽! ❤️`);
        
        // Открываем DonationAlerts
        setTimeout(() => {
            window.open('https://www.donationalerts.com/r/gr33nyea_the_builder', '_blank');
        }, 500);
    });
});

// Кнопка в футере
const footerDonate = document.querySelector('.footer-donate');
if (footerDonate) {
    footerDonate.addEventListener('click', (e) => {
        e.preventDefault();
        
        donateStats.clicks++;
        localStorage.setItem('donateClicks', donateStats.clicks);
        
        showDonateNotification('Спасибо! ❤️');
        
        setTimeout(() => {
            window.open('https://www.donationalerts.com/r/gr33nyea_the_builder', '_blank');
        }, 500);
    });
}

// Функция показа уведомления
function showDonateNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'donate-notification';
    notification.innerHTML = `
        <i class="fas fa-heart" style="color: #ff4d4d; margin-right: 10px;"></i>
        ${message}
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${body.classList.contains('dark') ? '#2d2d2d' : '#ffffff'};
        color: ${body.classList.contains('dark') ? '#ffffff' : '#333333'};
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        font-size: 1.1rem;
        border-left: 4px solid #ff4d4d;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========== СЧЕТЧИК СКАЧИВАНИЙ ==========
let downloadCount = parseInt(localStorage.getItem('downloadCount')) || 0;

document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Спрашиваем подтверждение
        if (!confirm('Скачать файл?')) {
            e.preventDefault();
            return;
        }
        
        // Увеличиваем счетчик
        downloadCount++;
        localStorage.setItem('downloadCount', downloadCount);
        
        // Показываем уведомление
        showDonateNotification(`Скачивание #${downloadCount}! Спасибо!`);
    });
});

// ========== АНИМАЦИЯ ДЛЯ КАРТОЧЕК ==========
document.querySelectorAll('.card, .community-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// ========== АНИМАЦИЯ ДЛЯ DONATE ИКОНКИ ==========
const donateIcon = document.querySelector('.donate-icon');
if (donateIcon) {
    // Создаем плавающие сердечки
    setInterval(() => {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart';
        heart.style.cssText = `
            position: absolute;
            color: #ff4d4d;
            font-size: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0;
            animation: floatHeart ${Math.random() * 3 + 2}s ease-out;
            pointer-events: none;
        `;
        
        donateIcon.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 3000);
    }, 1000);
}

// Добавляем анимацию для сердечек
const style = document.createElement('style');
style.textContent = `
    @keyframes floatHeart {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== АКТИВНЫЙ ПУНКТ МЕНЮ ==========
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========== ЗАГРУЗКА ВЕРСИЙ ==========
async function loadVersions() {
    try {
        const response = await fetch('downloads/versions.json');
        if (response.ok) {
            const data = await response.json();
            console.log('Версии загружены:', data.version);
            
            // Обновляем версии на странице
            document.querySelectorAll('.version').forEach(el => {
                el.textContent = `Версия ${data.version}`;
            });
        }
    } catch (e) {
        console.log('Используются стандартные версии');
    }
}

loadVersions();

// ========== КНОПКА НАВЕРХ ==========
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--green);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transition: all 0.3s;
    z-index: 999;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1)';
    scrollTopBtn.style.background = 'var(--dark-green)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1)';
    scrollTopBtn.style.background = 'var(--green)';
});

// ========== СОЦИАЛЬНЫЕ ССЫЛКИ ==========
// Discord
const discordLinks = document.querySelectorAll('a[href*="discord.gg"]');
discordLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        console.log('Переход в Discord');
        // Можно добавить аналитику
    });
});

// GitHub
const githubLinks = document.querySelectorAll('a[href*="github.com"]');
githubLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        console.log('Переход на GitHub');
        // Можно добавить аналитику
    });
});

// ========== ИНИЦИАЛИЗАЦИЯ ==========

console.log('✅ Сайт Рисовалка Pro загружен!');
console.log('❤️ От Gr33nYea');
console.log('💰 DonationAlerts: https://www.donationalerts.com/r/gr33nyea_the_builder');
console.log('🐙 GitHub: https://github.com/Gr33nYea-official/Gr33Yea-official.github.io');
