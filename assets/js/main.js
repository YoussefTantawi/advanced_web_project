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

closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// نموذج التواصل
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // الحصول على القيم من النموذج
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // التحقق من المدخلات
  if (!name || !email || !subject || !message) {
    showFormMessage("Please fill in all fields.", "error");
    return;
  }

  // هنا يمكنك إضافة كود لإرسال البيانات إلى الخادم
  // في هذا المثال سنعرض رسالة نجاح فقط
  showFormMessage(
    "Thank you! Your message has been sent successfully. I will get back to you soon.",
    "success"
  );

  // إعادة تعيين النموذج
  contactForm.reset();
});

function showFormMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = "form-message " + type;

  setTimeout(() => {
    formMessage.style.display = "none";
  }, 5000);
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
});
