import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"

import { EditorState, convertToRaw, ContentState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
// import {
//   entityMapperToComponent,
//   customChunkRenderer,
//   entityMapper
// } from "utils/draft-js-helpers"
import { stateToHTML } from "draft-js-export-html"
import { stateFromHTML } from "draft-js-import-html"
// import htmlToDraft from "html-to-draftjs"
import { options } from "./options"
import { removeArrayDuplicates } from "../../helpers"
import { Button } from "reactstrap"
import { ClearButton } from "./Buttons"
import Divider from "../Divider"
import "./styles.css"

class TextEditor extends PureComponent {
  constructor(props) {
    super(props)

    const { toolbarHidden } = props

    this.state = { editorRef: null, toolbarHidden }
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clearKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    html: PropTypes.string.isRequired,
    onChangeCallback: PropTypes.func,
    shouldAutoFocus: PropTypes.bool,
    showDivider: PropTypes.bool,

    // import { Editor } from "react-draft-wysiwyg"
    onChange: PropTypes.func,
    onEditorStateChange: PropTypes.func,
    onContentStateChange: PropTypes.func,
    // initialContentState is deprecated
    initialContentState: PropTypes.object,
    defaultContentState: PropTypes.object,
    contentState: PropTypes.object,
    editorState: PropTypes.object,
    defaultEditorState: PropTypes.object,
    toolbarOnFocus: PropTypes.bool,
    spellCheck: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    stripPastedStyles: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    toolbar: PropTypes.object,
    toolbarCustomButtons: PropTypes.array,
    toolbarClassName: PropTypes.string,
    toolbarHidden: PropTypes.bool,
    locale: PropTypes.string,
    localization: PropTypes.object,
    editorClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
    toolbarStyle: PropTypes.object,
    editorStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    uploadCallback: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onTab: PropTypes.func,
    mention: PropTypes.object,
    hashtag: PropTypes.object,
    textAlignment: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    readOnly: PropTypes.bool,
    tabIndex: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    placeholder: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaLabel: PropTypes.string,
    ariaOwneeID: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaActiveDescendantID: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaAutoComplete: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaDescribedBy: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaExpanded: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    ariaHasPopup: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    customBlockRenderFunc: PropTypes.func,
    wrapperId: PropTypes.number,
    customDecorators: PropTypes.array,
    editorRef: PropTypes.func
  }

  static defaultProps = {
    clearKey: "",
    mentions: [],
    suggestions: [],
    readOnly: false,
    toolbarHidden: false,
    shouldAutoFocus: false,
    height: "100%",
    width: "100%",
    showDivider: false
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      clearKey,
      html,
      mentions,
      suggestions,
      readOnly,
      height,
      width,
      shouldAutoFocus,
      showDivider
    } = props
    let editorState = this.htmlToEditorState(html)
    editorState = EditorState.moveSelectionToEnd(editorState)

    // const suggestions = Users.map(
    //   user =>
    //     (user = {
    //       text: user.username,
    //       value: user.username,
    //       url: `/profile/${user.id}`
    //     })
    // );
    this.setState({
      clearKey,
      editorState,
      mentions,
      suggestions,
      readOnly,
      height,
      width,
      shouldAutoFocus,
      showDivider
    })
  }

  componentWillUnmount() {}

  htmlToEditorState = html => {
    // const blocksFromHtml = htmlToDraft(html)
    // const { contentBlocks, entityMap } = blocksFromHtml
    // const contentState = ContentState.createFromBlockArray(blocksFromHtml)
    const contentState = stateFromHTML(html)

    return EditorState.createWithContent(contentState)
  }

  editorStateToHtml = editorState => {
    const EditorState = editorState ? editorState.getCurrentContent() : null
    const html = stateToHTML(EditorState)

    return html
  }

  handleEditorStateChange = editorState => {
    const { onChangeCallback } = this.props
    const html = this.editorStateToHtml(editorState)
    onChangeCallback(html)
  }

  getMentions = EditorState => {
    const mentions = []
    if (!EditorState) return mentions

    const entityMap = convertToRaw(EditorState).entityMap

    Object.values(entityMap).forEach(entity => {
      if (entity.type === "MENTION") {
        mentions.push(entity.data)
      }
    })

    return removeArrayDuplicates(
      mentions.map(m => parseInt(m.url.split("/")[2]))
    )
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  orderOptions = values =>
    values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed))

  clearState = () => {
    const { onChangeCallback } = this.props

    // onChangeCallback("<p></p>")
    this.setState({
      clearKey: new Date(),
      editorState: EditorState.createEmpty()
    })
  }

  EditorClass = props => ({
    maxHeigh: 100
  })

  setEditorReference = editorRef => {
    if (!editorRef) return
    const { shouldAutoFocus } = this.state
    if (shouldAutoFocus) editorRef.focus()
    this.setState({ editorRef })
  }

  renderBlock = (block, config) => {
    console.log(block, config)
    if (block.getType() === "atomic") {
      const contentState = config.getEditorState().getCurrentContent()
      const entity = contentState.getEntity(block.getEntityAt(0))
      return {
        // component: entityMapperToComponent(entity),
        editable: false,
        props: {
          children: () => entity.innerHTML
        }
      }
    }
    return undefined
  }

  toggleToolbar = () => {
    this.setState(currentState => ({
      toolbarHidden: !currentState.toolbarHidden
    }))
  }

  render() {
    const { children } = this.props
    const {
      clearKey,
      editorState,
      suggestions,
      readOnly,
      toolbarHidden,
      height,
      width,
      showDivider
    } = this.state

    // console.log(this.editorRef)

    return (
      <Fragment>
        {children}

        <Button
          onClick={this.toggleToolbar}
          color="primary"
          style={{
            width: "100%",
            fontSize: 20
          }}
        >
          <i className="fas fa-toolbox" />{" "}
          <i className={`fas fa-angle-${toolbarHidden ? "down" : "up"}`} />
        </Button>

        <div style={{ height, width }}>
          <Editor
            // customBlockRenderFunc={this.renderBlock}
            editorRef={this.setEditorReference}
            key={clearKey}
            readOnly={readOnly}
            defaultEditorState={editorState}
            // editorState={editorState}
            toolbarClassName="Toolbar"
            wrapperClassName="Wrapper"
            editorClassName={`Editor ${
              toolbarHidden ? "WithNoToolBar" : "WithToolBar"
            }`}
            onEditorStateChange={editorState =>
              this.handleEditorStateChange(editorState)
            }
            onFocus={e => e.preventDefault()}
            // onBlur={(e, editorState) => {
            //   this.props.SetEditorState(
            //     draftToHtml(convertToRaw(editorState.getCurrentContent()))
            //   );
            // }}
            onTab={e => e.preventDefault()}
            blurInputOnSelect={false}
            toolbarHidden={toolbarHidden}
            toolbar={options}
            toolbarCustomButtons={[
              <ClearButton onClickCallback={this.clearState} />
            ]}
            mention={{
              separator: " ",
              trigger: "@",
              suggestions
            }}
            // toolbarOnFocus
            // stripPastedStyles="off"
            // spellCheck="off"
            // autoCapitalize="off"
            // autoComplete="off"
            // autoCorrect="off"
          />
          {showDivider && <Divider />}
        </div>
      </Fragment>
    )
  }
}
export default TextEditor
