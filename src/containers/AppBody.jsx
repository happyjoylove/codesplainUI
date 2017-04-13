import axios from 'axios';
import { Card } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cookie from 'react-cookie';

import { restoreState } from '../actions/app';
import { setPermissions } from '../actions/permissions';

import Annotations from './Annotations';
import FilterArea from './FilterArea';
import SnippetArea from './SnippetArea';
import ReferenceArea from '../components/ReferenceArea';

import { makeSaveEndpointUrl } from '../util/requests';
import { removeDeprecatedFiltersFromState } from '../util/rules';
import { setDefaults } from '../util/state-management';

const API_URL = process.env.REACT_APP_API_URL;

const styles = {
  snippetAreaSection: {
    height: '90vh',
  },
  snippetAreaSectionCard: {
    height: '100%',
  },
  snippetAreaSectionCardContainer: {
    height: 'inherit',
  },
};

export class AppBody extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      router,
    } = this.props;
    const {
      id: snippetKey,
      username,
    } = router.params;

    if (!username && !snippetKey) {
      // This is a new snippet for the current user, enable all permissions
      const permissions = {
        canRead: true,
        canEdit: true
      }
      dispatch(setPermissions(permissions));

      // Reload the state if returning from login.
      const signInState = cookie.load('signInState');
      if (signInState) {
        cookie.remove('signInState', { path: '/' });
        cookie.remove('signInRedirect', { path: '/' });
        dispatch(restoreState(signInState));
      }
      return null;
    }

    const token = cookie.load('token');
    const config = {
      headers: {
        'Authorization': token,
      }
    }
    axios.get(makeSaveEndpointUrl(username, snippetKey), config)
      .then(res => {
        const permissions = {
          canRead: true,
          //Currently, users may only edit a file they own
          canEdit: (username === cookie.load('username')),
        };
        dispatch(setPermissions(permissions));

        // Normalize the app state received from S3
        const appState = setDefaults(removeDeprecatedFiltersFromState(res.data));
        // Snippet may not have a S3 key value saved; set it to the URL's id
        // param if the state object is lacking it
        if (!appState.snippetKey) {
          appState.snippetKey = snippetKey;
        }
        // Restore the application's state
        dispatch(restoreState(appState));

        // Reroute if not at the 'correct' location
        // So /:username/snippets/:id -> /:username/:id
        const nextRoute = `/${username}/${encodeURIComponent(snippetKey)}`;
        if (router.location.pathname !== nextRoute) {
          router.push(nextRoute);
        }
      }, (err) => {
        console.log(err);
        console.log(err.config);
        // Failed to get the snippet, either bad URL or unauthorized
        router.push('/');
      });
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2'>
            <FilterArea />
          </div>
          <div
            className='col-lg-5 col-md-7'
            style={styles.snippetAreaSection}
          >
            <Card
              containerStyle={styles.snippetAreaSectionCardContainer}
              style={styles.snippetAreaSectionCard}
            >
              <SnippetArea />
            </Card>
          </div>
          <div className='col-lg-5 col-md-5'>
            <Card>
              <Annotations />
            </Card>
          </div>
        </div>
        <div className='row'>
          <ReferenceArea />
        </div>
      </div>
    );
  }
}

export default withRouter(connect()(AppBody));
