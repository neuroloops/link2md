document.addEventListener('DOMContentLoaded', () => {
  const popup = document.querySelector('div')
  chrome.extension.getBackgroundPage().openPopup(popup)
})