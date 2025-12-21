// ============ MAIN.JS UPDATED - FIXED SUBMIT ISSUE ============

// ============ تهيئة الصفحة ============
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Page loaded successfully!");
    
    // 1. تهيئة النموذج أولاً (هذا هو الأهم)
    initializeFormSubmit();
    
    // 2. تحريك الخلفية المتحركة
    const shapes = document.querySelectorAll(".floating-shapes div");
    if (shapes.length > 0) {
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = index * 5 + "s";
        });
        console.log("✅ Background animation initialized");
    }

    // 3. تعيين سنة التحديث تلقائياً في الفوتر
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
        console.log("✅ Current year set in footer");
    }

    // 4. تحميل الوضع المحفوظ
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        const themeToggleIcon = document.querySelector("#themeToggle i");
        if (themeToggleIcon) {
            themeToggleIcon.classList.remove("fa-moon");
            themeToggleIcon.classList.add("fa-sun");
        }
        console.log("✅ Light mode loaded from localStorage");
    }

    // 5. تشغيل تأثيرات الـ hero
    const heroElements = document.querySelectorAll(
        ".hero-content h1, .hero-content h2, .hero-content p, .hero-btns"
    );
    if (heroElements.length > 0) {
        heroElements.forEach((el, index) => {
            el.style.animationDelay = 0.3 + index * 0.3 + "s";
        });
        console.log("✅ Hero animations initialized");
    }

    // 6. تهيئة تأثيرات الظهور
    initScrollAnimations();
    
    // 7. تحميل البيانات الديناميكية
    loadDynamicData();
    
    console.log("✅ Page initialization completed!");
});

// ============ الحل النهائي لمشكلة Submit ============
function initializeFormSubmit() {
    console.log("🔧 Initializing form submit handler...");
    
    // البحث عن النموذج
    const form = document.getElementById("projectInquiryForm");
    
    if (!form) {
        console.error("❌ ERROR: Form not found! Check if id='projectInquiryForm' exists in HTML");
        return;
    }
    
    console.log("✅ Form found:", form);
    
    // الطريقة الصحيحة: إضافة معالج على النموذج
    form.addEventListener("submit", handleFormSubmit);
    
    // معالج احتياطي للزر
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener("click", function(e) {
            console.log("🖱️ Submit button clicked!");
        });
    }
    
    console.log("✅ Form submit handlers added successfully!");
}

// ============ معالج إرسال النموذج - معدل ============
async function handleFormSubmit(e) {
    console.log("🎯 FORM SUBMIT EVENT FIRED!");
    
    // منع الإرسال الافتراضي
    e.preventDefault();
    e.stopPropagation();
    
    console.log("✅ Default form submission prevented");
    
    // جمع بيانات النموذج
    const formElement = document.getElementById("projectInquiryForm");
    const formData = new FormData(formElement);
    
    // التحقق من الصحة
    const validationData = {
        fullName: formData.get('fullName') || "",
        phoneNumber: formData.get('phoneNumber') || "",
        emailAddress: formData.get('emailAddress') || "",
        projectIdea: formData.get('projectIdea') || "",
        projectDescription: formData.get('projectDescription') || "",
        serviceType: formData.get('serviceType') || ""
    };
    
    console.log("📋 Form data collected:", validationData);
    
    const isValid = validateForm(validationData);
    console.log(`🔍 Form validation: ${isValid ? 'PASSED ✅' : 'FAILED ❌'}`);
    
    if (!isValid) {
        console.log("❌ Validation failed, stopping submission");
        return;
    }
    
    // إظهار حالة التحميل
    const submitBtn = document.querySelector('#projectInquiryForm button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    try {
        // إرسال البيانات إلى الخادم
        console.log("🌐 إرسال البيانات إلى الخادم...");
        
        // إرسال FormData مباشرة (بدون JSON)
        const response = await fetch('backend/handler.php', {
            method: 'POST',
            body: formData
        });
        
        console.log("📥 حالة الاستجابة من الخادم:", response.status);
        
        // قراءة النتيجة كنص
        const resultText = await response.text();
        console.log("📊 نص الاستجابة:", resultText.substring(0, 200) + "...");
        
        // عرض النتيجة للمستخدم
        const messageDiv = document.getElementById("formMessage");
        if (messageDiv) {
            messageDiv.innerHTML = resultText;
            messageDiv.style.display = "block";
            
            // تحديد لون الرسالة بناءً على المحتوى
            if (resultText.includes("Successfully") || 
                resultText.includes("successfully") || 
                resultText.includes("green")) {
                messageDiv.style.color = "#28a745";
                messageDiv.style.borderColor = "#28a745";
                
                // إعادة تعيين النموذج بعد 3 ثواني
                setTimeout(() => {
                    formElement.reset();
                    console.log("🔄 تم إعادة تعيين النموذج");
                    messageDiv.style.display = "none";
                }, 3000);
            } else {
                messageDiv.style.color = "#dc3545";
                messageDiv.style.borderColor = "#dc3545";
            }
        }
        
        console.log("✅ تم إرسال النموذج بنجاح!");
        
    } catch (error) {
        console.error('💥 خطأ في إرسال النموذج:', error);
        
        // عرض رسالة الخطأ
        const messageDiv = document.getElementById("formMessage");
        if (messageDiv) {
            messageDiv.textContent = "❌ حدث خطأ: " + error.message;
            messageDiv.style.color = "#dc3545";
            messageDiv.style.display = "block";
        }
        
    } finally {
        // إعادة تمكين الزر
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        console.log("🔄 تم إعادة تمكين زر الإرسال");
    }
}

