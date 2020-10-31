import BasicTableContext from './state/context'
import React, { useRef, useEffect, useMemo, lazy, memo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import PropTypes from 'prop-types'
import { BasicTableReducer } from './state/reducer'
import { basicTableSetData } from './state/actions'
import { getInitialState } from './state/utils'
import { ColumnsPropType, DataPropType } from './state/types'
import { stringMatch } from '../../../utils'
const Table = lazy(() => import('./Table'))
const { NODE_ENV } = process.env

const inDevelopmentMode = NODE_ENV == 'development'

const middleWares = inDevelopmentMode
  ? composeWithDevTools(applyMiddleware(thunk))
  : applyMiddleware(thunk)

const BasicTableProvider = ({ children, ...restOfProps }) => {
  let mounted = useRef(false)

  const store = useMemo(
    () => createStore(BasicTableReducer, getInitialState(restOfProps), middleWares),
    [],
  )

  useEffect(() => {
    if (mounted.current) {
      store.dispatch(basicTableSetData(restOfProps.data))
    }
    mounted.current = true
  }, [restOfProps.data])

  return (
    <Provider context={BasicTableContext} store={store}>
      {children}
      <Table />
    </Provider>
  )
}

BasicTableProvider.propTypes = {
  sortable: PropTypes.bool.isRequired,
  filterable: PropTypes.bool.isRequired,
  columns: ColumnsPropType,
  dataDisplayName: PropTypes.string.isRequired,
  data: DataPropType,
  actionMenuCallback: PropTypes.func,
  getRowValue: PropTypes.func,
  onRowClick: PropTypes.func,
  onSortCallback: PropTypes.func,
  onFilterCallback: PropTypes.func,
  // reactstrap Table
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  size: PropTypes.string,
  bordered: PropTypes.bool,
  borderless: PropTypes.bool,
  striped: PropTypes.bool,
  dark: PropTypes.bool,
  hover: PropTypes.bool,
  responsive: PropTypes.bool,
  pageSize: PropTypes.number.isRequired,
  pageSizes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  // Custom ref handler that will be assigned to the "ref" of the inner <table> element
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.object]),
}

BasicTableProvider.defaultProps = {
  hover: false,
  sortable: false,
  filterable: false,
  bordered: false,
  borderless: true,
  striped: false,
  dark: true,
  responsive: true,
  pageSize: 5,
  pageSizes: [5, 15, 25, 50],
  columns: [
    {
      title: '#',
      key: 'id',
      width: 25,
    },
    {
      title: 'First Name',
      key: 'first_name',
      width: 100,
      filter: 'string',
    },
    {
      title: 'Last Name',
      key: 'last_name',
      width: 200,
      filter: 'string',
    },
    {
      title: 'Username',
      key: 'user_name',
      render: item => <a href='#'>{`Delete ${item.user_name}`}</a>,
      sort: (a, b, sortUp) =>
        sortUp ? b.user_name.localeCompare(a.user_name) : a.user_name.localeCompare(b.user_name),
      filter: filterValue => item => stringMatch(item.user_name, filterValue),
    },
  ],
  dataDisplayName: 'Data',
  data: new Array(25).fill().map(
    (e, i) =>
      (e = {
        id: i,
        first_name: `first_name${i}`,
        last_name: `last_name${i}`,
        user_name: `user_name${i}`,
      }),
  ),
}
export default memo(BasicTableProvider)
