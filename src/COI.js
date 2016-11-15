import React, { Component } from 'react';
import authToken from './auth-token';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import {TextField, RaisedButton} from 'material-ui';

class COI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      proposal: null
    }

    this.createProposal = this.createProposal.bind(this);
  }

  createProposal() {
    console.log(this.state.userId);
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        "primeSponsorCode":"000340",
        "unitNumber":"000001",
        "sponsorCode":"000340",
        "statusCode":"1",
        "accountNumber":"123456",
        "anticipatedTotalDirect": "100.05",
        "anticipatedTotalIndirect":"100",
        "obligatedTotalDirect":"100.05",
        "obligatedTotalIndirect":"100",
        "obligationStartDate":"01/11/2008",
        "obligationEndDate":"30/11/2008",
        "awardExecutionDate":"4/11/2008",
        "preAwardEffectiveDate":"3/11/2008",
        "beginDate":"3/11/2008",
        "awardEffectiveDate":"1/11/2008",
        "projectEndDate":"30/11/2008",
        "closeoutDate":"3/11/2008",
        "procurementPriorityCode":"1",
        "sponsorAwardNumber":null,
        "awardTypeCode":"5",
        "accountTypeCode":"1",
        "activityTypeCode":"1",
        "preAwardAuthorizedAmount":"100",
        "cfdaNumber":"00.000",
        "methodOfPaymentCode":"1",
        "title":"APPLICATION OF MECHANICAL VIBRATION TO ENHANCE ORTHODONTIC TOOTH MOVEMENT",
        "basisOfPaymentCode":"1",
        "awardTransactionTypeCode":"1",
        "noticeDate":"3/11/2008",
        "leadUnitNumber": "000001",
        "projectPersons": [
          {
            "personId" : this.state.userId,
            "roleCode": "PI"
          }
        ],
        "awardCustomDataList": [
          {
            "customAttributeId" : "1",
            "value" : "2"
          },
          {
            "customAttributeId" : "4",
            "value" : "2"
          }
        ],
        "awardSponsorTerms" : [
          {"sponsorTermId":"307"}, {"sponsorTermId":"308"}, {"sponsorTermId":"309"},
          {"sponsorTermId":"310"}, {"sponsorTermId":"311"}, {"sponsorTermId":"312"},
          {"sponsorTermId":"313"}, {"sponsorTermId":"314"}, {"sponsorTermId":"315"}
        ],
        "awardReportTerms" : [
          {
            "reportClassCode":"1",
            "reportCode":"33",
            "frequencyCode":"7",
            "frequencyBaseCode":"3",
            "ospDistributionCode":"4",
            "dueDate":"3/11/2015"
          }, 
          {
            "reportClassCode":"3",
            "reportCode":"7",
            "frequencyCode":"6",
            "frequencyBaseCode":"2",
            "ospDistributionCode":"4",
            "dueDate":"3/11/2015"
          }
        ],
        "awardSponsorContacts" : [
          {
            "rolodexId" : "132",
            "roleCode" : "1"
          }
        ]
      })
    };

    fetch('/award/api/v2/awards/', options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('error fetching proposals');
        }
      }).then(proposal => this.setState({proposal}));
  }

  render() {
    let proposal;
    if (this.state.proposal) {
      proposal = (
        <Proposal proposal={this.state.proposal} />
      );
    }

    return (
      <div style={{padding: 10}}>
        <TextField
          style={{display: 'block'}}
          hintText="User Id"
          onChange={event => {
            this.setState({userId: event.target.value});
          }}
        />
        <RaisedButton
          label="CREATE PROTOCOL"
          primary={true}
          onClick={this.createProposal}
        />

        {proposal}
      </div>
    );
  }
}

export default COI;

class Proposal extends Component {
  render() {
    return (
      <Table style={{paddingTop: 30}}>
        <TableHeader
          displaySelectAll={false}
          enableSelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Proposal Number</TableHeaderColumn>
            <TableHeaderColumn>Proposal Type</TableHeaderColumn>
            <TableHeaderColumn>Activity Type</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Lead Unit</TableHeaderColumn>
            <TableHeaderColumn>Title</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>{this.props.proposal.proposalNumber}</TableRowColumn>
            <TableRowColumn>{this.props.proposal.proposalTypeCode}</TableRowColumn>
            <TableRowColumn>{this.props.proposal.activityTypeCode}</TableRowColumn>
            <TableRowColumn>{this.props.proposal.statusCode}</TableRowColumn>
            <TableRowColumn>{this.props.proposal.unitNumber}</TableRowColumn>
            <TableRowColumn>{this.props.proposal.title}</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}