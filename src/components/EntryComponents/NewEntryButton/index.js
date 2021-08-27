import React, { memo } from 'react'
import { Button, ButtonGroup } from 'reactstrap'
import { RouteMap, RouterPush } from 'redux/router/actions'
import { ButtonImportEntries } from 'components'

export const NewEntryButton = () => (
  <ButtonGroup>
    <Button color='accent' onClick={() => RouterPush(RouteMap.NEW_ENTRY)}>
      <i className='fas fa-feather-alt mr-1' />
      Create a new journal entry
    </Button>
    <ButtonImportEntries />
  </ButtonGroup>
)

NewEntryButton.propTypes = {}

NewEntryButton.defaultProps = {}

export default memo(NewEntryButton)
