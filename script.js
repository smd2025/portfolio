// Language and Theme Management
class PortfolioManager {
  constructor() {
    this.currentLang = "es"
    this.currentTheme = "dark"
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupSmoothScrolling()
    this.setupActiveNavigation()
    this.loadPreferences()
    this.setupContactForm()
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById("themeToggle")
    themeToggle.addEventListener("click", () => this.toggleTheme())

    // Language toggle
    const langToggle = document.getElementById("langToggle")
    langToggle.addEventListener("click", () => this.toggleLanguage())

    // Navigation arrows
    const prevArrow = document.querySelector(".nav-prev")
    const nextArrow = document.querySelector(".nav-next")

    if (prevArrow) prevArrow.addEventListener("click", () => this.navigateSection(-1))
    if (nextArrow) nextArrow.addEventListener("click", () => this.navigateSection(1))

    // CTA button
    const ctaButton = document.querySelector(".cta-button")
    if (ctaButton) {
      ctaButton.addEventListener("click", () => {
        document.getElementById("projects").scrollIntoView({ behavior: "smooth" })
      })
    }
  }

  setupSmoothScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          this.transitionToSection(target)
        }
      })
    })
  }

  transitionToSection(target) {
    const currentSection = document.querySelector("section:not(.section-transition)")

    if (currentSection) {
      currentSection.classList.add("section-transition")
    }

    setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      setTimeout(() => {
        document.querySelectorAll(".section-transition").forEach((section) => {
          section.classList.remove("section-transition")
        })
      }, 400)
    }, 200)
  }

  setupActiveNavigation() {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id")

            // Update active nav link
            navLinks.forEach((link) => {
              link.classList.remove("active")
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active")
              }
            })
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: "-80px 0px -80px 0px",
      },
    )

    sections.forEach((section) => observer.observe(section))
  }

  setupContactForm() {
    const form = document.getElementById("contactForm")
    if (!form) return

    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const submitBtn = document.getElementById("submitBtn")
      const btnContent = submitBtn.querySelector(".btn-content")
      const btnLoading = submitBtn.querySelector(".btn-loading")
      const successMessage = document.getElementById("successMessage")
      const formSection = document.querySelector(".contact-form-section")

      // Show loading state with enhanced animation
      btnContent.style.display = "none"
      btnLoading.style.display = "flex"
      submitBtn.disabled = true
      submitBtn.style.transform = "scale(0.98)"
      submitBtn.style.filter = "brightness(0.8)"

      // Add form shake animation for feedback
      form.style.animation = "formSubmit 0.3s ease"

      // Simulate sending (2.5 seconds delay)
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Hide form with enhanced fade animation
      form.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      form.style.opacity = "0"
      form.style.transform = "translateY(-30px) scale(0.95)"

      setTimeout(() => {
        form.style.display = "none"
        successMessage.style.display = "flex"
        successMessage.style.opacity = "0"
        successMessage.style.transform = "translateY(40px) scale(0.9)"

        setTimeout(() => {
          successMessage.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
          successMessage.style.opacity = "1"
          successMessage.style.transform = "translateY(0) scale(1)"
        }, 100)
      }, 600)

      // Reset form after 6 seconds with smooth transition
      setTimeout(() => {
        successMessage.style.transition = "all 0.5s ease"
        successMessage.style.opacity = "0"
        successMessage.style.transform = "translateY(-30px) scale(0.95)"

        setTimeout(() => {
          form.style.display = "block"
          successMessage.style.display = "none"
          form.reset()

          // Reset button state
          btnContent.style.display = "flex"
          btnLoading.style.display = "none"
          submitBtn.disabled = false
          submitBtn.style.transform = "scale(1)"
          submitBtn.style.filter = "brightness(1)"

          // Fade form back in with bounce effect
          setTimeout(() => {
            form.style.opacity = "1"
            form.style.transform = "translateY(0) scale(1)"
            form.style.animation = "formReturn 0.6s ease"
          }, 100)
        }, 500)
      }, 6000)
    })

    const formFields = form.querySelectorAll(".form-field input, .form-field textarea")
    formFields.forEach((field) => {
      field.addEventListener("focus", (e) => {
        e.target.parentElement.style.transform = "translateY(-2px)"
        e.target.parentElement.style.transition = "transform 0.3s ease"
      })

      field.addEventListener("blur", (e) => {
        e.target.parentElement.style.transform = "translateY(0)"
      })

      // Real-time validation feedback
      field.addEventListener("input", (e) => {
        const fieldBorder = e.target.parentElement.querySelector(".field-border")
        if (fieldBorder) {
          if (e.target.value.length > 0) {
            fieldBorder.style.background = "linear-gradient(90deg, #10b981, #059669)"
          } else {
            fieldBorder.style.background = "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))"
          }
        }
      })
    })
  }

  toggleTheme() {
    const body = document.body
    const themeIcon = document.querySelector("#themeToggle i")

    if (this.currentTheme === "dark") {
      body.classList.remove("dark-theme")
      body.classList.add("light-theme")
      themeIcon.className = "fas fa-moon"
      this.currentTheme = "light"
    } else {
      body.classList.remove("light-theme")
      body.classList.add("dark-theme")
      themeIcon.className = "fas fa-sun"
      this.currentTheme = "dark"
    }

    this.savePreferences()
  }

  toggleLanguage() {
    const langText = document.querySelector(".lang-text")

    if (this.currentLang === "es") {
      this.currentLang = "en"
      langText.textContent = "ES"
    } else {
      this.currentLang = "es"
      langText.textContent = "EN"
    }

    this.updateLanguage()
    this.savePreferences()
  }

  updateLanguage() {
    const elements = document.querySelectorAll("[data-es][data-en]")

    elements.forEach((element) => {
      const text = element.getAttribute(`data-${this.currentLang}`)
      if (text) {
        element.textContent = text
      }
    })
  }

  navigateSection(direction) {
    const sections = ["home", "about", "projects", "contact"]
    const currentSection = this.getCurrentSection()
    const currentIndex = sections.indexOf(currentSection)

    let nextIndex = currentIndex + direction
    if (nextIndex < 0) nextIndex = sections.length - 1
    if (nextIndex >= sections.length) nextIndex = 0

    const nextSection = document.getElementById(sections[nextIndex])
    if (nextSection) {
      this.transitionToSection(nextSection)
    }
  }

  getCurrentSection() {
    const sections = document.querySelectorAll("section[id]")
    let currentSection = "home"

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = section.id
      }
    })

    return currentSection
  }

  savePreferences() {
    localStorage.setItem("portfolio-theme", this.currentTheme)
    localStorage.setItem("portfolio-lang", this.currentLang)
  }

  loadPreferences() {
    const savedTheme = localStorage.getItem("portfolio-theme")
    const savedLang = localStorage.getItem("portfolio-lang")

    if (savedTheme && savedTheme !== this.currentTheme) {
      this.toggleTheme()
    }

    if (savedLang && savedLang !== this.currentLang) {
      this.toggleLanguage()
    }
  }
}

