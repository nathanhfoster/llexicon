import React, { PureComponent, createRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import BasicList from '../BasicList'
import UseDebounce from '../UseDebounce'
import { getSearchValue, filterList, getTextWidth, mergeLists } from './functions'

import './styles.css'

const TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK = 200

class SearchList extends PureComponent {
  constructor(props) {
    super(props)
    this.searchListRef = createRef()
    const { initiallyRenderList, list, defaultValue, value, height, width, showList } = props

    const searchValue = defaultValue || getSearchValue(list, value)

    this.state = {
      initiallyRenderList,
      showList,
      showDropDownIcon: true,
      searchValue,
      typingSearchValue: false,
      list,
      height,
      width,
      value,
      searchListRef: {}
    }
  }

  static propTypes = {
    // Input / list props
    defaultValue: PropTypes.string,

    list: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        otherValue: PropTypes.any
      }).isRequired
    ),
    cacheList: PropTypes.bool,

    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    maxHeight: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    itemSize: PropTypes.number.isRequired,
    listPosition: PropTypes.oneOf([
      'static',
      'absolute',
      'fixed',
      'relative',
      'sticky',
      'initial',
      'inherit'
    ]),

    // Callback props
    onListItemClickCallback: PropTypes.func, // When an item is clicked
    onChangeCallback: PropTypes.func, // When searching
    onChangeCallbackDebounceDelay: PropTypes.number,
    onBlurCallback: PropTypes.func,
    onFocusCallback: PropTypes.func,
    onScrollToBottomOfListCallback: PropTypes.func // When scrolled to the bottom of the list,
  }

  static defaultProps = {
    placeholder: 'Search...',
    maxHeight: 250,
    height: 250,
    width: 300,
    itemSize: 50,
    list: [],
    showList: false,
    initiallyRenderList: true,
    cacheList: false,
    listPosition: 'absolute',
    onChangeCallbackDebounceDelay: 400
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { initiallyRenderList, searchValue, showList, searchListRef, typingSearchValue } = prevState
    const { defaultValue, itemSize, maxHeight, value, cacheList } = nextProps
    let nextList = nextProps.list

    if (cacheList) {
      nextList = mergeLists(nextList, prevState.list)
    }

    let list = filterList(nextList, searchValue, initiallyRenderList)

    const listHeight = list.length * itemSize

    const height = listHeight > maxHeight ? maxHeight : listHeight

    if (!typingSearchValue) {
      searchValue = getSearchValue(list, value)
    }

    const { clientWidth, offsetWidth } = searchListRef
    const currentSearchValueWidth = getTextWidth(searchValue, '1rem system-ui')
    const listSearchDropDownIconOffset = 16
    const listSearchInputMaxWidth = offsetWidth - listSearchDropDownIconOffset

    const currentSearchValueOverflowed = currentSearchValueWidth > listSearchInputMaxWidth

    const showDropDownIcon = !currentSearchValueOverflowed

    return {
      searchValue,
      list,
      height,
      showList,
      showDropDownIcon,
      value,
      searchListRef,
      width: clientWidth
    }
  }

  componentDidMount() {
    this.setState({ searchListRef: this.searchListRef.current })
  }

  onListItemClick = (id, value) => {
    const { onListItemClickCallback } = this.props
    if (onListItemClickCallback) {
      onListItemClickCallback(id, value)
    }
    this.setState({ showDropDownIcon: true })
  }

  onSearchChange = e => {
    const { value } = e.target
    this.setState({ searchValue: value, initiallyRenderList: false })
  }

  handleInputFocus = () => {
    const { onFocusCallback } = this.props
    const { searchValue } = this.state
    if (onFocusCallback) onFocusCallback(searchValue)
    this.setState({ showList: true })
  }

  handleInputBlur = () => {
    const { onBlurCallback } = this.props
    const { searchValue } = this.state
    if (onBlurCallback) onBlurCallback(searchValue)
    this.setState({ showList: false })
  }

  handleDropDownIconClick = () => {
    this.setState(prevState => {
      const { placeholder } = this.props
      const { searchValue, showList } = prevState
      if (searchValue === placeholder && !showList) {
        return {
          showList: true,
          searchValue: ''
        }
      } else {
        return { showList: !showList }
      }
    })
  }

  handleDropDownIconBlur = () => {
    const { onBlurCallback } = this.props
    const { searchValue } = this.state
    if (onBlurCallback) onBlurCallback(searchValue)
    this.setState({ showList: false })
  }

  render() {
    const {
      placeholder,
      helperText,
      itemSize,
      onChangeCallbackDebounceDelay,
      onChangeCallback,
      listPosition,
      onScrollToBottomOfListCallback
    } = this.props
    const { showList, showDropDownIcon, list, searchValue, height, width } = this.state
    return (
      <Fragment>
        {onChangeCallback && (
          <UseDebounce
            value={searchValue}
            onChangeCallback={onChangeCallback}
            delay={onChangeCallbackDebounceDelay}
          />
        )}
        <div className="listSearchContainer">
          <div className="listSearchInputDropDown">
            <input
              ref={this.searchListRef}
              className="listSearchInput"
              type="text"
              value={searchValue}
              placeholder={placeholder}
              onChange={this.onSearchChange}
              onFocus={e => {
                e.target.select()
                this.setState({ typingSearchValue: true })
                setTimeout(this.handleInputFocus, TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK)
              }}
              onBlur={() => {
                this.setState({ typingSearchValue: false })
                setTimeout(this.handleInputBlur, TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK)
              }}
            />

            {showDropDownIcon && (
              <i
                className={`listSearchDropDownIcon ${showList ? 'Up' : 'Down'}`}
                tabIndex="1"
                onClick={this.handleDropDownIconClick}
                onBlur={() =>
                  setTimeout(this.handleDropDownIconBlur, TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK)
                }
              />
            )}
          </div>
          {showList &&
            (list.length > 0 ? (
              <BasicList
                listPosition={listPosition}
                height={height}
                width={width}
                list={list}
                itemSize={itemSize}
                listItemHoverable
                onScrollToBottomOfListCallback={onScrollToBottomOfListCallback}
                onListItemClickCallback={this.onListItemClick}
              />
            ) : (
              <div
                className="listSearchItemsContainer fade-in"
                style={{ height: itemSize, width: width, position: 'absolute' }}
              >
                <div className="listSearchItem noHover">No results</div>
              </div>
            ))}
          {helperText && <p className="listSearchHelper">{helperText}</p>}
        </div>
      </Fragment>
    )
  }
}
export default SearchList