// ============ دالة التحقق من الصحة ============
function validateForm(data) {
    let isValid = true;
    
    // مسح رسائل الخطأ السابقة
    document.querySelectorAll(".error-message").forEach((el) => {
        el.textContent = "";
    });
    
    // التحقق من الاسم الكامل
    if (!data.fullName) {
        showFieldError("nameError", "Full name required");
        isValid = false;
    } else if (data.fullName.length < 2) {
        showFieldError("nameError", "The name must be at least two letters long");
        isValid = false;
    }
    
    // التحقق من رقم الهاتف
    if (!data.phoneNumber) {
        showFieldError("phoneError", "Phone number required");
        isValid = false;
    } else if (!/^[\d\s\-\+\(\)]{10,20}$/.test(data.phoneNumber)) {
        showFieldError("phoneError", "Please enter a valid phone number.");
        isValid = false;
    }
    
    // التحقق من البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.emailAddress) {
        showFieldError("emailError", "Email address required");
        isValid = false;
    } else if (!emailRegex.test(data.emailAddress)) {
        showFieldError("emailError", "Please enter a valid email address.");
        isValid = false;
    }
    
    // التحقق من فكرة المشروع
    if (!data.projectIdea) {
        showFieldError("ideaError", "Project idea required");
        isValid = false;
    } else if (data.projectIdea.length < 10) {
        showFieldError("ideaError","Please provide a more detailed project proposal" );
        isValid = false;
    }
    
    // التحقق من وصف المشروع
    if (!data.projectDescription) {
        showFieldError("descriptionError", "Project description required");
        isValid = false;
    } else if (data.projectDescription.length < 20) {
        showFieldError("descriptionError", "Please provide a more detailed description");
        isValid = false;
    }
    
    // التحقق من نوع الخدمة
    if (!data.serviceType) {
        showFieldError("serviceError", "Please select the service type");
        isValid = false;
    }
    
    return isValid;
}

// ============ وظائف مساعدة ============
function showFieldError(fieldId, message) {
    const element = document.getElementById(fieldId);
    if (element) {
        element.textContent = message;
        element.style.color = "#dc3545";
        element.style.fontSize = "14px";
        element.style.marginTop = "5px";
    }
}

function showFormMessage(text, type) {
    const formMessage = document.getElementById("formMessage");
    if (formMessage) {
        formMessage.textContent = text;
        formMessage.className = "form-message " + type;
        formMessage.style.display = "block";
        
        // إخفاء الرسالة بعد 5 ثواني
        setTimeout(() => {
            formMessage.style.opacity = "0";
            setTimeout(() => {
                formMessage.style.display = "none";
                formMessage.style.opacity = "1";
            }, 500);
        }, 5000);
    }
}

// ============ وظائف التنقل ============
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
    menuToggle.addEventListener("click", function () {
        const navLinks = document.querySelector(".nav-links");
        if (navLinks) {
            navLinks.classList.toggle("active");
        }
    });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        const navLinks = document.querySelector(".nav-links");
        if (navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
        }
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

