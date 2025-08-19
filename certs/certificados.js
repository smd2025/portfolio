// Certificate data
const certificates = [
  {
    id: 1,
    title: "Full Stack Web Development",
    issuer: "FreeCodeCamp",
    date: "2024",
    icon: "fas fa-code",
    description:
      "Certificación completa en desarrollo web full stack, cubriendo tecnologías frontend y backend modernas.",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "MongoDB"],
    verifyUrl: "https://freecodecamp.org/certification/verify",
    details: {
      duration: "300 horas",
      projects: "5 proyectos principales",
      topics: [
        "Responsive Web Design",
        "JavaScript Algorithms",
        "Frontend Libraries",
        "Data Visualization",
        "APIs and Microservices",
        "Information Security",
      ],
    },
  },
  {
    id: 2,
    title: "JavaScript Algorithms and Data Structures",
    issuer: "FreeCodeCamp",
    date: "2024",
    icon: "fab fa-js-square",
    description: "Certificación especializada en algoritmos de JavaScript y estructuras de datos fundamentales.",
    skills: ["JavaScript", "Algorithms", "Data Structures", "ES6+", "Functional Programming"],
    verifyUrl: "https://freecodecamp.org/certification/verify",
    details: {
      duration: "300 horas",
      projects: "5 proyectos de algoritmos",
      topics: ["Basic JavaScript", "ES6", "Regular Expressions", "Debugging", "Data Structures", "Algorithm Scripting"],
    },
  },
  {
    id: 3,
    title: "Responsive Web Design",
    issuer: "FreeCodeCamp",
    date: "2023",
    icon: "fas fa-mobile-alt",
    description: "Certificación en diseño web responsive y mejores prácticas de CSS moderno.",
    skills: ["HTML5", "CSS3", "Flexbox", "Grid", "Responsive Design", "Accessibility"],
    verifyUrl: "https://freecodecamp.org/certification/verify",
    details: {
      duration: "300 horas",
      projects: "5 proyectos responsive",
      topics: [
        "Basic HTML",
        "Basic CSS",
        "Applied Visual Design",
        "Applied Accessibility",
        "Responsive Web Design",
        "CSS Flexbox",
        "CSS Grid",
      ],
    },
  },
  {
    id: 4,
    title: "React Development",
    issuer: "Udemy",
    date: "2024",
    icon: "fab fa-react",
    description: "Curso avanzado de React incluyendo hooks, context API, y mejores prácticas de desarrollo.",
    skills: ["React", "JSX", "Hooks", "Context API", "Redux", "Testing"],
    verifyUrl: "https://udemy.com/certificate/verify",
    details: {
      duration: "40 horas",
      projects: "8 proyectos prácticos",
      topics: [
        "Components",
        "Props & State",
        "Event Handling",
        "Hooks",
        "Context API",
        "Redux",
        "Testing",
        "Deployment",
      ],
    },
  },
  {
    id: 5,
    title: "Node.js Backend Development",
    issuer: "Coursera",
    date: "2024",
    icon: "fab fa-node-js",
    description: "Certificación completa en desarrollo backend con Node.js, Express y bases de datos.",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Authentication", "Security"],
    verifyUrl: "https://coursera.org/verify",
    details: {
      duration: "60 horas",
      projects: "4 APIs completas",
      topics: [
        "Node.js Fundamentals",
        "Express Framework",
        "Database Integration",
        "Authentication",
        "Security",
        "Testing",
        "Deployment",
      ],
    },
  },
  {
    id: 6,
    title: "Database Design and Management",
    issuer: "MongoDB University",
    date: "2023",
    icon: "fas fa-database",
    description: "Certificación en diseño y gestión de bases de datos NoSQL con MongoDB.",
    skills: ["MongoDB", "Database Design", "Aggregation", "Indexing", "Performance", "Security"],
    verifyUrl: "https://university.mongodb.com/verify",
    details: {
      duration: "25 horas",
      projects: "3 proyectos de base de datos",
      topics: [
        "MongoDB Basics",
        "CRUD Operations",
        "Data Modeling",
        "Aggregation Framework",
        "Indexing",
        "Performance Tuning",
      ],
    },
  },
]

