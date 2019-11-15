import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"

import {
  EditorState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
  ContentState
} from "draft-js"
import { Editor } from "react-draft-wysiwyg"
// import {
//   entityMapperToComponent,
//   customChunkRenderer,
//   entityMapper
// } from "utils/draft-js-helpers"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { options } from "./options"
import { removeArrayDuplicates } from "../../helpers"
import { Button } from "reactstrap"
import { ClearButton, HtmlButton } from "./Buttons"
import Divider from "../Divider"
import "./styles.css"

class TextEditor extends PureComponent {
  constructor(props) {
    super(props)

    const { toolbarHidden } = props

    this.state = { editorRef: null, toolbarHidden, showHtml: false }
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
    showDivider: false,
    toolbarOnFocus: false
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
      showDivider,
      toolbarOnFocus
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
      showDivider,
      toolbarOnFocus
    })
  }

  componentWillUnmount() {}

  htmlToEditorState = html => {
    const blocksFromHtml = htmlToDraft(html)
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    )
    const editorState = EditorState.createWithContent(contentState)
    return editorState
  }

  editorStateToHtml = editorState => {
    const EditorState = editorState ? editorState.getCurrentContent() : null

    const raw = convertToRaw(EditorState)

    const html = draftToHtml(raw)

    return html
  }

  handleEditorStateChange = editorState => {
    const { onChangeCallback } = this.props
    const html = this.editorStateToHtml(editorState)
    onChangeCallback(html)
    // this.setState({ editorState })
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

  setEditorReference = editorRef => {
    if (!editorRef) return
    const { shouldAutoFocus } = this.state
    // if (shouldAutoFocus) editorRef.focus()
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

  toggleHtml = () => {
    this.setState(currentState => ({
      showHtml: !currentState.showHtml
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
      showDivider,
      toolbarOnFocus,
      contentState,
      showHtml
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
        {showHtml && (
          <textarea
            style={{
              background: "var(--slate_grey)",
              color: "white",
              height: 250,
              width: "100%"
            }}
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
        )}
        <div style={{ height, width }}>
          <Editor
            // customBlockRenderFunc={this.renderBlock}
            editorRef={this.setEditorReference}
            key={clearKey}
            readOnly={readOnly}
            defaultEditorState={editorState}
            contentState={contentState}
            // editorState={editorState}
            toolbarClassName="Toolbar"
            wrapperClassName="Wrapper"
            editorClassName={`Editor ${
              toolbarHidden ? "WithNoToolBar" : "WithToolBar"
            }`}
            // onChange={RawDraftContentState => {
            //   const contentState = convertFromRaw(RawDraftContentState)
            //   console.log(contentState)
            //   //this.setState({ contentState })
            // }}
            onEditorStateChange={editorState =>
              this.handleEditorStateChange(editorState)
            }
            onFocus={e => e.preventDefault()}
            onBlur={e => {
              e.preventDefault()
              // const editorState = this.htmlToEditorState(e.target.outerHTML)
              // this.handleEditorStateChange(editorState)
            }}
            onTab={e => e.preventDefault()}
            toolbarHidden={toolbarHidden}
            toolbar={options}
            toolbarCustomButtons={[
              <ClearButton onClickCallback={this.clearState} />,
              <HtmlButton onClickCallback={this.toggleHtml} />
            ]}
            mention={{
              separator: " ",
              trigger: "@",
              suggestions
            }}
            // handlePastedText={clipboard => console.log(clipboard)}
            toolbarOnFocus={toolbarOnFocus}
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
