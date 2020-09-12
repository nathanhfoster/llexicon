import filterSort from './filterSort';
import tableSort from './tableSort';
import tableFilter from './tableFilter';

const getInitialState = ({ columns, pageSize, pageSizes, data,  ...restOfProps }) => {
  let sortList = [];
  let filterList = [];
  let firstRowClickFound = null;

  for (let i = 0, { length } = columns; i < length; i++) {
    const { key, sort, filter, defaultSortValue, defaultFilterValue } = columns[
      i
    ];

    const sortItem = { key, sortUp: defaultSortValue, sort };
    sortList.push(sortItem);

    const filterItem = { key, filterValue: defaultFilterValue || '', filter };
    filterList.push(filterItem);
  }

  return {
    ...restOfProps,
    data,
    sortedAndFilteredData: data,
    dataLength: data.length,
    columns,
    sortList,
    filterList,
    currentPage: 0,
    pageSize,
    pageSizes: [{ id: 0, header: true, value: 'Page Sizes' }].concat(
      pageSizes.map((value, i) => ({ id: i + 1, value })),
    ),
  };
};

const getSortedAndFilteredData = (data, sortList, filterList ) => {
  const sortedData = tableSort(data, sortList);

  const sortedAndFilteredData = tableFilter(sortedData, filterList);

  const dataLength = (sortedAndFilteredData || data).length;

  return {
    sortedAndFilteredData,
    dataLength,
    sortList,
    filterList
  };
};

export {
  filterSort,
  tableSort,
  tableFilter,
  getInitialState,
  getSortedAndFilteredData,
};