// تحديث رابط التنقل النشط
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
    
    if (scrollHeight > 0) {
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        const progressBar = document.querySelector(".progress-bar");
        if (progressBar) {
            progressBar.style.width = scrollPercent + "%";
        }
    }
});

// ============ تبديل وضع الفاتح/الداكن ============
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");
        const icon = themeToggle.querySelector("i");
        
        if (document.body.classList.contains("light-mode")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
            localStorage.setItem("theme", "light");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
            localStorage.setItem("theme", "dark");
        }
    });
}

// ============ تأثيرات الظهور عند التمرير ============
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                if (entry.target.classList.contains("stat-number")) {
                    const count = parseInt(entry.target.getAttribute("data-count"));
                    animateCounter(entry.target, count);
                }

                if (entry.target.classList.contains("skill-level")) {
                    const level = entry.target.getAttribute("data-level");
                    setTimeout(() => {
                        entry.target.style.width = level + "%";
                    }, 300);
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        ".service-card, .project-card, .timeline-content, .cert-card, .skill-category, .contact-item, .team-card, .tech-category, .service-icon"
    );
    
    if (animatedElements.length > 0) {
        animatedElements.forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            observer.observe(el);
        });
    }

    document.querySelectorAll(".skill-level").forEach((skill) => {
        skill.style.width = "0";
        observer.observe(skill);
    });

    document.querySelectorAll(".stat-number").forEach((stat) => {
        observer.observe(stat);
    });
}

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

// ============ وظائف الصور والوسائط ============
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.querySelector(".close-modal");

if (modal && modalImg) {
    document.querySelectorAll(".view-large").forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const imgSrc = this.closest(".project-card")?.querySelector(".project-image")?.src;
            if (imgSrc) {
                modal.style.display = "block";
                modalImg.src = imgSrc;
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// ============ وسائط الفيديو والصوت ============
function playAudio() {
    const audio = document.getElementById("testimonialAudio");
    if (audio) {
        audio.play().catch(e => {
            alert("يرجى النقر على زر التشغيل في مشغل الصوت");
        });
    }
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

window.addEventListener("click", function (e) {
    const videoModal = document.getElementById("videoModal");
    if (e.target === videoModal) {
        closeIntroVideo();
    }
});

// ============ وظائف إضافية ============
function openTeamMemberProfile(url) {
    window.location.href = url;
}

function resetForm() {
    const form = document.getElementById("projectInquiryForm");
    if (form) {
        form.reset();
        document.querySelectorAll(".error-message").forEach(el => {
            el.textContent = "";
        });
        const formMessage = document.getElementById("formMessage");
        if (formMessage) {
            formMessage.textContent = "";
            formMessage.className = "form-message";
            formMessage.style.display = "none";
        }
    }
}

async function loadDynamicData() {
    try {
        console.log("جاري تحميل البيانات الديناميكية...");
        // يمكنك إضافة كود لتحميل البيانات هنا
    } catch (error) {
        console.error("خطأ في تحميل البيانات الديناميكية:", error);
    }
}

// ============ إعادة تعيين الزر ============
const resetButton = document.querySelector('button[type="reset"]');
if (resetButton) {
    resetButton.addEventListener("click", resetForm);
}

// ============ وظيفة اختبار الاتصال ============
async function testBackendConnection() {
    console.log("🔍 اختبار الاتصال بالخادم...");
    
    try {
        // إنشاء بيانات اختبار
        const testFormData = new FormData();
        testFormData.append('fullName', 'Test User');
        testFormData.append('phoneNumber', '01012345678');
        testFormData.append('emailAddress', 'test@example.com');
        testFormData.append('projectIdea', 'Test Project Idea');
        testFormData.append('projectDescription', 'This is a test description for testing purposes');
        testFormData.append('serviceType', 'web');
        
        const response = await fetch('backend/handler.php', {
            method: 'POST',
            body: testFormData
        });
        
        const resultText = await response.text();
        console.log("✅ نتيجة الاختبار:", resultText.substring(0, 100) + "...");
        
    } catch (error) {
        console.error("❌ فشل اختبار الاتصال:", error);
    }
}

console.log("✅ تم تحميل main.js بنجاح!");


