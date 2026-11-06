
/* Nav bar Menu - single robust toggle */
function toggleMenu() {
    var navLinks = document.getElementById('nav-links');
    var menuIcon = document.getElementById('menu-icon');
    if (!navLinks) return;

    var isOpen = navLinks.classList.toggle('active');

    // update aria-expanded on icon if present
    if (menuIcon) {
        var expanded = isOpen ? 'true' : 'false';
        menuIcon.setAttribute('aria-expanded', expanded);
    }

    // If open, focus first link for accessibility
    if (isOpen) {
        var firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
    }
}

// Close the mobile menu when a nav link is clicked (use event delegation)
document.addEventListener('click', function (e) {
    var navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    // if the clicked element or its ancestor is a toggle-btn (submenu opener), ignore here
    var clickedToggle = e.target.closest && e.target.closest('.toggle-btn');
    if (clickedToggle) return;

    // if a link inside nav-links was clicked (non-submenu toggle), close the menu on small screens
    var clickedLink = e.target.closest && e.target.closest('a');
    if (navLinks.contains(e.target) && clickedLink && window.innerWidth <= 600) {
        // Only close if the link is a real navigation (href not 'javascript:void(0)')
        var href = clickedLink.getAttribute('href');
        if (href && href.trim() !== '' && href.indexOf('javascript:') !== 0) {
            navLinks.classList.remove('active');
            var menuIcon = document.getElementById('menu-icon');
            if (menuIcon) menuIcon.setAttribute('aria-expanded', 'false');
        }
    }
});

// Sub-menu toggle for mobile: tap .toggle-btn to open/close submenus
document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.toggle-btn');
    if (btn) {
        e.preventDefault();
        var parent = btn.closest('.menu-item');
        if (!parent) return;
        parent.classList.toggle('open');
    }
});

// Tablet touch fallback: make parent menu links act like toggles on first tap
(function () {
    function isTouch() {
        return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    }

    if (!isTouch()) return;

    document.addEventListener('click', function (e) {
        // only run on tablet widths
        if (window.innerWidth < 601 || window.innerWidth > 1024) return;

        var link = e.target.closest && e.target.closest('.menu-item-has-children > a');
        if (!link) return;

        var parent = link.parentElement;
        if (!parent) return;

        // If submenu is not open, open it and prevent navigation on first tap
        if (!parent.classList.contains('open')) {
            e.preventDefault();
            // close other open siblings for a clean UX
            var siblings = parent.parentElement.querySelectorAll('.menu-item-has-children.open');
            siblings.forEach(function (s) {
                if (s !== parent) s.classList.remove('open');
            });
            parent.classList.add('open');
            // update aria if toggles present
            var menuIcon = document.getElementById('menu-icon');
            if (menuIcon) menuIcon.setAttribute('aria-expanded', 'true');
        }
        // if already open, allow the tap to navigate normally
    });
})();

// keyboard support for menu-icon (Enter / Space)
document.addEventListener('keydown', function (e) {
    var menuIcon = document.getElementById('menu-icon');
    if (!menuIcon) return;
    if (document.activeElement === menuIcon && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        toggleMenu();
    }
});
// Desktop View: Show Panel on Hover (guarded)
var projectsEl = document.querySelector(".projects");
if (projectsEl) {
    projectsEl.addEventListener("mouseenter", function () {
        if (window.innerWidth > 600) {
            var desktopPanel = document.getElementById("desktop-panel");
            if (desktopPanel) desktopPanel.style.display = "flex";
        }
    });

    projectsEl.addEventListener("mouseleave", function () {
        if (window.innerWidth > 600) {
            var desktopPanel = document.getElementById("desktop-panel");
            if (desktopPanel) desktopPanel.style.display = "none";
        }
    });
}

    /*Interactivity to determine when an animated element in in view. In view elements trigger our animation*/
    document.addEventListener('DOMContentLoaded', function () {
        var animation_elements = document.querySelectorAll('.animation-element');

        function check_if_in_view() {
            var window_height = window.innerHeight;
            var window_top_position = window.pageYOffset || document.documentElement.scrollTop;
            var window_bottom_position = (window_top_position + window_height);

            animation_elements.forEach(function (element) {
                var rect = element.getBoundingClientRect();
                var element_top_position = rect.top + window_top_position;
                var element_height = rect.height;
                var element_bottom_position = element_top_position + element_height;

                if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
                    element.classList.add('in-view');
                } else {
                    element.classList.remove('in-view');
                }
            });
        }

        window.addEventListener('scroll', check_if_in_view);
        window.addEventListener('resize', check_if_in_view);
        // Initial check
        check_if_in_view();
    });

