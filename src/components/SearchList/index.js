import React, { Component, createRef } from "react"
import PropTypes from "prop-types"
import { FixedSizeList } from "react-window"
import deepEquals from "../../helpers/deepEquals"
import "./styles.css"

const TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK = 200

class SearchList extends Component {
  constructor(props) {
    super(props)
    this.listRef = createRef()
    this.searchListRef = createRef()
    const { listItemIdProp, listItemValueProp, defaultIdValue, height } = props

    const list = this.getList(props.list)
    const defaultValueIndex = list.findIndex(
      e => e[listItemIdProp] === defaultIdValue
    )

    let searchValue

    if (defaultValueIndex !== -1)
      searchValue = list[defaultValueIndex][listItemValueProp] || ""
    else searchValue = "None"

    this.state = {
      showList: false,
      showDropDownIcon: true,
      searchValue,
      orginalList: list,
      list,
      height
    }
  }

  static propTypes = {
    defaultIdValue: PropTypes.string,
    list: PropTypes.array.isRequired,
    listItemIdProp: PropTypes.string,
    listItemValueProp: PropTypes.string,
    onListItemClickCallback: PropTypes.func,
    placeholder: PropTypes.string,
    helperText: PropTypes.string,
    maxHeight: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    itemSize: PropTypes.number.isRequired
  }

  static defaultProps = {
    placeholder: "Search..",
    listItemIdProp: "id",
    listItemValueProp: "name",
    maxHeight: 250,
    height: 250,
    itemSize: 50,
    list: []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { itemSize, maxHeight } = nextProps
    const nextList = nextProps.list
    let { list, searchValue } = prevState

    const newListLoaded = searchValue === "None" && list.length === 0

    if (newListLoaded) {
      list = nextList
    }

    const listHeight = list.length * itemSize

    const height = listHeight > maxHeight ? maxHeight : listHeight

    return { orginalList: nextList, list, height }
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
    else if (typeof list === "object")
      return Object.keys(list).map(
        key => (key = { [listItemIdProp]: key, [listItemValueProp]: list[key] })
      )
  }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   console.log('prevProps: ', prevProps)
  //   console.log('prevState: ', prevState)
  //   return null
  // }

  componentDidUpdate(prevProps, prevState) {
    const currentSearchValue = this.state.searchValue
    const { offsetWidth } = this.searchListRef.current
    const currentSearchValueWidth = this.getTextWidth(
      currentSearchValue,
      "1rem system-ui"
    )
    const listSearchDropDownIconOffset = 16
    const listSearchInputMaxWidth = offsetWidth - listSearchDropDownIconOffset

    const currentSearchValueOverflowed =
      currentSearchValueWidth > listSearchInputMaxWidth

    const showDropDownIcon = !currentSearchValueOverflowed

    this.setState({ showDropDownIcon })
  }

  getTextWidth = (text, font) => {
    const canvas = document.createElement("canvas")
    let context = canvas.getContext("2d")
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

    return !value || value === "All" || value === "None"
      ? orginalList
      : orginalList.filter(item =>
          !id
            ? item[listItemValueProp]
                .toUpperCase()
                .includes(value.toUpperCase())
            : item[listItemIdProp] === id
        )
  }

  toggleList = () =>
    this.setState(prevState => {
      const { searchValue, showList } = prevState
      if (searchValue === "None" && !showList)
        return {
          showList: !showList,
          searchValue: ""
        }
      else return { showList: !showList }
    })

  clearSearchValue = () => this.setState({ searchValue: "" })

  renderProjectList = ({ data, index, style, isScrolling }) => {
    const { listItemIdProp, listItemValueProp } = this.props
    const item = data[index]
    const id = item[listItemIdProp]
    const value = item[listItemValueProp]
    if (!(id && value)) {
      console.log(
        "No id or value found! Pass in the correct listItemIdProp={'someId'} and listItemValueProp={'someValue'} into the <SearchList /> component"
      )
    }

    return (
      <div
        className="listSearchItem"
        style={style}
        key={id}
        id={id}
        value={value}
        onClick={() => this.onListItemClick(id, value)}
      >
        {value}
      </div>
    )
  }

  render() {
    const { placeholder, helperText, itemSize } = this.props
    const { showList, showDropDownIcon, list, searchValue, height } = this.state

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
            onFocus={() => this.toggleList()}
            onBlur={() =>
              setTimeout(this.toggleList, TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK)
            }
          />
          {showDropDownIcon && (
            <i className="listSearchDropDownIcon" onClick={this.toggleList} />
          )}
        </div>
        {showList && (
          <FixedSizeList
            ref={this.listRef}
            className="listSearchItemsContainer fade-in"
            style={{ top: helperText ? 76 : 56 }}
            height={height}
            width="calc(100% - 16px)"
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
