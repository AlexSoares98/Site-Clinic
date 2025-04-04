// Função para mudar o header quando rolar a página
function initHeader() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Função para suavizar o scroll dos links do menu
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Função para controlar o conteúdo dinâmico dos recursos
function initRecursos() {
    const cards = document.querySelectorAll('.recurso-card');
    const contents = document.querySelectorAll('.recurso-content');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active de todos os cards
            cards.forEach(c => c.setAttribute('data-active', 'false'));
            // Adiciona active ao card clicado
            card.setAttribute('data-active', 'true');

            // Esconde todos os conteúdos
            contents.forEach(content => content.classList.remove('active'));
            
            // Mostra o conteúdo correspondente
            const recursoId = card.getAttribute('data-recurso');
            if (recursoId) {
                const content = document.getElementById(`${recursoId}-content`);
                if (content) {
                    content.classList.add('active');
                }
            }
        });
    });
}

// Função para animar os números
function initNumeros() {
    const numeros = document.querySelectorAll('.numero');
    const numerosContent = document.querySelector('.numeros-content');
    const numerosTitle = document.querySelector('.numeros-title');
    
    // Observador para o container dos números
    const numerosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Container visível - adicionando slide-in');
                numerosContent.classList.add('slide-in');
                numerosTitle.classList.add('slide-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    if (numerosContent) {
        console.log('Iniciando observador do container');
        numerosObserver.observe(numerosContent);
    } else {
        console.error('Container não encontrado');
    }
    
    // Observador para os números individuais
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numero = entry.target;
                const valor = parseInt(numero.textContent);
                let atual = 0;
                const incremento = valor / 200;
                const duracao = 2000;
                const intervalo = duracao / 200;
                
                const animacao = setInterval(() => {
                    atual += incremento;
                    if (atual >= valor) {
                        numero.textContent = valor;
                        clearInterval(animacao);
                    } else {
                        numero.textContent = Math.floor(atual);
                    }
                }, intervalo);
                
                observer.unobserve(numero);
            }
        });
    }, {
        threshold: 0.5
    });
    
    numeros.forEach(numero => observer.observe(numero));
}

// Função para sanitizar inputs
function sanitizeInput(input) {
    return input.replace(/[<>]/g, ''); // Remove tags HTML
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar telefone
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
}

// Função para o formulário de contato com validações
function initContato() {
    const form = document.querySelector('.contato-form');
    if (!form) return;
    
    let lastSubmission = 0;
    const SUBMISSION_DELAY = 2000; // 2 segundos entre envios
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastSubmission < SUBMISSION_DELAY) {
            alert('Por favor, aguarde alguns segundos antes de enviar novamente.');
            return;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validações de segurança
        if (!data.nome || !data.email || !data.telefone || !data.assunto || !data.mensagem) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            alert('Por favor, insira um email válido.');
            return;
        }
        
        if (!isValidPhone(data.telefone)) {
            alert('Por favor, insira um telefone válido.');
            return;
        }
        
        // Sanitiza os inputs
        const sanitizedData = {
            nome: sanitizeInput(data.nome),
            email: sanitizeInput(data.email),
            telefone: sanitizeInput(data.telefone),
            assunto: sanitizeInput(data.assunto),
            mensagem: sanitizeInput(data.mensagem)
        };
        
        // Adiciona token CSRF (deve ser gerado pelo backend)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (!csrfToken) {
            console.error('Token CSRF não encontrado');
            return;
        }
        
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;
        
        lastSubmission = now;
        
        // Aqui você deve enviar os dados para uma API segura usando HTTPS
        console.log('Dados sanitizados:', sanitizedData);
        
        setTimeout(() => {
            btn.textContent = 'Enviado!';
            form.reset();
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Função para controlar a rolagem das logos
function initLogosScroll() {
    const track = document.querySelector('.logos-track');
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let animationFrame;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.animation = 'none';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.animation = 'slide 30s linear infinite';
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.animation = 'slide 30s linear infinite';
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.style.transform = `translateY(-50%) translateX(${walk}px)`;
    });
}

// Inicializa todas as funcionalidades
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSmoothScroll();
    initRecursos();
    initNumeros();
    initContato();
    initLogosScroll();
}); 