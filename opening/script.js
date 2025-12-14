const countdown = 10
const countdownElement = document.getElementById("countdown")
const countdownContainer = document.getElementById("countdown-container")
const celebrationContainer = document.getElementById("celebration")

const targetHour = 9 // 8 PM en formato 24h
const targetMinute = 59

let finalCountdownActive = false
let finalCountdown = 10

const timeDisplay = document.getElementById("time-display")
const finalCountdownElement = document.getElementById("final-countdown")
const hoursElement = document.getElementById("hours")
const minutesElement = document.getElementById("minutes")
const secondsElement = document.getElementById("seconds")

// Background confetti removed - using particles instead

function getTimeUntilTarget() {
  const now = new Date()
  const target = new Date()
  target.setHours(targetHour, targetMinute, 0, 0)

  // Si ya pasó las 8:35 PM de hoy, configurar para mañana
  if (now > target) {
    target.setDate(target.getDate() + 1)
  }

  const diff = target - now

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { hours, minutes, seconds, totalSeconds: Math.floor(diff / 1000) }
}

function updateTimeDisplay() {
  const time = getTimeUntilTarget()

  // Cuando falten 10 segundos o menos, cambiar al contador final
  if (time.totalSeconds <= 10 && !finalCountdownActive) {
    startFinalCountdown()
    return
  }

  // Actualizar valores con animación
  if (hoursElement.textContent !== String(time.hours).padStart(2, "0")) {
    hoursElement.style.animation = "none"
    setTimeout(() => {
      hoursElement.textContent = String(time.hours).padStart(2, "0")
      hoursElement.style.animation = "valueChange 0.5s ease-out"
    }, 10)
  } else {
    hoursElement.textContent = String(time.hours).padStart(2, "0")
  }

  if (minutesElement.textContent !== String(time.minutes).padStart(2, "0")) {
    minutesElement.style.animation = "none"
    setTimeout(() => {
      minutesElement.textContent = String(time.minutes).padStart(2, "0")
      minutesElement.style.animation = "valueChange 0.5s ease-out"
    }, 10)
  } else {
    minutesElement.textContent = String(time.minutes).padStart(2, "0")
  }

  if (secondsElement.textContent !== String(time.seconds).padStart(2, "0")) {
    secondsElement.style.animation = "none"
    setTimeout(() => {
      secondsElement.textContent = String(time.seconds).padStart(2, "0")
      secondsElement.style.animation = "valueChange 0.5s ease-out"
    }, 10)
  } else {
    secondsElement.textContent = String(time.seconds).padStart(2, "0")
  }
}

function startFinalCountdown() {
  finalCountdownActive = true
  timeDisplay.style.display = "none"
  finalCountdownElement.style.display = "block"

  const interval = setInterval(() => {
    finalCountdown--
    finalCountdownElement.textContent = finalCountdown

    // Animación de pulso al cambiar número
    finalCountdownElement.style.animation = "none"
    setTimeout(() => {
      finalCountdownElement.style.animation = "countPulse 1s ease-in-out"
    }, 10)

    if (finalCountdown === 0) {
      clearInterval(interval)
      finalCountdownElement.style.display = "none"
      startCelebration()
    }
  }, 1000)
}

// Iniciar actualización del tiempo
updateTimeDisplay()
const timeInterval = setInterval(() => {
  if (!finalCountdownActive) {
    updateTimeDisplay()
  } else {
    clearInterval(timeInterval)
  }
}, 1000)

function initParticles() {
  const canvas = document.getElementById("particles-background")
  const ctx = canvas.getContext("2d")

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = []
  const particleCount = 60
  const colors = ["#667eea", "#764ba2", "#f093fb", "#4ecdc4", "#feca57"]

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 4 + 1
      this.speedY = Math.random() * 0.5 - 0.25
      this.speedX = Math.random() * 0.5 - 0.25
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.opacity = Math.random() * 0.5 + 0.2
    }

    update() {
      this.y += this.speedY
      this.x += this.speedX

      if (this.y > canvas.height) this.y = 0
      if (this.y < 0) this.y = canvas.height
      if (this.x > canvas.width) this.x = 0
      if (this.x < 0) this.x = canvas.width
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.opacity
      ctx.fill()
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((particle) => {
      particle.update()
      particle.draw()
    })
    requestAnimationFrame(animateParticles)
  }

  animateParticles()
}

initParticles()

function startCelebration() {
  explodeCountdown()

  setTimeout(() => {
    countdownContainer.style.display = "none"
    celebrationContainer.style.display = "block"
    celebrationContainer.style.background = "white"
    // Ocultar los canvases de fuegos artificiales y confeti
    const fireworksCanvas = document.getElementById("fireworks")
    const confettiCanvas = document.getElementById("confetti")
    if (fireworksCanvas) fireworksCanvas.style.display = "none"
    if (confettiCanvas) confettiCanvas.style.display = "none"

    setTimeout(() => {
      revealLogo()
    }, 500)
  }, 1500) // Esperar a que termine la explosión
}

