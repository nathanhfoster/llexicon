import * as React from "react"

export const useAddToHomescreenPrompt = () => {
  const [prompt, setState] = React.useState(null)
  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    )
  }
  React.useEffect(() => {
    const ready = e => {
      e.preventDefault()
      setState(e)
    }
    window.addEventListener("beforeinstallprompt", ready)
    return () => {
      window.removeEventListener("beforeinstallprompt", ready)
    }
  }, [])
  return [prompt, promptToInstall]
}
