import React, { Component } from 'react';
import { dbx } from './dropbox';
export let googleAccessToken;

const googleClientId =
  '1056413076451-a86v998vikmpsfbnbc1lmterles60dlp.apps.googleusercontent.com';
const googleApiKey = 'AIzaSyBeg3KrZrPMVwKSz5iCiVnYS8bEWOY9Zbg';

const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

const SCOPES = 'https://www.googleapis.com/auth/drive';

class GoogleDriveComponent extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
    };
  }

  initClient() {
    gapi.client
      .init({
        apiKey: googleApiKey,
        clientId: googleClientId,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
      });
  }
  componentDidMount() {
    gapi.load('client:auth2', this.initClient);
  }
  handleClientLoad() {
    gapi.load('client:auth2', this.initClient);
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      listFiles();
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
    }
  }

  connectToGoogle(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  viewFiles = () => {
    if (gapi.auth.getToken) {
      googleAccessToken = gapi.auth.getToken().accessToken;
    }
    gapi.client.drive.files.list({}).then(response => {
      console.log(response);
      this.setState({ files: response.result.files });
    });
  };

  downloadFiles = fileName => {
    gapi.client.drive.files
      .get({ fileId: fileName.id, alt: 'media' })
      .then(response => {
        dbx
          .filesUpload({
            contents: response.body,
            path: `/${fileName.name}`,
          })
          .then(after => {
            console.log('After Message: ', after);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    return (
      <div>
        <button type="submit" onClick={this.connectToGoogle}>
          Connect to Google Drive
        </button>
        <button type="submit" onClick={this.viewFiles}>
          View Google Drive filesListFolder
        </button>
        <div>
          {this.state.files.map(file => {
            return (
              <div key={file.id}>
                <button
                  type="submit"
                  onClick={() => {
                    this.downloadFiles(file);
                  }}
                >
                  {file.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default GoogleDriveComponent;
