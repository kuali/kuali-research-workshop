import React, { Component } from 'react';
import authToken from './auth-token';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { proposals : [] }
  }

  componentDidMount() {
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    const init = {
      method: 'GET',
      headers
    };
    fetch('/instprop/api/v1/institutional-proposals/', init)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('error fetching proposals');
        }
      }).then((data) => this.setState({proposals : data}));
  }

  render() {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Proposal Number</TableHeaderColumn>
              <TableHeaderColumn>Proposal Type</TableHeaderColumn>
              <TableHeaderColumn>Activity Type</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Lead Unit</TableHeaderColumn>
              <TableHeaderColumn>Title</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.proposals.map(proposal =>
              <TableRow>
                <TableRowColumn>{proposal.proposalNumber}</TableRowColumn>
                <TableRowColumn>{proposal.proposalTypeCode}</TableRowColumn>
                <TableRowColumn>{proposal.activityTypeCode}</TableRowColumn>
                <TableRowColumn>{proposal.statusCode}</TableRowColumn>
                <TableRowColumn>{proposal.unitNumber}</TableRowColumn>
                <TableRowColumn>{proposal.title}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default App;
