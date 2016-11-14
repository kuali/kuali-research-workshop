import React, { Component } from 'react';
import authToken from './auth-token';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { awards : [] }
  }

  componentDidMount() {
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    const init = {
      method: 'GET',
      headers
    };
    fetch('/award/api/v1/awards/?summary', init)
      .then((response) => {
        console.log('Fetching awards');
        if (response.ok) {
          return response.json();
        } else {
          console.log('error fetching awards');
        }
      }).then((data) => {
          this.setState({awards: data.awards});
      });
  }

  render() {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>Award Number</TableHeaderColumn>
              <TableHeaderColumn>Sponsor</TableHeaderColumn>
              <TableHeaderColumn>Activity Type</TableHeaderColumn>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Lead Unit</TableHeaderColumn>
              <TableHeaderColumn>Title</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.awards.map(award =>
              <TableRow>
                <TableRowColumn>{award.awardNumber}</TableRowColumn>
                <TableRowColumn>{award.sponsor.sponsorName}</TableRowColumn>
                <TableRowColumn>{award.activityType.description}</TableRowColumn>
                <TableRowColumn>{award.awardStatus.description}</TableRowColumn>
                <TableRowColumn>{award.leadUnit.unitNumber}</TableRowColumn>
                <TableRowColumn>{award.title}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default App;
