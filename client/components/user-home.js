import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DropboxComponenet from './dropbox';

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
          <h1 className="storage-header">Here is the first online storage</h1>
        </div>
        <div className="storage" id="storage2">
          <h1 className="storage-header">Here is the second online storage</h1>
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
