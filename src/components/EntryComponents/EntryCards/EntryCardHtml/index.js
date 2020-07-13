import React, { memo } from "react"
import ReactQuill from "react-quill"
import PropTypes from "prop-types"
import "./styles.css"

const EntryCardHtml = ({ html, modules, styles, reduceHtml }) => {
  const reducedHtml = reduceHtml ? html.slice(0, 1000) : html

  return (
    <ReactQuill
      className="EntryCardHtml"
      readOnly={true}
      style={styles}
      modules={modules}
      value={reducedHtml}
      placeholder={"No entry text..."}
    />
  )
}

EntryCardHtml.propTypes = {
  html: PropTypes.string.isRequired,
  modules: PropTypes.object.isRequired,
  styles: PropTypes.object,
  reduceHtml: PropTypes.bool.isRequired,
}

EntryCardHtml.defaultProps = {
  modules: { toolbar: false },
  styles: { height: 160, width: "100%" },

}

export default memo(EntryCardHtml)
