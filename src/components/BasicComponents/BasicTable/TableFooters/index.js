import BasicTableContext from '../state/context'
import React, { useMemo } from 'react';
import { DataPropType, ColumnsPropType } from '../state/types';
import { connect } from 'react-redux';
import './styles.css';

const mapStateToProps = ({ columns, sortedAndFilteredData }) => ({
  columns,
  sortedAndFilteredData,
});

const TableFooters = ({ columns, sortedAndFilteredData }) => {
  const shouldRender = useMemo(() => columns.some(column => column.footer), [
    columns,
  ]);

  const renderTableRows = useMemo(
    () =>
      columns.map((column, i) => {
        const { footer } = column;

        return footer ? (
          <td key={i}>{footer(sortedAndFilteredData)}</td>
        ) : (
          <td key={i}></td>
        );
      }),
    [columns, sortedAndFilteredData],
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
  sortedAndFilteredData: DataPropType,
  columns: ColumnsPropType,
};

export default connect(mapStateToProps, null, null, {
  context: BasicTableContext,
})(TableFooters);
