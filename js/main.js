document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-hidden').forEach(el => {
        observer.observe(el);
    });

    // Section 4 Spotlight Effect
    const ecoCards = document.querySelectorAll('.ecosystem-card');
    ecoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- NEW LOGIC FROM PROVIDED CODE ---

    // Popup Logic
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closeBtn");
    const submitBtn = document.getElementById("submitBtn");
    const box = overlay ? overlay.querySelector(".popup-box") : null;

    const openBtns = document.querySelectorAll(".open-popup");
    openBtns.forEach(btn => {
        btn.addEventListener("click", () => { 
            if (overlay) overlay.classList.add("active"); 
        });
    });

    function closePopup() {
        if (box) {
            box.classList.add("closing");
            setTimeout(() => {
                overlay.classList.remove("active");
                box.classList.remove("closing");
            }, 600);
        }
    }

    if (closeBtn) closeBtn.onclick = closePopup;
    if (overlay) {
        overlay.onclick = (e) => { 
            if (e.target === overlay) closePopup(); 
        };
    }

    // Phone filtering
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, 10);
        });
    }

    // Form Submission Logic
    if (submitBtn) {
        submitBtn.onclick = async () => {
            let valid = true;

            const name = document.getElementById("name");
            const company = document.getElementById("company");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const msg = document.getElementById("msg");

            const nameErr = document.getElementById("nameErr");
            const companyErr = document.getElementById("companyErr");
            const emailErr = document.getElementById("emailErr");
            const phoneErr = document.getElementById("phoneErr");
            const msgErr = document.getElementById("msgErr");

            const formArea = document.getElementById("formArea");
            const successBox = document.getElementById("successBox");

            document.querySelectorAll(".error-text").forEach(e => e.innerText = "");
            document.querySelectorAll("input, textarea").forEach(e => e.classList.remove("error"));

            if (name.value.trim().length < 2) { name.classList.add("error"); if(nameErr) nameErr.innerText = "Enter valid name"; valid = false; }
            if (company.value.trim().length < 2) { company.classList.add("error"); if(companyErr) companyErr.innerText = "Enter company name"; valid = false; }
            if (!/^\S+@\S+\.\S+$/.test(email.value)) { email.classList.add("error"); if(emailErr) emailErr.innerText = "Enter valid email"; valid = false; }
            if (!/^\d{10}$/.test(phone.value)) { phone.classList.add("error"); if(phoneErr) phoneErr.innerText = "Enter 10 digit number"; valid = false; }
            if (msg.value.trim().length < 10) { msg.classList.add("error"); if(msgErr) msgErr.innerText = "Minimum 10 characters required"; valid = false; }

            if (!valid) return;

            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        access_key: "494784ed-5745-466d-a3f9-da90c37a844b",
                        subject: "New Quote Request — Superior Digital",
                        name: name.value,
                        company: company.value,
                        email: email.value,
                        phone: phone.value,
                        message: msg.value
                    })
                });

                const result = await response.json();

                if (result.success) {
                    if (formArea) formArea.style.display = "none";
                    if (successBox) successBox.classList.add("show");
                    setTimeout(() => {
                        closePopup();
                        if (successBox) successBox.classList.remove("show");
                        if (formArea) formArea.style.display = "block";
                        name.value = company.value = email.value = phone.value = msg.value = "";
                    }, 2000);
                } else {
                    alert("Something went wrong. Please try again.");
                }
            } catch (err) {
                alert("Network error. Please check your connection.");
            } finally {
                submitBtn.innerText = "Send";
                submitBtn.disabled = false;
            }
        };
    }

    // Enhanced video play logic for mobile (handles low power mode and browser restrictions)
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        const playVideo = () => {
            heroVideo.play().catch(() => {
                // If it fails, try again on first interaction
                document.addEventListener('click', () => heroVideo.play(), { once: true });
                document.addEventListener('touchstart', () => heroVideo.play(), { once: true });
            });
        };

        // Attempt play immediately
        playVideo();
        
        // Ensure it stays playing
        heroVideo.addEventListener('pause', () => {
            if (heroVideo.autoplay) playVideo();
        });
    }

    // Initialize AOS with premium settings
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 1200, 
            once: true, 
            mirror: false, 
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            offset: 50 // Reduced offset for mobile
        });
    }
});
