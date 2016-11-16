import React, { Component } from 'react';
import authToken from './auth-token';
import { keyBy } from 'lodash';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn } from 'material-ui/Table';
import {
  SelectField,
  TextField,
  MenuItem,
  RaisedButton } from 'material-ui';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { proposals : [] }
  }

  componentDidMount() {
    this.fetchProposals();
    this.fetchRelatedData();
  }

  fetchRelatedData() {
    this.fetchData('/research-common/api/v1/proposal-types/')
      .then((data) => this.setState({proposalTypes : keyBy(data, 'code')}));
    this.fetchData('/research-common/api/v1/activity-types/')
      .then((data) => this.setState({activityTypes : keyBy(data, 'code')}));
    this.fetchData('/instprop/api/v1/proposal-statuses/')
      .then((data) => this.setState({proposalStatuses : keyBy(data, 'proposalStatusCode')}));
    this.fetchData('/research-common/api/v1/units/')
      .then((data) => this.setState({units : keyBy(data, 'unitNumber')}));
  }

  fetchProposals = () => {
    let url = '/instprop/api/v1/institutional-proposals/';
    if (this.state.filterBy) {
      url = `${url}?${this.state.filterBy}=${this.state.filter}`;
    }
    console.log(url);
    this.fetchData(url).then((data) => this.setState({proposals : data}));
  }

  fetchData = (url) => {
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    const init = {
      method: 'GET',
      headers
    };
    return fetch(url, init).then(response => {
      if (response.ok) {
        return response.json();
      }
    });
  }

  render() {
    return (
      <div>
        <div style={{width: '50%', display: 'flex', justifyContent: 'space-between'}}>
          Filter:
          <SelectField
            id='filterBy'
            value={this.state.filterBy}
            onChange={(e, i, value) => this.setState({filterBy: value})}
          >
            <MenuItem primaryText='Proposal Type Code' value='proposalTypeCode'/>
            <MenuItem primaryText='Activity Type Code' value='activityTypeCode'/>
            <MenuItem primaryText='Proposal Status Code' value='statusCode'/>
            <MenuItem primaryText='Unit Number' value='unitNumber'/>
          </SelectField>
          <TextField
            value={this.state.filter}
            onChange={e => this.setState({filter: e.target.value})}
          />
          <RaisedButton label='Filter' primary={true} onTouchTap={this.fetchProposals}/>
        </div>
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
              <TableRow key={proposal.proposalId}>
                <TableRowColumn>{proposal.proposalNumber}</TableRowColumn>
                <TableRowColumn>
                  {resolveDescription(proposal.proposalTypeCode, this.state.proposalTypes)}
                </TableRowColumn>
                <TableRowColumn>
                  {resolveDescription(proposal.activityTypeCode, this.state.activityTypes)}
                </TableRowColumn>
                <TableRowColumn>
                  {resolveDescription(proposal.statusCode, this.state.proposalStatuses)}
                </TableRowColumn>
                <TableRowColumn>
                  {resolveDescription(proposal.unitNumber, this.state.units, 'unitName')}
                </TableRowColumn>
                <TableRowColumn>{proposal.title}</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

function resolveDescription(code, data, property) {
  if (data && data[code]) {
    return data[code][property || 'description'];
  } else {
    return code;
  }
}

export default App;
