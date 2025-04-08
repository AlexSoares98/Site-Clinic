/**
 * CLINIC - Sistema para Gestão de Clínicas e Hospitais
 * Arquivo principal JavaScript
 * Versão: 2.0.0
 */

class ClinicApp {
    constructor() {
        this._scrollPosition = 0;
        this._isScrolling = false;
        this._logoAnimationId = null;
        this.init();
    }

    init() {
        this.cacheElements();
        this.initHeader();
        this.initSmoothScroll();
        this.initRecursos();
        this.initNumeros();
        this.initContato();
        this.initLogosCarousel();
        this.initIntersectionObservers();
        this.addEventListeners();
        this.setupA11y();
    }

    cacheElements() {
        this.elements = {
            header: document.querySelector('.header'),
            navLinks: document.querySelectorAll('a[href^="#"]'),
            recursoCards: document.querySelectorAll('.recurso-card'),
            recursoContents: document.querySelectorAll('.recurso-content'),
            numeros: document.querySelectorAll('.numero'),
            contatoForm: document.querySelector('.contato-form'),
            logosTrack: document.querySelector('.logos-track'),
            fadeElements: document.querySelectorAll('.fade-in')
        };
    }

    initHeader() {
        if (!this.elements.header) return;

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            
            // Apenas atualiza se a posição mudou significativamente
            if (Math.abs(currentScroll - this._scrollPosition) > 5) {
                this.elements.header.classList.toggle('scrolled', currentScroll > 50);
                this._scrollPosition = currentScroll;
            }
            
            this._isScrolling = false;
        };

        window.addEventListener('scroll', () => {
            if (!this._isScrolling) {
                window.requestAnimationFrame(handleScroll);
                this._isScrolling = true;
            }
        });

        // Estado inicial
        handleScroll();
    }

    initSmoothScroll() {
        this.elements.navLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Atualiza a URL sem recarregar a página
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    initRecursos() {
        const cards = document.querySelectorAll('.recurso-card');
        const contents = document.querySelectorAll('.recurso-content');

        const showContent = (recursoId) => {
            this.elements.recursoContents.forEach(content => {
                content.classList.toggle('active', content.id === `${recursoId}-content`);
            });
        };

        this.elements.recursoCards.forEach(card => {
            // Mouse/Toque
            card.addEventListener('click', () => {
                this.elements.recursoCards.forEach(c => c.setAttribute('data-active', 'false'));
                card.setAttribute('data-active', 'true');
                showContent(card.dataset.recurso);
            });

            // Teclado
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Ativar o primeiro card por padrão
        if (this.elements.recursoCards[0]) {
            this.elements.recursoCards[0].click();
        }
    }

    initNumeros() {
        const numerosSection = document.querySelector('.numeros');
        if (!numerosSection) return;
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const title = entry.target.querySelector('.numeros-title');
                    const content = entry.target.querySelector('.numeros-content');
                    
                    if (title) title.classList.add('slide-in');
                    if (content) content.classList.add('slide-in');
                    
                    // Animação dos números
                    this.animateNumbers();
                    
                    // Para de observar após a animação
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
    
        observer.observe(numerosSection);
    }

    animateNumbers() {
        this.elements.numeros.forEach(numero => {
            const target = +numero.textContent.replace('+', '');
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(progress * target);
                
                numero.textContent = value;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        });
    }

    initContato() {
        if (!this.elements.contatoForm) return;

        this.elements.contatoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(this.elements.contatoForm);
            const data = Object.fromEntries(formData);
            const btn = this.elements.contatoForm.querySelector('button');

            // Validação
            if (!this.validateForm(data)) return;

            btn.disabled = true;
            btn.textContent = 'Enviando...';
            
            try {
                // Simulação de envio (substituir por chamada real)
                await this.sendFormData(data);
                
                this.elements.contatoForm.reset();
                this.showFeedback('Formulário enviado com sucesso!', 'success');
            } catch (error) {
                console.error('Erro no formulário:', error);
                this.showFeedback('Erro ao enviar formulário', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Enviar formulário';
            }
        });
    }

    validateForm(data) {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;

        // Validação básica
        if (!data.nome || data.nome.trim().length < 3) {
            this.showFeedback('Nome deve ter pelo menos 3 caracteres', 'error');
            isValid = false;
        }

        if (!emailRegex.test(data.email)) {
            this.showFeedback('Por favor, insira um e-mail válido', 'error');
            isValid = false;
        }

        if (!phoneRegex.test(data.telefone)) {
            this.showFeedback('Telefone inválido', 'error');
            isValid = false;
        }

        return isValid;
    }

    async sendFormData(data) {
        // Simula uma requisição assíncrona
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Dados do formulário:', data);
                resolve();
            }, 1500);
        });
    }

    initLogosCarousel() {
        if (!this.elements.logosTrack) return;

        const config = {
            speed: 1,
            direction: -1,
            isPaused: false,
            position: 0
        };

        const animate = () => {
            if (config.isPaused) {
                this._logoAnimationId = requestAnimationFrame(animate);
                return;
            }
            
            config.position += config.speed * config.direction;
            this.elements.logosTrack.style.transform = `translateX(${config.position}px)`;
            
            // Reset para loop infinito
            if (Math.abs(config.position) >= this.elements.logosTrack.scrollWidth / 2) {
                config.position = 0;
            }
            
            this._logoAnimationId = requestAnimationFrame(animate);
        };

        // Controles de interação
        this.elements.logosTrack.addEventListener('mouseenter', () => {
            config.isPaused = true;
        });

        this.elements.logosTrack.addEventListener('mouseleave', () => {
            config.isPaused = false;
        });

        // Touch events
        this.elements.logosTrack.addEventListener('touchstart', () => {
            config.isPaused = true;
        });

        this.elements.logosTrack.addEventListener('touchend', () => {
            config.isPaused = false;
        });

        // Iniciar animação
        animate();
    }

    initIntersectionObservers() {
        if (!this.elements.fadeElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.elements.fadeElements.forEach(el => observer.observe(el));
    }

    addEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        // Ajustes para diferentes tamanhos de tela
        if (window.innerWidth < 768) {
            // Ações específicas para mobile
        }
    }

    setupA11y() {
        // Melhorias de acessibilidade
        document.body.classList.add('js-enabled');
        
        // Foco visível para elementos interativos
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Tab') {
                document.documentElement.classList.add('tabbing');
            }
        });

        document.addEventListener('mousedown', () => {
            document.documentElement.classList.remove('tabbing');
        });
    }

    showFeedback(message, type = 'success') {
        // Remove feedback existente
        const existingFeedback = document.querySelector('.feedback-message');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Cria novo elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = `feedback-message feedback-${type}`;
        feedback.textContent = message;
        feedback.setAttribute('role', 'alert');
        feedback.setAttribute('aria-live', 'polite');

        document.body.appendChild(feedback);

        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 300);
        }, 5000);
    }

    cleanup() {
        // Limpeza de recursos
        if (this._logoAnimationId) {
            cancelAnimationFrame(this._logoAnimationId);
        }
    }
}

// Inicialização segura
if (document.readyState !== 'loading') {
    initializeApp();
} else {
    document.addEventListener('DOMContentLoaded', initializeApp);
}

function initializeApp() {
    const app = new ClinicApp();

    // Expor para debug se necessário
    if (process.env.NODE_ENV === 'development') {
        window.ClinicApp = app;
    }
}