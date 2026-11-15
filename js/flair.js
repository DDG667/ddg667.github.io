/* Subtle hero parallax. Desktop pointers only, and never when the visitor
   prefers reduced motion. Values are consumed by custom.css. */
(function () {
  'use strict'

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

  if (reduceMotion.matches || !finePointer.matches) return

  var root = document.documentElement
  var frame = 0
  var targetX = 0
  var targetY = 0
  var currentX = 0
  var currentY = 0
  var spotlight = null

  function apply(x, y) {
    root.style.setProperty('--hero-mx', x.toFixed(3))
    root.style.setProperty('--hero-my', y.toFixed(3))
  }

  function moveSpotlight(event) {
    var header = document.querySelector('#page-header.full_page')
    if (!header) return

    var rect = header.getBoundingClientRect()
    if (event.clientY < rect.top || event.clientY > rect.bottom) return

    if (!spotlight || !spotlight.isConnected) {
      spotlight = header.querySelector('.hero-spotlight')
      if (!spotlight) {
        spotlight = document.createElement('div')
        spotlight.className = 'hero-spotlight'
        spotlight.setAttribute('aria-hidden', 'true')
        header.appendChild(spotlight)
      }
    }

    spotlight.style.setProperty('--hx', (event.clientX - rect.left).toFixed(1) + 'px')
    spotlight.style.setProperty('--hy', (event.clientY - rect.top).toFixed(1) + 'px')
  }

  function tick() {
    frame = 0
    currentX += (targetX - currentX) * 0.12
    currentY += (targetY - currentY) * 0.12
    apply(currentX, currentY)

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      frame = window.requestAnimationFrame(tick)
    }
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', function (event) {
    targetX = (event.clientX / window.innerWidth - 0.5) * 2
    targetY = (event.clientY / window.innerHeight - 0.5) * 2
    moveSpotlight(event)
    schedule()
  }, { passive: true })

  document.addEventListener('mouseleave', function () {
    targetX = 0
    targetY = 0
    schedule()
  })

  reduceMotion.addEventListener('change', function () {
    if (reduceMotion.matches) {
      targetX = 0
      targetY = 0
      currentX = 0
      currentY = 0
      apply(0, 0)
    }
  })
})()