// ✅ Mobile View: Toggle Sub-Projects List (Fixed)
function toggleSubProjects(event, subId) {
    event.stopPropagation();

    let subProducts = document.getElementById(subId);

    // Toggle sub-projects visibility
    if (subProducts.style.display === "block") {
        subProducts.style.display = "none";
    } else {
        subProducts.style.display = "block";
    }
}

/*Dropdown */

document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (event) {
            const submenu = this.querySelector(".submenu");
            if (submenu) {
                submenu.style.display = submenu.style.display === "block" ? "none" : "block";
            }
            event.stopPropagation();
        });
    });

    // Close dropdowns if clicking anywhere outside
    document.addEventListener("click", function (event) {
        dropdowns.forEach(dropdown => {
            const submenu = dropdown.querySelector(".submenu");
            if (submenu && !dropdown.contains(event.target)) {
                submenu.style.display = "none";
            }
        });
    });
});

// Enable click-based dropdown for mobile and tablet
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function () {
        this.parentElement.classList.toggle('active');
    });
});


/* carousel home page - make idempotent to avoid errors if script is loaded twice */
if (!window.__carousel_initialized) {
    window.__carousel_initialized = true;
    window.__carousel_currentIndex = window.__carousel_currentIndex || 0;

    function showSlide(index) {
        const slides = document.querySelectorAll('.carousel-item');
        const dots = document.querySelectorAll('.dot');
        if (!slides || slides.length === 0) return;

        if (index >= slides.length) {
            window.__carousel_currentIndex = 0;
        } else if (index < 0) {
            window.__carousel_currentIndex = slides.length - 1;
        } else {
            window.__carousel_currentIndex = index;
        }

        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
            if (dots && dots[i]) dots[i].classList.remove('active');
        }

        slides[window.__carousel_currentIndex].classList.add('active');
        if (dots && dots[window.__carousel_currentIndex]) dots[window.__carousel_currentIndex].classList.add('active');
    }

    function nextSlide() {
        showSlide(window.__carousel_currentIndex + 1);
    }

    function currentSlide(index) {
        showSlide(index - 1);
    }

    setInterval(nextSlide, 3000); // Automatic play every 3 seconds

    // Initialize the first slide
    try { showSlide(window.__carousel_currentIndex); } catch (e) { /* ignore */ }
}


/* Demo purposes only div hover effect (vanilla JS) */
document.querySelectorAll('.hover').forEach(function(el) {
    el.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
    });
});














document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".sd-main-Slider");
    const slides = document.querySelectorAll(".sd-slide-wrapper");
    if (!slider || slides.length === 0) return;

    let currentIndex = 0;

    function moveToNextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    function updateSlider() {
        const offset = -currentIndex * 100;
        slider.style.transform = `translateX(${offset}%)`;
    }

    // Auto-slide every 3 seconds
    setInterval(moveToNextSlide, 3000);
});

/* navbar pannel */




/*nested sub menu start*/

document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            let parentItem = this.parentElement;

            // Sirf jis item pe click ho raha hai, wahi toggle hoga
            if (parentItem.classList.contains("active")) {
                parentItem.classList.remove("active");
            } else {
                // Kisi aur item ko close nahi karna
                parentItem.classList.add("active");
            }
        });
    });

    // **Click outside se menu close NAHI hoga**
});

/* nested sub menu end*/


/*panel start*/

