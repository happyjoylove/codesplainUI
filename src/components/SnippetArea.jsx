import React, { PropTypes } from 'react';
import CodeMirror from 'react-codemirror';

import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';

import ConfirmLockDialog from './ConfirmLockDialog.jsx'
import LockButton from './LockButton';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import 'codemirror/mode/go/go.js';
import 'codemirror/mode/python/python.js';

const snippetEditorModes = {
  go: 'go',
  python3: 'python',
};

const SnippetArea = ({ contents, isDialogOpen, onTitleChanged, onSnippetChanged, readOnly, switchReadOnlyMode, snippetLanguage, toggleConfirmLockDialogVisibility }) => {
  const codeMirrorOptions = {
    lineNumbers: true,
    theme: 'material',
    mode: snippetEditorModes[snippetLanguage],
    readOnly,
  };
  return (
    <Card>
      <CardText>
      <TextField
        name="snippetName"
        hintText="Snippet Name"
        onChange={onTitleChanged}
      />
      <LockButton
        onClick={toggleConfirmLockDialogVisibility}
        readOnly={readOnly}
      />
      <ConfirmLockDialog
        isOpen={isDialogOpen}
        accept={switchReadOnlyMode}
        reject={toggleConfirmLockDialogVisibility}
      />
      <CodeMirror
        value={contents}
        options={codeMirrorOptions}
        onChange={onSnippetChanged}
      />
      </CardText>
    </Card>
  );
};

SnippetArea.propTypes = {
  contents: PropTypes.string.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  onTitleChanged: PropTypes.func.isRequired,
  onSnippetChanged: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  snippetLanguage: PropTypes.string.isRequired,
  switchReadOnlyMode: PropTypes.func.isRequired,
  toggleConfirmLockDialogVisibility: PropTypes.func.isRequired,
}

export default SnippetArea;