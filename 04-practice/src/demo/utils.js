export function getRandomCount(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

export function getRandomHueColor() {
  return getRandomCount(0, 360)
}

export function setAppColor() {
  document.body.style.setProperty('--hue', getRandomHueColor())
}

const ORIGIN_TITLE = document.title

export function setDocumentTitle(targetCount) {
  document.title = `(${targetCount}) ${ORIGIN_TITLE}`
}
