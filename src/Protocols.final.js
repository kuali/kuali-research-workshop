import React, { Component } from 'react';
import authToken from './auth-token';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { RaisedButton, Dialog, TextField } from 'material-ui';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {committees: [], committee: {}, open: false}
  }

  componentDidMount() {
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    const init = {
      method: 'GET',
      headers
    };
    fetch('/irb/api/v1/committees', init)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('error fetching proposals');
        }
      }).then((data) => {
      fetch('/research-common/api/v1/committee-types/', init)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log('error fetching proposals');
          }
        }).then((types) => this.setState({committees: this.convert(data, types)}));
    });
  }

  convert = (committees, types) => {
    return committees.map(committee => {
      const committeeType = types.find(type => type.id === committee.committeeTypeId);
      return {
        committeeId: committee.committeeId,
        version: committee.sequenceNumber,
        name: committee.committeeName,
        committeeType: committeeType ? committeeType.description : 'unknown',
        leadUnitNumber: committee.homeUnitNumber
      }
    });
  }

  handleOpen = (committee) => {
    this.setState({
      committee,
      open: true
    })
  };

  handleClose = () => {
    this.setState(
      {
        committee: {},
        open: false
      }
    )
  }

  handlePost = (committee) => {
    var headers = new Headers();
    const body = JSON.stringify(committee);
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Length', body.length);
    const init = {
      method: 'POST',
      body,
      headers
    };
    fetch('/api/v1/protocols/committees/', init)
      .then((response) => {
        if (response.ok) {
          console.log('protocol created')
        }
      })
  };

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => this.handlePost(this.state.committee)}
      />,
    ];


    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>#</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Home Unit Number</TableHeaderColumn>
              <TableHeaderColumn>Version</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.committees.map((committee, idx) => {
                return (
                  <TableRow key={idx}>
                    <TableRowColumn>{idx + 1}</TableRowColumn>
                    <TableRowColumn>{committee.name}</TableRowColumn>
                    <TableRowColumn>{committee.leadUnitNumber}</TableRowColumn>
                    <TableRowColumn>{committee.version}</TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton label="View" onClick={() => this.handleOpen(committee)}/>
                    </TableRowColumn>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>

        <Dialog
          title="Committee"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div>
            <TextField
              floatingLabelText="Committee Id"
              floatingLabelFixed={true}
              fullWidth={true}
              disabled={true}
              value={this.state.committee.committeeId}
            />
            <TextField
              floatingLabelText="Name"
              floatingLabelFixed={true}
              fullWidth={true}
              value={this.state.committee.name}
              onChange={(e) => this.setState({committee: {...this.state.committee, name: e.target.value}})}
            />
            <TextField
              floatingLabelText="Version"
              floatingLabelFixed={true}
              fullWidth={true}
              disabled={true}
              value={this.state.committee.version}
            />
            <TextField
              floatingLabelText="Type"
              floatingLabelFixed={true}
              fullWidth={true}
              onChange={(e) => this.setState({committee: {...this.state.committee, committeeType: e.target.value}})}
              value={this.state.committee.committeeType}
            />
            <TextField
              floatingLabelText="Lead Unit Number"
              floatingLabelFixed={true}
              fullWidth={true}
              disabled={true}
              value={this.state.committee.leadUnitNumber}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default App;
