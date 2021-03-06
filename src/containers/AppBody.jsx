import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cookie from 'react-cookie';

import Annotations from './Annotations';
import FilterArea from './FilterArea';
import SnippetArea from './SnippetArea';
import {
  loadSnippet,
  restoreState,
} from '../actions/app';
import { setPermissions } from '../actions/permissions';
import { switchOrg } from '../actions/user';
import NotFound from '../components/NotFound';
import CustomPropTypes from '../util/custom-prop-types';
import { sanitizeKey } from '../util/requests';

const styles = {
  body: {
    display: 'flex',
    height: '100%',
  },
};

export class AppBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidSnippet: true,
    };
    this.loadSnippet = this.loadSnippet.bind(this);
    this.setUpNewSnippet = this.setUpNewSnippet.bind(this);
    this.updatePermissions = this.updatePermissions.bind(this);
  }

  componentDidMount() {
    this.loadSnippet();
  }

  componentWillReceiveProps(nextProps) {
    // Reload snippet if URL changes. Assume it is valid, and
    // if it is not, the call to loadSnippet will handle it.
    if (this.state.pathname !== nextProps.router.location.pathname) {
      this.setState({ isValidSnippet: true });
      this.loadSnippet();
    }
  }

  componentDidUpdate() {
    const { router } = this.props;
    const {
      id: snippetKey,
      username: snippetOwner,
    } = router.params;

    if (snippetOwner && snippetKey) {
      this.updatePermissions();
    }
  }

  setUpNewSnippet() {
    const {
      dispatch,
    } = this.props;
    // This is a new snippet for the current user, enable all permissions
    const permissions = {
      canRead: true,
      canEdit: true,
    };
    dispatch(setPermissions(permissions));

    // Reload the state if returning from login.
    const signInState = cookie.load('signInState');
    if (signInState) {
      cookie.remove('signInState', { path: '/' });
      cookie.remove('signInRedirect', { path: '/' });
      dispatch(restoreState(signInState));
    }
  }

  loadSnippet() {
    const {
      dispatch,
      router,
    } = this.props;
    const {
      params: {
        id: snippetKey,
        username: snippetOwner,
      },
      location: { pathname },
    } = router;

    this.setState({ pathname });
    if (!snippetOwner && !snippetKey) {
      this.setUpNewSnippet();
      return;
    }

    dispatch(loadSnippet(snippetOwner, snippetKey))
      .then(() => {
        this.updatePermissions();

        // Reroute if using legacy url
        // So /:username/snippets/:id -> /:username/:id
        const nextRoute = `/${snippetOwner}/${sanitizeKey(snippetKey)}`;
        if (pathname !== nextRoute) {
          router.push(nextRoute);
        }
      }, () => {
        // Failed to get the snippet, either bad URL or unauthorized
        this.setState({
          isValidSnippet: false,
        });
      });
  }

  updatePermissions() {
    const {
      username,
      orgs,
      dispatch,
      router: {
        params: {
          username: snippetOwner,
        },
      },
    } = this.props;

    // If the user is a member of the org in question, make the org the
    // current org
    const isMember = orgs.includes(snippetOwner);
    if (isMember) {
      dispatch(switchOrg(snippetOwner));
    }

    const permissions = {
      canRead: true,
      // Users may only edit & save a file they (or one of their orgs) own
      canEdit: (username === snippetOwner || isMember),
    };
    dispatch(setPermissions(permissions));
  }

  render() {
    const { isValidSnippet } = this.state;
    if (!isValidSnippet) {
      return <NotFound />;
    }
    return (
      <div style={styles.body} id="app-body" >
        <SnippetArea />
        <div id="app-body-right-section">
          <FilterArea />
          <Annotations />
        </div>
      </div>
    );
  }
}

AppBody.propTypes = {
  orgs: CustomPropTypes.orgs,
  username: PropTypes.string,
};

AppBody.defaultProps = {
  orgs: [],
  username: '',
};

const mapStateToProps = (state) => {
  const {
    user: {
      username,
      orgs,
    },
  } = state;
  return {
    username,
    orgs,
  };
};

export default withRouter(connect(mapStateToProps)(AppBody));
