import React, { PropTypes } from 'react';
import CodeMirror from 'react-codemirror';
import Save from 'material-ui/svg-icons/content/save'
import IconButton from 'material-ui/IconButton'

import { Card, CardText } from 'material-ui/Card';
import '../styles/codesplain.css'
import TextField from 'material-ui/TextField';
import ConfirmLockDialog from './ConfirmLockDialog.jsx'
import LockButton from './LockButton';
import { getIndexToRowColConverter } from '../util/util.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/python/python.js';


const snippetEditorModes = {
  go: 'go',
  python3: 'python',
};

// Options for the CodeMirror instance that are shared by edit and annotation mddes
const baseCodeMirrorOptions = {
    lineNumbers: true,
    theme: 'codesplain',
};

// Options specific for edit mode should be set here
const editModeOptions = {
  ...baseCodeMirrorOptions,
  readOnly: false,
};

// Options specific for annotation mode should be set here
const annotationModeOptions = {
  ...baseCodeMirrorOptions,
  readOnly: true,
};

class SnippetArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lockDialogOpen: false
    };

    this.switchToReadOnlyMode = this.switchToReadOnlyMode.bind(this);
    this.toggleLockDialogVisibility = this.toggleLockDialogVisibility.bind(this);
  }

  componentDidMount() {
    const codeMirrorInst = this.codeMirror.getCodeMirror();
    codeMirrorInst.on('gutterClick', (codeMirror, lineNumber) => {
      // Clicking on a gutter in read-only mode should not do anything
      if (!this.props.readOnly) {
        return;
      }
      console.log(`clicked on line ${lineNumber}`);
    })
  }

  switchToReadOnlyMode() {
    // The lock dialog should not appear any more
    this.setState({
      lockDialogOpen: false,
    });
    // Invoke the callback to switch to read-only mode
    this.props.switchReadOnlyMode();
  }

  toggleLockDialogVisibility() {
    // Get the previous state of the lock dialog's visibility
    const prevState = this.state.lockDialogOpen;
    // Set the state to the NOT of the previous state
    this.setState({
      lockDialogOpen: !prevState,
    });
  }

  render() {
    // Inject any final options for the CodeMirror instance based on the props passed down
    const codeMirrorOptions = {
      ...(this.props.readOnly ? annotationModeOptions : editModeOptions),
      mode: snippetEditorModes[this.props.snippetLanguage],
    };

    return (
      <Card>
        <CardText>
        <TextField
          name="snippetName"
          hintText="Snippet Name"
          onChange={this.props.onTitleChanged}
        />
        <LockButton
          onClick={this.toggleLockDialogVisibility}
          readOnly={this.props.readOnly}
        />
        <ConfirmLockDialog
          isOpen={this.state.lockDialogOpen}
          accept={this.switchToReadOnlyMode}
          reject={this.toggleLockDialogVisibility}
        />
        <CodeMirror
          ref={cm => {this.codeMirror = cm}}
          value={this.props.contents}
          options={ codeMirrorOptions }
          onChange={ev => this.props.onSnippetChanged(ev, this.codeMirror)}
        />
        <IconButton
          onTouchTap={this.props.onSaveClick}
          tooltip="Save snippet"
        >
          <Save />
        </IconButton>
        </CardText>
      </Card>
    );
  }
};

SnippetArea.propTypes = {
  contents: PropTypes.string.isRequired,
  onTitleChanged: PropTypes.func.isRequired,
  onSnippetChanged: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  snippetLanguage: PropTypes.string.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  switchReadOnlyMode: PropTypes.func.isRequired,
}

export default SnippetArea;

/*
Given a CodeMirror ref, styleRegion() will apply the specified css style to the
given region of code. The code is treated as a single string, and characters in
that string must be identified by their index (as opposed to row/col). Both
start and end are inclusive.
*/
export function styleRegion(codeMirrorRef, start, end, css) {
  if (end < start) throw new Error('end must be greater than start');
  const cmElement = codeMirrorRef.getCodeMirror();
  const snippet = cmElement.getValue();
  const convert = getIndexToRowColConverter(snippet);
  cmElement.markText(convert(start), convert(end), {css: css});
}
