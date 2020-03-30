import React, { memo } from "react"
import ReactQuill from "react-quill"
import PropTypes from "prop-types"

const EntryCardHtml = ({ html, modules }) => (
  <ReactQuill
    readOnly={true}
    style={{ height: 200, width: "100%" }}
    modules={modules}
    value={html}
    placeholder={"No entry text..."}
  />
)

EntryCardHtml.propTypes = { html: PropTypes.string, modules: PropTypes.object }

EntryCardHtml.defaultProps = { modules: { toolbar: false } }

export default memo(EntryCardHtml)
