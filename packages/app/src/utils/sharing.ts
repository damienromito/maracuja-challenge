import { Plugins } from '@capacitor/core'
const { Share } = Plugins

const openShareSheet = ({ title, dialogTitle, text, url, platform }) => {
  const mailtoString = `mailto:?subject=${title}&body=${text}%0d%0a : ${url}`
  if (platform === 'web') {
    //@ts-ignore
    window.location = mailtoString
    return true
  } else {
    return Share.share({ title, dialogTitle, text, url }).then(() => {
      return true
    }).catch(err => {
      //@ts-ignore
      window.location = mailtoString
      return Promise.reject(err)
    })
  }
}

export {
  openShareSheet
}
