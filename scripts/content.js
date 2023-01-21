
// const insert = (content) => {

//   // Find Calmly editor input section
//   const elements = document.getElementsByClassName('droid')
//   if (elements.length === 0) {
//     return
//   }

//   const element = elements[0]

//   // Grab the first p tag so we can replace it with our injection
//   const pToRemove = element.childNodes[1]
//   pToRemove?.remove()

//   // Split content by \n
//   console.log(content)
//   let splitContent = ''

//   if (typeof content === 'object') {
//     splitContent = content.join(',')
//   }
//   console.log(typeof content)
//   console.log(splitContent)
//   splitContent = content?.split('\n')

//   // Wrap in p tags
//   splitContent.forEach((content) => {
//     const p = document.createElement('p')

//     if (content === '') {
//       const br = document.createElement('br')
//       p.appendChild(br)
//     } else {
//       p.textContent = content
//     }

//     // Insert into HTML one at a time
//     element.appendChild(p)
//   })

//   // On success return true
//   return true
// }


//   // })

//   // // This is the message listener
//   // chrome.runtime.onMessage.addListener(
//   //   (request, sender, sendResponse) => {
//   //     console.log('l52', request)
//   //     if (request.requested == 'createDiv') {
//   //       sendResponse({ confirmation: "Successfully created div" })
//   //     }
//   //     // if (request.message === 'inject') {
//   //     //   const { content } = request

//   //     //   // Call this insert function
//   //     //   const result = insert(content)

//   //     //   // If something went wrong, send a failed status
//   //     //   if (!result) {
//   //     //     sendResponse({ status: 'failed' })
//   //     //   }

//   //     //   sendResponse({ status: 'success' })
//   //     // }
// }
// )

// Notification body.
const notification = document.createElement("div")
notification.className = 'overlay'

// const content = document.createElement("div")
// notification.className = 'content'

// notification.appendChild(content)

// Notification icon.
const icon = document.createElement('img')
icon.src = chrome.runtime.getURL("assets/t2md_48.png")

notification.appendChild(icon)

// Notification text.
const notificationText = document.createElement('p')
notification.appendChild(notificationText)

// Add to current page.
document.body.appendChild(notification)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  const notification = document.getElementsByClassName('content')[0]
  const notificationText = notification.getElementsByTagName('p')[0]

  notificationText.innerHTML = request.tabTitle

  notification.style.display = 'flex'

  return true
})