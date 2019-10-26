import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList, shouldComponentUpdate } from 'react-window'
import './styles.css'

const TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK = 200

class SearchList extends Component {
  constructor(props) {
    super(props)
    this.listRef = createRef()
    this.searchListRef = createRef()
    const { list, listItemIdProp, listItemValueProp, defaultIdValue } = props

    const defaultValueIndex = list.findIndex(e => e[listItemIdProp] === defaultIdValue)
    const searchValue =
      defaultValueIndex !== -1 ? list[defaultValueIndex][listItemValueProp] : 'None'

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
    onListItemClick: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    helperText: PropTypes.string
  }

  static defaultProps = {
    placeholder: 'Search..',
    listItemIdProp: 'id',
    listItemValueProp: 'name'
  }

  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate = shouldComponentUpdate.bind(this)

  componentWillUpdate(nextProps, nextState) {
    const { list, listItemIdProp, defaultIdValue, listItemValueProp } = nextProps
    const currentDefaultIdValue = this.props.defaultIdValue
    const { searchValue } = nextState
    if (currentDefaultIdValue !== defaultIdValue) {
      if (searchValue !== 'All') {
        const defaultValueIndex = list.findIndex(e => e[listItemIdProp] === defaultIdValue)
        const searchValue =
          defaultValueIndex !== -1 ? list[defaultValueIndex][listItemValueProp] : 'None'
        this.setState({ searchValue })
      }
    }
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { listItemIdProp, listItemValueProp } = props

    const list = [
      {
        [listItemIdProp]: 'None',
        [listItemValueProp]: 'None',
        subscriptionService: false
      },
      {
        [listItemIdProp]: 'All',
        [listItemValueProp]: 'All',
        subscriptionService: false
      },
      ...props.list
    ]

    this.setState({ list })
  }

  componentDidUpdate(prevProps, prevState) {
    const previousList = prevState.orginalList
    const currentList = this.state.list
    const currentSearchValue = this.state.searchValue
    const { offsetWidth } = this.searchListRef.current
    const currentSearchValueWidth = this.getTextWidth(currentSearchValue, '1rem system-ui')
    const listSearchDropDownIconOffset = 16
    const listSearchInputMaxWidth = offsetWidth - listSearchDropDownIconOffset

    const largerList = previousList.length < currentList.length
    const currentSearchValueOverflowed = currentSearchValueWidth > listSearchInputMaxWidth

    const orginalList = largerList ? currentList : previousList
    const showDropDownIcon = !currentSearchValueOverflowed

    this.setState({ orginalList, showDropDownIcon })
  }

  componentWillUnmount() {}

  getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
  }

  onListItemClick = (id, value) => {
    const { onListItemClick } = this.props
    onListItemClick(id, value)
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

  toggleList = () =>
    this.setState(prevState => ({
      showList: !prevState.showList
    }))

  clearSearchValue = () => this.setState({ searchValue: '' })

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
    const { showList, showDropDownIcon, list, searchValue } = this.state
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
            onBlur={() => setTimeout(this.toggleList, TIME_TO_WAIT_FOR_LIST_ITEM_ON_CLICK)}
          />
          {showDropDownIcon && <i className="listSearchDropDownIcon" onClick={this.toggleList} />}
        </div>
        {showList && (
          <FixedSizeList
            ref={this.listRef}
            className="listSearchItemsContainer fade-in"
            height={250}
            width="calc(100% - 16px)"
            itemData={list}
            itemCount={list.length}
            itemSize={50}
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
