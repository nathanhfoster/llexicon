import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { InputGroup, Input, InputGroupAddon, InputGroupText } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import TextEditor from "../../components/TextEditor"
import Divider from "../../components/Divider"
import { UpdateReduxEntry } from "../../actions/Entries"
import Moment from "react-moment"
import ConfirmAction from "../ConfirmAction"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UpdateReduxEntry }

class Entry extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    containerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    showDivider: PropTypes.bool
  }

  static defaultProps = { showDivider: false }

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      id,
      author,
      title,
      html,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      containerHeight,
      showDivider
    } = props

    const dividerHeight = showDivider ? 16 : 0
    const inputHeight = 48
    const numberOfInputs = 1
    const inputOffset = inputHeight * numberOfInputs

    const textEditorHeight = containerHeight - inputOffset - dividerHeight

    this.setState({
      id,
      author,
      title,
      html,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      textEditorHeight,
      showDivider
    })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { UpdateReduxEntry } = this.props
    const {
      id,
      author,
      title,
      html,
      date_created,
      date_created_by_author,
      date_updated,
      views,
      lastUpdated,
      textEditorHeight,
      showDivider
    } = this.state

    return (
      <Fragment>
        <InputGroup key={id} className="EntryInput">
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Entry title..."
            value={title}
            onChange={e => UpdateReduxEntry({ id, title: e.target.value })}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText color="primary">
              <Moment fromNow format="MM/DD/YY hh:mm a">
                {date_created_by_author || lastUpdated}
              </Moment>
            </InputGroupText>
          </InputGroupAddon>
          {/* {show, Disabled, Icon, Size, Class, Title} */}
          <InputGroupAddon
            addonType="append"
            // onClick={() => UpdateReduxEntry({ id, shouldDelete: true })}
          >
            <InputGroupText color="primary" className="p-0">
              <ConfirmAction
                onClickCallback={() =>
                  UpdateReduxEntry({ id, shouldDelete: true })
                }
                icon={
                  <i
                    className="fas fa-trash"
                    style={{ color: "var(--danger)", fontSize: 22 }}
                  />
                }
                title={"Delete Entry"}
              />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <TextEditor
          height={textEditorHeight}
          html={html}
          onChangeCallback={html => UpdateReduxEntry({ id, html })}
        />
        {showDivider && <Divider />}
      </Fragment>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Entry)
