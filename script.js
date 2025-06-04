/**
 * PORTFOLIO Anderson Melara - UPF
 * Arquivo JavaScript Principal
 * Data: 03/06/2025
 * Disciplina: Desenvolvimento para Web
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
});

/**
 * Inicializa a navegação móvel
 */
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle do menu hamburger
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fecha o menu ao clicar em um link (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Destaca o link ativo baseado na página atual
    highlightActiveNavLink();
}

/**
 * Destaca o link de navegação ativo
 */
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Inicializa efeitos de scroll
 */
function initializeScrollEffects() {
    // Efeito da navbar no scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona sombra na navbar quando rola a página
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }

        lastScrollTop = scrollTop;
    });

    // Scroll reveal para elementos
    initializeScrollReveal();
}

/**
 * Inicializa o scroll reveal para animações
 */
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observa elementos que devem ser animados
    const animatedElements = document.querySelectorAll(
        '.highlight-card, .interest-card, .project-card, .academic-card, .faq-item'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Inicializa o formulário de contato
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

/**
 * Manipula o envio do formulário
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validação completa do formulário
    if (!validateForm(form)) {
        showNotification('Por favor, corrija os erros no formulário.', 'error');
        return;
    }
    
    // Simula envio do formulário
    simulateFormSubmission(form, formData);
}

/**
 * Valida o formulário completo
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Valida um campo individual
 */
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // Remove erro anterior
    clearFieldError(event);
    
    // Validação por tipo de campo
    switch (fieldName) {
        case 'nome':
            if (value.length < 2) {
                errorMessage = 'Nome deve ter pelo menos 2 caracteres.';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Por favor, insira um email válido.';
                isValid = false;
            }
            break;
            
        case 'telefone':
            if (value && value.length < 10) {
                errorMessage = 'Telefone deve ter pelo menos 10 dígitos.';
                isValid = false;
            }
            break;
            
        case 'mensagem':
            if (value.length < 10) {
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres.';
                isValid = false;
            }
            break;
            
        case 'assunto':
            if (!value) {
                errorMessage = 'Por favor, selecione um assunto.';
                isValid = false;
            }
            break;
    }
    
    // Mostra erro se necessário
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

/**
 * Mostra erro em um campo
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove mensagem de erro anterior
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adiciona nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--danger-color)';
    errorDiv.style.fontSize = 'var(--font-size-small)';
    errorDiv.style.marginTop = 'var(--spacing-xs)';
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Remove erro de um campo
 */
function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Simula o envio do formulário
 */
function simulateFormSubmission(form, formData) {
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;
    
    // Muda o botão para estado de carregamento
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simula delay de envio
    setTimeout(() => {
        // Restaura o botão
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Mostra mensagem de sucesso
        showNotification('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
        
        // Limpa o formulário
        form.reset();
        
        // Log dos dados (em produção, enviaria para o servidor)
        console.log('Dados do formulário:', Object.fromEntries(formData));
        
    }, 2000);
}

/**
 * Mostra notificação para o usuário
 */
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentNode.parentNode.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Adiciona ao DOM
    document.body.appendChild(notification);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Retorna o ícone da notificação baseado no tipo
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Retorna a cor da notificação baseada no tipo
 */
function getNotificationColor(type) {
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--primary-color)'
    };
    return colors[type] || colors.info;
}

/**
 * Inicializa animações e efeitos visuais
 */
function initializeAnimations() {
    // Anima barras de progresso das habilidades
    animateSkillBars();
    
    // Adiciona efeito hover nos cards
    addHoverEffects();
    
    // Inicializa contador animado (se houver)
    initializeCounters();
    
    // Adiciona animações CSS customizadas
    addCustomAnimations();
}

/**
 * Anima as barras de progresso das habilidades
 */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                
                // Reset and animate
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

/**
 * Adiciona efeitos hover nos cards
 */
function addHoverEffects() {
    const cards = document.querySelectorAll('.highlight-card, .interest-card, .project-card, .academic-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Inicializa contadores animados
 */
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Anima um contador específico
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Adiciona animações CSS customizadas
 */
function addCustomAnimations() {
    // Adiciona estilos de animação ao head se não existirem
    if (!document.getElementById('custom-animations')) {
        const style = document.createElement('style');
        style.id = 'custom-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: background 0.2s ease;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Utilitários adicionais
 */

/**
 * Smooth scroll para links internos
 */
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Detecta tema do sistema e ajusta cores se necessário
 */
function initializeThemeDetection() {
    // Detecta preferência de tema escuro
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Usuário prefere tema escuro
        console.log('Tema escuro detectado');
    }
    
    // Listener para mudanças de tema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            console.log('Mudou para tema escuro');
        } else {
            console.log('Mudou para tema claro');
        }
    });
}

/**
 * Lazy loading para imagens
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Adiciona funcionalidade de busca (se necessário)
 */
function initializeSearch() {
    const searchInput = document.getElementById('search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const searchableElements = document.querySelectorAll('[data-searchable]');
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                const shouldShow = text.includes(query);
                
                element.style.display = shouldShow ? 'block' : 'none';
            });
        });
    }
}

/**
 * Performance monitoring
 */
function initializePerformanceMonitoring() {
    // Monitora tempo de carregamento
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
        
        // Em produção, enviaria estes dados para analytics
    });
    
    // Monitora interações do usuário
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, .nav-link, .project-card')) {
            console.log('Interação:', e.target.textContent.trim());
        }
    });
}

/**
 * Inicializa funcionalidades extras quando a página carrega
 */
window.addEventListener('load', function() {
    initializeSmoothScroll();
    initializeThemeDetection();
    initializeLazyLoading();
    initializeSearch();
    initializePerformanceMonitoring();
});

/**
 * Funções utilitárias globais
 */
window.PortfolioUtils = {
    showNotification: showNotification,
    validateForm: validateForm,
    animateSkillBars: animateSkillBars
};

/**
 * Console log de inicialização
 */
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    PORTFÓLIO JOÃO SILVA - UPF                ║
║                 Desenvolvimento para Web - 2025              ║
╚═══════════════════════════════════════════════════════════════╝

✅ JavaScript carregado com sucesso!
✅ Navegação responsiva ativada
✅ Formulário de contato funcional
✅ Animações e efeitos visuais ativados
✅ Scroll reveal configurado

📧 Para dúvidas: joao.silva@exemplo.com
🔗 GitHub: https://github.com/seu-usuario/portfolio-upf
`);