const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['link2md-key'], (result) => {
      resolve(result['link2md-key'])
    })
  })
}

const checkForTags = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['link2md-tags'], (result) => {
      resolve(result['link2md-tags'])
    })
  })
}

const encode = (input) => {
  return btoa(input)
}

const saveKey = () => {
  const input = document.getElementById('key_input')

  if (input) {
    const { value } = input

    // Encode String
    const encodedValue = encode(value)

    // Save to google storage
    chrome.storage.local.set({ 'link2md-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none'
      document.getElementById('key_entered').style.display = 'block'
    })
  }
}

const changeKey = () => {
  document.getElementById('key_needed').style.display = 'block'
  document.getElementById('key_entered').style.display = 'none'
}

document.getElementById('save_key_button').addEventListener('click', saveKey)
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey)

checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none'
    document.getElementById('key_entered').style.display = 'block'
  }
  checkForTags().then((response) => {
    if (response !== 'undefined') {
      console.log('no tag')
      return
    }
    console.log('tag:', response)
  })
})



const setTags = () => {

  const input = document.getElementById('tags_input')
  if (input) {
    const { value } = input
    const hashTags = value.split(',').map(item => '#' + item.trim()).join(',')

    // Save to google storage
    chrome.storage.local.set({ 'link2md-tag': hashTags })
  }
}

document.getElementById('save_key_button').addEventListener('click', saveKey)

document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey)

document.getElementById('generate_button').addEventListener('click', setTags)