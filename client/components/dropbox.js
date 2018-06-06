import React, { Component } from 'react';
import axios from 'axios';
import {
  googleClientId,
  googleApiKey,
  googleAccessToken,
} from './google-drive';
require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
export const dbx = new Dropbox({
  clientId: 'u373kipjvd3wu1q',
  accessToken:
    'aHS8DfEzrlIAAAAAAAADcBI9T50NNE8N3N77A9MTj0XYHWrC9iJhthqt5GyJTV8J',
});

class DropboxComponent extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
    };
  }

  connectToDropbox = event => {
    event.preventDefault();
    console.log('connect to Dropbox for OAuth');
    dbx.authenticateWithCordova(
      function(accessToken) {
        console.log(accessToken);
      },
      function() {
        console.log('failed');
      }
    );
  };

  viewFiles = () => {
    dbx
      .filesListFolder({ path: '' })
      .then(response => {
        console.log(response);
        this.setState({ files: response.entries });
      })
      .catch(err => {
        console.error(err);
      });
  };

  copyFiles = () => {
    dbx.filesCopyV2();
  };

  downloadFiles = fileName => {
    dbx
      .filesDownload({ path: fileName })
      .then(response => {
        console.log(response);
        const blob = response.fileBlob;
        // var reader = new FileReader();
        // reader.onloadend = function(evt) {
        //   console.log('read success');
        //   console.log(evt.target.result);
        // };
        // reader.readAsText(blob);
        // console.log(this);
        // console.log(this.downloadFiles);
        // this.downloadFiles(fileName);
        console.log('about to copy to Google Drive');
        console.log('here is the access token', googleAccessToken);
        axios({
          method: 'post',
          url: `https://www.googleapis.com/upload/drive/v3/files?uploadType=media`,
          config: {
            headers: {
              Authorization: googleAccessToken,
              'Content-Type': blob.type,
              'Content-Length': response.size,
            },
            data: response,
          },
        })
          .then(value => {
            console.log(value);
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    return (
      <div>
        <button type="submit" onClick={this.connectToDropbox}>
          Connect to Dropbox
        </button>
        <button type="submit" onClick={this.viewFiles}>
          View Dropbox filesListFolder
        </button>
        <div>
          {this.state.files.map(file => {
            return (
              <div key={file.id}>
                <button
                  type="submit"
                  onClick={() => {
                    this.downloadFiles(file.path_display);
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

export default DropboxComponent;
