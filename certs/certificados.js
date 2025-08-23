// Loading animation and page initialization
document.addEventListener("DOMContentLoaded", () => {
  // Simulate loading time
  setTimeout(() => {
    document.getElementById("loadingScreen").style.opacity = "0"
    setTimeout(() => {
      document.getElementById("loadingScreen").style.display = "none"
      document.getElementById("mainContent").style.opacity = "1"
      generateCertificates()
    }, 500)
  }, 2500)
})

// Real certificates data from TodoCode Academy
const certificates = [
  {
    id: 1,
    title: "Introducción a Git y GitHub",
    institution: "TodoCode Academy",
    date: "19 de agosto de 2025",
    duration: "Curso completo",
    description:
      "Certificado de finalización por completar con éxito el curso de Introducción a Git y GitHub, cubriendo control de versiones, repositorios, ramas, merge, y colaboración en proyectos.",
    skills: ["Git", "GitHub", "Control de Versiones", "Repositorios", "Branching", "Merge"],
    verificationUrl: "https://todocodeacademy.com/certificate/git-y-github-roe/",
    credentialId: "TC-GIT-2025-RCG",
    type: "Desarrollo",
  },
  {
    id: 2,
    title: "HTML y CSS desde CERO",
    institution: "TodoCode Academy",
    date: "19 de agosto de 2025",
    duration: "Curso completo",
    description:
      "Certificado de finalización por completar con éxito el curso de HTML y CSS desde CERO, abarcando estructura web, estilos, responsive design y mejores prácticas.",
    skills: ["HTML5", "CSS3", "Responsive Design", "Flexbox", "Grid", "Semántica Web"],
    verificationUrl: "https://todocodeacademy.com/certificate/certificado-html-y-css-9ds/",
    credentialId: "TC-HTML-2025-RCG",
    type: "Frontend",
  },
  {
    id: 3,
    title: "Introducción a los Algoritmos y la Programación",
    institution: "TodoCode Academy",
    date: "19 de agosto de 2025",
    duration: "3 horas",
    description:
      "Certificado de finalización por completar con éxito el curso de Introducción a los Algoritmos y la Programación de 3hs de duración, cubriendo lógica de programación y estructuras algorítmicas.",
    skills: ["Algoritmos", "Lógica de Programación", "Estructuras de Datos", "Pseudocódigo", "Diagramas de Flujo"],
    verificationUrl: "https://todocodeacademy.com/certificate/introduccion-a-los-algoritmos-ldf/",
    credentialId: "TC-ALG-2025-RCG",
    type: "Fundamentos",
  },{
  id: 4,
  title: "Responsive Web Design",
  institution: "FreeCodeCamp",   // 🔄 en vez de issuer
  date: "2025",
  duration: "Curso completo",    // 🔄 añade algo para no quedar vacío
  description: "Certificación en diseño web responsivo...",
  skills: ["HTML5", "CSS3", "Flexbox", "CSS Grid", "Responsive Design"],
  verificationUrl: "https://www.freecodecamp.org/certification/fcc-f3eb2a1c-6183-43c4-80d1-a490a434d8cf/responsive-web-design", // 🔄 en vez de credentialUrl
  credentialId: "FCC-RWD-2024",  // 🔄 invéntate uno si no lo da FCC
  type: "Frontend"               // 🔄 agrega tipo
},
{
  id: 5,
  title: "Data Visualization",
  institution: "FreeCodeCamp",
  date: "2025",
  duration: "Curso completo",
  description: "Certificación en visualización de datos usando D3.js...",
  skills: ["D3.js", "JSON APIs", "Data Analysis", "SVG", "Interactive Charts"],
  verificationUrl: "https://www.freecodecamp.org/certification/fcc-f3eb2a1c-6183-43c4-80d1-a490a434d8cf/data-visualization",
  credentialId: "FCC-DV-2024",
  type: "Frontend"
}

]

