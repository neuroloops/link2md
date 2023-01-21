const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['link2md-key'], (result) => {
      if (result['link2md-key']) {
        const decodedKey = atob(result['link2md-key'])
        resolve(decodedKey)
      }
    })
  })
}

const getTags = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['link2md-tag'], (result) => {
      if (result['link2md-tag']) {
        console.log(result['link2md-tag'])
        resolve(result['link2md-tag'])
      }
    })
  })
}

const getUrl = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      console.log(tabs[0].url)
      resolve(tabs[0].url)
    })
  })
}

const sendMessage = (content, type) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]?.id

    chrome.tabs.sendMessage(
      activeTab,
      { message: type, content },
      (response) => {
        // console.log(response)
        if (response?.status === 'failed') {
          console.log('injection failed.')
        }
      }
    )
  })
}

const generate = async (prompt) => {
  // Get your API key from storage
  const key = await getKey()


  // console.log(chrome.storage.local.get(['openai-tags']))
  const url = 'https://api.openai.com/v1/completions'

  // Call completions endpoint
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  })

  // Select the top choice and send back
  const completion = await completionResponse.json()
  console.log(completion)
  return completion.choices.pop()
}



const generateCompletionAction = async (info) => {
  // getTags()
  // createDiv()

  try {

    sendMessage('generating...')

    const myUrl = await getUrl()
    const { selectionText } = info
    const tags = await getTags()
    console.log(tags)
    // const tags = new Array(await getTags())

    // Send message with generating text (this will be like a loading indicator)



    const basePromptPrefix = `
    convert the link below to markdown link.
    Link: ${myUrl}
    `

    const baseCompletion = await generate(`${basePromptPrefix}`)

    console.log(baseCompletion.text)
    sendMessage(baseCompletion.text, 'link')
    // Add your second prompt here

    let title = baseCompletion.text.match(/\[(.*?)\]/)

    const secondPrompt = `
      Take the Title, Url, Tags and Selection below to generate a short description:

      Title: ${title}
      Url: ${baseCompletion.text}
      Tags: ${tags}
      Selection: ${selectionText}

      `


    // Let's see what we get!
    const secondPromptCompletion = await generate(secondPrompt)

    // Send the output when we're all done


    console.log(secondPromptCompletion.text)
    sendMessage(secondPromptCompletion.text, 'text')

  } catch (error) {
    console.log(error)
  }
}


chrome.runtime.onInstalled.addListener(() => {

  chrome.contextMenus.create({
    id: 'context-run',
    title: 'Select your title',
    contexts: ['selection'],
  })
})

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction)

function barkTitle() {
  const query = { active: true, currentWindow: true }
  chrome.tabs.query(query, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      tabTitle: baseCompletion.text
    })
  })
}


chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case 'bark':
      barkTitle()
      break
    default:
      console.log(`Command ${command} not found`)
  }
})