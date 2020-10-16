import { useState, useCallback, useEffect } from 'react'

const useAddToHomescreenPrompt = () => {
  const [prompt, setPrompt] = useState(null)

  const promptToInstall = useCallback(() => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event',
      ),
    )
  }, [prompt])

  useEffect(() => {
    const ready = prompt => {
      prompt.preventDefault()
      setPrompt(prompt)
    }
    window.addEventListener('beforeinstallprompt', ready)
    return () => {
      window.removeEventListener('beforeinstallprompt', ready)
    }
  }, [])
  
  return [prompt, promptToInstall]
}

export default useAddToHomescreenPrompt
