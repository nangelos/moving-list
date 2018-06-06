import React, { Component } from 'react';
import axios from 'axios';
import { dbx } from './dropbox';
export let googleAccessToken;
// const googleDrive = require('google-drive');

export const googleClientId =
  '1056413076451-a86v998vikmpsfbnbc1lmterles60dlp.apps.googleusercontent.com';
export const googleApiKey = 'AIzaSyBeg3KrZrPMVwKSz5iCiVnYS8bEWOY9Zbg';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
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
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      });
  }
  componentDidMount() {
    gapi.load('client:auth2', this.initClient);
  }
  handleClientLoad() {
    gapi.load('client:auth2', this.initClient);
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
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

  /**
   *  Sign in the user upon button click.
   */
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
    console.log(fileName);
    // gapi.client.drive.files
    //   .copy({ fileId: fileName })
    //   .then(response => {
    //     console.log('here is the response', response);
    // axios({
    //   method: 'get',
    //   url: `https://www.googleapis.com/drive/v3/files/${fileName.id}?alt=media`,
    // })
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
    gapi.client.drive.files
      .get({ fileId: fileName.id /*, type: 'media'*/ })
      .then(response => {
        console.log(response);
        dbx
          .filesUpload({
            contents: response.result,
            path: `/${fileName.name}`,
          })
          .then(after => {
            console.log('here is the after message', after);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  /**
   *  Sign out the user upon button click.
   **/
  // handleSignoutClick(event) {
  //   gapi.auth2.getAuthInstance().signOut();
  // }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *@ param {string} message Text to be placed in pre element.
   */
  // appendPre(message) {
  //   const pre = document.getElementById('content');
  //   const textContent = document.createTextNode(message + '\n');
  //   pre.appendChild(textContent);
  // }

  /**
   * Print files.
   */
  // listFiles() {
  //   gapi.client.drive.files
  //     .list({
  //       pageSize: 10,
  //       fields: 'nextPageToken, files(id, name)',
  //     })
  //     .then(function(response) {
  //       appendPre('Files:');
  //       var files = response.result.files;
  //       if (files && files.length > 0) {
  //         for (var i = 0; i < files.length; i++) {
  //           var file = files[i];
  //           appendPre(file.name + ' (' + file.id + ')');
  //         }
  //       } else {
  //         appendPre('No files found.');
  //       }
  //     });
  // }

  // downloadFiles = fileName => {
  //   dbx
  //     .filesDownload({ path: fileName })
  //     .then(response => {
  //       console.log(response);
  //       // var blob = response.fileBlob;
  //       // var reader = new FileReader();
  //       // reader.onloadend = function(evt) {
  //       //   console.log('read success');
  //       //   console.log(evt.target.result);
  //       // };
  //       // reader.readAsText(blob);
  //       // console.log(this);
  //       // console.log(this.downloadFiles);
  //       // this.downloadFiles(fileName);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // };

  render() {
    console.log('here is gapi', gapi);
    // if (gapi.client.getToken) console.log(gapi.client.getToken);
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
