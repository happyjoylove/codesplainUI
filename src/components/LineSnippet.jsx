import React, { PropTypes } from 'react';
import CodeMirror from 'react-codemirror';
import Paper from 'material-ui/Paper';

// Base options for CodeMirror instances for a LineSnippet
const baseOptions = {
  lineNumbers: true,
  theme: 'codesplain',
  readOnly: true,
  cursorBlinkRate: -1,
  lineWrapping: true,
};

class LineSnippet extends React.Component {
  componentDidMount() {
    const cm = this.codeMirror.getCodeMirror();
    cm.setSize('auto', 'auto');
  }
  render() {
    const {
      lineNumber,
      value,
    } = this.props;
    const codeMirrorOptions = {
      ...baseOptions,
      firstLineNumber: lineNumber,
    };
    return (
      <div>
        <Paper>
          <CodeMirror
            ref={(cm) => { this.codeMirror = cm; }}
            value={value}
            options={codeMirrorOptions}
          />
        </Paper>
        <br />
      </div>
    );
  }
}

LineSnippet.propTypes = {
  lineNumber: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
};

export default LineSnippet;
