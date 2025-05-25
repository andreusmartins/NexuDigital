document.addEventListener('DOMContentLoaded', function() {
  // Preloader
  const preloader = document.querySelector('.preloader');
  
  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 1000);
  });

  // Cursor Personalizado
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (window.innerWidth > 992) {
    document.addEventListener('mousemove', function(e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
    
    // Efeito de hover no cursor
    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, .team-member, .blog-post');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', function() {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
      });
      
      el.addEventListener('mouseleave', function() {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
      });
    });
  }

  // Navbar Scroll
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Menu Mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Ativar link ativo na navegação
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Filtro do Portfólio
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover classe active de todos os botões
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Adicionar classe active ao botão clicado
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Contador de Estatísticas
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.querySelector('.about-stats');
  
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(number => {
            const target = +number.getAttribute('data-count');
            const count = +number.innerText;
            const increment = target / 100;
            
            if (count < target) {
              number.innerText = Math.ceil(count + increment);
              setTimeout(updateCount, 1);
            } else {
              number.innerText = target;
            }
            
            function updateCount() {
              const count = +number.innerText;
              if (count < target) {
                number.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
              } else {
                number.innerText = target;
              }
            }
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(statsSection);
  }

  // Slider de Depoimentos
  let testimonialSlider;
  
  function initTestimonialSlider() {
    if (window.innerWidth < 768) {
      if (!document.querySelector('.testimonial-slider').classList.contains('slick-initialized')) {
        testimonialSlider = $('.testimonial-slider').slick({
          dots: true,
          arrows: false,
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          adaptiveHeight: true
        });
      }
    } else {
      if (document.querySelector('.testimonial-slider').classList.contains('slick-initialized')) {
        $('.testimonial-slider').slick('unslick');
      }
    }
  }
  
  if (document.querySelector('.testimonial-slider')) {
    initTestimonialSlider();
    window.addEventListener('resize', initTestimonialSlider);
  }

  // Validação do Formulário
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validar campos
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      let isValid = true;
      
      // Remover mensagens de erro anteriores
      document.querySelectorAll('.error-message').forEach(el => el.remove());
      
      // Validar nome
      if (name.value.trim() === '') {
        showError(name, 'Por favor, insira seu nome');
        isValid = false;
      }
      
      // Validar email
      if (email.value.trim() === '' || !isValidEmail(email.value)) {
        showError(email, 'Por favor, insira um email válido');
        isValid = false;
      }
      
      // Validar mensagem
      if (message.value.trim() === '') {
        showError(message, 'Por favor, insira sua mensagem');
        isValid = false;
      }
      
      // Se tudo estiver válido, enviar formulário
      if (isValid) {
        // Simular envio (substituir por AJAX/API real)
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(function() {
          submitBtn.innerHTML = 'Mensagem enviada! <i class="fas fa-check"></i>';
          
          // Resetar formulário
          setTimeout(function() {
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar mensagem';
            
            // Mostrar mensagem de sucesso
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.';
            contactForm.appendChild(successMessage);
            
            // Remover mensagem após 5 segundos
            setTimeout(function() {
              successMessage.remove();
            }, 5000);
          }, 2000);
        }, 1500);
      }
    });
    
    function showError(input, message) {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.textContent = message;
      input.parentNode.appendChild(errorMessage);
      input.classList.add('error');
      
      input.addEventListener('input', function() {
        errorMessage.remove();
        this.classList.remove('error');
      });
    }
    
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  }

  // Botão Voltar ao Topo
  const backToTop = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Animação de Scroll
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .team-member, .blog-post, .pricing-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Configurar elementos para animação
  document.querySelectorAll('.service-card, .portfolio-item, .team-member, .blog-post, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Disparar animação quando a página carrega
  animateOnScroll();
  
  // Disparar animação quando o usuário rola
  window.addEventListener('scroll', animateOnScroll);
});