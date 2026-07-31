
document.addEventListener('DOMContentLoaded', function () {
  initAnimations();
  initNotesSearch();
  initLoginValidation();
});




function initNotesSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const grid = document.getElementById('papersGrid');
  const noResults = document.getElementById('noResults');


  if (!searchInput || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.paper-card'));

  function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(function (card) {
      const subject = (card.dataset.subject || '').toLowerCase();
      const heading = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const isMatch = query === '' || subject.includes(query) || heading.includes(query);

      card.style.display = isMatch ? '' : 'none';
      if (isMatch) visibleCount++;
    });


    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }


  searchInput.addEventListener('input', filterCards);


  if (searchBtn) {
    searchBtn.addEventListener('click', filterCards);
  }


  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterCards();
    }
  });
}

function initAnimations() {
  injectAnimationStyles();


  const autoFadeSelectors = [
    '.login-card',
    '.welcome-banner',
    '.stat-card',
    '.action-card',
    '.paper-card',
    '.upload-card',
    '.image-slider'
  ];

  const entranceEls = [];
  autoFadeSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('fade-slide-in');
      entranceEls.push(el);
    });
  });


  entranceEls.forEach(function (el, index) {
    el.style.animationDelay = Math.min(index * 60, 480) + 'ms';
  });


  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      entranceEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    });
  });


  const revealTargets = document.querySelectorAll('.paper-card, .stat-card, .action-card');

  if ('IntersectionObserver' in window && revealTargets.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  
  document.querySelectorAll('.sidebar nav ul li a').forEach(function (link) {
    link.classList.add('nav-link-animated');
  });

  
  document.querySelectorAll('.btn-primary, .download-btn, .search-bar button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.remove('pulse-anim'); 
      void btn.offsetWidth; 
      btn.classList.add('pulse-anim');
    });
  });
}

function injectAnimationStyles() {
  if (document.getElementById('animationStyles')) return;

  const style = document.createElement('style');
  style.id = 'animationStyles';
  style.textContent = `
  
    .fade-slide-in {
      opacity: 0;
      transform: translateY(18px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .fade-slide-in.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    
    .nav-link-animated {
      position: relative;
      transition: background 0.2s ease, color 0.2s ease, padding-left 0.2s ease;
    }
    .nav-link-animated:hover {
      padding-left: 18px;
    }

    
    @keyframes pulseAnim {
      0%   { transform: scale(1); }
      40%  { transform: scale(0.94); }
      100% { transform: scale(1); }
    }
    .pulse-anim {
      animation: pulseAnim 0.28s ease;
    }

    
    @keyframes shakeAnim {
      0%, 100% { transform: translateX(0); }
      20%      { transform: translateX(-4px); }
      40%      { transform: translateX(4px); }
      60%      { transform: translateX(-3px); }
      80%      { transform: translateX(3px); }
    }
    .input-error {
      animation: shakeAnim 0.35s ease;
    }

    /* Success message entrance (upload.html) */
    .success-message {
      animation: fadeInUp 0.4s ease;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .fade-slide-in, .pulse-anim, .input-error, .success-message {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}


function initLoginValidation() {
  const form = document.querySelector('.login-card form');
  if (!form) return;

  const emailInput = form.querySelector('#email');
  const passwordInput = form.querySelector('#password');
  if (!emailInput || !passwordInput) return;

  const emailError = createErrorElement(emailInput);
  const passwordError = createErrorElement(passwordInput);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail() {
    const value = emailInput.value.trim();
    if (value === '') {
      showError(emailInput, emailError, 'Student email is required.');
      return false;
    }
    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validatePassword() {
    const value = passwordInput.value;
    if (value === '') {
      showError(passwordInput, passwordError, 'Password is required.');
      return false;
    }
    if (value.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
      return false;
    }
    clearError(passwordInput, passwordError);
    return true;
  }

  emailInput.addEventListener('input', validateEmail);
  emailInput.addEventListener('blur', validateEmail);
  passwordInput.addEventListener('input', validatePassword);
  passwordInput.addEventListener('blur', validatePassword);

  form.addEventListener('submit', function (e) {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      e.preventDefault(); 
    }
  });
}



