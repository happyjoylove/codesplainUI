import React, { PropTypes } from 'react';

const styles = {
  countSpan: {
    color: '#666666',
    display: 'block',
    float: 'right',
  },
  label: {
    borderRadius: '5px',
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: '10pt',
    lineHeight: 1,
    marginTop: '5px',
    marginRight: '5px',
    maxWidth: '200px',
    padding: '5px',
    width: '100%',
  },
};

const RuleLabel = ({ color, rule, count, onClick, isActive }) => {
  const backgroundColor = isActive ? color : 'transparent';
  const borderColor = isActive ? 'transparent' : '#e6e6e6'; // light grey

  return (
    <div
      className="rule-label"
      style={{ backgroundColor, borderColor }}
      onClick={onClick}
    >
      {rule}
      <span style={styles.countSpan}>{`(${count})`}</span>
    </div>
  );
};

RuleLabel.propTypes = {
  color: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  rule: PropTypes.string.isRequired,
};

export default RuleLabel;
