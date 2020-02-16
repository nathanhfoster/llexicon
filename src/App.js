import { useEffect } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { SetWindow, CheckAppVersion } from "./redux/App/actions"
import { GetUserSettings } from "./redux/User/actions"
import { SetCalendar } from "./redux/Calendar/Calendar"
import {
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
} from "./redux/Entries/actions"

const FIFTEEN_MINUTES = 1000 * 60 * 15

const mapStateToProps = ({ User: { id } }) => ({
  UserId: id
})

const mapDispatchToProps = {
  SetWindow,
  GetUserSettings,
  CheckAppVersion,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
}

const App = ({
  GetUserSettings,
  UserId,
  CheckAppVersion,
  SetWindow,
  SetCalendar,
  SyncEntries,
  GetUserEntries,
  GetUserEntryTags
}) => {
  useEffect(() => {
    const activeDate = new Date()

    SetCalendar({ activeDate })

    CheckAppVersion()

    setInterval(() => CheckAppVersion(), FIFTEEN_MINUTES)

    const handleResize = () => SetWindow()

    window.addEventListener("resize", handleResize)

    handleResize()

    if (UserId) {
      SyncEntries(() => new Promise(resolve => resolve(GetUserEntries(1))))
      GetUserSettings()
      GetUserEntryTags()
    }

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return null
}

App.propTypes = {
  UserId: PropTypes.number,
  SetWindow: PropTypes.func.isRequired,
  GetUserSettings: PropTypes.func.isRequired,
  SetCalendar: PropTypes.func.isRequired,
  SyncEntries: PropTypes.func.isRequired,
  GetUserEntries: PropTypes.func.isRequired
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(App)
