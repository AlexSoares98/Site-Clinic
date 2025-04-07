// Função para verificar se um elemento está visível na tela
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Função para adicionar classes de animação
function addAnimationClasses() {
    // Container de experiência
    const experienciaContainer = document.querySelector('.experiencia-container');
    if (experienciaContainer && isElementInViewport(experienciaContainer)) {
        experienciaContainer.classList.add('animate');
    }

    // Seção de números
    const numerosSection = document.querySelector('.numeros');
    if (numerosSection && isElementInViewport(numerosSection)) {
        const numerosTitle = document.querySelector('.numeros-title');
        const numerosContent = document.querySelector('.numeros-content');
        
        if (numerosTitle) {
            numerosTitle.classList.add('slide-in');
        }
        if (numerosContent) {
            numerosContent.classList.add('slide-in');
        }
    }

    // Seção de contato
    const contatoSection = document.querySelector('.contato');
    if (contatoSection && isElementInViewport(contatoSection)) {
        const contatoTitle = document.querySelector('.contato h2');
        const contatoForm = document.querySelector('.contato-form');
        
        if (contatoTitle) {
            contatoTitle.classList.add('animate');
        }
        if (contatoForm) {
            contatoForm.classList.add('animate');
        }
    }
}

// Adiciona as classes de animação quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    addAnimationClasses();

    // Força a animação da seção de números
    setTimeout(() => {
        const numerosTitle = document.querySelector('.numeros-title');
        const numerosContent = document.querySelector('.numeros-content');
        
        if (numerosTitle) {
            numerosTitle.classList.add('slide-in');
        }
        if (numerosContent) {
            numerosContent.classList.add('slide-in');
        }
    }, 1000);
});

// Adiciona as classes de animação quando o usuário rola a página
window.addEventListener('scroll', () => {
    addAnimationClasses();
}); 