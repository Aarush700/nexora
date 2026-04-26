document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ===== MOBILE MENU =====
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#enquiry-form') {
        if (href === '#enquiry-form') {
          e.preventDefault();
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== OPEN FORM WITH PACKAGE PRE-SELECTED =====
  window.openForm = function(packageValue) {
    // Scroll to contact section
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Pre-select package radio
    setTimeout(() => {
      const radios = document.querySelectorAll('.pill-radio');
      radios.forEach(radio => {
        if (radio.value === packageValue) {
          radio.checked = true;
        }
      });
    }, 500);
  };

  // ===== FORM SUBMISSION (FormSubmit.co) =====
  const form = document.getElementById('enquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const formStatus = document.getElementById('formStatus');
  const formCard = document.getElementById('formCard');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate package selection
      const selectedPkg = document.querySelector('.pill-radio:checked');
      if (!selectedPkg) {
        alert('Please select a package that interests you.');
        return;
      }

      // Disable & show loading
      submitBtn.disabled = true;
      submitText.innerHTML = '<span class="spinner"></span> Sending...';

      const formData = new FormData(form);
      formData.set('package', selectedPkg.value);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formCard.style.display = 'none';
          formStatus.className = 'form-status form-status--success';
          formStatus.innerHTML = `
            <div class="form-status__icon">✅</div>
            <div class="form-status__title">Thank you!</div>
            <div class="form-status__msg">We've received your enquiry and will get back to you within 24 hours.</div>
          `;
          form.reset();
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        formStatus.className = 'form-status form-status--error';
        formStatus.innerHTML = `
          <div class="form-status__icon">❌</div>
          <div class="form-status__title">Something went wrong</div>
          <div class="form-status__msg">Please try again or DM us on Instagram.</div>
        `;
      } finally {
        submitBtn.disabled = false;
        submitText.textContent = 'Submit Enquiry';
      }
    });
  }

  // ===== SCROLL REVEAL ANIMATIONS =====
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = current + suffix;
        }, 30);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

});
