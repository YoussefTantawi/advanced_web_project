 // تفعيل القائمة المتنقلة
        document.querySelector('.menu-toggle')?.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
        });

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelector('.nav-links').classList.remove('active');
            });
        });

        // تأثير التمرير السلس
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // تحديث رابط التنقل النشط
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if(pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if(link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // شريط التقدم للتمرير
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            document.querySelector('.progress-bar').style.width = scrollPercent + '%';
        });

        // تبديل وضع الفاتح/الداكن
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });

        // تحميل الوضع المحفوظ
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
        }

        // تأثير ظهور العناصر عند التمرير
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // تطبيق تأثير الظهور على العناصر
        document.querySelectorAll('.service-card, .team-card, .tech-category').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });

        // تشغيل الفيديو التعريفي
        function playIntroVideo() {
            const modal = document.getElementById('videoModal');
            const video = document.getElementById('introVideo');
            modal.style.display = 'block';
            video.play();
        }
        
        function closeIntroVideo() {
            const modal = document.getElementById('videoModal');
            const video = document.getElementById('introVideo');
            modal.style.display = 'none';
            video.pause();
            video.currentTime = 0;
        }
        
        // التحكم في الصوت
        function playAudio() {
            const audio = document.getElementById('testimonialAudio');
            if (audio) audio.play();
        }
        
        function pauseAudio() {
            const audio = document.getElementById('testimonialAudio');
            if (audio) audio.pause();
        }
        
        function stopAudio() {
            const audio = document.getElementById('testimonialAudio');
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
        
        // إغلاق النافذة المنبثقة عند النقر خارجها
        window.onclick = function(event) {
            const modal = document.getElementById('videoModal');
            if (event.target == modal) {
                closeIntroVideo();
            }
        }

        // تحديث عرض قيمة الميزانية
        const budgetRange = document.getElementById('budgetRange');
        const budgetValue = document.getElementById('budgetValue');
        
        if (budgetRange && budgetValue) {
            budgetRange.addEventListener('input', function() {
                const value = parseInt(this.value);
                budgetValue.textContent = '$' + value.toLocaleString();
            });
        }

        // معالجة إرسال النموذج
        document.getElementById('projectInquiryForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = {
                fullName: document.getElementById('fullName').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                emailAddress: document.getElementById('emailAddress').value,
                projectIdea: document.getElementById('projectIdea').value,
                projectDescription: document.getElementById('projectDescription').value,
                serviceType: document.getElementById('serviceType').value,
                budgetRange: document.getElementById('budgetRange').value,
                agreeTerms: document.getElementById('agreeTerms').checked
            };
            
            // التحقق من الصحة
            const isValid = validateForm(formData);
            
            if (isValid) {
                // عرض رسالة النجاح
                const formMessage = document.getElementById('formMessage');
                formMessage.textContent = 'Thank you! Your project inquiry has been submitted successfully. We will contact you within 24 hours.';
                formMessage.className = 'form-message success';
                
                // إعادة تعيين النموذج
                setTimeout(() => {
                    this.reset();
                    budgetValue.textContent = '$10,000';
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);
            }
        });

        // دالة التحقق من الصحة
        function validateForm(data) {
            let isValid = true;
            
            // مسح رسائل الخطأ السابقة
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
            
            // التحقق من الاسم
            if (!data.fullName.trim()) {
                document.getElementById('nameError').textContent = 'Full name is required';
                isValid = false;
            } else if (data.fullName.trim().length < 2) {
                document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
                isValid = false;
            }
            
            // التحقق من الهاتف
            if (!data.phoneNumber.trim()) {
                document.getElementById('phoneError').textContent = 'Phone number is required';
                isValid = false;
            } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(data.phoneNumber)) {
                document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
                isValid = false;
            }
            
            // التحقق من البريد الإلكتروني
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.emailAddress.trim()) {
                document.getElementById('emailError').textContent = 'Email address is required';
                isValid = false;
            } else if (!emailRegex.test(data.emailAddress)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address';
                isValid = false;
            }
            
            // التحقق من فكرة المشروع
            if (!data.projectIdea.trim()) {
                document.getElementById('ideaError').textContent = 'Project idea is required';
                isValid = false;
            } else if (data.projectIdea.trim().length < 10) {
                document.getElementById('ideaError').textContent = 'Please provide a more detailed project idea';
                isValid = false;
            }
            
            // التحقق من وصف المشروع
            if (!data.projectDescription.trim()) {
                document.getElementById('descriptionError').textContent = 'Project description is required';
                isValid = false;
            } else if (data.projectDescription.trim().length < 20) {
                document.getElementById('descriptionError').textContent = 'Please provide a more detailed description';
                isValid = false;
            }
            
            // التحقق من نوع الخدمة
            if (!data.serviceType) {
                document.getElementById('serviceError').textContent = 'Please select a service type';
                isValid = false;
            }
            
            // التحقق من الموافقة على الشروط
            if (!data.agreeTerms) {
                document.getElementById('termsError').textContent = 'You must agree to the terms and conditions';
                isValid = false;
            }
            
            return isValid;
        }

        // تهيئة الصفحة
        document.addEventListener('DOMContentLoaded', function() {
            // تحريك الخلفية المتحركة
            const shapes = document.querySelectorAll('.floating-shapes div');
            shapes.forEach((shape, index) => {
                shape.style.animationDelay = (index * 5) + 's';
            });
            
            // تعيين سنة التحديث تلقائياً في الفوتر
            const yearSpan = document.getElementById('currentYear');
            if (yearSpan) {
                yearSpan.textContent = new Date().getFullYear();
            }
        });