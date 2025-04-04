// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Função para o carrossel de logos
function initLogosCarousel() {
    const logosSection = document.querySelector('.logos-section');
    const logosTrack = document.querySelector('.logos-track');
    let isDragging = false;
    let startX;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let animationFrame;

    // Eventos de mouse
    logosSection.addEventListener('mousedown', dragStart);
    logosSection.addEventListener('mousemove', drag);
    logosSection.addEventListener('mouseup', dragEnd);
    logosSection.addEventListener('mouseleave', dragEnd);

    // Eventos de touch
    logosSection.addEventListener('touchstart', dragStart);
    logosSection.addEventListener('touchmove', drag);
    logosSection.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        cancelAnimationFrame(animationFrame);
        logosTrack.style.transition = 'none';
    }

    function drag(e) {
        if (isDragging) {
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + currentPosition - startX;
            setSliderPosition();
        }
    }

    function dragEnd() {
        isDragging = false;
        logosTrack.style.transition = 'transform 0.3s ease-out';
        prevTranslate = currentTranslate;
        startAnimation();
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function setSliderPosition() {
        logosTrack.style.transform = `translateY(-50%) translateX(${currentTranslate}px)`;
    }

    function startAnimation() {
        let startTime = null;
        const duration = 50000; // 50 segundos
        const distance = -50; // 50% da largura

        function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const translateX = prevTranslate + (distance * progress);
            logosTrack.style.transform = `translateY(-50%) translateX(${translateX}px)`;

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                prevTranslate = 0;
                startTime = null;
                startAnimation();
            }
        }

        animationFrame = requestAnimationFrame(animate);
    }

    // Inicia a animação
    startAnimation();
}

// Função para animação da seção de números
function initNumerosAnimation() {
    const numerosSection = document.querySelector('.numeros');
    const numerosTitle = document.querySelector('.numeros-title');
    const numerosContent = document.querySelector('.numeros-content');
    
    // Reset das animações
    function resetAnimations() {
        numerosTitle.style.transform = 'translateX(-100%)';
        numerosTitle.style.opacity = '0';
        numerosContent.style.transform = 'translateX(-100%)';
        numerosContent.style.opacity = '0';
    }

    // Função para iniciar as animações
    function startAnimations() {
        numerosTitle.classList.add('slide-in');
        numerosContent.classList.add('slide-in');
    }

    // Criando o Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset das animações antes de iniciar
                resetAnimations();
                // Pequeno delay para garantir que o reset foi aplicado
                setTimeout(() => {
                    startAnimations();
                }, 50);
            } else {
                // Remove as classes quando sair do viewport
                numerosTitle.classList.remove('slide-in');
                numerosContent.classList.remove('slide-in');
            }
        });
    }, {
        threshold: 0.2 // 20% da seção visível
    });

    // Observando a seção de números
    observer.observe(numerosSection);
}

// Inicializa o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initLogosCarousel();
    initNumerosAnimation();
}); 