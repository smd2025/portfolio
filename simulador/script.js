class KaliSimulator {
    constructor() {
        this.currentPath = "/home/rene"
        this.fileSystem = this.createFileSystem()
        this.commandHistory = []
        this.historyIndex = -1
        this.init()
    }

    init() {
        this.showBootSequence()
        this.setupEventListeners()
        this.updateDateTime()
        setInterval(() => this.updateDateTime(), 1000)
    }

    createFileSystem() {
        return {
            "/home/rene": {
                type: "directory",
                contents: {
                    Acerca_de_mi: {
                        type: "directory",
                        contents: {
                            "perfil.txt": {
                                type: "file",
                                content: `RENÉ CARABALLO GARCÍA - DESARROLLADOR FULL STACK
=================================================

Perfil Profesional

Desarrollador Full Stack apasionado por crear soluciones web innovadoras y funcionales.
Con experiencia sólida en tecnologías modernas tanto de frontend como de backend.

Experiencia

3+ años desarrollando aplicaciones web.

Arquitecturas escalables.

Metodologías ágiles.

Líder técnico en proyectos complejos.

Filosofía

"El código limpio no es solo funcional, es arte que otros desarrolladores pueden leer y mejorar."

Contacto

📍 Ubicación: Cuba
📧 Email: supermentedigital.srl@gmail.com
📱 Teléfono: +5355791959`,
                            },
                            "habilidades.txt": {
                                type: "file",
                                content: `HABILIDADES TÉCNICAS - RENÉ CARABALLO GARCÍA
==========================================

FRONTEND DEVELOPMENT:
• HTML5 - Maquetación semántica, formularios, accesibilidad
• CSS3 - Flexbox, Grid, Animaciones, Bootstrap, Diseño responsive, Dark mode
• JavaScript ES6+ - DOM, Fetch API, Async/Await, Módulos
• jQuery - Manipulación del DOM, AJAX, Efectos dinámicos
• UI/UX - Diseño moderno, interfaces intuitivas, prototipado

BACKEND DEVELOPMENT:
• PHP - Desarrollo de sistemas, CRUD, APIs, Autenticación
• MySQL - Diseño de bases de datos, Procedimientos almacenados, Consultas optimizadas
• SQLite - Manejo de BD local en aplicaciones móviles Android
• Java - Android Studio, CRUD en SQLite, gestión de vistas modernas
• APIs - RESTful, integración con terceros, seguridad básica

DEVOPS & CLOUD:
• Linux - Hardening, gestión de servidores dedicados, configuraciones de red
• Servidores web - Apache, Nginx, Virtual Hosts, SSL/TLS
• Docker - Contenedores básicos para desarrollo y despliegue
• CI/CD - GitHub Actions para pruebas y despliegues automáticos
• Seguridad - Firewall UFW/Iptables, Fail2Ban, Monitorización de logs

HERRAMIENTAS & METODOLOGÍAS:
• Git & GitHub - Flujo de ramas, versionado, colaboración en equipo
• Testing - Pruebas manuales, Postman para APIs, Debugging en PHP/JS
• Agile - Scrum, gestión de tareas en Trello/Jira
• Diseño - Bootstrap, CSS personalizado, estilo moderno tipo neón/dark
• Patrón MVC - Organización de proyectos en PHP y Android`,
                            },
                        },
                    },

                    Proyectos: {
                        type: "directory",
                        contents: {
                            "restaurant-system": {
                                type: "directory",
                                contents: {
                                    "README.md": {
                                        type: "file",
                                        content: `# SLYTHEERPOS - RESTAURANT SYSTEM
## Sistema de Punto de Venta para Restaurantes

### DESCRIPCIÓN:
SlytheerPOS es un sistema de punto de venta completo para restaurantes, diseñado para gestionar todas las operaciones de manera eficiente y segura. Incluye módulos de ventas, inventario con stock automático, gestión de almacenes, control de asistencia de empleados y reportes detallados. Compatible con pantallas KDS o impresoras, permite un flujo de trabajo híbrido entre digital y físico, optimizando la operatividad del negocio en tiempo real.

### CARACTERÍSTICAS:
- Punto de venta completo
- Gestión de inventario y almacenes
- Control de asistencia de empleados
- Reportes y estadísticas detalladas
- Soporte para pantallas KDS e impresoras
- Flujo híbrido digital/físico

### TECNOLOGÍAS:
- Backend: PHP Core, MySQL
- Frontend: JavaScript, jQuery, Bootstrap
- Infraestructura: Servidores Linux

### GITHUB:
https://github.com/smd2025/pos_system_v1.0_by_Rene_Caraballo_Garcia
`,
                                    },
                                },
                            },
                            "ads-system": {
                                type: "directory",
                                contents: {
                                    "README.md": {
                                        type: "file",
                                        content: `# LAMAYORANTILLA.COM - ADS SYSTEM
## Plataforma de Anuncios Clasificados

### DESCRIPCIÓN:
LaMayorAntilla.com es una plataforma de anuncios clasificados gratuita y segura dirigida a usuarios en Cuba. Permite la compra, venta y alquiler de productos y servicios en diversas categorías como vivienda, celulares, autos, empleos, moda, electrónica y más. Los anuncios son revisados por moderadores para garantizar su calidad y veracidad.

### CARACTERÍSTICAS:
- Publicación gratuita de anuncios
- Categorías múltiples (vivienda, autos, móviles, etc.)
- Moderación de anuncios para mayor seguridad
- Diseño responsive y moderno
- Optimizada como PWA (Progressive Web App)

### TECNOLOGÍAS:
- Backend: PHP, MySQL
- Frontend: Core JS, Tailwind CSS
- APIs: OpenGraph
- Infraestructura: PWA

### GITHUB:
https://github.com/smd2025/AnunciosCuba

### DEMO:
https://lamayorantilla.com/adscuba/`,
                                    },
                                },
                            },
                            "crypto-dashboard": {
                                type: "directory",
                                contents: {
                                    "README.md": {
                                        type: "file",
                                        content: `# CRYPTO DASHBOARD
## Dashboard de Criptomonedas

### DESCRIPCIÓN:
Dashboard de criptomonedas completo en HTML, CSS y JavaScript puro. El dashboard incluye datos en tiempo real de la API de CoinGecko, gráficos interactivos dibujados con Canvas, y actualizaciones automáticas cada 30 segundos.

### CARACTERÍSTICAS:
- Datos en tiempo real desde CoinGecko API
- Gráficos interactivos con Canvas
- Actualización automática cada 30 segundos
- Diseño responsive y minimalista

### TECNOLOGÍAS:
- Frontend: HTML5, CSS3, JavaScript
- APIs: CoinGecko API

### GITHUB:
https://github.com/smd2025/Simple_Crypto
`,
                                    },
                                },
                            },
                        },
                    }
                    ,
                    Contacto: {
                        type: "directory",
                        contents: {
                            "informacion.txt": {
                                type: "file",
                                content: `INFORMACIÓN DE CONTACTO - RENÉ CARABALLO GARCÍA
============================================

📧 EMAIL:
supermentedigital.srl@gmail.com
Respuesta garantizada en 24 horas

📱 WHATSAPP:
+5355791959
Disponible para consultas rápidas

🐙 GITHUB:
https://github.com/smd2025
Revisa mis proyectos y contribuciones

🌐 PORTFOLIO:
https://smd2025.github.io/portfolio/
Sitio web personal con todos mis trabajos

DISPONIBILIDAD:
- Proyectos freelance: ✅ Disponible
- Consultoría técnica: ✅ Disponible  
- Colaboraciones: ✅ Siempre abierto
- Trabajo remoto: ✅ Preferido

HORARIO DE CONTACTO:
Lunes a Viernes: 9:00 AM - 6:00 PM (GMT-4)
Fines de semana: Solo emergencias

"¡Hablemos sobre tu próximo proyecto increíble!"`,
                            },
                        },
                    },
                },
            },
        }
    }

    showBootSequence() {
        const bootScreen = document.getElementById("bootScreen")
        const desktop = document.getElementById("desktop")

        setTimeout(() => {
            bootScreen.style.opacity = "0"
            bootScreen.style.transition = "opacity 1s ease"

            setTimeout(() => {
                bootScreen.style.display = "none"
                desktop.style.display = "block"
                desktop.style.opacity = "0"
                desktop.style.transition = "opacity 1s ease"

                setTimeout(() => {
                    desktop.style.opacity = "1"
                }, 100)
            }, 1000)
        }, 6000)
    }

    setupEventListeners() {
        // Desktop folder clicks
        document.querySelectorAll(".desktop-folder").forEach((folder) => {
            folder.addEventListener("dblclick", (e) => {
                const folderName = e.currentTarget.dataset.folder
                this.openFolder(folderName)
            })
        })

        // App icons
        document.querySelectorAll(".app-icon").forEach((icon) => {
            icon.addEventListener("click", (e) => {
                const app = e.currentTarget.dataset.app
                this.openApp(app)
            })
        })

        // Window controls
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("close")) {
                const window = e.target.closest(".window")
                this.closeWindow(window)
            }
            if (e.target.classList.contains("minimize")) {
                const window = e.target.closest(".window")
                this.minimizeWindow(window)
            }
        })

        // Terminal input
        const terminalInput = document.getElementById("terminalInput")
        if (terminalInput) {
            terminalInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    this.executeCommand(e.target.value)
                    e.target.value = ""
                } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    this.navigateHistory(-1)
                } else if (e.key === "ArrowDown") {
                    e.preventDefault()
                    this.navigateHistory(1)
                }
            })
        }

        // Make windows draggable
        this.makeWindowsDraggable()
    }

    openFolder(folderName) {
        let path
        switch (folderName) {
            case "about":
                path = "/home/rene/Acerca_de_mi"
                break
            case "projects":
                path = "/home/rene/Proyectos"
                break
            case "contact":
                path = "/home/rene/Contacto"
                break
        }

        this.openFileManager(path)
    }

    openApp(appName) {
        if (appName === "terminal") {
            this.openTerminal()
        } else if (appName === "files") {
            this.openFileManager("/home/rene")
        }
    }

    openTerminal() {
        const terminal = document.getElementById("terminalWindow")
        terminal.style.display = "block"
        terminal.style.animation = "fadeIn 0.3s ease"

        // Focus on terminal input
        setTimeout(() => {
            document.getElementById("terminalInput").focus()
        }, 100)
    }

    openFileManager(path = "/home/rene") {
        const fileManager = document.getElementById("fileManager")
        fileManager.style.display = "block"
        fileManager.style.animation = "fadeIn 0.3s ease"

        this.currentPath = path
        this.updateFileList()
        this.updatePathBar()
    }

    updateFileList() {
        const fileList = document.getElementById("fileList")
        const currentDir = this.getDirectoryContents(this.currentPath)

        fileList.innerHTML = ""

        if (currentDir && currentDir.contents) {
            Object.entries(currentDir.contents).forEach(([name, item]) => {
                const fileItem = document.createElement("div")
                fileItem.className = "file-item"
                fileItem.innerHTML = `
          <div class="file-icon">
            <i class="fas ${item.type === "directory" ? "fa-folder" : "fa-file-alt"}"></i>
          </div>
          <div class="file-name">${name}</div>
          <div class="file-type">${item.type}</div>
        `

                fileItem.addEventListener("dblclick", () => {
                    if (item.type === "directory") {
                        this.currentPath = `${this.currentPath}/${name}`
                        this.updateFileList()
                        this.updatePathBar()
                    } else {
                        this.openFile(`${this.currentPath}/${name}`)
                    }
                })

                fileList.appendChild(fileItem)
            })
        }
    }

    updatePathBar() {
        const pathBar = document.getElementById("pathBar")
        const currentPathElement = document.getElementById("currentPath")

        if (pathBar) pathBar.textContent = this.currentPath
        if (currentPathElement) currentPathElement.textContent = `Explorador de Archivos - ${this.currentPath}`
    }

    openFile(filePath) {
        const file = this.getFileContents(filePath)
        if (file && file.content) {
            this.openContentViewer(filePath, file.content)
        }
    }

    openContentViewer(filePath, content) {
        const viewer = document.getElementById("contentViewer")
        const contentBody = document.getElementById("contentBody")
        const contentTitle = document.getElementById("contentTitle")

        viewer.style.display = "block"
        viewer.style.animation = "fadeIn 0.3s ease"

        const fileName = filePath.split("/").pop()
        contentTitle.textContent = fileName

        // Format content based on file type
        if (fileName.includes("habilidades")) {
            contentBody.innerHTML = this.formatSkillsContent(content)
        } else if (filePath.includes("Proyectos")) {
            contentBody.innerHTML = this.formatProjectContent(content)
        } else if (fileName.includes("informacion")) {
            contentBody.innerHTML = this.formatContactContent(content)
        } else {
            contentBody.innerHTML = `<pre>${content}</pre>`
        }
    }

    formatSkillsContent(content) {
        const sections = content.split("\n\n")
        let html = "<h1>Habilidades Técnicas</h1>"

        sections.forEach((section) => {
            if (section.includes("FRONTEND") || section.includes("BACKEND") || section.includes("DEVOPS")) {
                const lines = section.split("\n")
                const title = lines[0].replace(/[•]/g, "").trim()
                html += `<div class="skill-section"><h3>${title}</h3>`

                const techs = lines.slice(1).filter((line) => line.trim().startsWith("•"))
                html += '<div class="tech-list">'

                techs.forEach((tech) => {
                    const [name, ...desc] = tech.replace("•", "").split(" - ")
                    html += `
            <div class="tech-item">
              <div class="tech-name">${name.trim()}</div>
              <div class="tech-desc">${desc.join(" - ")}</div>
            </div>
          `
                })

                html += "</div></div>"
            }
        })

        return html
    }

    formatProjectContent(content) {
        const lines = content.split("\n")
        const title = lines[0].replace("#", "").trim()
        const subtitle = lines[1].replace("##", "").trim()

        let html = `<h1>${title}</h1><h2>${subtitle}</h2>`

        let currentSection = ""
        lines.forEach((line) => {
            if (line.startsWith("### DESCRIPCIÓN:")) {
                currentSection = "desc"
                html += "<h3>Descripción</h3>"
            } else if (line.startsWith("### CARACTERÍSTICAS:")) {
                currentSection = "features"
                html += "<h3>Características</h3><ul>"
            } else if (line.startsWith("### TECNOLOGÍAS:")) {
                if (currentSection === "features") html += "</ul>"
                currentSection = "tech"
                html += '<h3>Tecnologías</h3><div class="project-tech">'
            } else if (line.startsWith("### GITHUB:")) {
                if (currentSection === "tech") html += "</div>"
                currentSection = "github"
                html += "<h3>Repositorio</h3>"
            } else if (line.startsWith("### DEMO:")) {
                currentSection = "demo"
                html += "<h3>Demo</h3>"
            } else if (line.trim() && !line.startsWith("#")) {
                if (currentSection === "desc") {
                    html += `<p>${line}</p>`
                } else if (currentSection === "features" && line.startsWith("-")) {
                    html += `<li>${line.substring(1).trim()}</li>`
                } else if (currentSection === "tech" && line.startsWith("-")) {
                    const tech = line.substring(1).trim()
                    html += `<span class="tech-tag">${tech}</span>`
                } else if (currentSection === "github" && line.startsWith("https://")) {
                    html += `<a href="${line}" class="project-link" target="_blank"><i class="fab fa-github"></i> Ver en GitHub</a>`
                } else if (currentSection === "demo" && line.startsWith("https://")) {
                    html += `<a href="${line}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Ver Demo</a>`
                }
            }
        })

        return html
    }

    formatContactContent(content) {
        const lines = content.split("\n")
        let html = "<h1>Información de Contacto</h1>"

        const contacts = []
        let currentContact = null

        lines.forEach((line) => {
            if (line.includes("📧") || line.includes("📱") || line.includes("🐙") || line.includes("📘")) {
                if (currentContact) contacts.push(currentContact)
                currentContact = { icon: "", label: "", value: "", link: "" }

                if (line.includes("📧")) {
                    currentContact.icon = "fas fa-envelope"
                    currentContact.label = "Email"
                } else if (line.includes("📱")) {
                    currentContact.icon = "fab fa-whatsapp"
                    currentContact.label = "WhatsApp"
                } else if (line.includes("🐙")) {
                    currentContact.icon = "fab fa-github"
                    currentContact.label = "GitHub"
                } else if (line.includes("📘")) {
                    currentContact.icon = "fab fa-facebook"
                    currentContact.label = "Facebook"
                }
            } else if (
                currentContact &&
                line.trim() &&
                !line.includes(":") &&
                !line.includes("Respuesta") &&
                !line.includes("Disponible") &&
                !line.includes("Revisa") &&
                !line.includes("Conecta")
            ) {
                if (line.includes("@") || line.includes("http") || line.includes("+")) {
                    currentContact.value = line.trim()
                    if (line.includes("http")) {
                        currentContact.link = line.trim()
                    } else if (line.includes("@")) {
                        currentContact.link = `mailto:${line.trim()}`
                    } else if (line.includes("+")) {
                        currentContact.link = `https://wa.me/${line.trim().replace(/[^0-9]/g, "")}`
                    }
                }
            }
        })

        if (currentContact) contacts.push(currentContact)

        html += '<div class="contact-info">'
        contacts.forEach((contact) => {
            html += `
        <div class="contact-method">
          <div class="contact-icon"><i class="${contact.icon}"></i></div>
          <div class="contact-label">${contact.label}</div>
          <div class="contact-value">
            ${contact.link ? `<a href="${contact.link}" class="contact-link" target="_blank">${contact.value}</a>` : contact.value}
          </div>
        </div>
      `
        })
        html += "</div>"

        return html
    }

    executeCommand(command) {
        const output = document.getElementById("terminalOutput")
        const input = command.trim()

        // Add command to history
        if (input) {
            this.commandHistory.push(input)
            this.historyIndex = this.commandHistory.length
        }

        // Show command in terminal
        const commandLine = document.createElement("div")
        commandLine.className = "terminal-line"
        commandLine.innerHTML = `<span class="prompt">rene@kali:~$</span> ${input}`
        output.appendChild(commandLine)

        // Execute command
        const result = this.processCommand(input)

        if (result) {
            const resultLine = document.createElement("div")
            resultLine.className = "terminal-line"
            resultLine.innerHTML = `<span style="color: #ffffff;">${result}</span>`
            output.appendChild(resultLine)
        }

        // Scroll to bottom
        output.scrollTop = output.scrollHeight
    }

    processCommand(command) {
        const parts = command.split(" ")
        const cmd = parts[0].toLowerCase()
        const args = parts.slice(1)

        switch (cmd) {
            case "help":
                return `Comandos disponibles:<br>
ls - Listar archivos y directorios<br>
cd - Cambiar directorio<br>
cat - Mostrar contenido de archivo<br>
pwd - Mostrar directorio actual<br>
clear - Limpiar terminal<br>
whoami - Mostrar usuario actual<br>
date - Mostrar fecha y hora<br>
about - Abrir información personal<br>
projects - Abrir proyectos<br>
contact - Abrir información de contacto<br>
neofetch - Mostrar información del sistema<br>`

            case "ls":
                return this.listDirectory(args[0] || this.currentPath)

            case "cd":
                return this.changeDirectory(args[0] || "/home/rene")

            case "cat":
                if (!args[0]) return "cat: falta el nombre del archivo"
                return this.catFile(args[0])

            case "pwd":
                return this.currentPath

            case "clear":
                document.getElementById("terminalOutput").innerHTML = ""
                return ""

            case "whoami":
                return "rene"

            case "date":
                return new Date().toString()

            case "about":
                this.openFolder("about")
                return "Abriendo información personal..."

            case "projects":
                this.openFolder("projects")
                return "Abriendo proyectos..."

            case "contact":
                this.openFolder("contact")
                return "Abriendo información de contacto..."

            case "neofetch":
                return `                    rene@kali-linux<br>
                    ----------------<br>
     OS: Kali GNU/Linux Rolling<br>
     Host: Portfolio System<br>
     Kernel: 5.10.0-kali<br>
     Uptime: 2 hours, 30 mins<br>
     Packages: 2847 (dpkg)<br>
     Shell: bash 5.1.4<br>
     Resolution: 1920x1080<br>
     DE: Custom Portfolio Environment<br>
     WM: Kali Window Manager<br>
     Theme: Hacker Green<br>
     Terminal: Custom Terminal<br>
     CPU: Intel i7-9700K (8) @ 3.60GHz<br>
     Memory: 16384MiB<br>`

            default:
                return `bash: ${cmd}: comando no encontrado`
        }
    }

    listDirectory(path) {
        const dir = this.getDirectoryContents(path || this.currentPath)
        if (!dir || !dir.contents) {
            return `ls: no se puede acceder a '${path}': No existe el archivo o el directorio`
        }

        const items = Object.entries(dir.contents).map(([name, item]) => {
            const color = item.type === "directory" ? "#00ff41" : "#ffffff"
            return `<span style="color: ${color}">${name}</span>`
        })

        return items.join("  ")
    }

    changeDirectory(path) {
        if (path === "..") {
            const pathParts = this.currentPath.split("/")
            pathParts.pop()
            this.currentPath = pathParts.join("/") || "/"
            return ""
        }

        if (path.startsWith("/")) {
            if (this.getDirectoryContents(path)) {
                this.currentPath = path
                return ""
            }
        } else {
            const newPath = `${this.currentPath}/${path}`
            if (this.getDirectoryContents(newPath)) {
                this.currentPath = newPath
                return ""
            }
        }

        return `bash: cd: ${path}: No existe el archivo o el directorio`
    }

    catFile(filename) {
        const filePath = filename.startsWith("/") ? filename : `${this.currentPath}/${filename}`
        const file = this.getFileContents(filePath)

        if (!file) {
            return `cat: ${filename}: No existe el archivo o el directorio`
        }

        if (file.type === "directory") {
            return `cat: ${filename}: Es un directorio`
        }

        return file.content.replace(/\n/g, "<br>")
    }

    getDirectoryContents(path) {
        const parts = path.split("/").filter((p) => p)
        let current = this.fileSystem["/home/rene"]

        for (const part of parts.slice(2)) {
            // Skip 'home' and 'rene'
            if (current.contents && current.contents[part]) {
                current = current.contents[part]
            } else {
                return null
            }
        }

        return current
    }

    getFileContents(path) {
        const parts = path.split("/").filter((p) => p)
        let current = this.fileSystem["/home/rene"]

        for (const part of parts.slice(2)) {
            // Skip 'home' and 'rene'
            if (current.contents && current.contents[part]) {
                current = current.contents[part]
            } else {
                return null
            }
        }

        return current
    }

    navigateHistory(direction) {
        const input = document.getElementById("terminalInput")

        if (direction === -1 && this.historyIndex > 0) {
            this.historyIndex--
            input.value = this.commandHistory[this.historyIndex]
        } else if (direction === 1 && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++
            input.value = this.commandHistory[this.historyIndex]
        } else if (direction === 1 && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length
            input.value = ""
        }
    }

    closeWindow(window) {
        window.style.animation = "fadeOut 0.3s ease"
        setTimeout(() => {
            window.style.display = "none"
        }, 300)
    }

    minimizeWindow(window) {
        window.style.transform = "scale(0.1)"
        window.style.opacity = "0"
        setTimeout(() => {
            window.style.display = "none"
            window.style.transform = "scale(1)"
            window.style.opacity = "1"
        }, 300)
    }

    makeWindowsDraggable() {
        document.querySelectorAll(".window").forEach((window) => {
            const header = window.querySelector(".window-header")
            let isDragging = false
            let currentX = 0
            let currentY = 0
            let initialX = 0
            let initialY = 0

            header.addEventListener("mousedown", (e) => {
                if (e.target.classList.contains("window-btn")) return

                isDragging = true
                initialX = e.clientX - window.offsetLeft
                initialY = e.clientY - window.offsetTop
                window.style.zIndex = "3000"
            })

            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    currentX = e.clientX - initialX
                    currentY = e.clientY - initialY

                    window.style.left = currentX + "px"
                    window.style.top = currentY + "px"
                }
            })

            document.addEventListener("mouseup", () => {
                isDragging = false
                window.style.zIndex = "2000"
            })
        })
    }

    updateDateTime() {
        const datetimeElement = document.getElementById("datetime")
        if (datetimeElement) {
            const now = new Date()
            const timeString = now.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            })
            const dateString = now.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
            })
            datetimeElement.textContent = `${timeString} ${dateString}`
        }
    }
}

// Initialize the Kali Linux simulator
document.addEventListener("DOMContentLoaded", () => {
    new KaliSimulator()
})

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.9); }
  }
`
document.head.appendChild(style)
