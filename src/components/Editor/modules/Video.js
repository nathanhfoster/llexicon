import { Quill } from 'react-quill'
const Link = Quill.import('formats/link')
const BlockEmbed = Quill.import('blots/block/embed')
// https://github.com/zenoamaro/react-quill/issues/436

export const cleanUrl = url =>
  url
    .replace('watch?v=', 'embed/')
    .replace('/watch/', '/embed/')
    .replace('youtu.be/', 'youtube.com/embed/')

class Video extends BlockEmbed {
  static create(value) {
    value = cleanUrl(value)
    const editorRef = document.getElementById('TextEditor')

    let iFrameHeight = '270px'
    let iFrameWidth = '480px'

    if (editorRef) {
      const editorContainerRef = editorRef.children[1].children[0]
      const { offsetHeight, offsetWidth } = editorContainerRef

      if (offsetHeight > 0) {
        iFrameHeight = `${offsetHeight}px`
        iFrameWidth = `${offsetHeight * (16 / 9)}px`
      }
      if (offsetWidth > 0) {
        // iFrameWidth = `${offsetWidth}px`
      }
    }

    let node = super.create(value)
    let div = document.createElement('div')
    div.setAttribute('class', 'embed-responsive embed-responsive-16by9')
    let iframe = document.createElement('iframe')
    iframe.setAttribute('controls', true)
    // iframe.setAttribute('type', "video/mp4")
    iframe.setAttribute('frameborder', '0')
    iframe.setAttribute('allowfullscreen', true)

    iframe.setAttribute('height', iFrameHeight)
    iframe.setAttribute('width', iFrameWidth)
    iframe.setAttribute('class', 'embed-responsive-item')

    iframe.setAttribute('src', this.sanitize(value))

    div.appendChild(iframe)

    node.appendChild(div)
    return node
  }

  static value = domNode => {
    if (domNode.firstChild) {
      return domNode.firstChild.getAttribute('src')
    }
  }

  static sanitize = url => Link.sanitize(url)
}

Video.blotName = 'video'
Video.className = 'ql-video'
Video.tagName = 'div'

export default Video
