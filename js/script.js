"use strict";

/* =========================================================
   WEB ZONE CENTRAL CONFIGURATION
   CHANGE YOUR DETAILS HERE
========================================================= */

const SITE_CONFIG = {
    brand: "PRIME WEB AGENCY",
    whatsapp: "+916307803618",
    email: "riteshprajapati77399@gmail.com",
    phone: "+918572948718",
    location: "YOUR_LOCATION",
    instagram: "YOUR_INSTAGRAM_URL",
    facebook: "YOUR_FACEBOOK_URL",
    linkedin: "YOUR_LINKEDIN_URL"
};

const WHATSAPP_NUMBER = SITE_CONFIG.whatsapp;

const REVIEW_STORAGE_KEY = "web_zone_reviews_v1";

/* =========================================================
   SAFE HELPERS
========================================================= */

function $(selector, parent = document) {
    try {
        return parent.querySelector(selector);
    } catch {
        return null;
    }
}

function $$(selector, parent = document) {
    try {
        return Array.from(parent.querySelectorAll(selector));
    } catch {
        return [];
    }
}

function safeText(value) {
    return String(value ?? "").trim();
}

function escapeHTML(value) {
    return safeText(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeText(email));
}

function validURL(url) {
    if (!safeText(url)) return false;

    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function showToast(message, type = "success") {
    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    window.clearTimeout(showToast.timer);

    showToast.timer = window.setTimeout(() => {
        toast.className = "toast";
    }, 3500);
}

/* =========================================================
   CONFIGURATION
========================================================= */

function applyConfiguration() {
    $$("[data-config]").forEach((element) => {
        const key = element.dataset.config;

        if (!Object.prototype.hasOwnProperty.call(SITE_CONFIG, key)) {
            return;
        }

        const value = SITE_CONFIG[key];

        if (!value || value.startsWith("YOUR_")) {
            return;
        }

        element.textContent = value;

        if (element.tagName === "A") {
            if (key === "email") {
                element.href = `mailto:${value}`;
            }

            if (key === "phone") {
                element.href = `tel:${value.replace(/\s+/g, "")}`;
            }
        }
    });

    $$("[data-social]").forEach((link) => {
        const key = link.dataset.social;
        const url = SITE_CONFIG[key];

        if (!url || url.startsWith("YOUR_")) {
            link.style.display = "none";
            return;
        }

        if (validURL(url)) {
            link.href = url;
        } else {
            link.style.display = "none";
        }
    });
}

/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {
    const currentPage = document.body?.dataset?.page || "";

    $$("[data-nav]").forEach((link) => {
        if (link.dataset.nav === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    const toggle = $("#mobileToggle");
    const close = $("#mobileClose");
    const menu = $("#mobileMenu");

    if (!toggle || !menu) return;

    function openMenu() {
        menu.classList.add("open");
        menu.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        menu.classList.remove("open");
        menu.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    toggle.addEventListener("click", openMenu);

    if (close) {
        close.addEventListener("click", closeMenu);
    }

    $$(".mobile-links a, .mobile-project-btn", menu).forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    menu.addEventListener("click", (event) => {
        if (event.target === menu) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            closePortfolioModal();
            closeReviewModal();
        }
    });
}

/* =========================================================
   SCROLL PROGRESS + SCROLL TOP
========================================================= */

function setupScroll() {
    const progress = $("#scrollProgress");
    const scrollTop = $("#scrollTop");

    function update() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollHeight > 0
            ? (window.scrollY / scrollHeight) * 100
            : 0;

        if (progress) {
            progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }

        if (scrollTop) {
            scrollTop.classList.toggle("show", window.scrollY > 500);
        }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();

    if (scrollTop) {
        scrollTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

function setupRevealAnimations() {
    const elements = $$(".reveal");

    if (!elements.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    elements.forEach((element) => observer.observe(element));
}

/* =========================================================
   COUNTERS
========================================================= */

function setupCounters() {
    const counters = $$(".counter");

    if (!counters.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        counters.forEach((counter) => {
            counter.textContent =
                `${counter.dataset.target || 0}${counter.dataset.suffix || ""}`;
        });
        return;
    }

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = Number(counter.dataset.target || 0);
            const suffix = counter.dataset.suffix || "";
            const duration = 1300;
            const start = performance.now();

            function animate(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);

                counter.textContent = `${current}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
            currentObserver.unobserve(counter);
        });
    }, {
        threshold: .7
    });

    counters.forEach((counter) => observer.observe(counter));
}

/* =========================================================
   FAQ
========================================================= */

function setupFAQ() {
    $$(".faq-question").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");

            if (!item) return;

            const wasOpen = item.classList.contains("open");

            $$(".faq-item").forEach((faq) => {
                faq.classList.remove("open");

                const faqButton = $(".faq-question", faq);

                if (faqButton) {
                    faqButton.setAttribute("aria-expanded", "false");
                }
            });

            if (!wasOpen) {
                item.classList.add("open");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });
}

/* =========================================================
   DEMO TESTIMONIALS
========================================================= */

const DEMO_TESTIMONIALS = [
    {
        id: "demo-1",
        name: "Aarav Sharma",
        business: "Demo Business",
        rating: 5,
        text: "The website concept feels modern, clean and professional. The structure makes it very easy to understand the business.",
        date: "2026-01-18",
        avatar: "https://i.pravatar.cc/120?img=12"
    },
    {
        id: "demo-2",
        name: "Ananya Verma",
        business: "Demo Studio",
        rating: 5,
        text: "The mobile presentation is excellent and the visual details make the overall experience feel much more premium.",
        date: "2026-02-06",
        avatar: "https://i.pravatar.cc/120?img=47"
    },
    {
        id: "demo-3",
        name: "Rohan Mehta",
        business: "Demo Retail",
        rating: 4,
        text: "A strong example of how a business website can combine attractive design with clear calls to action.",
        date: "2026-03-11",
        avatar: "https://i.pravatar.cc/120?img=33"
    },
    {
        id: "demo-4",
        name: "Priya Kapoor",
        business: "Demo Academy",
        rating: 5,
        text: "The layout is easy to navigate and the sections communicate the service offering clearly.",
        date: "2026-04-22",
        avatar: "https://i.pravatar.cc/120?img=44"
    },
    {
        id: "demo-5",
        name: "Kabir Singh",
        business: "Demo Fitness",
        rating: 5,
        text: "The visual hierarchy is strong and the website feels much more professional than a basic template.",
        date: "2026-05-13",
        avatar: "https://i.pravatar.cc/120?img=15"
    },
    {
        id: "demo-6",
        name: "Neha Gupta",
        business: "Demo Hospitality",
        rating: 4,
        text: "The portfolio presentation is visually impressive and gives a clear idea of what a premium website could look like.",
        date: "2026-06-09",
        avatar: "https://i.pravatar.cc/120?img=49"
    }
];

/* =========================================================
   REVIEW STORAGE
========================================================= */

function getStoredReviews() {
    try {
        const raw = localStorage.getItem(REVIEW_STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((review) => {
            return review &&
                typeof review === "object" &&
                safeText(review.name) &&
                Number(review.rating) >= 1 &&
                Number(review.rating) <= 5 &&
                safeText(review.review) &&
                review.status === "pending";
        });
    } catch {
        return [];
    }
}

function saveReview(review) {
    try {
        const reviews = getStoredReviews();
        reviews.unshift(review);
        localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
        return true;
    } catch {
        return false;
    }
}

function getApprovedReviews() {
    return DEMO_TESTIMONIALS.map((review) => ({
        ...review,
        status: "approved",
        demo: true
    }));
}

function getAllApprovedReviews() {
    return getApprovedReviews();
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Recently";
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    } catch {
        return "Recently";
    }
}

function starHTML(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
}

/* =========================================================
   HOME TESTIMONIALS
========================================================= */

function renderHomeTestimonials() {
    const container = $("#homeTestimonials");

    if (!container) return;

    const reviews = getAllApprovedReviews().slice(0, 3);

    if (!reviews.length) {
        container.innerHTML = "<p>No reviews available.</p>";
        return;
    }

    container.innerHTML = reviews.map((review) => `
        <article class="testimonial-card reveal visible">
            <div class="testimonial-stars" aria-label="${review.rating} out of 5 stars">
                ${starHTML(review.rating)}
            </div>

            <p class="testimonial-text">
                “${escapeHTML(review.text)}”
            </p>

            <div class="testimonial-person">
                <img
                    src="${escapeHTML(review.avatar)}"
                    alt="${escapeHTML(review.name)} avatar"
                    loading="lazy"
                    width="44"
                    height="44"
                    onerror="this.onerror=null;this.src='https://i.pravatar.cc/120?img=1';"
                >

                <div>
                    <strong>
                        ${escapeHTML(review.name)}
                        <span class="demo-tag">DEMO REVIEW</span>
                    </strong>
                    <small>${escapeHTML(review.business)}</small>
                </div>
            </div>
        </article>
    `).join("");
}

/* =========================================================
   REVIEW PAGE
========================================================= */

let visibleReviews = 6;

function renderReviewSummary(reviews) {
    const averageElement = $("#averageRating");
    const totalElement = $("#totalReviews");
    const starsElement = $("#averageStars");

    if (!averageElement || !totalElement || !starsElement) return;

    const total = reviews.length;

    const average = total
        ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / total
        : 0;

    averageElement.textContent = average.toFixed(1);
    totalElement.textContent = String(total);
    starsElement.textContent = starHTML(Math.round(average));

    [1, 2, 3, 4, 5].forEach((rating) => {
        const count = reviews.filter(
            (review) => Number(review.rating) === rating
        ).length;

        const countElement = $(`#rating${rating}`);
        const bar = $(`[data-rating-bar="${rating}"]`);

        if (countElement) {
            countElement.textContent = String(count);
        }

        if (bar) {
            const percentage = total ? (count / total) * 100 : 0;
            bar.style.width = `${percentage}%`;
        }
    });
}

function getFilteredReviews() {
    const ratingFilter = $("#ratingFilter");
    const sort = $("#reviewSort");

    const rating = ratingFilter?.value || "all";
    const sortValue = sort?.value || "newest";

    let reviews = [...getAllApprovedReviews()];

    if (rating !== "all") {
        reviews = reviews.filter(
            (review) => Number(review.rating) === Number(rating)
        );
    }

    if (sortValue === "highest") {
        reviews.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortValue === "lowest") {
        reviews.sort((a, b) => Number(a.rating) - Number(b.rating));
    } else {
        reviews.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    return reviews;
}

function renderReviews() {
    const grid = $("#reviewsGrid");

    if (!grid) return;

    const reviews = getFilteredReviews();
    const visible = reviews.slice(0, visibleReviews);

    renderReviewSummary(getAllApprovedReviews());

    if (!visible.length) {
        grid.innerHTML = `
            <div class="demo-notice" style="grid-column:1/-1">
                <div class="notice-icon">!</div>
                <div>
                    <strong>No approved reviews match this filter.</strong>
                    <p>Try another rating filter.</p>
                </div>
            </div>
        `;

        const loadMore = $("#loadMoreReviews");

        if (loadMore) {
            loadMore.style.display = "none";
        }

        return;
    }

    grid.innerHTML = visible.map((review) => `
        <article class="review-card">
            <div class="review-card-top">

                <div class="review-person">
                    <img
                        class="review-avatar"
                        src="${escapeHTML(review.avatar)}"
                        alt="${escapeHTML(review.name)} avatar"
                        loading="lazy"
                        width="44"
                        height="44"
                        onerror="this.onerror=null;this.src='https://i.pravatar.cc/120?img=1';"
                    >

                    <div>
                        <strong>${escapeHTML(review.name)}</strong>
                        <small>${escapeHTML(review.business)}</small>
                    </div>
                </div>

                <span class="review-date">${formatDate(review.date)}</span>
            </div>

            <div class="rating-stars" aria-label="${review.rating} out of 5 stars">
                ${starHTML(review.rating)}
            </div>

            <p class="review-text">
                “${escapeHTML(review.text)}”
            </p>

            <span class="demo-review-badge">DEMO REVIEW</span>
        </article>
    `).join("");

    const loadMore = $("#loadMoreReviews");

    if (loadMore) {
        loadMore.style.display =
            visibleReviews >= reviews.length ? "none" : "inline-flex";
    }
}

function setupReviewPage() {
    const form = $("#reviewForm");
    const openButton = $("#openReviewForm");
    const modal = $("#reviewModal");
    const closeButton = $("#reviewModalClose");
    const ratingInput = $("#reviewRating");

    if (!modal) return;

    function openModal() {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("menu-open");

        window.setTimeout(() => {
            $("#reviewName")?.focus();
        }, 100);
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("menu-open");
    }

    window.closeReviewModal = closeModal;

    if (openButton) {
        openButton.addEventListener("click", openModal);
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    $$(".rating-input button").forEach((button) => {
        button.addEventListener("click", () => {
            const value = Number(button.dataset.star || 0);

            if (ratingInput) {
                ratingInput.value = String(value);
            }

            $$(".rating-input button").forEach((starButton) => {
                starButton.classList.toggle(
                    "selected",
                    Number(starButton.dataset.star) <= value
                );
            });
        });
    });

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = safeText($("#reviewName")?.value);
            const business = safeText($("#reviewBusiness")?.value) || "Independent";
            const email = safeText($("#reviewEmail")?.value);
            const rating = Number($("#reviewRating")?.value || 0);
            const reviewText = safeText($("#reviewText")?.value);
            const avatar = safeText($("#reviewAvatar")?.value);

            let valid = true;

            function setError(id, message) {
                const error = $(`[data-error-for="${id}"]`);

                if (error) {
                    error.textContent = message;
                }

                if (message) {
                    valid = false;
                }
            }

            $$("[data-error-for]").forEach((element) => {
                element.textContent = "";
            });

            setError("reviewName",
                name.length >= 2 ? "" : "Please enter your name.");

            setError("reviewEmail",
                validEmail(email) ? "" : "Please enter a valid email.");

            setError("reviewRating",
                rating >= 1 && rating <= 5 ? "" : "Please select a rating.");

            setError("reviewText",
                reviewText.length >= 10
                    ? ""
                    : "Please write at least 10 characters.");

            if (avatar && !validURL(avatar)) {
                showToast("The profile image URL is invalid.", "error");
                valid = false;
            }

            if (!valid) {
                showToast("Please correct the highlighted fields.", "error");
                return;
            }

            const review = {
                id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                name,
                business,
                email,
                rating,
                review: reviewText,
                avatar: avatar || "https://i.pravatar.cc/120?img=1",
                date: new Date().toISOString(),
                status: "pending"
            };

            if (!saveReview(review)) {
                showToast("Could not save the review in local storage.", "error");
                return;
            }

            form.reset();

            if (ratingInput) {
                ratingInput.value = "";
            }

            $$(".rating-input button").forEach((button) => {
                button.classList.remove("selected");
            });

            closeModal();

            showToast(
                "Review submitted successfully. It is pending approval in this demo.",
                "success"
            );
        });
    }

    $("#ratingFilter")?.addEventListener("change", () => {
        visibleReviews = 6;
        renderReviews();
    });

    $("#reviewSort")?.addEventListener("change", () => {
        visibleReviews = 6;
        renderReviews();
    });

    $("#loadMoreReviews")?.addEventListener("click", () => {
        visibleReviews += 3;
        renderReviews();
    });

    renderReviews();
}

/* =========================================================
   PORTFOLIO DATA
========================================================= */

const PORTFOLIO_PROJECTS = [
    {
        id: 1,
        name: "Vertex Business",
        category: "Business",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
        description: "A polished corporate business website designed to communicate trust, expertise and services.",
        features: ["Premium hero", "Service sections", "Lead-generation CTAs", "Responsive layout"],
        tech: ["HTML5", "CSS3", "JavaScript", "SEO"]
    },
    {
        id: 2,
        name: "Bright Future Academy",
        category: "School",
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=85",
        description: "A modern school website concept for admissions, facilities, academics and parent enquiries.",
        features: ["Admissions CTA", "Academic sections", "Gallery", "Contact enquiry"],
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive"]
    },
    {
        id: 3,
        name: "Azure Grand Hotel",
        category: "Hotel",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
        description: "An elegant hospitality concept focused on rooms, facilities, visual storytelling and bookings.",
        features: ["Room showcase", "Gallery", "Facilities", "Booking CTA"],
        tech: ["HTML5", "CSS3", "JavaScript", "UI/UX"]
    },
    {
        id: 4,
        name: "Forge Fitness",
        category: "Gym",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
        description: "A high-energy gym website concept with programs, trainers, memberships and conversion-focused sections.",
        features: ["Trainer cards", "Programs", "Membership pricing", "Lead CTA"],
        tech: ["HTML5", "CSS3", "JavaScript", "Animation"]
    },
    {
        id: 5,
        name: "Saffron Table",
        category: "Restaurant",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        description: "A premium restaurant website designed around food imagery, menus and reservation enquiries.",
        features: ["Menu", "Food gallery", "Restaurant story", "Reservation CTA"],
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive"]
    },
    {
        id: 6,
        name: "Nova Commerce",
        category: "E-commerce",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",
        description: "A clean e-commerce storefront concept with product-focused layouts and shopping interactions.",
        features: ["Product cards", "Categories", "Promotional sections", "Responsive storefront"],
        tech: ["HTML5", "CSS3", "JavaScript", "UI/UX"]
    },
    {
        id: 7,
        name: "LaunchPro",
        category: "Landing Page",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
        description: "A conversion-focused landing page concept built around one product and one clear action.",
        features: ["Hero CTA", "Benefits", "Social proof", "Conversion sections"],
        tech: ["HTML5", "CSS3", "JavaScript", "SEO"]
    },
    {
        id: 8,
        name: "CarePlus Hospital",
        category: "Business",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85",
        description: "A healthcare website concept designed for trust, services, departments and appointment enquiries.",
        features: ["Departments", "Doctors", "Services", "Appointment CTA"],
        tech: ["HTML5", "CSS3", "JavaScript", "Accessibility"]
    },
    {
        id: 9,
        name: "Elite Properties",
        category: "Business",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85",
        description: "A real-estate style business concept with property presentation and enquiry pathways.",
        features: ["Property cards", "Search concept", "Agent section", "Contact CTA"],
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive"]
    },
    {
        id: 10,
        name: "Momentum Fitness",
        category: "Gym",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85",
        description: "A clean fitness brand concept focused on programs, trainers and membership conversion.",
        features: ["Program cards", "Trainer section", "Stats", "Pricing"],
        tech: ["HTML5", "CSS3", "JavaScript", "Animation"]
    },
    {
        id: 11,
        name: "Urban Stay",
        category: "Hotel",
        image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=85",
        description: "A modern hotel concept featuring rooms, experiences and premium hospitality visuals.",
        features: ["Room cards", "Experience section", "Gallery", "Contact"],
        tech: ["HTML5", "CSS3", "JavaScript", "UI/UX"]
    },
    {
        id: 12,
        name: "Academia Plus",
        category: "School",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
        description: "A school website concept focused on academic information, campus life and admissions.",
        features: ["Programs", "Campus life", "Achievements", "Enquiry form"],
        tech: ["HTML5", "CSS3", "JavaScript", "SEO"]
    }
];

/* =========================================================
   PORTFOLIO
========================================================= */

let currentPortfolioFilter = "All";

function renderPortfolio(filter = currentPortfolioFilter) {
    const grid = $("#portfolioGrid");

    if (!grid) return;

    currentPortfolioFilter = filter;

    const projects = filter === "All"
        ? PORTFOLIO_PROJECTS
        : PORTFOLIO_PROJECTS.filter(
            (project) => project.category === filter
        );

    if (!projects.length) {
        grid.innerHTML = `
            <div class="demo-notice" style="grid-column:1/-1">
                <div class="notice-icon">!</div>
                <div>
                    <strong>No projects found.</strong>
                    <p>Try another category.</p>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = projects.map((project) => `
        <article class="portfolio-card reveal visible">

            <div class="portfolio-image">
                <img
                    src="${escapeHTML(project.image)}"
                    alt="${escapeHTML(project.name)} website preview"
                    loading="lazy"
                    width="1200"
                    height="960"
                    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';"
                >

                <div class="portfolio-overlay">
                    <button type="button" data-project-view="${project.id}">
                        View Project ↗
                    </button>
                </div>
            </div>

            <div class="portfolio-info">
                <span>${escapeHTML(project.category)}</span>
                <h3>${escapeHTML(project.name)}</h3>
                <p>${escapeHTML(project.description)}</p>

                <div class="portfolio-tech">
                    ${project.tech.map((tech) => `
                        <span>${escapeHTML(tech)}</span>
                    `).join("")}
                </div>

                <div class="portfolio-actions">
                    <button type="button" data-project-view="${project.id}">
                        Details
                    </button>

                    <a href="contact.html?service=Website%20Development">
                        Build Similar
                    </a>
                </div>
            </div>

        </article>
    `).join("");

    $$("[data-project-view]").forEach((button) => {
        button.addEventListener("click", () => {
            const project = PORTFOLIO_PROJECTS.find(
                (item) => String(item.id) === String(button.dataset.projectView)
            );

            if (project) {
                openPortfolioModal(project);
            }
        });
    });
}

function openPortfolioModal(project) {
    const modal = $("#portfolioModal");

    if (!modal || !project) return;

    const image = $("#modalImage");
    const title = $("#modalTitle");
    const category = $("#modalCategory");
    const description = $("#modalDescription");
    const features = $("#modalFeatures");
    const tech = $("#modalTech");

    if (image) {
        image.src = project.image;
        image.alt = `${project.name} project preview`;
    }

    if (title) title.textContent = project.name;
    if (category) category.textContent = project.category;
    if (description) description.textContent = project.description;

    if (features) {
        features.innerHTML = project.features.map(
            (feature) => `<li>${escapeHTML(feature)}</li>`
        ).join("");
    }

    if (tech) {
        tech.innerHTML = project.tech.map(
            (item) => `<span>${escapeHTML(item)}</span>`
        ).join("");
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
}

function closePortfolioModal() {
    const modal = $("#portfolioModal");

    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
}

function setupPortfolio() {
    const grid = $("#portfolioGrid");

    if (!grid) return;

    window.closePortfolioModal = closePortfolioModal;

    $$(".filter-btn").forEach((button) => {
        button.addEventListener("click", () => {
            $$(".filter-btn").forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderPortfolio(button.dataset.filter || "All");
        });
    });

    $("#modalClose")?.addEventListener("click", closePortfolioModal);
    $("#modalBottomClose")?.addEventListener("click", closePortfolioModal);

    $("#portfolioModal")?.addEventListener("click", (event) => {
        if (event.target.id === "portfolioModal") {
            closePortfolioModal();
        }
    });

    renderPortfolio();
}

/* =========================================================
   CONTACT FORM
========================================================= */

function cleanWhatsappNumber(number) {
    return safeText(number).replace(/[^\d]/g, "");
}

function createWhatsappURL(message) {
    const number = cleanWhatsappNumber(WHATSAPP_NUMBER);

    if (!number || number.length < 8) {
        return null;
    }

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function setupContact() {
    const form = $("#contactForm");

    if (!form) return;

    const serviceSelect = $("#serviceSelect");

    try {
        const params = new URLSearchParams(window.location.search);
        const service = params.get("service");

        if (service && serviceSelect) {
            const exists = Array.from(serviceSelect.options).some(
                (option) => option.value === service || option.textContent === service
            );

            if (exists) {
                serviceSelect.value = service;
            }
        }
    } catch {
        /* Ignore malformed URL parameters safely. */
    }

    const directWhatsapp = $("#directWhatsapp");

    if (directWhatsapp) {
        const url = createWhatsappURL(
            "Hello WEB ZONE, I would like to discuss a website project."
        );

        if (url) {
            directWhatsapp.href = url;
            directWhatsapp.target = "_blank";
            directWhatsapp.rel = "noopener";
        } else {
            directWhatsapp.addEventListener("click", (event) => {
                event.preventDefault();
                showToast(
                    "Please configure SITE_CONFIG.whatsapp in js/script.js first.",
                    "error"
                );
            });
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = safeText($("#contactName")?.value);
        const email = safeText($("#contactEmail")?.value);
        const phone = safeText($("#contactPhone")?.value);
        const business = safeText($("#businessName")?.value);
        const service = safeText($("#serviceSelect")?.value);
        const budget = safeText($("#budgetSelect")?.value);
        const message = safeText($("#contactMessage")?.value);

        let valid = true;

        function setError(id, messageText) {
            const error = $(`[data-error-for="${id}"]`);

            if (error) {
                error.textContent = messageText;
            }

            if (messageText) {
                valid = false;
            }
        }

        $$("[data-error-for]").forEach((element) => {
            element.textContent = "";
        });

        setError(
            "contactName",
            name.length >= 2 ? "" : "Please enter your name."
        );

        setError(
            "contactEmail",
            validEmail(email) ? "" : "Please enter a valid email."
        );

        setError(
            "serviceSelect",
            service ? "" : "Please select a service."
        );

        setError(
            "contactMessage",
            message.length >= 10
                ? ""
                : "Please describe your project in at least 10 characters."
        );

        if (!valid) {
            showToast("Please correct the highlighted fields.", "error");
            return;
        }

        const whatsappMessage = [
            `Hello WEB ZONE!`,
            ``,
            `I would like to discuss a website project.`,
            ``,
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "Not provided"}`,
            `Business: ${business || "Not provided"}`,
            `Service: ${service}`,
            `Budget: ${budget || "Not specified"}`,
            ``,
            `Project Details:`,
            message
        ].join("\n");

        const whatsappURL = createWhatsappURL(whatsappMessage);

        if (!whatsappURL) {
            showToast(
                "Please configure SITE_CONFIG.whatsapp in js/script.js first.",
                "error"
            );
            return;
        }

        showToast("Opening WhatsApp with your project enquiry.", "success");

        window.setTimeout(() => {
            window.open(whatsappURL, "_blank", "noopener,noreferrer");
        }, 350);

        form.reset();
    });
}

/* =========================================================
   MOUSE FOLLOW MICRO-INTERACTION
========================================================= */

function setupMouseInteraction() {
    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches
    ) {
        return;
    }

    const hero = $(".hero");

    if (!hero) return;

    hero.addEventListener("pointermove", (event) => {
        const rect = hero.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width - .5) * 10;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 10;

        const blobs = $$(".gradient-blob", hero);

        blobs.forEach((blob, index) => {
            const factor = index === 0 ? 1 : -0.7;

            blob.style.transform =
                `translate3d(${x * factor}px, ${y * factor}px, 0)`;
        });
    });
}

/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    applyConfiguration();
    setupNavigation();
    setupScroll();
    setupRevealAnimations();
    setupCounters();
    setupFAQ();
    setupMouseInteraction();

    renderHomeTestimonials();

    setupPortfolio();
    setupReviewPage();
    setupContact();
});
