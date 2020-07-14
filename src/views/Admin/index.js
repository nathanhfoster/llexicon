import React, { useEffect, useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { UsersProps } from "../../redux/Admin/propTypes"
import { connect as reduxConnect } from "react-redux"
import UserEntriesTable from "./UserEntriesTable"
import { BasicTable, Header } from "../../components"
import Moment from "react-moment"
import { Container, Row, Col } from "reactstrap"
import { GetAllUsers, GetAllUserEntries } from "../../redux/Admin/actions"
import { stringMatch } from "../../utils"

const mapStateToProps = ({
  Admin: {
    users: { isPending, items },
  },
}) => ({ isPending, users: items })

const mapDispatchToProps = {
  GetAllUsers,
  GetAllUserEntries,
}

const Admin = ({ isPending, users, GetAllUsers, GetAllUserEntries }) => {
  useEffect(() => {
    // Using an IIFE
    ;(async function anyNameFunction() {
      await GetAllUsers()
      await GetAllUserEntries()
    })()
  }, [])

  const tableColumns = useMemo(
    () => [
      {
        title: <i className="fas fa-id-card-alt" />,
        key: "id",
        width: 120,
        filter: (searchValue) => ({ first_name, last_name }) =>
          stringMatch(`${first_name} ${last_name}`, searchValue),
        filterPlaceholder: "Name",
        render: ({ first_name, last_name }) => `${first_name} ${last_name}`,
      },
      {
        title: <i className="fas fa-id-card" />,
        key: "username",
        width: 120,
      },
      {
        title: <i className="fas fa-envelope" />,
        key: "email",
        width: 120,
      },
      {
        title: <i className="fas fa-hiking" />,
        key: "is_active",
        width: 40,
        filterPlaceholder: "Is active",
        render: ({ is_active }) => (is_active ? "Yes" : "No"),
      },
      {
        title: <i className="fas fa-user-check" />,
        key: "opt_in",
        width: 40,
        filterPlaceholder: "Opted in",
        render: ({ opt_in }) => (opt_in ? "Yes" : "No"),
      },
      {
        title: <i className="fas fa-chart-line" />,
        key: "last_login",
        width: 120,
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b.last_login) - new Date(a.last_login)
            : new Date(a.last_login) - new Date(b.last_login),

        filter: "date",
        filterPlaceholder: "Last login",
        render: ({ last_login }) => (
          <Moment format="D MMM YY hh:mma">{last_login}</Moment>
        ),
      },
      {
        title: <i className="fas fa-birthday-cake" />,
        key: "date_joined",
        width: 120,
        sort: (a, b, sortUp) =>
          sortUp
            ? new Date(b.last_login) - new Date(a.last_login)
            : new Date(a.last_login) - new Date(b.last_login),

        filter: "date",
        filterPlaceholder: "Date joined",
        render: ({ date_joined }) => (
          <Moment format="D MMM YY hh:mma">{date_joined}</Moment>
        ),
      },
      {
        title: <i className="fas fa-feather-alt" />,
        key: "entries",
        width: 80,
        //   filter: "date",
        //   filterPlaceholder: "Date joined",
        render: ({ entries }) => (entries ? entries.length : 0),
        footer: (items) => items.reduce((count, { entries }) => count + entries && entries.length, 0),
      },
    ],
    [users]
  )

  const getRowValue = useCallback(
    (user) => <UserEntriesTable user={user} entries={user.entries} />,
    [users]
  )

  return (
    <Container className="Admin Container">
      <Row className="Center">
        <Col xs={12} className="p-0">
          <Header fill="var(--quinaryColor)">Admin Table</Header>
        </Col>
      </Row>
      <Row className="HomeRow mb-3 pb-1">
        <BasicTable
          sortable
          filterable
          pageSize={25}
          columns={tableColumns}
          dataDisplayName="Users"
          data={users}
          getRowValue={getRowValue}
          // onSortCallback={handleSortCallback}
          // onFilterCallback={handleFilterCallback}
        />
      </Row>
    </Container>
  )
}

Admin.propTypes = {
  isPending: PropTypes.bool.isRequired,
  users: UsersProps,
  GetAllUsers: PropTypes.func.isRequired,
  GetAllUserEntries: PropTypes.func.isRequired,
}

Admin.defaultProps = {}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(Admin)