function explodeCountdown() {
  const content = document.querySelector(".content")
  if (!content) return

  // Seleccionar todos los elementos visibles
  const elements = Array.from(content.querySelectorAll("h1, p, .time-unit, .time-separator, #final-countdown"))
  const containerRect = countdownContainer.getBoundingClientRect()

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 - containerRect.left
    const centerY = rect.top + rect.height / 2 - containerRect.top

    // Crear fragmentos del elemento
    const text = el.textContent
    const fragmentCount = Math.min(text.length, 20) // Limitar fragmentos

    for (let i = 0; i < fragmentCount; i++) {
      const fragment = document.createElement("div")
      fragment.textContent = text.charAt(Math.floor((i * text.length) / fragmentCount))
      fragment.style.position = "absolute"
      fragment.style.left = centerX + "px"
      fragment.style.top = centerY + "px"
      fragment.style.fontSize = window.getComputedStyle(el).fontSize
      fragment.style.fontWeight = window.getComputedStyle(el).fontWeight
      fragment.style.color = window.getComputedStyle(el).color
      fragment.style.background = window.getComputedStyle(el).background
      fragment.style.webkitBackgroundClip = window.getComputedStyle(el).webkitBackgroundClip
      fragment.style.webkitTextFillColor = window.getComputedStyle(el).webkitTextFillColor
      fragment.style.backgroundClip = window.getComputedStyle(el).backgroundClip
      fragment.style.zIndex = "1000"
      fragment.style.pointerEvents = "none"

      const angle = (Math.PI * 2 * i) / fragmentCount
      const velocity = 5 + Math.random() * 10
      const vx = Math.cos(angle) * velocity
      const vy = Math.sin(angle) * velocity - 5 // Impulso inicial hacia arriba

      fragment.dataset.vx = vx
      fragment.dataset.vy = vy
      fragment.dataset.rotation = Math.random() * 360
      fragment.dataset.rotationSpeed = (Math.random() - 0.5) * 20

      countdownContainer.appendChild(fragment)

      animateFragment(fragment)
    }

    // Ocultar elemento original
    el.style.opacity = "0"
  })
}

function animateFragment(fragment) {
  const vx = Number.parseFloat(fragment.dataset.vx)
  let vy = Number.parseFloat(fragment.dataset.vy)
  let rotation = Number.parseFloat(fragment.dataset.rotation)
  const rotationSpeed = Number.parseFloat(fragment.dataset.rotationSpeed)
  const gravity = 0.5
  let x = Number.parseFloat(fragment.style.left)
  let y = Number.parseFloat(fragment.style.top)
  let alpha = 1

  function animate() {
    vy += gravity
    x += vx
    y += vy
    rotation += rotationSpeed
    alpha -= 0.015

    fragment.style.left = x + "px"
    fragment.style.top = y + "px"
    fragment.style.transform = `rotate(${rotation}deg)`
    fragment.style.opacity = alpha

    if (alpha > 0 && y < window.innerHeight + 100) {
      requestAnimationFrame(animate)
    } else {
      fragment.remove()
    }
  }

  animate()
}

function revealLogo() {
  const logoReveal = document.querySelector(".logo-reveal")
  if (!logoReveal) return

  logoReveal.style.opacity = "0"
  logoReveal.style.transform = "translate(-50%, -50%) scale(0.3)"
  logoReveal.style.transition = "opacity 5s ease-out, transform 5s ease-out"

  setTimeout(() => {
    logoReveal.style.opacity = "1"
    logoReveal.style.transform = "translate(-50%, -50%) scale(1)"

    setTimeout(() => {
      // Efecto de destrucción del logo
      logoReveal.style.transition = "all 2s ease-in"
      logoReveal.style.transform = "translate(-50%, -50%) scale(2) rotate(180deg)"
      logoReveal.style.opacity = "0"
      logoReveal.style.filter = "blur(20px)"
      
      setTimeout(() => {
        window.location.href = "https://elpatiodemicasa.shop/"
      }, 2000)
    }, 3000)
  }, 100)
}

function startFireworks() {
  const canvas = document.getElementById("fireworks")
  const ctx = canvas.getContext("2d")

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = []
  const colors = [
    "#ff6b9d",
    "#c44569",
    "#4ecdc4",
    "#45b7d1",
    "#f9ca24",
    "#6c5ce7",
    "#feca57",
    "#ff9ff3",
    "#667eea",
    "#764ba2",
  ]

  class Particle {
    constructor(x, y, color) {
      this.x = x
      this.y = y
      this.color = color
      this.velocity = {
        x: (Math.random() - 0.5) * 12, // Velocidad más rápida
        y: (Math.random() - 0.5) * 12,
      }
      this.alpha = 1
      this.decay = Math.random() * 0.015 + 0.01
      this.size = Math.random() * 5 + 2 // Partículas más grandes
    }

    update() {
      this.velocity.y += 0.15
      this.x += this.velocity.x
      this.y += this.velocity.y
      this.alpha -= this.decay
    }

    draw() {
      ctx.save()
      ctx.globalAlpha = this.alpha
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.shadowBlur = 20
      ctx.shadowColor = this.color
      ctx.fill()
      ctx.restore()
    }
  }

  function createFirework(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const particleCount = Math.random() * 60 + 60

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(x, y, color))
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(15, 15, 15, 0.15)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particles.splice(index, 1)
      } else {
        particle.update()
        particle.draw()
      }
    })

    requestAnimationFrame(animate)
  }

  // Crear fuegos artificiales continuos
  setInterval(() => {
    const x = Math.random() * canvas.width
    const y = Math.random() * (canvas.height * 0.6)
    createFirework(x, y)
  }, 200) // Más frecuentes

  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const x = canvas.width / 2 + (Math.random() - 0.5) * 600
      const y = canvas.height / 2 + (Math.random() - 0.5) * 400
      createFirework(x, y)
    }, i * 80)
  }

  animate()
}

// Confetti removed

window.addEventListener("resize", () => {
  const particlesCanvas = document.getElementById("particles-background")

  if (particlesCanvas) {
    particlesCanvas.width = window.innerWidth
    particlesCanvas.height = window.innerHeight
  }
})
