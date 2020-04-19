import { Quill } from "react-quill"
const Link = Quill.import("formats/link")
const BlockEmbed = Quill.import("blots/block/embed")
// https://github.com/zenoamaro/react-quill/issues/436

class Video extends BlockEmbed {
  static create(value) {
    const editorRef = document.getElementById("TextEditor")

    let iFrameHeight = "auto"
    let iFrameWidth = "100%"

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

    // console.log(iFrameHeight, iFrameWidth)

    if (value.includes("watch?v=")) {
       value = value.replace("watch?v=", "embed/")
    }

    if (value.includes("/watch/")) {
       value = value.replace("/watch/", "/embed/")
    }

    if (value.includes("youtu.be/")) {
       value = value.replace("youtu.be/", "youtube.com/embed/")
    }

    let node = super.create(value)
    let iframe = document.createElement("iframe")
    iframe.setAttribute("controls", true)
    // iframe.setAttribute('type', "video/mp4")
    iframe.setAttribute("frameborder", "0")
    iframe.setAttribute("allowfullscreen", true)

    iframe.setAttribute("height", iFrameHeight)
    iframe.setAttribute("width", iFrameWidth)

    iframe.setAttribute("src", this.sanitize(value))
    node.appendChild(iframe)
    return node
  }

  static value = (domNode) => {
    if (domNode.firstChild) {
      return domNode.firstChild.getAttribute("src")
    }
  }

  static sanitize = (url) => Link.sanitize(url)
}

Video.blotName = "video"
Video.className = "ql-video"
Video.tagName = "div"

export default Video
