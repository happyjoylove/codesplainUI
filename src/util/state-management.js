import defaults from 'lodash/defaults';

export const defaultStateValues = {
  // Default values for state should go here. If a value was already set
  // by state, it won't be overriden by this object
  snippetLanguage: 'python3',
  annotations: {},
  snippet: '',
  readOnly: false,
  snippetTitle: 'title',
  filters: {},
};

export const setDefaults = state => defaults(
  { ...state },
  defaultStateValues,
);
