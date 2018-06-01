import React, { Component } from 'react';
require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
const dbx = new Dropbox({
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
                <p>{file.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DropboxComponent;
