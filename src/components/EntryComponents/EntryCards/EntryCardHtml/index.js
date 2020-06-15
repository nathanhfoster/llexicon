import React, { useMemo, memo } from "react"
import ReactQuill from "react-quill"
import PropTypes from "prop-types"
import "./styles.css"

const EntryCardHtml = ({ html, modules, styles }) => {
  const reducedHtml = useMemo(() => html.slice(0, 1000), [html])

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
}

EntryCardHtml.defaultProps = {
  modules: { toolbar: false },
  styles: { height: 160, width: "100%" },
}

export default memo(EntryCardHtml)
