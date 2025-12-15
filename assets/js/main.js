// تفعيل القائمة المتنقلة
document.querySelector(".menu-toggle").addEventListener("click", function () {
  document.querySelector(".nav-links").classList.toggle("active");
});

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
  });
});

// تأثير التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// تحديث رابط التنقل النشط (من الكود الثاني - فريد)
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// شريط التقدم للتمرير
window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  document.querySelector(".progress-bar").style.width = scrollPercent + "%";
});

// تبديل وضع الفاتح/الداكن
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("light-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});

// تأثير ظهور العناصر عند التمرير
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

      // إذا كان العنصر يحتوي على أرقام للإحصائيات
      if (entry.target.classList.contains("stat-number")) {
        const count = parseInt(entry.target.getAttribute("data-count"));
        animateCounter(entry.target, count);
      }

      // إذا كان العنصر شريط مهارات
      if (entry.target.classList.contains("skill-level")) {
        const level = entry.target.getAttribute("data-level");
        setTimeout(() => {
          entry.target.style.width = level + "%";
        }, 300);
      }
    }
  });
}, observerOptions);

// تطبيق تأثير الظهور على العناصر
document
  .querySelectorAll(
    ".service-card, .project-card, .timeline-content, .cert-card, .skill-category, .contact-item"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });

// تطبيق تأثير على أشرطة المهارات
document.querySelectorAll(".skill-level").forEach((skill) => {
  skill.style.width = "0";
  observer.observe(skill);
});

// تطبيق تأثير على الأرقام الإحصائية
document.querySelectorAll(".stat-number").forEach((stat) => {
  observer.observe(stat);
});

// دالة لتحريك العدادات
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 20);
}

// عرض الصور بالحجم الكامل
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.querySelector(".close-modal");

document.querySelectorAll(".view-large").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const imgSrc =
      this.closest(".project-card").querySelector(".project-image").src;
    modal.style.display = "block";
    modalImg.src = imgSrc;
  });
});

if (closeModal) {
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

// إغلاق النوافذ المنبثقة عند النقر خارجها
window.addEventListener("click", function (e) {
  // للصور
  if (e.target === modal) {
    modal.style.display = "none";
  }
  // للفيديو
  const videoModal = document.getElementById("videoModal");
  if (e.target === videoModal) {
    closeIntroVideo();
  }
});

// نموذج التواصل
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    if (!name || !email || !subject || !message) {
      showFormMessage("Please fill in all fields.", "error");
      return;
    }

    showFormMessage(
      "Thank you! Your message has been sent successfully. I will get back to you soon.",
      "success"
    );

    contactForm.reset();
  });
}

function showFormMessage(text, type) {
  if (formMessage) {
    formMessage.textContent = text;
    formMessage.className = "form-message " + type;

    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  }
}

// تشغيل الفيديو التعريفي (من الكود الثاني - فريد)
function playIntroVideo() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("introVideo");
  if (modal && video) {
    modal.style.display = "block";
    video.play();
  }
}

function closeIntroVideo() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("introVideo");
  if (modal && video) {
    modal.style.display = "none";
    video.pause();
    video.currentTime = 0;
  }
}

// التحكم في الصوت (من الكود الثاني - فريد)
function playAudio() {
  const audio = document.getElementById("testimonialAudio");
  if (audio) audio.play();
}

function pauseAudio() {
  const audio = document.getElementById("testimonialAudio");
  if (audio) audio.pause();
}

function stopAudio() {
  const audio = document.getElementById("testimonialAudio");
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

// تحديث عرض قيمة الميزانية (من الكود الثاني - فريد)
const budgetRange = document.getElementById("budgetRange");
const budgetValue = document.getElementById("budgetValue");

if (budgetRange && budgetValue) {
  budgetRange.addEventListener("input", function () {
    const value = parseInt(this.value);
    budgetValue.textContent = "$" + value.toLocaleString();
  });
}

// معالجة إرسال نموذج الاستفسار عن المشروع (من الكود الثاني - فريد)
const projectInquiryForm = document.getElementById("projectInquiryForm");
if (projectInquiryForm) {
  projectInquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      fullName: document.getElementById("fullName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      emailAddress: document.getElementById("emailAddress").value,
      projectIdea: document.getElementById("projectIdea").value,
      projectDescription: document.getElementById("projectDescription").value,
      serviceType: document.getElementById("serviceType").value,
      budgetRange: document.getElementById("budgetRange").value,
      agreeTerms: document.getElementById("agreeTerms").checked,
    };

    const isValid = validateForm(formData);

    if (isValid) {
      const formMessage = document.getElementById("formMessage");
      formMessage.textContent =
        "Thank you! Your project inquiry has been submitted successfully. We will contact you within 24 hours.";
      formMessage.className = "form-message success";

      setTimeout(() => {
        this.reset();
        if (budgetValue) budgetValue.textContent = "$10,000";
        formMessage.textContent = "";
        formMessage.className = "form-message";
      }, 5000);
    }
  });
}

// دالة التحقق من الصحة (من الكود الثاني - فريد)
function validateForm(data) {
  let isValid = true;

  document.querySelectorAll(".error-message").forEach((el) => {
    el.textContent = "";
  });

  if (!data.fullName.trim()) {
    document.getElementById("nameError").textContent = "Full name is required";
    isValid = false;
  } else if (data.fullName.trim().length < 2) {
    document.getElementById("nameError").textContent =
      "Name must be at least 2 characters";
    isValid = false;
  }

  if (!data.phoneNumber.trim()) {
    document.getElementById("phoneError").textContent =
      "Phone number is required";
    isValid = false;
  } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(data.phoneNumber)) {
    document.getElementById("phoneError").textContent =
      "Please enter a valid phone number";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.emailAddress.trim()) {
    document.getElementById("emailError").textContent =
      "Email address is required";
    isValid = false;
  } else if (!emailRegex.test(data.emailAddress)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email address";
    isValid = false;
  }

  if (!data.projectIdea.trim()) {
    document.getElementById("ideaError").textContent =
      "Project idea is required";
    isValid = false;
  } else if (data.projectIdea.trim().length < 10) {
    document.getElementById("ideaError").textContent =
      "Please provide a more detailed project idea";
    isValid = false;
  }

  if (!data.projectDescription.trim()) {
    document.getElementById("descriptionError").textContent =
      "Project description is required";
    isValid = false;
  } else if (data.projectDescription.trim().length < 20) {
    document.getElementById("descriptionError").textContent =
      "Please provide a more detailed description";
    isValid = false;
  }

  if (!data.serviceType) {
    document.getElementById("serviceError").textContent =
      "Please select a service type";
    isValid = false;
  }

  if (!data.agreeTerms) {
    document.getElementById("termsError").textContent =
      "You must agree to the terms and conditions";
    isValid = false;
  }

  return isValid;
}

// تهيئة الصفحة
document.addEventListener("DOMContentLoaded", function () {
  // تحريك الخلفية المتحركة
  const shapes = document.querySelectorAll(".floating-shapes div");
  shapes.forEach((shape, index) => {
    shape.style.animationDelay = index * 5 + "s";
  });

  // تشغيل تأثيرات الـ hero
  const heroElements = document.querySelectorAll(
    ".hero-content h1, .hero-content h2, .hero-content p, .hero-btns"
  );
  heroElements.forEach((el, index) => {
    el.style.animationDelay = 0.3 + index * 0.3 + "s";
  });

  // تعيين سنة التحديث تلقائياً في الفوتر (من الكود الثاني - فريد)
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

openTeamMemberProfile = function (profilePage) {
  window.location.href = profilePage;
}