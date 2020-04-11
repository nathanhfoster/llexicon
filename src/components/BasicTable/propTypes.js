import PropTypes from "prop-types"

const ColumnsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.func,
    ]),
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    render: PropTypes.func,
    footer: PropTypes.func,
    sort: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf(["string"])]),
    defaultSortValue: PropTypes.bool,
    filter: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.oneOf(["string", "number", "date"]),
    ]),
    defaultFilterValue: PropTypes.string,
    filterPlaceholder: PropTypes.string,
    onRowClick: PropTypes.func,
  })
)

const DataPropType = PropTypes.arrayOf(PropTypes.object.isRequired).isRequired

export { ColumnsPropType, DataPropType }
