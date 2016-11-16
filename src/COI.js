/* eslint-disable */
import React, { Component } from 'react';
import authToken, {coiAdminToken} from './auth-token';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import {TextField, RaisedButton} from 'material-ui';

function Award(props) {
  return (
    <Table>
      <TableHeader
        displaySelectAll={false}
        enableSelectAll={false}
        adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>Award ID</TableHeaderColumn>
          <TableHeaderColumn>Lead Unit</TableHeaderColumn>
          <TableHeaderColumn>Title</TableHeaderColumn>
          <TableHeaderColumn></TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        <TableRow selectable={false}>
          <TableRowColumn>{props.award.awardId}</TableRowColumn>
          <TableRowColumn>{props.award.unitNumber}</TableRowColumn>
          <TableRowColumn>{props.award.title}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              label="PUSH TO COI"
              secondary={true}
              onClick={props.pushToCOI}
            />
          </TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  );
}

class COI extends Component {
  constructor() {
    super();

    this.state = {
      userId: null,
      award: null
    };

    this.createAward = this.createAward.bind(this);
    this.showNextStep = this.showNextStep.bind(this);
    this.pushToCOI = this.pushToCOI.bind(this);
  }

  getAwardJson(userId) {
    return {
      primeSponsorCode: '000340',
      unitNumber: '000001',
      sponsorCode: '000340',
      statusCode: '1',
      accountNumber: '123456',
      anticipatedTotalDirect:  '100.05',
      anticipatedTotalIndirect: '100',
      obligatedTotalDirect: '100.05',
      obligatedTotalIndirect: '100',
      obligationStartDate: '01/11/2008',
      obligationEndDate: '30/11/2008',
      awardExecutionDate: '4/11/2008',
      preAwardEffectiveDate: '3/11/2008',
      beginDate: '3/11/2008',
      awardEffectiveDate: '1/11/2008',
      projectEndDate: '30/11/2008',
      closeoutDate: '3/11/2008',
      procurementPriorityCode: '1',
      sponsorAwardNumber:  null,
      awardTypeCode: '5',
      accountTypeCode: '1',
      activityTypeCode: '1',
      preAwardAuthorizedAmount: '100',
      cfdaNumber: '00.000',
      methodOfPaymentCode: '1',
      title: 'APPLICATION OF MECHANICAL VIBRATION TO ENHANCE ORTHODONTIC TOOTH MOVEMENT',
      basisOfPaymentCode: '1',
      awardTransactionTypeCode: '1',
      noticeDate: '3/11/2008',
      leadUnitNumber: '000001',
      projectPersons: [
        {
          personId: userId,
          roleCode: 'PI'
        }
      ],
      awardCustomDataList: [
        {
          customAttributeId: '1',
          value: '2'
        },
        {
          customAttributeId: '4',
          value: '2'
        }
      ],
      awardSponsorTerms: [
        {sponsorTermId: '307'}, {sponsorTermId: '308'}, {sponsorTermId: '309'},
        {sponsorTermId: '310'}, {sponsorTermId: '311'}, {sponsorTermId: '312'},
        {sponsorTermId: '313'}, {sponsorTermId: '314'}, {sponsorTermId: '315'}
      ],
      awardReportTerms: [
        {
          reportClassCode: '1',
          reportCode: '33',
          frequencyCode: '7',
          frequencyBaseCode: '3',
          ospDistributionCode: '4',
          dueDate: '3/11/2015'
        }, 
        {
          reportClassCode: '3',
          reportCode: '7',
          frequencyCode: '6',
          frequencyBaseCode: '2',
          ospDistributionCode: '4',
          dueDate: '3/11/2015'
        }
      ],
      awardSponsorContacts: [
        {
          rolodexId: '132',
          roleCode: '1'
        }
      ]
    };
  }

  createAward() {
    // call this.getAwardJson passing in this.state.userId
    // Use the authToken to POST the result to /award/api/v2/awards/
    // After resolving response.json from the fetch, set the result on this component's state as award
  }

  getProjectJson() {
    return {
      title: this.state.award.title,
      typeCode: 5,
      sourceSystem: "KC-AWARD",
      sourceIdentifier: String(this.state.award.awardId),
      sourceStatus: String(this.state.award.statusCode),
      persons: [
        {
          sourceSystem: "KC-AWARD",
          sourceIdentifier: String(this.state.award.awardId),
          personId: this.state.award.projectPersons[0].personId,
          sourcePersonType: "EMPLOYEE",
          roleCode: this.state.award.projectPersons[0].roleCode
        }
      ],
      sponsors: [
        {
          sourceSystem: "KC-AWARD",
          sourceIdentifier: String(this.state.award.awardId),
          sponsorCode: this.state.award.sponsor.sponsorCode,
          sponsorName: this.state.award.sponsor.sponsorName
        }
      ],
      startDate: this.state.award.beginDate,
      endDate: this.state.award.projectEndDate
    };
  }

  pushToCOI() {
    // call this.getProjectJson
    // Use the coiAdminToken to POST the result to /api/coi/projects/
    // call this.showNextStep after the response has been received.
  }

  showNextStep() {
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${coiAdminToken}`);
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'GET',
      headers
    };

    fetch(`/api/v1/users/?schoolId=${this.state.userId}`, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          alert('Error looking up username for user id');
        }
      }).then(data => {
        this.setState({
          userName: data[0].username
        });
      });
  }

  render() {
    let award;
    if (this.state.award) {
      award = (
        <Award
          award={this.state.award}
          pushToCOI={this.pushToCOI}
        />
      );
    }

    let nextStep;
    if (this.state.userName) {
      nextStep = (
        <h2 style={{textAlign: 'center', marginTop: 65}}>
          Good job! Now sign out and sign in as  
          <a
            href="https://greendale.kuali.co/coi"
            style={{margin: '0 5px 0 5px'}}
          >
            {this.state.userName}
          </a> 
          and create a disclosure.
        </h2>
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
          label="CREATE AWARD"
          primary={true}
          onClick={this.createAward}
          style={{marginBottom: 30}}
        />

        {award}
        {nextStep}
      </div>
    );
  }
}

export default COI;