class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupScrollAnimations()
    this.setupParallaxEffects()
    this.setupHoverEffects()
    this.setupIntersectionAnimations()
    this.setupSkillCardAnimations()
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Animate elements on scroll with staggered delays
    document
      .querySelectorAll(".project-card, .skill-card, .contact-method, .modern-contact-form")
      .forEach((el, index) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(50px)"
        el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`
        observer.observe(el)
      })
  }

  setupSkillCardAnimations() {
    document.querySelectorAll(".skill-card").forEach((card) => {
      let isFlipped = false

      card.addEventListener("click", () => {
        const inner = card.querySelector(".skill-card-inner")
        if (!isFlipped) {
          inner.style.transform = "rotateY(180deg)"
          isFlipped = true
        } else {
          inner.style.transform = "rotateY(0deg)"
          isFlipped = false
        }
      })

      // Auto-flip on mobile devices
      if (window.innerWidth <= 768) {
        card.addEventListener("touchstart", () => {
          const inner = card.querySelector(".skill-card-inner")
          inner.style.transform = "rotateY(180deg)"
        })

        card.addEventListener("touchend", () => {
          setTimeout(() => {
            const inner = card.querySelector(".skill-card-inner")
            inner.style.transform = "rotateY(0deg)"
          }, 3000)
        })
      }
    })
  }

  setupIntersectionAnimations() {
    const titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
            entry.target.classList.add("title-animate")
          }
        })
      },
      { threshold: 0.5 },
    )

    document.querySelectorAll(".section-title, .projects-title").forEach((title) => {
      title.style.opacity = "0"
      title.style.transform = "translateY(30px)"
      title.style.transition = "all 0.6s ease"
      titleObserver.observe(title)
    })
  }

  setupParallaxEffects() {
    let ticking = false

    const updateParallax = () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll(".circle-bg")

      parallaxElements.forEach((el) => {
        const speed = 0.3
        el.style.transform = `translate(-50%, -50%) translateY(${scrolled * speed}px)`
      })

      // Parallax effect for code symbols
      document.querySelectorAll(".symbol").forEach((symbol, index) => {
        const speed = 0.1 + index * 0.05
        symbol.style.transform = `translateY(${scrolled * speed}px)`
      })

      ticking = false
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    })
  }

  setupHoverEffects() {
    // Enhanced project cards hover effect
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-12px) scale(1.02)"
        card.style.transition = "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      })

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)"
      })
    })

    // Enhanced contact method hover effects
    document.querySelectorAll(".contact-method").forEach((method) => {
      method.addEventListener("mouseenter", () => {
        method.style.transform = "translateX(15px) scale(1.02)"
        method.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
      })

      method.addEventListener("mouseleave", () => {
        method.style.transform = "translateX(0) scale(1)"
      })
    })

    // Enhanced social links hover effect
    document.querySelectorAll(".social-links a").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        link.style.transform = "translateY(-4px) scale(1.15) rotate(5deg)"
      })

      link.addEventListener("mouseleave", () => {
        link.style.transform = "translateY(0) scale(1) rotate(0deg)"
      })
    })

    // Navigation arrows pulse effect
    document.querySelectorAll(".nav-arrow").forEach((arrow) => {
      arrow.addEventListener("mouseenter", () => {
        arrow.style.transform = "scale(1.1)"
        arrow.style.animation = "pulse 1s infinite"
      })

      arrow.addEventListener("mouseleave", () => {
        arrow.style.transform = "scale(1)"
        arrow.style.animation = "none"
      })
    })

    // Form field focus effects
    document.querySelectorAll(".form-field input, .form-field textarea").forEach((field) => {
      field.addEventListener("focus", () => {
        field.parentElement.style.transform = "translateY(-3px)"
        field.parentElement.style.boxShadow = "0 10px 30px rgba(255, 71, 87, 0.1)"
      })

      field.addEventListener("blur", () => {
        field.parentElement.style.transform = "translateY(0)"
        field.parentElement.style.boxShadow = "none"
      })
    })
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioManager()
  new AnimationManager()

  // Enhanced loading animation
  document.body.style.opacity = "0"
  document.body.style.transform = "scale(0.98)"

  setTimeout(() => {
    document.body.style.transition = "all 0.8s ease"
    document.body.style.opacity = "1"
    document.body.style.transform = "scale(1)"
  }, 150)

  const style = document.createElement("style")
  style.textContent = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(255, 71, 87, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
    }
    
    @keyframes formSubmit {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
      100% { transform: translateX(0); }
    }
    
    @keyframes formReturn {
      0% { transform: translateY(20px) scale(0.95); opacity: 0; }
      50% { transform: translateY(-5px) scale(1.02); opacity: 0.8; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    .animate-in {
      animation: slideInUp 0.6s ease forwards;
    }
    
    .title-animate {
      animation: titleSlide 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes titleSlide {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Skill card flip animation enhancement */
    .skill-card-inner {
      transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Contact method hover enhancement */
    .contact-method::before {
      transition: left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* Form field animation enhancement */
    .form-field {
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  `
  document.head.appendChild(style)
})

// Enhanced keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault()
    const event = new CustomEvent("navigate", { detail: { direction: -1 } })
    document.dispatchEvent(event)
  } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault()
    const event = new CustomEvent("navigate", { detail: { direction: 1 } })
    document.dispatchEvent(event)
  } else if (e.key === "Escape") {
    // Reset any active states
    document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
      card.style.transform = "translateY(0) scale(1)"
    })
  }
})

document.addEventListener("navigate", (e) => {
  const portfolio = new PortfolioManager()
  portfolio.navigateSection(e.detail.direction)
})

document.documentElement.style.scrollBehavior = "smooth"

// Performance optimization: Throttle scroll events
let scrollTimeout
window.addEventListener("scroll", () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  scrollTimeout = setTimeout(() => {
    // Scroll-based animations can be added here
  }, 10)
})

window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    document.querySelectorAll(".skill-card").forEach((card) => {
      card.style.cursor = "pointer"
    })
  }
})