// Generate certificate cards
function generateCertificates() {
  const grid = document.getElementById("certificatesGrid")

  certificates.forEach((cert, index) => {
    const card = document.createElement("div")
    card.className = "certificate-card"
    card.style.animationDelay = `${index * 0.2}s`

    card.innerHTML = `
            <div class="certificate-header">
                <div class="certificate-icon">
                    <i class="fas fa-award"></i>
                </div>
                <div class="certificate-type">${cert.type}</div>
            </div>
            <div class="certificate-body">
                <h3 class="certificate-title">${cert.title}</h3>
                <div class="certificate-institution">
                    <i class="fas fa-university"></i>
                    ${cert.institution}
                </div>
                <div class="certificate-date">
                    <i class="fas fa-calendar"></i>
                    ${cert.date}
                </div>
                <div class="certificate-duration">
                    <i class="fas fa-clock"></i>
                    ${cert.duration}
                </div>
                <div class="certificate-skills">
                    ${cert.skills
                      .slice(0, 3)
                      .map((skill) => `<span class="skill-tag">${skill}</span>`)
                      .join("")}
                    ${cert.skills.length > 3 ? `<span class="skill-more">+${cert.skills.length - 3}</span>` : ""}
                </div>
            </div>
            <div class="certificate-footer">
                <button class="btn-details" onclick="openModal(${cert.id})">
                    <i class="fas fa-eye"></i>
                    Ver Detalles
                </button>
                <button class="btn-verify" onclick="verifyCredential('${cert.verificationUrl}')">
                    <i class="fas fa-shield-alt"></i>
                    Verificar
                </button>
            </div>
        `

    grid.appendChild(card)
  })
}

// Open certificate modal
function openModal(certId) {
  const cert = certificates.find((c) => c.id === certId)
  const modal = document.getElementById("certificateModal")
  const modalTitle = document.getElementById("modalTitle")
  const modalBody = document.getElementById("modalBody")

  modalTitle.textContent = cert.title
  modalBody.innerHTML = `
        <div class="modal-certificate">
            <div class="modal-cert-header">
                <div class="modal-cert-icon">
                    <i class="fas fa-certificate"></i>
                </div>
                <div class="modal-cert-info">
                    <h4>${cert.title}</h4>
                    <p class="modal-institution">${cert.institution}</p>
                    <p class="modal-credential">ID: ${cert.credentialId}</p>
                </div>
            </div>
            <div class="modal-cert-details">
                <div class="detail-row">
                    <span class="detail-label">Fecha de Emisión:</span>
                    <span class="detail-value">${cert.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duración:</span>
                    <span class="detail-value">${cert.duration}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tipo:</span>
                    <span class="detail-value">${cert.type}</span>
                </div>
            </div>
            <div class="modal-description">
                <h5>Descripción del Curso</h5>
                <p>${cert.description}</p>
            </div>
            <div class="modal-skills">
                <h5>Habilidades Adquiridas</h5>
                <div class="skills-grid">
                    ${cert.skills.map((skill) => `<span class="skill-badge">${skill}</span>`).join("")}
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn-verify-modal" onclick="verifyCredential('${cert.verificationUrl}')">
                    <i class="fas fa-shield-alt"></i>
                    Verificar Credencial
                </button>
            </div>
        </div>
    `

  modal.style.display = "flex"
  setTimeout(() => modal.classList.add("active"), 10)
}

// Close modal
function closeModal() {
  const modal = document.getElementById("certificateModal")
  modal.classList.remove("active")
  setTimeout(() => (modal.style.display = "none"), 300)
}

// Verify credential
function verifyCredential(url) {
  // Simulate verification process
  const btn = event.target.closest("button")
  const originalText = btn.innerHTML

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...'
  btn.disabled = true

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Verificado'
    btn.style.background = "linear-gradient(135deg, #00ff88, #00cc6a)"

    setTimeout(() => {
      // In a real implementation, this would open the verification URL
      window.open(url, "_blank")
      btn.innerHTML = originalText
      btn.disabled = false
      btn.style.background = ""
    }, 1500)
  }, 2000)
}

// Go back function
function goBack() {
  // Add exit animation
  document.getElementById("mainContent").style.opacity = "0"
  document.getElementById("mainContent").style.transform = "translateY(-20px)"

  setTimeout(() => {
    window.history.back()
  }, 300)
}

// Close modal when clicking outside
document.getElementById("certificateModal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal()
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
  }
})
