
const insert = (content) => {

  // Find Calmly editor input section
  const elements = document.getElementsByClassName('droid')
  if (elements.length === 0) {
    return
  }

  const element = elements[0]

  // Grab the first p tag so we can replace it with our injection
  const pToRemove = element.childNodes[1]
  pToRemove?.remove()

  // Split content by \n
  console.log(content)
  let splitContent = ''

  if (typeof content === 'object') {
    splitContent = content.join(',')
  }
  console.log(typeof content)
  console.log(splitContent)
  splitContent = content?.split('\n')

  // Wrap in p tags
  splitContent.forEach((content) => {
    const p = document.createElement('p')

    if (content === '') {
      const br = document.createElement('br')
      p.appendChild(br)
    } else {
      p.textContent = content
    }

    // Insert into HTML one at a time
    element.appendChild(p)
  })

  // On success return true
  return true
}




// This is the message listener
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log('l52', request)

    if (request.message === 'inject') {
      const { content } = request

      // Call this insert function
      const result = insert(content)

      // If something went wrong, send a failed status
      if (!result) {
        sendResponse({ status: 'failed' })
      }

      sendResponse({ status: 'success' })
    }
  }
)

// Notification body.
const overlay = document.createElement("div")
overlay.className = 'link2md-overlay'

const content = document.createElement("div")
content.className = 'link2md-content'

overlay.appendChild(content)

const header = document.createElement('div')
header.className = 'link2md-header'
content.appendChild(header)


const icon = document.createElement('img')
icon.src = chrome.runtime.getURL("assets/t2md_48.png")

header.appendChild(icon)

const title = document.createElement('p')
title.className = 'link2md-title'
title.innerHTML = "Link2.md"
header.appendChild(title)

const whitespace = document.createElement('p')
whitespace.className = 'link2md-whitespace'
whitespace.innerHTML = " "
header.appendChild(whitespace)
// const tagInput = document.createElement('input')
// tagInput.className = "tagInput"
// content.appendChild(tagInput)

// const tagBtn = document.createElement('button')
// tagBtn.innerHTML = "generate"
// tagBtn.className = "tagBtn"
// content.appendChild(tagBtn)

// Notification text.
const link = document.createElement('p')
link.className = 'link2md-link'
content.appendChild(link)

const text = document.createElement('p')
text.className = 'link2md-text'
content.appendChild(text)

// Add to current page.
document.body.appendChild(overlay)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request)
  const overlay = document.getElementsByClassName('link2md-overlay')[0]
  const link = content.getElementsByClassName('link2md-link')[0]
  const text = content.getElementsByClassName('link2md-text')[0]

  if (request.message == 'link') {
    link.innerHTML = request.content
  }
  if (request.message == 'text') {
    text.innerHTML = request.content
  }

  overlay.style.display = 'flex'

  return true
})