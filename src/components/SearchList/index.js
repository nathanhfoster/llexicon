import React, { Component, createRef } from "react"
import PropTypes from "prop-types"
import { FixedSizeList } from "react-window"
import "./styles.css"

const TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK = 200

class SearchList extends Component {
  constructor(props) {
    super(props)
    this.listRef = createRef()
    this.searchListRef = createRef()
    const {
      listItemIdProp,
      listItemValueProp,
      defaultIdValue,
      showDefaultListValues
    } = props
    const list = this.getList(props.list)

    const defaultValueIndex = list.findIndex(
      e => e[listItemIdProp] === defaultIdValue
    )

    let searchValue

    if (defaultValueIndex !== -1)
      searchValue = list[defaultValueIndex][listItemValueProp]
    else if (!showDefaultListValues) searchValue = ""
    else searchValue = "None"

    this.state = {
      showList: false,
      showDropDownIcon: true,
      searchValue,
      orginalList: list
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
    height: PropTypes.number.isRequired,
    itemSize: PropTypes.number.isRequired
  }

  static defaultProps = {
    placeholder: "Search..",
    listItemIdProp: "id",
    listItemValueProp: "name",
    showDefaultListValues: false,
    height: 250,
    itemSize: 50
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {
    const list = this.getList(nextProps.list)
    const {
      listItemIdProp,
      defaultIdValue,
      listItemValueProp,
      showDefaultListValues
    } = nextProps
    const currentDefaultIdValue = this.props.defaultIdValue
    const { searchValue } = nextState

    if (currentDefaultIdValue !== defaultIdValue) {
      if (searchValue !== "All") {
        const defaultValueIndex = list.findIndex(
          e => e[listItemIdProp] === defaultIdValue
        )
        let searchValue

        if (defaultValueIndex !== -1)
          searchValue = list[defaultValueIndex][listItemValueProp]
        else if (showDefaultListValues) searchValue = "None"

        this.setState({ searchValue })
      }
    }
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      listItemIdProp,
      listItemValueProp,
      showDefaultListValues,
      itemSize
    } = props
    let { height } = props
    let propsList = this.getList(props.list)

    const defaultListValues = [
      {
        [listItemIdProp]: "None",
        [listItemValueProp]: "None",
        subscriptionService: false
      },
      {
        [listItemIdProp]: "All",
        [listItemValueProp]: "All",
        subscriptionService: false
      }
    ]

    const list = showDefaultListValues
      ? [...defaultListValues, ...props.list]
      : propsList

    const listHeight = list.length * itemSize

    if (listHeight < height) height = listHeight

    this.setState({ list, height, itemSize })
  }

  getList = list => {
    const { listItemIdProp, listItemValueProp } = this.props
    if (Array.isArray(list)) return list
    else if (typeof list === "object")
      return Object.keys(list).map(
        key => (key = { [listItemIdProp]: key, [listItemValueProp]: list[key] })
      )
  }

  componentDidUpdate(prevProps, prevState) {
    const previousList = prevState.orginalList
    const currentList = this.state.list
    const currentSearchValue = this.state.searchValue
    const { offsetWidth } = this.searchListRef.current
    const currentSearchValueWidth = this.getTextWidth(
      currentSearchValue,
      "1rem system-ui"
    )
    const listSearchDropDownIconOffset = 16
    const listSearchInputMaxWidth = offsetWidth - listSearchDropDownIconOffset

    const largerList = previousList.length < currentList.length
    const currentSearchValueOverflowed =
      currentSearchValueWidth > listSearchInputMaxWidth

    const orginalList = largerList ? currentList : previousList
    const showDropDownIcon = !currentSearchValueOverflowed

    this.setState({ orginalList, showDropDownIcon })
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
    this.setState(prevState => ({
      showList: !prevState.showList
    }))

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
    const { placeholder, helperText } = this.props
    const {
      showList,
      showDropDownIcon,
      list,
      searchValue,
      height,
      itemSize
    } = this.state

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