document.addEventListener("DOMContentLoaded", function () {
    const categoryToggle = document.querySelector(".dropdown-toggle");
    const categoryPanel = document.querySelector(".category-panel");
    const categories = document.querySelectorAll(".main-categories .category");
    const subCategories = document.querySelectorAll(".sub-category");

    // Toggle category panel on click
    categoryToggle.addEventListener("click", function (event) {
        event.preventDefault();
        categoryPanel.classList.toggle("active");
    });

    // Close panel when clicking outside
    document.addEventListener("click", function (event) {
        if (!categoryToggle.contains(event.target) && !categoryPanel.contains(event.target)) {
            categoryPanel.classList.remove("active");
        }
    });

    // Show sub-categories when clicking a main category
    categories.forEach(category => {
        category.addEventListener("click", function () {
            let selectedCategory = this.getAttribute("data-category");

            subCategories.forEach(sub => {
                sub.style.display = sub.classList.contains(selectedCategory) ? "grid" : "none";
            });

            categories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Show sub-categories when clicking a main category
    categories.forEach(category => {
        category.addEventListener("click", function () {
            let selectedCategory = this.getAttribute("data-category");

            subCategories.forEach(sub => {
                if (selectedCategory === "all") {
                    sub.style.display = "grid";
                } else if (sub.classList.contains(selectedCategory)) {
                    sub.style.display = "grid";
                } else {
                    sub.style.display = "none";
                }
            });

            // Remove active class from all categories and add to clicked one
            categories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const comingSoonItems = document.querySelectorAll(".coming-soon a");

    comingSoonItems.forEach(item => {
        item.addEventListener("click", function (event) {
            event.preventDefault(); // Prevents navigation
            alert("This category is !");
        });
    });
});

/*panel end*/


// Removed a global Swiper init here. Initialization is handled centrally below

const mobileProductPurchaseRows = new Map();

function getProductDetailPriceElement(productInfo) {
    const productPrice = productInfo.querySelector(".product-price");
    if (productPrice) return productPrice;

    const price = productInfo.querySelector(".price-large, #price");
    if (!price) return null;

    let element = price;
    while (element.parentElement && element.parentElement !== productInfo) {
        element = element.parentElement;
    }
    return element.parentElement === productInfo ? element : null;
}

function updateMobileProductPurchaseRows() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        document.querySelectorAll(".product-info").forEach(function (productInfo) {
            if (mobileProductPurchaseRows.has(productInfo)) return;

            const priceElement = getProductDetailPriceElement(productInfo);
            const quantityContainer = productInfo.querySelector(".quantity-container");
            if (!priceElement || !quantityContainer) return;

            const quantityLabel = quantityContainer.previousElementSibling;
            const hasQuantityLabel = quantityLabel &&
                (quantityLabel.matches("label, lable, h3") ||
                    quantityLabel.classList.contains("form__label"));
            const pricePlaceholder = document.createComment("product price position");
            const quantityPlaceholder = document.createComment("product quantity position");
            const quantityLabelPlaceholder = hasQuantityLabel
                ? document.createComment("product quantity label position")
                : null;
            const purchaseRow = document.createElement("div");
            const quantityGroup = document.createElement("div");

            purchaseRow.className = "product-purchase-row";
            priceElement.classList.add("product-purchase-price");
            quantityGroup.className = "product-purchase-quantity";

            priceElement.parentNode.insertBefore(pricePlaceholder, priceElement);
            priceElement.parentNode.insertBefore(purchaseRow, priceElement);
            purchaseRow.appendChild(priceElement);

            if (hasQuantityLabel) {
                quantityLabel.parentNode.insertBefore(quantityLabelPlaceholder, quantityLabel);
                quantityGroup.appendChild(quantityLabel);
            }
            quantityContainer.parentNode.insertBefore(quantityPlaceholder, quantityContainer);
            quantityGroup.appendChild(quantityContainer);
            purchaseRow.appendChild(quantityGroup);

            mobileProductPurchaseRows.set(productInfo, {
                priceElement,
                pricePlaceholder,
                quantityContainer,
                quantityPlaceholder,
                quantityLabel: hasQuantityLabel ? quantityLabel : null,
                quantityLabelPlaceholder,
                purchaseRow
            });
        });
        return;
    }

    mobileProductPurchaseRows.forEach(function (elements, productInfo) {
        elements.pricePlaceholder.parentNode.replaceChild(elements.priceElement, elements.pricePlaceholder);
        elements.quantityPlaceholder.parentNode.replaceChild(elements.quantityContainer, elements.quantityPlaceholder);
        if (elements.quantityLabel) {
            elements.quantityLabelPlaceholder.parentNode.replaceChild(
                elements.quantityLabel,
                elements.quantityLabelPlaceholder
            );
        }
        elements.priceElement.classList.remove("product-purchase-price");
        elements.purchaseRow.remove();
        mobileProductPurchaseRows.delete(productInfo);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateMobileProductPurchaseRows);
} else {
    updateMobileProductPurchaseRows();
}
window.addEventListener("resize", updateMobileProductPurchaseRows);
const mobileProductPurchaseMedia = window.matchMedia("(max-width: 768px)");
if (mobileProductPurchaseMedia.addEventListener) {
    mobileProductPurchaseMedia.addEventListener("change", updateMobileProductPurchaseRows);
} else {
    mobileProductPurchaseMedia.addListener(updateMobileProductPurchaseRows);
}

function updatePrice(size) {
    if (typeof sizePrices === "undefined") {
        console.error("Product size prices are not configured for this page.");
        return;
    }

    updateProductDetailPrice(size, sizePrices);
}

function updateProductDetailPrice(size, prices) {
    var productInfo = document.querySelector(".product-info");
    if (!productInfo) return;

    var priceData = prices[size];
    if (priceData === undefined) return;

    var price = typeof priceData === "object" ? priceData.price : priceData;
    var mrp = typeof priceData === "object" ? priceData.mrp : priceData;
    if (price === undefined || mrp === undefined) return;

    var priceElement = productInfo.querySelector("#price, #productPrice");
    var mrpElement = productInfo.querySelector("#mrp");
    var selectedSize = productInfo.querySelector("#selected-size");
    var sizeOptions = productInfo.querySelectorAll(".size-selector .size-btn, .size-container .size-option");

    if (priceElement) {
        setProductDetailPriceText(priceElement, price);
    }
    if (mrpElement) {
        setProductDetailPriceText(mrpElement, mrp);
    }
    if (selectedSize) selectedSize.textContent = "Size: " + size;

    sizeOptions.forEach(function (option) {
        option.classList.toggle("active", option.textContent.trim().toLowerCase() === size.toLowerCase());
    });
}

function setProductDetailPriceText(element, value) {
    var valueText = typeof value === "number" ? String(value) : String(value).replace(/^₹/, "");
    var currentText = element.textContent;
    var numberPattern = /[\d,]+(?:\.\d+)?/;

    element.textContent = numberPattern.test(currentText)
        ? currentText.replace(numberPattern, valueText)
        : valueText;
}

function updateProductDetailTotal(productInfo, sizeChanged) {
    var priceElement = productInfo.querySelector("#price, #productPrice");
    var mrpElement = productInfo.querySelector("#mrp");
    var quantityInput = productInfo.querySelector("#quantity, .quantity-input");
    if (!priceElement || !quantityInput) return;

    var quantity = parseInt(quantityInput.value, 10);
    if (!Number.isInteger(quantity) || quantity < 1) return;

    if (sizeChanged || !priceElement.dataset.unitPriceText) {
        priceElement.dataset.unitPriceText = priceElement.textContent;
        if (mrpElement) mrpElement.dataset.unitPriceText = mrpElement.textContent;
    }

    renderProductDetailTotal(priceElement, quantity);
    if (mrpElement) renderProductDetailTotal(mrpElement, quantity);
}

function renderProductDetailTotal(element, quantity) {
    var unitPriceText = element.dataset.unitPriceText;
    var match = unitPriceText && unitPriceText.match(/[\d,]+(?:\.\d+)?/);
    if (!match) return;

    if (quantity === 1) {
        element.textContent = unitPriceText;
        return;
    }

    var unitPrice = Number(match[0].replace(/,/g, ""));
    if (!Number.isFinite(unitPrice)) return;

    element.textContent = unitPriceText.replace(match[0], (unitPrice * quantity).toFixed(2));
}

function changeQuantity(delta) {
    var productInfo = document.querySelector(".product-info");
    var quantityInput = productInfo && productInfo.querySelector("#quantity, .quantity-input");
    if (!quantityInput) return;

    var quantity = parseInt(quantityInput.value, 10);
    if (!Number.isInteger(quantity) || quantity < 1) quantity = 1;
    quantityInput.value = String(Math.max(1, quantity + delta));
    updateProductDetailTotal(productInfo, false);
}

document.addEventListener("click", function (event) {
    var productInfo = event.target.closest(".product-info");
    if (!productInfo) return;

    var sizeOption = event.target.closest(".size-selector .size-btn, .size-container .size-option");
    var quantityButton = event.target.closest(".quantity-btn");
    if (sizeOption) {
        updateProductDetailTotal(productInfo, true);
    } else if (quantityButton) {
        updateProductDetailTotal(productInfo, false);
    }
});

document.addEventListener("click", function (event) {
    const option = event.target.closest(".size-container .size-option");
    if (!option) return;

    const card = option.closest(".swiper-slide, .service-item");
    if (!card) return;

    const sizeContainer = option.closest(".size-container");
    sizeContainer.querySelectorAll(".size-option[onclick]").forEach(sizeOption => {
        sizeOption.removeAttribute("onclick");
    });
    const currentPrice = card.querySelector(".recommended-price-current span, .product-price span, [id='price']");
    const mrp = card.querySelector(".recommended-price-mrp span, .product-mrp span, [id='mrp']");
    const activeOption = sizeContainer.querySelector(".size-option.active") || option;

    if (!currentPrice || !mrp) return;

    const parseSizeInGrams = value => {
        const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*(kg|g)$/i);
        if (!match) return NaN;
        const amount = Number(match[1]);
        return match[2].toLowerCase() === "kg" ? amount * 1000 : amount;
    };
    const parseAmount = value => {
        const match = value.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : NaN;
    };

    if (!card.dataset.recommendedBaseSize) {
        const baseSize = parseSizeInGrams(activeOption.textContent);
        const basePrice = parseAmount(currentPrice.textContent);
        const baseMrp = parseAmount(mrp.textContent);

        if (!baseSize || !Number.isFinite(basePrice) || !Number.isFinite(baseMrp)) return;

        card.dataset.recommendedBaseSize = String(baseSize);
        card.dataset.recommendedBasePrice = String(basePrice);
        card.dataset.recommendedBaseMrp = String(baseMrp);
        card.dataset.recommendedMrpHasCurrency = String(mrp.textContent.includes("₹"));
    }

    const selectedSize = parseSizeInGrams(option.textContent);
    if (!selectedSize) return;

    const multiplier = selectedSize / Number(card.dataset.recommendedBaseSize);
    currentPrice.textContent = (Number(card.dataset.recommendedBasePrice) * multiplier).toFixed(2);
    mrp.textContent = `${card.dataset.recommendedMrpHasCurrency === "true" ? "₹" : ""}${(
        Number(card.dataset.recommendedBaseMrp) * multiplier
    ).toFixed(2)}`;

    sizeContainer.querySelectorAll(".size-option").forEach(sizeOption => {
        sizeOption.classList.toggle("active", sizeOption === option);
    });
}, true);





/*popup message*/

function startCountdown(days) {
    let endTime = new Date();
    endTime.setDate(endTime.getDate() + days);
    function updateCountdown() {
        let now = new Date();
        let timeDiff = endTime - now;
        if (timeDiff <= 0) {
            document.getElementById("countdown").innerText = "Offer Expired";
            return;
        }
        let daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        document.getElementById("countdown").innerText = `${daysLeft}d ${hours}h ${minutes}m ${seconds}s`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}
startCountdown(3);

/* Recommended products list */


// Centralized Swiper initialization: initialize one Swiper instance per .swiper-container
function initSwipers() {
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded yet');
        return;
    }

    const containers = document.querySelectorAll('.swiper-container');
    console.log('Found', containers.length, '.swiper-container elements');

    containers.forEach(function (container) {
        if (container.swiper && !container.swiper.destroyed) {
            return;
        }

        // avoid double-init: check for data attribute
        if (container.dataset.swiperInitialized) {
            console.log('Container already initialized, skipping');
            return;
        }

        const nextEl = container.querySelector('.swiper-button-next');
        const prevEl = container.querySelector('.swiper-button-prev');
        let paginationEl = container.querySelector('.swiper-pagination');

        // ensure there is a pagination element inside the container so Swiper can render bullets
        if (!paginationEl) {
            paginationEl = document.createElement('div');
            paginationEl.className = 'swiper-pagination';
            container.appendChild(paginationEl);
            console.log('Created pagination element for container');
        }

        const baseOptions = {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                stopOnLastSlide: false,
                pauseOnMouseEnter: false
            },
            navigation: {
                nextEl: nextEl || null,
                prevEl: prevEl || null
            },
            pagination: {
                el: paginationEl,
                clickable: true
            },
            breakpoints: {
                280: { slidesPerView: 2, spaceBetween: 5 },
                480: { slidesPerView: 3, spaceBetween: 5 },
                768: { slidesPerView: 4, spaceBetween: 10 },
                1024: { slidesPerView: 5, spaceBetween: 10 },
                1200: { slidesPerView: 6, spaceBetween: 15 }
            }
        };

        try {
            const swiperInstance = new Swiper(container, baseOptions);
            container.dataset.swiperInitialized = 'true';
            container.dataset.swiperInstance = true;
            
            // Ensure autoplay starts
            if (swiperInstance.autoplay) {
                swiperInstance.autoplay.start();
            }
            
            console.log('✓ Swiper initialized for container', { hasNext: !!nextEl, hasPrev: !!prevEl, hasPagination: !!paginationEl, autoplayActive: !!swiperInstance.autoplay });
        } catch (e) {
            console.error('Swiper init failed:', e);
        }
    });
}

// Try to initialize immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipers);
} else {
    initSwipers();
}

// Also try on window load for any late-loading scenarios
window.addEventListener('load', initSwipers);