// DOM Elements
const loadingScreen = document.getElementById("loadingScreen")
const mainContent = document.getElementById("mainContent")
const certificatesGrid = document.getElementById("certificatesGrid")
const modal = document.getElementById("certificateModal")
const modalTitle = document.getElementById("modalTitle")
const modalBody = document.getElementById("modalBody")

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Show loading screen
  setTimeout(() => {
    loadingScreen.classList.add("hidden")
    mainContent.classList.add("visible")
    generateCertificates()
  }, 4000)
})

// Generate certificate cards
function generateCertificates() {
  certificatesGrid.innerHTML = ""

  certificates.forEach((cert, index) => {
    const card = document.createElement("div")
    card.className = "certificate-card"
    card.style.animationDelay = `${index * 0.1}s`

    card.innerHTML = `
            <div class="certificate-header">
                <i class="${cert.icon} certificate-icon"></i>
                <h3 class="certificate-title">${cert.title}</h3>
            </div>
            <div class="certificate-info">
                <div class="certificate-issuer">${cert.issuer}</div>
                <div class="certificate-date">Obtenido en ${cert.date}</div>
                <p class="certificate-description">${cert.description}</p>
                <div class="certificate-skills">
                    ${cert.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
                </div>
            </div>
            <div class="certificate-actions">
                <a href="${cert.verifyUrl}" target="_blank" class="verify-btn">
                    <i class="fas fa-external-link-alt"></i>
                    Verificar
                </a>
                <button class="details-btn" onclick="showDetails(${cert.id})">
                    <i class="fas fa-info-circle"></i>
                    Detalles
                </button>
            </div>
        `

    certificatesGrid.appendChild(card)
  })
}

// Show certificate details in modal
function showDetails(certId) {
  const cert = certificates.find((c) => c.id === certId)
  if (!cert) return

  modalTitle.textContent = cert.title
  modalBody.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #00ff41; margin-bottom: 1rem;">Información General</h4>
            <p><strong>Emisor:</strong> ${cert.issuer}</p>
            <p><strong>Fecha:</strong> ${cert.date}</p>
            <p><strong>Duración:</strong> ${cert.details.duration}</p>
            <p><strong>Proyectos:</strong> ${cert.details.projects}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #00ff41; margin-bottom: 1rem;">Descripción</h4>
            <p>${cert.description}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #00ff41; margin-bottom: 1rem;">Temas Cubiertos</h4>
            <ul style="list-style: none; padding: 0;">
                ${cert.details.topics
                  .map(
                    (topic) => `
                    <li style="padding: 0.5rem 0; border-bottom: 1px solid rgba(0,255,65,0.2);">
                        <i class="fas fa-check" style="color: #00ff41; margin-right: 0.5rem;"></i>
                        ${topic}
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        </div>
        
        <div>
            <h4 style="color: #00ff41; margin-bottom: 1rem;">Habilidades Adquiridas</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${cert.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
            </div>
        </div>
        
        <div style="margin-top: 2rem; text-align: center;">
            <a href="${cert.verifyUrl}" target="_blank" class="verify-btn" style="display: inline-flex; text-decoration: none;">
                <i class="fas fa-external-link-alt"></i>
                Verificar Certificado
            </a>
        </div>
    `

  modal.classList.add("show")
  document.body.style.overflow = "hidden"
}

// Close modal
function closeModal() {
  modal.classList.remove("show")
  document.body.style.overflow = "auto"
}

// Go back function
function goBack() {
  // Add exit animation
  mainContent.style.transform = "translateX(-100%)"
  mainContent.style.opacity = "0"

  setTimeout(() => {
    window.history.back()
  }, 500)
}

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal()
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeModal()
  }
})

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth"
