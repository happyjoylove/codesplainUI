import * as actions from '../../src/actions/permissions';
import reducer from '../../src/reducers/permissions';

describe('Reducer: permissions', () => {
  it('should have initial state', () => {
    const initial = {
      canRead: false,
      canEdit: false,
      author: '',
    };
    expect(reducer(undefined, {})).toEqual(initial);
  });

  it('should handle SET_PERMISSIONS', () => {
    const permissions = {
      canRead: true,
      canEdit: false,
    };
    const action = {
      type: actions.SET_PERMISSIONS,
      payload: permissions,
    };
    const expected = expect.objectContaining({
      ...permissions,
    });
    expect(reducer(undefined, action)).toEqual(expected);
  });
  it('should handle SET_AUTHOR', () => {
    const author = 'phoenixperson';
    const action = {
      type: actions.SET_AUTHOR,
      payload: author,
    };
    const expected = expect.objectContaining({ author });
    expect(reducer(undefined, action)).toEqual(expected);
  });
});
