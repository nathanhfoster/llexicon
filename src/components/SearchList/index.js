import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList } from 'react-window'
import deepEquals from '../../helpers/deepEquals'
import './styles.css'

const TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK = 200

class SearchList extends Component {
  constructor(props) {
    super(props)
    this.listRef = createRef()
    this.searchListRef = createRef()
    const { listItemIdProp, listItemValueProp, defaultIdValue, height, width } = props

    const list = this.getList(props.list)

    const defaultValueIndex = list.findIndex(
      item => item[listItemIdProp] === defaultIdValue || item[listItemValueProp] === defaultIdValue
    )

    let searchValue

    if (defaultValueIndex !== -1) searchValue = list[defaultValueIndex][listItemValueProp] || ''

    this.state = {
      showList: false,
      showDropDownIcon: true,
      searchValue,
      orginalList: list,
      list,
      height,
      width
    }
  }

  static propTypes = {
    defaultIdValue: PropTypes.string,
    list: PropTypes.oneOf([PropTypes.array, PropTypes.object]),
    listItemIdProp: PropTypes.string,
    listItemValueProp: PropTypes.string,
    onListItemClickCallback: PropTypes.func,
    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    maxHeight: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
    itemSize: PropTypes.number.isRequired,
    onBlurCallback: PropTypes.func,
    onFocusCallback: PropTypes.func
  }

  static defaultProps = {
    placeholder: 'Search...',
    listItemIdProp: 'id',
    listItemValueProp: 'name',
    maxHeight: 250,
    height: 250,
    width: 'calc(100% - 16px)',
    itemSize: 50,
    list: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { itemSize, maxHeight } = nextProps
    const nextList = nextProps.list
    let { list, searchValue, showList, showDropDownIcon } = prevState

    const newListLoaded = searchValue === 'None' && list.length === 0

    if (newListLoaded) {
      list = nextList
    }

    const listHeight = list.length * itemSize

    const height = listHeight > maxHeight ? maxHeight : listHeight

    return { orginalList: nextList, list, height, showList, showDropDownIcon }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !deepEquals(this.props, nextProps)
    const stateChanged = !deepEquals(this.state, nextState)

    return propsChanged || stateChanged
  }

  componentDidMount() {}

  getList = list => {
    const { listItemIdProp, listItemValueProp } = this.props
    if (Array.isArray(list)) return list
    else if (typeof list === 'object')
      return Object.keys(list).map(
        key => (key = { [listItemIdProp]: key, [listItemValueProp]: list[key] })
      )
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    let snapshot = {}

    const { defaultIdValue } = prevProps

    const { listItemIdProp, listItemValueProp, list } = this.props

    const currentDefaultIdValue = this.props.defaultIdValue

    const defaultIdValueChanged = defaultIdValue !== currentDefaultIdValue

    const currentSearchValue = this.state.searchValue
    const { offsetWidth } = this.searchListRef.current
    const currentSearchValueWidth = this.getTextWidth(currentSearchValue, '1rem system-ui')
    const listSearchDropDownIconOffset = 16
    const listSearchInputMaxWidth = offsetWidth - listSearchDropDownIconOffset

    const currentSearchValueOverflowed = currentSearchValueWidth > listSearchInputMaxWidth

    const showDropDownIcon = !currentSearchValueOverflowed

    if (defaultIdValueChanged) {
      const defaultValueIndex = list.findIndex(
        item =>
          item[listItemIdProp] === currentDefaultIdValue ||
          item[listItemValueProp] === currentDefaultIdValue
      )

      let searchValue

      if (defaultValueIndex !== -1) searchValue = list[defaultValueIndex][listItemValueProp] || ''

      snapshot = { ...snapshot, searchValue }
    }

    snapshot = { ...snapshot, showDropDownIcon }

    return snapshot
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.setState({ ...snapshot })
  }

  getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
  }

  onListItemClick = (id, value) => {
    const { onListItemClickCallback } = this.props
    if (onListItemClickCallback) onListItemClickCallback(id, value)
    this.setState({ searchValue: value, showDropDownIcon: true })
  }

  onSearchChange = e => {
    const { value } = e.target
    const filteredList = this.filterList(value)
    this.setState({ searchValue: value, list: filteredList })
  }

  filterList = (value, id) => {
    const { listItemIdProp, listItemValueProp } = this.props
    const { orginalList } = this.state

    return !value || value === 'All' || value === 'None'
      ? orginalList
      : orginalList.filter(
          item =>
            !id
              ? item[listItemValueProp].toUpperCase().includes(value.toUpperCase())
              : item[listItemIdProp] === id
        )
  }

  handleInputFocus = () => {
    const { onFocusCallback } = this.props
    const { searchValue } = this.state
    if (onFocusCallback) onFocusCallback(searchValue)
    this.setState({ showList: true })
  }

  toggleList = () =>
    this.setState(prevState => {
      const { searchValue, showList } = prevState
      if (searchValue === 'None' && !showList)
        return {
          showList: !showList,
          searchValue: ''
        }
      else return { showList: !showList }
    })

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

  renderProjectList = ({ data, index, style, isScrolling }) => {
    const { listItemIdProp, listItemValueProp } = this.props
    const item = data[index]
    const id = item[listItemIdProp]
    const value = item[listItemValueProp]

    return (
      <div
        className="listSearchItem"
        style={style}
        key={id}
        id={id}
        value={value}
        onClick={e => {
          e.stopPropagation()
          this.onListItemClick(id, value)
        }}
      >
        {value}
      </div>
    )
  }

  render() {
    const { placeholder, helperText, itemSize } = this.props
    const { showList, showDropDownIcon, list, searchValue, height, width } = this.state

    return (
      <div className="listSearchContainer">
        <div className="listSearchInputDropDown">
          <input
            ref={this.searchListRef}
            className="listSearchInput"
            type="text"
            value={searchValue}
            placeholder={placeholder}
            onChange={this.onSearchChange}
            onFocus={() => setTimeout(this.handleInputFocus, TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK)}
            onBlur={() => setTimeout(this.handleInputBlur, TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK)}
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
        {showList && (
          <FixedSizeList
            ref={this.listRef}
            className="listSearchItemsContainer fade-in"
            style={{ top: helperText ? 76 : 56 }}
            height={height}
            width={width}
            itemData={list}
            itemCount={list.length}
            itemSize={itemSize}
          >
            {this.renderProjectList}
          </FixedSizeList>
        )}
        {helperText && <p className="listSearchHelper">{helperText}</p>}
      </div>
    )
  }
}
export default SearchList
