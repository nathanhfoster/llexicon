import React, { memo } from "react"
import PropTypes from "prop-types"
import ButtonContainer from "../ButtonContainer"

const ClearButton = ({ onClickCallback }) => (
  <ButtonContainer onClickCallback={onClickCallback} title="Clear">
    <i className="fas fa-window-close" />
  </ButtonContainer>
)

ClearButton.prototypes = { PropTypes: PropTypes.func.isRequired }

export default memo(ClearButton)
