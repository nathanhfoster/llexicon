import PropTypes from "prop-types"

const ColumnsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.func
    ]),
    dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    render: PropTypes.func,
    footer: PropTypes.func,
    sort: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf(["string"])]),
    filter: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.oneOf(["string", "number"])
    ]),
    filterPlaceholder: PropTypes.string,
    onRowClick: PropTypes.func
  })
)

const DataPropType = PropTypes.arrayOf(PropTypes.object.isRequired).isRequired

export { ColumnsPropType, DataPropType }
