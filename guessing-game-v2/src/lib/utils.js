export function trackEvent(eventName, eventData) {
  if (!window.gtag) {
    return
  }
  window.gtag('event', eventName, eventData)
}
