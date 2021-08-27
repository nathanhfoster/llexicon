import React from 'react'
import { render, screen } from 'redux/testUtils'
// import { AddToHomeScreenModal } from './AddToHomeScreen'
// import { AlertNotifications } from './AlertNotifications'
import { BackgroundImage } from './BackgroundImage'
import { BasicCard } from './BasicComponents/BasicCard'
import { BasicCarousel } from './BasicComponents/BasicCarousel'
import { BasicDropDown } from './BasicComponents/BasicDropDown'
import { BasicForm } from './BasicComponents/BasicForm'
import { BasicImageCarousel } from './BasicComponents/BasicImageCarousel'
import { BasicInput } from './BasicComponents/BasicInput'
import { BasicList } from './BasicComponents/BasicList'
// import { BasicMap } from './BasicComponents/BasicMap'
import { BasicModal } from './BasicComponents/BasicModal'
import { BasicOption } from './BasicComponents/BasicOption'
import { BasicProgress } from './BasicComponents/BasicProgress'
// import { BasicSearchBar } from './BasicComponents/BasicSearchBar'
// import { BasicTableProvider } from './BasicComponents/BasicTable'
import { BasicTabs } from './BasicComponents/BasicTabs'
// import { ButtonClearCache } from './ButtonClearCache'
// import { ConfirmAction } from './ConfirmAction'
// import { DebounceInput } from './DebounceInput'
// import { Editor } from './Editor'
// import { ButtonClearEntries } from './EntryComponents/Buttons/ButtonClearEntries'
// import { ButtonClearSelectedEntries } from './EntryComponents/Buttons/ButtonClearSelectedEntries'
// import { ButtonDeleteEntries } from './EntryComponents/Buttons/ButtonDeleteEntries'
// import { ButtonEditEntries } from './EntryComponents/Buttons/ButtonEditEntries'
import { ButtonExportEntries } from './EntryComponents/Buttons/ButtonExportEntries'
// import { ButtonShareEntries } from './EntryComponents/Buttons/ButtonShareEntries'
// import { EntriesList } from './EntryComponents/EntriesList'
// import { EntriesMap } from './EntryComponents/EntriesMap'
// import { EntriesMedia } from './EntryComponents/EntriesMedia'
// import { EntriesMostViewed } from './EntryComponents/EntriesMostViewed'
// import { EntriesRandom } from './EntryComponents/EntriesRandom'
// import { EntriesRediscover } from './EntryComponents/EntriesRediscover'
// import { EntriesTable } from './EntryComponents/EntriesTable'
// import { EntriesToggleShowOnlyPublic } from './EntryComponents/EntriesToggleShowOnlyPublic'
// import { Entry } from './EntryComponents/Entry'
// import { EntryCalendar } from './EntryComponents/EntryCalendar'
// import { EntryCards } from './EntryComponents/EntryCards'
import { EntryDataCellLink } from './EntryComponents/EntryDataCellLink'
// import { EntryFilesCarousel } from './EntryComponents/EntryFilesCarousel'
import { EntryFolders } from './EntryComponents/EntryFolders'
// import { EntryList } from './EntryComponents/EntryList'
// import { EntryMinimal } from './EntryComponents/EntryMinimal'
// import { EntryNavButtons } from './EntryComponents/EntryNavButtons'
// import { EntryOptionsMenu } from './EntryComponents/EntryOptionsMenu'
import { ButtonImportEntries } from './EntryComponents/Buttons/ButtonImportEntries'
import { NewEntryButton } from './EntryComponents/NewEntryButton'
import { RatingIcon } from './EntryComponents/RatingIcon'
import { RatingStar } from './EntryComponents/RatingStar'
import { TagsContainer } from './EntryComponents/TagsContainer'
import { FacebookGoogleLogin } from './FacebookGoogleLogin'
import { FileUpload } from './FileUpload'
import { Footer } from './Footer'
import { Header } from './Header'
import { LoadingScreen } from './LoadingScreen'
import { LocalStorage } from './LocalStorage'
import { MemoizedComponent } from './MemoizedComponent'
import { MetaTags } from './MetaTags'
import { NavBar } from './NavBar'
import { Persistor } from './Persistor'
import { Portal } from './Portal'
import { PushNotifications } from './PushNotifications'
import { SearchList } from './SearchList'
import { ShareUrlLinks } from './ShareUrlLinks'
import { StarSearch } from './StarSearch'
import { UseDebounce } from './UseDebounce'
import { UseInterval } from './UseInterval'
import { ViewPortContainer } from './ViewPortContainer'

const componentsToTest = {
  // AddToHomeScreenModal,
  // AlertNotifications,
  BackgroundImage,
  BasicCard,
  BasicCarousel,
  BasicDropDown,
  BasicForm,
  // BasicImageCarousel,
  BasicInput,
  BasicList,
  // BasicMap,
  BasicModal,
  BasicOption,
  BasicProgress,
  // BasicSearchBar,
  // BasicTableProvider,
  // BasicTabs,
  // ButtonClearCache,
  // ConfirmAction,
  // DebounceInput,
  // Editor,
  // ButtonClearEntries,
  // ButtonClearSelectedEntries,
  // ButtonDeleteEntries,
  // ButtonEditEntries,
  ButtonExportEntries,
  // ButtonShareEntries,
  // EntriesList,
  // EntriesMap,
  // EntriesMedia,
  // EntriesMostViewed,
  // EntriesRandom,
  // EntriesRediscover,
  // EntriesTable,
  // EntriesToggleShowOnlyPublic,
  // Entry,
  // EntryCalendar,
  // EntryCards,
  EntryDataCellLink,
  // EntryFilesCarousel,
  EntryFolders,
  // EntryList,
  // EntryMinimal,
  // EntryNavButtons,
  // EntryOptionsMenu,
  ButtonImportEntries,
  NewEntryButton,
  RatingIcon,
  RatingStar,
  TagsContainer,
  // FacebookGoogleLogin,
  FileUpload,
  Footer,
  Header,
  LoadingScreen,
  LocalStorage,
  // MemoizedComponent,
  // MetaTags,
  NavBar,
  Persistor,
  Portal,
  // PushNotifications,
  // SearchList,
  ShareUrlLinks,
  StarSearch,
  UseDebounce,
  UseInterval,
  ViewPortContainer,
}

let props
let wrapper
describe('Components', () => {
  beforeEach(() => {
    props = {
      Component: <div>Test</div>,

      // required props
      name: 'Test',
      version: 1,
      children: <div>Test</div>,
      href: 'Test',
      isPending: true,
      adminIsPending: true,

      // functions
      SyncEntries: jest.fn(),
      LoadReducerStatePending: jest.fn(),
      onClick: jest.fn(),
      onMouseEnterCallback: jest.fn(),
      onMouseLeaveCallback: jest.fn(),
      onChange: jest.fn(),
      LoadReducerState: jest.fn(),
      SetLocalStorageUsage: jest.fn(),
      SetSearchEntries: jest.fn(),
      ResetSearchEntries: jest.fn(),
      SearchUserEntries: jest.fn(),
    }
  })
  const runTest = (name, Component, testNumber) =>
    it(`Mounts component ${testNumber} - ${name}`, () => {
      wrapper = render(<Component {...props} />)

      expect(wrapper).toBeDefined()
    })
  Object.entries(componentsToTest).forEach(([key, value], i) => runTest(key, value, i))
})
