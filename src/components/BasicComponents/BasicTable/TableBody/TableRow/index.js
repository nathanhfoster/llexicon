import React, { useState, useCallback, useMemo, memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import TableDataCell from './TableDataCell';
import { Collapse } from 'reactstrap';
import { ColumnsPropType } from '../../state/types';
import { connect } from 'store';
import { isType } from '../../../../../utils';

const mapStateToProps = ({ getRowValue, onRowClick, columns }) => ({
  getRowValue,
  onRowClick,
  columns,
});

const TableRow = ({ getRowValue, onRowClick, item, columns }) => {
  const [open, setOpen] = useState(false);
  const handleRowClick = useCallback(
    e => {
      e.stopPropagation();
      onRowClick && onRowClick(item, open);
      getRowValue && setOpen(prevOpen => !prevOpen);
    },
    [item, open],
  );

  const [firstColumn, ...restOfColumns] = columns;
  const { key, render } = firstColumn;
  const itemValue = item[key];
  const title =
    typeof render === isType.STRING
      ? render
      : typeof itemValue === isType.STRING
      ? itemValue
      : '';

  const renderRestOfColumns = useMemo(
    () =>
      restOfColumns.map((c, j) => {
        const { key, render } = c;
        const itemValue = item[key];
        const title =
          typeof render === isType.STRING
            ? render
            : typeof itemValue === isType.STRING
            ? itemValue
            : '';

        return (
          <TableDataCell key={j} title={title}>
            {render ? render(item) : itemValue}
          </TableDataCell>
        );
      }),
    [restOfColumns],
  );
  return (
    <Fragment>
      <tr onClick={handleRowClick}>
        <TableDataCell scope='row' title={title}>
          {render ? render(item) : itemValue}
        </TableDataCell>
        {renderRestOfColumns}
      </tr>
      {open && getRowValue && (
        <tr>
          <TableDataCell colSpan={columns.length}>
            <Collapse isOpen={open}>{getRowValue(item)}</Collapse>
          </TableDataCell>
        </tr>
      )}
    </Fragment>
  );
};

TableRow.propTypes = {
  onRowClick: PropTypes.func,
  item: PropTypes.object,
  columns: ColumnsPropType,
};

export default connect(mapStateToProps)(memo(TableRow));
