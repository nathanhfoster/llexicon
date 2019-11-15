import React, { memo } from "react"
import PropTypes from "prop-types"
import ButtonContainer from "../ButtonContainer"

const HtmlButton = ({ onClickCallback }) => (
  <ButtonContainer onClickCallback={onClickCallback} title="Html">
    <i className="fas fa-code" />
  </ButtonContainer>
)

HtmlButton.prototypes = { PropTypes: PropTypes.func.isRequired }

export default memo(HtmlButton)
