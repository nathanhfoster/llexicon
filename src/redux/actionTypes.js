import * as AdminActionTypes from './Admin/types'
import * as AlertActionTypes from './Alerts/types'
import * as AppActionTypes from './App/types'
import * as CalendarActionTypes from './Calendar/types'
import * as EntriesActionTypes from './Entries/types'
import * as MapActionTypes from './Map/types'
import * as RouterActionTypes from './router/types'
import * as TextEditorActionTypes from './TextEditor/types'
import * as UserActionTypes from './User/types'
import * as WindowActionTypes from './Window/types'

export default {
  ...AdminActionTypes,
  ...AlertActionTypes,
  ...AppActionTypes,
  ...CalendarActionTypes,
  ...EntriesActionTypes,
  ...MapActionTypes,
  ...RouterActionTypes,
  ...TextEditorActionTypes,
  ...UserActionTypes,
  ...WindowActionTypes,
}
