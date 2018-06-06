import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DropboxComponenet from './dropbox';
import GoogleDriveComponent from './google-drive';

/**
 * COMPONENT
 */
export const UserHome = props => {
  const { email } = props;

  return (
    <div>
      <h3>Welcome, {email}</h3>
      <div className="split-screen">
        <div className="storage" id="storage1">
          <h1 className="storage-header">Google Drive Files</h1>
          <GoogleDriveComponent />
        </div>
        <div className="storage" id="storage2">
          <h1 className="storage-header">Dropbox Files</h1>
          <DropboxComponenet />
        </div>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
  };
};

export default connect(mapState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string,
};
