import { Quill } from 'react-quill'
const Parchment = Quill.import('parchment')
const BaseImage = Quill.import('formats/image')

const ATTRIBUTES = ['alt', 'height', 'width', 'style']

const WHITE_STYLE = ['margin', 'display', 'float']

class Image extends BaseImage {
  constructor(props) {
    super(props)
  }
  static formats(domNode) {
    return ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        if (name === 'style') {
          value = this.sanitize_style(value)
        }
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }

  sanitize_style(style) {
    let style_arr = style.split(';')
    let allow_style = ''
    style_arr.forEach((v, i) => {
      if (WHITE_STYLE.indexOf(v.trim().split(':')[0]) !== -1) {
        allow_style += v + ';'
      }
    })
    return allow_style
  }
}

export default Image
