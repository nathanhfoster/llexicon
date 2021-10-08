import React, { useRef, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { EntriesPropTypes } from 'redux/Entries/propTypes';
import { connect } from 'react-redux';
import { EntryCards, Header } from '../..';
import Moment from 'react-moment';
import { Col } from 'reactstrap';
import { RouteMap } from 'redux/router/actions';

const mapStateToProps = ({
  Entries: { items, filteredItems, showOnlyPublic }
}) => ({
  entries: filteredItems.length > 0 ? items.concat(filteredItems) : items,
  showOnlyPublic
});

export const EntriesRediscover = ({
  entries,
  showOnlyPublic,
  height,
  headerLink
}) => {
  const containerRef = useRef();
  const today = new Date();
  const styles = useMemo(() => ({ maxHeight: height }), [height]);
  const entriesOnThisDay = useMemo(
    () =>
      entries
        .filter(({ date_created_by_author, _shouldDelete, is_public }) => {
          if (_shouldDelete || is_public !== showOnlyPublic) return false;
          const entryDate = new Date(date_created_by_author);
          const isOnThisDay =
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getDate() === today.getDate();
          return isOnThisDay;
        })
        .sort((a, b) => {
          const aDate = new Date(a.date_created_by_author);
          const bDate = new Date(b.date_created_by_author);
          return bDate - aDate;
        }),
    [entries, showOnlyPublic]
  );

  return (
    <Fragment>
      <Col xs={12} className='p-0'>
        <Header
          fill='var(--quinaryColor)'
          href={headerLink ? RouteMap.ENTRIES_REDISCOVER : null}
        >
          Rediscover This Day
        </Header>
      </Col>
      <Header fontSize='1.5rem'>
        <Moment format='MMMM D'>{today}</Moment>
      </Header>
      <div ref={containerRef} className='HomeRow mb-3 mx-1 row' style={styles}>
        <EntryCards entries={entriesOnThisDay} containerRef={containerRef} />
      </div>
    </Fragment>
  );
};

EntriesRediscover.propTypes = {
  entries: EntriesPropTypes,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  headerLink: PropTypes.bool
};

EntriesRediscover.defaultProps = {
  height: 424,
  headerLink: false
};

export default connect(mapStateToProps)(EntriesRediscover);
