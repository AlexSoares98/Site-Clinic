/**
 * CLINIC - Animations
 * Arquivo de animações específicas
 * Versão: 2.0.0
 */

class ClinicAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        // Animação de fade-in para seções
        const fadeSections = document.querySelectorAll('[data-animate="fade"]');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    this.animatedElements.add(entry.target);
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeSections.forEach(section => fadeObserver.observe(section));

        // Animação de slide para elementos
        const slideElements = document.querySelectorAll('[data-animate="slide"]');
        
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const direction = entry.target.dataset.direction || 'up';
                    entry.target.classList.add(`slide-in-${direction}`);
                    this.animatedElements.add(entry.target);
                    slideObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        slideElements.forEach(el => slideObserver.observe(el));
    }

    setupHoverEffects() {
        // Efeitos hover para cards
        const cards = document.querySelectorAll('.card-hover-effect');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover-active');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-active');
            });
        });

        // Efeitos hover para botões
        const buttons = document.querySelectorAll('.btn-hover-effect');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                button.style.setProperty('--mouse-x', `${x}px`);
                button.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            element.textContent = value;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }
}

// Inicialização das animações
document.addEventListener('DOMContentLoaded', () => {
    new ClinicAnimations();
});