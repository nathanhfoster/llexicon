import React, { useMemo, memo } from 'react';
import { DataPropType, ColumnsPropType } from '../state/types';
import { connect } from 'store';
import './styles.css';

const mapStateToProps = ({ columns, sortList }) => ({
  columns,
  sortList,
});

const TableFooters = ({ data, columns }) => {
  const shouldRender = useMemo(() => columns.some(column => column.footer), [
    columns,
  ]);

  const renderTableRows = useMemo(
    () =>
      columns.map((column, i) => {
        const { footer } = column;

        return footer ? <td key={i}>{footer(data)}</td> : <td key={i}></td>;
      }),
    [columns, data],
  );

  return (
    shouldRender && (
      <tfoot className='BasicTableFooter'>
        <tr>{renderTableRows}</tr>
      </tfoot>
    )
  );
};

TableFooters.propTypes = {
  data: DataPropType,
  columns: ColumnsPropType,
};

export default connect(mapStateToProps)(memo(TableFooters));
