import { getImageBlob, getImageBase64 } from "../../helpers"
import {
  getFilesStateLength,
  appendFileToState
} from "../../store/Persister/persist"

const imageUploadCallback = async image =>
  await getImageBase64(image).then(imageBase64 => {
    return new Promise((resolve, reject) => {
      const key = getFilesStateLength()
      appendFileToState(key, imageBase64)
      resolve({
        data: {
          link: imageBase64
        }
      })
    })
  })

export const options = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "fontFamily",
    "list",
    "textAlign",
    "colorPicker",
    "link",
    "embedded",
    "emoji",
    "image",
    "remove",
    "history"
  ],
  inline: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "monospace",
      "superscript",
      "subscript"
    ]
    // bold: { icon: bold, className: undefined },
    // italic: { icon: italic, className: undefined },
    // underline: { icon: underline, className: undefined },
    // strikethrough: { icon: strikethrough, className: undefined },
    // monospace: { icon: monospace, className: undefined },
    // superscript: { icon: superscript, className: undefined },
    // subscript: { icon: subscript, className: undefined }
  },
  blockType: {
    inDropdown: true,
    options: [
      "Normal",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "Blockquote",
      "Code"
    ],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined
  },
  fontSize: {
    //icon: fontSize,
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined
  },
  fontFamily: {
    options: [
      "Arial",
      "Georgia",
      "Impact",
      "Tahoma",
      "Times New Roman",
      "Verdana"
    ],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined
  },
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered", "ordered", "indent", "outdent"]
    // unordered: { icon: unordered, className: undefined },
    // ordered: { icon: ordered, className: undefined },
    // indent: { icon: indent, className: undefined },
    // outdent: { icon: outdent, className: undefined }
  },
  textAlign: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["left", "center", "right", "justify"]
    //     left: { icon: left, className: undefined },
    //     center: { icon: center, className: undefined },
    //     right: { icon: right, className: undefined },
    //     justify: { icon: justify, className: undefined }
  },
  colorPicker: {
    //icon: color,
    className: "TextEditorModalWrapper",
    component: undefined,
    popupClassName: "TextEditorModal",
    colors: [
      "rgb(97,189,109)",
      "rgb(26,188,156)",
      "rgb(84,172,210)",
      "rgb(44,130,201)",
      "rgb(147,101,184)",
      "rgb(71,85,119)",
      "rgb(204,204,204)",
      "rgb(65,168,95)",
      "rgb(0,168,133)",
      "rgb(61,142,185)",
      "rgb(41,105,176)",
      "rgb(85,57,130)",
      "rgb(40,50,78)",
      "rgb(0,0,0)",
      "rgb(247,218,100)",
      "rgb(251,160,38)",
      "rgb(235,107,86)",
      "rgb(226,80,65)",
      "rgb(163,143,132)",
      "rgb(239,239,239)",
      "rgb(255,255,255)",
      "rgb(250,197,28)",
      "rgb(243,121,52)",
      "rgb(209,72,65)",
      "rgb(184,49,47)",
      "rgb(124,112,107)",
      "rgb(209,213,216)"
    ]
  },
  link: {
    inDropdown: true,
    className: "TextEditorModalWrapper",
    component: undefined,
    popupClassName: "TextEditorModal",
    dropdownClassName: undefined,
    showOpenOptionOnHover: true,
    defaultTargetOption: "_self",
    options: ["link", "unlink"]
    //link: { icon: link, className: undefined },
    //unlink: { icon: unlink, className: undefined }
  },
  emoji: {
    //icon: emoji,
    className: "TextEditorModalWrapper",
    component: undefined,
    popupClassName: "TextEditorModal",
    emojis: [
      "😀",
      "😁",
      "😂",
      "😃",
      "😉",
      "😋",
      "😎",
      "😍",
      "😗",
      "🤗",
      "🤔",
      "😣",
      "😫",
      "😴",
      "😌",
      "🤓",
      "😛",
      "😜",
      "😠",
      "😇",
      "😷",
      "😈",
      "👻",
      "😺",
      "😸",
      "😹",
      "😻",
      "😼",
      "😽",
      "🙀",
      "🙈",
      "🙉",
      "🙊",
      "👼",
      "👮",
      "🕵",
      "💂",
      "👳",
      "🎅",
      "👸",
      "👰",
      "👲",
      "🙍",
      "🙇",
      "🚶",
      "🏃",
      "💃",
      "⛷",
      "🏂",
      "🏌",
      "🏄",
      "🚣",
      "🏊",
      "⛹",
      "🏋",
      "🚴",
      "👫",
      "💪",
      "👈",
      "👉",
      "👉",
      "👆",
      "🖕",
      "👇",
      "🖖",
      "🤘",
      "🖐",
      "👌",
      "👍",
      "👎",
      "✊",
      "👊",
      "👏",
      "🙌",
      "🙏",
      "🐵",
      "🐶",
      "🐇",
      "🐥",
      "🐸",
      "🐌",
      "🐛",
      "🐜",
      "🐝",
      "🍉",
      "🍄",
      "🍔",
      "🍤",
      "🍨",
      "🍪",
      "🎂",
      "🍰",
      "🍾",
      "🍷",
      "🍸",
      "🍺",
      "🌍",
      "🚑",
      "⏰",
      "🌙",
      "🌝",
      "🌞",
      "⭐",
      "🌟",
      "🌠",
      "🌨",
      "🌩",
      "⛄",
      "🔥",
      "🎄",
      "🎈",
      "🎉",
      "🎊",
      "🎁",
      "🎗",
      "🏀",
      "🏈",
      "🎲",
      "🔇",
      "🔈",
      "📣",
      "🔔",
      "🎵",
      "🎷",
      "💰",
      "🖊",
      "📅",
      "✅",
      "❎",
      "💯"
    ]
  },
  embedded: {
    //icon: embedded,
    className: "TextEditorModalWrapper",
    component: undefined,
    popupClassName: "TextEditorModal",
    embedCallback: (embeddedLink, height, width) => {
      if (embeddedLink.includes("youtube")) {
        embeddedLink = embeddedLink
          .replace("watch?v=", "embed/")
          .replace("/watch/", "/embed/")
          .replace("youtu.be/", "youtube.com/embed/")
      }
      return embeddedLink
    },
    defaultSize: {
      height: "540",
      width: "100%"
    }
  },
  image: {
    //icon: image,
    className: "TextEditorModalWrapper",
    component: undefined,
    popupClassName: "TextEditorModal",
    urlEnabled: true,
    uploadEnabled: true,
    alignmentEnabled: true,
    uploadCallback: imageUploadCallback,
    previewImage: true,
    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: "270",
      width: "auto"
    }
  },
  //remove: { icon: eraser, className: undefined, component: undefined },
  history: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["undo", "redo"]
    // undo: { icon: undo, className: undefined },
    // redo: { icon: redo, className: undefined }
  }
}
