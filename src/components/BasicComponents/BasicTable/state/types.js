import PropTypes from 'prop-types'

const BasicTableActionTypes = {
  BASIC_TABLE_SORT: 'BASIC_TABLE_SORT',
  BASIC_TABLE_FILTER: 'BASIC_TABLE_FILTER',
  BASIC_TABLE_SET_PAGE: 'BASIC_TABLE_SET_PAGE',
  BASIC_TABLE_SET_PAGE_SIZE: 'BASIC_TABLE_SET_PAGE_SIZE',
  BASIC_TABLE_SET_DATA: 'BASIC_TABLE_SET_DATA',
  BASIC_TABLE_SET_SELECTED_DATA: 'BASIC_TABLE_SET_SELECTED_DATA',
  BASIC_TABLE_SELECT_DATA_ITEMS: 'BASIC_TABLE_SELECT_DATA_ITEMS',
}

const ColumnPropType = PropTypes.shape({
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.func,
  ]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  render: PropTypes.func,
  footer: PropTypes.func,
  sort: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf(['string'])]),
  defaultSortValue: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf(['string', 'number', 'date'])]),
  defaultFilterValue: PropTypes.string,
  filterPlaceholder: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
})

const ColumnsPropType = PropTypes.arrayOf(ColumnPropType)

const DataPropType = PropTypes.arrayOf(PropTypes.object).isRequired

const SortListPropType = PropTypes.arrayOf(
  PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sortUp: PropTypes.oneOf([false, true, null]),
  }),
)

export { BasicTableActionTypes, ColumnPropType, ColumnsPropType, DataPropType, SortListPropType }
