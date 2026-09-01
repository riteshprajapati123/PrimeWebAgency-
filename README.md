# PRIME WEB AGENCY

Premium personal web developer / web development agency portfolio.

PRIME WEB AGENCY is a static frontend website built using:

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts CDN
- Unsplash images

No React, Next.js, Vue, Angular, TypeScript, Bootstrap, Tailwind, PHP, Node.js, Firebase or jQuery is required.

---

## PROJECT STRUCTURE

web-zone/
│
├── index.html
├── about.html
├── services.html
├── maintenance.html
├── portfolio.html
├── reviews.html
├── contact.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logo/
│
└── README.md

---

# INSTALLATION

## 1. Create the project folder

Create a folder named:

web-zone

---

## 2. Create the HTML files

Inside the web-zone folder create:

index.html
about.html
services.html
maintenance.html
portfolio.html
reviews.html
contact.html

---

## 3. Create CSS folder

Create:

css

Inside css create:

style.css

---

## 4. Create JavaScript folder

Create:

js

Inside js create:

script.js

---

## 5. Create assets folders

Create:

assets/images
assets/icons
assets/logo

These folders can be used later for your own local assets.

The current website uses remote Unsplash images.

---

# RUNNING THE WEBSITE

## VS CODE

Open the `web-zone` folder in Visual Studio Code.

Install the extension:

Live Server

Then:

1. Open `index.html`
2. Right-click
3. Select "Open with Live Server"

The website should open in your browser.

---

# IMPORTANT: CHANGE YOUR CONTACT DETAILS

Open:

js/script.js

At the top you will find:

const SITE_CONFIG = {
    brand: "PRIME WEB AGENCY",
    whatsapp: "YOUR_WHATSAPP_NUMBER",
    email: "YOUR_EMAIL",
    phone: "YOUR_PHONE",
    location: "YOUR_LOCATION",
    instagram: "YOUR_INSTAGRAM_URL",
    facebook: "YOUR_FACEBOOK_URL",
    linkedin: "YOUR_LINKEDIN_URL"
};

Change these values.

Example:

const SITE_CONFIG = {
    brand: "PRIME WEB AGENCY",
    whatsapp: "919876543210",
    email: "hello@example.com",
    phone: "+91 98765 43210",
    location: "Lucknow, Uttar Pradesh, India",
    instagram: "https://instagram.com/yourusername",
    facebook: "https://facebook.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername"
};

Do not add spaces to the WhatsApp number.

For an Indian number use the country code:

91

Example:

919876543210

---

# CHANGE BRAND NAME

The main JavaScript configuration contains:

brand: "PRIME WEB AGENCY"

The visible HTML logo also contains:

PRIME WEB AGENCY

If you want to completely rebrand the website, replace the visible logo text in the HTML files as well.

---

# CHANGE LOGO

The current logo is an inline SVG.

The SVG is located inside:

.brand-mark

You can replace the SVG code in the HTML files with your own logo SVG.

The favicon is also an inline SVG inside the `<head>` section.

---

# CHANGE IMAGES

The website currently uses Unsplash image URLs.

Search for:

images.unsplash.com

You can replace those URLs with:

1. Unsplash images
2. Pexels images
3. Your own local images

For local images, create:

assets/images/

Then use:

assets/images/my-image.jpg

Every image should have useful alt text.

---

# PORTFOLIO PROJECTS

Portfolio projects are stored inside:

js/script.js

Search for:

const PORTFOLIO_PROJECTS = [

Each project contains:

id
name
category
image
description
features
tech

Example structure:

{
    id: 1,
    name: "My Business Website",
    category: "Business",
    image: "image-url",
    description: "Project description.",
    features: [
        "Responsive design",
        "SEO structure",
        "Contact CTA"
    ],
    tech: [
        "HTML5",
        "CSS3",
        "JavaScript"
    ]
}

Supported categories:

All
Business
School
Hotel
Gym
Restaurant
E-commerce
Landing Page

---

# PRICES

Prices appear in:

index.html
services.html
maintenance.html

Search for:

₹4,999+
₹9,999+
₹19,999+

and change them according to your actual pricing.

---

# SERVICES

Services are listed in:

services.html

Current services include:

Business Website
Portfolio Website
Landing Page
E-commerce Website
School Website
Hospital Website
Hotel Website
Gym Website
Restaurant Website
Website Redesign
SEO Optimization
Website Maintenance

---

# CONTACT FORM

The contact form is located in:

contact.html

The JavaScript functionality is in:

js/script.js

The form:

1. Validates name
2. Validates email
3. Validates service
4. Validates message
5. Creates a formatted WhatsApp message
6. Opens WhatsApp

No PHP backend is required.

---

# WHATSAPP

The WhatsApp number is controlled from ONE variable:

const WHATSAPP_NUMBER = SITE_CONFIG.whatsapp;

Do not repeat your WhatsApp number throughout the JavaScript.

Change the number inside:

SITE_CONFIG

Only.

---

# REVIEW SYSTEM

The review system is a frontend demo system.

It uses:

localStorage

Reviews submitted by visitors are stored locally in their browser.

A submitted review gets:

status: "pending"

Example:

{
    status: "pending"
}

Only approved reviews would normally be displayed.

The current demo testimonials are predefined with:

status: "approved"

These are clearly labelled:

DEMO REVIEW

They are not real customer testimonials.

---

# REVIEW STORAGE

The storage key is:

web_zone_reviews_v1

You can inspect stored reviews using browser developer tools:

Application
→ Local Storage
→ Your website
→ web_zone_reviews_v1

---

# REVIEW MODERATION

This static version intentionally does not pretend to provide real cloud moderation.

Submitted reviews remain pending.

For a production version, connect the review system to:

Firebase
Supabase
PHP/MySQL
Node.js
or another backend.

Then create:

Admin login
Review moderation
Approve
Reject
Delete
Edit
Spam protection

The current localStorage version is only for frontend demonstration.

---

# REVIEW RESET

To clear local demo reviews:

Open browser Developer Tools.

Go to:

Application
→ Local Storage

Delete:

web_zone_reviews_v1

The seeded demo testimonials will still remain because they are part of the frontend demo data.

---

# FAQ

FAQ functionality is inside:

js/script.js

FAQ HTML is inside:

index.html

Additional FAQ questions can be added by copying the existing FAQ item structure.

---

# PORTFOLIO FILTER

Portfolio filtering works with:

data-filter

Supported filters:

All
Business
School
Hotel
Gym
Restaurant
E-commerce
Landing Page

---

# PORTFOLIO MODAL

Clicking:

Details

or:

View Project

opens a project modal.

The modal displays:

Project name
Category
Large image
Description
Features
Technologies
Contact button
Close button

---

# MOBILE MENU

The mobile menu supports:

Open
Close
Close button
Close after navigation
Close when clicking outside
Escape key
Scroll locking

The navigation automatically highlights the current page.

---

# RESPONSIVE DESIGN

The website is designed for:

320px
375px
425px
768px
900px
1024px
1440px
1920px

The CSS prevents horizontal page overflow.

---

# ACCESSIBILITY

The website includes:

Semantic HTML
Labels
Keyboard focus states
ARIA attributes
Accessible buttons
Accessible forms
Alt text
Reduced motion support

---

# REDUCED MOTION

The CSS supports:

prefers-reduced-motion

Users who prefer reduced motion will receive simplified animations.

---

# PERFORMANCE

The website intentionally uses minimal dependencies.

Images other than critical hero imagery use:

loading="lazy"

Animations use mostly:

transform
opacity

These properties are generally more performance-friendly than animating layout-heavy properties.

---

# SEO

Every page contains:

Unique title
Meta description
Keywords
H1
H2
H3
Semantic HTML
Image alt text
Open Graph metadata

Before publishing, replace the generic metadata with your actual:

Business description
Location
Target keywords
Social profile
Domain

---

# BEFORE PUBLISHING

Replace:

YOUR_WHATSAPP_NUMBER
YOUR_EMAIL
YOUR_PHONE
YOUR_LOCATION
YOUR_INSTAGRAM_URL
YOUR_FACEBOOK_URL
YOUR_LINKEDIN_URL

Replace demo testimonials with real testimonials.

Replace demo portfolio projects with actual work.

Replace placeholder statistics with truthful numbers.

Replace remote images with your own project images if desired.

Check all social links.

Test the WhatsApp number.

Test every navigation link.

---

# IMPORTANT

The portfolio and testimonials included in this project are demonstration content.

Do not present demo projects or demo testimonials as real client work.

Replace them with genuine work and genuine customer feedback before using the website commercially.

---

# PRODUCTION BACKEND

This version is intentionally frontend-only.

It does not include:

PHP
Node.js
Firebase
Supabase
MySQL
Authentication
Admin dashboard
Cloud database

Those can be connected later when a backend is required.

---

# TECHNOLOGY

Frontend:

HTML5
CSS3
Vanilla JavaScript

External resources:

Google Fonts
Unsplash image URLs

No framework is required.

---

# LICENSE

This project is intended as a customizable portfolio/agency website starter for PRIME WEB AGENCY.

Replace branding, content, images, testimonials and contact information with your own information before commercial deployment.