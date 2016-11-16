import React, { Component } from 'react';
import authToken from './auth-token'; //eslint-disable-line no-unused-vars
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { awardPosts : null,
      award: {}, open : false }
    this.createAward = this.createAward.bind(this);
  }

  componentDidMount() {
    this.fetchAwardPosts();
  }

  fetchAwardPosts() {
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('Content-Type', 'application/json');

    const init = {
      method: 'GET',
      headers
    };
    fetch('/award/api/v1/award-posts', init)
      .then((response) => {
        console.log('Fetching award posts...');
        if (response.ok) {
          return response.json();
        } else {
          console.log('error fetching award posts');
        }
      }).then((data) => {
        this.setState({awardPosts: data});
      });
  }

  createAward() {
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
            "personId" : "10000000018",
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
          console.log('error creating award');
        }
      }).then(data => {
        this.setState({award : data, awardId: data.awardId});
      });
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  toggleStatus = (id) => {
    var headers = new Headers();
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        "active": false,
      })
    };

    fetch('award/api/v1/award-posts/' + id, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log('error toggling post');
        }
      }).then(data => {
        this.setState({award : data});
      });
  };

  getFinancialData(awardPost) {
    let financialData = {
      accountName : awardPost.awardDto.sponsor.sponsorName + '-' + awardPost.awardDto.projectPersons[0].personId,
      accountNumber: awardPost.awardDto.accountNumber,
      cfdaNumber: awardPost.awardDto.cfdaNumber,
      effectiveDate: awardPost.awardDto.effectiveDate,
      expirationDate: awardPost.awardDto.expirationDate,
      expenseGuidelineText: awardPost.awardDto.awardNumber,
      unit: awardPost.awardDto.unitNumber
    }
    return JSON.stringify(financialData);
  }

  getAwardReactElements() {
    let docUrl = "https://res-demo3.kuali.co/kc-dev/awardHome.do?viewDocument=false&placeHolderAwardId=" + this.state.award.awardId +
      "&docId=" + this.state.award.docNbr + "&docOpenedFromAwardSearch=true&docTypeName=AwardDocument&methodToCall=docHandler&command=displayDocSearchView";

    return (
      <div>
        <h2>Award Posts</h2>
        <RaisedButton label="Create Award" primary={true} onClick={this.createAward}/>
        <Table>
          <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Award Title</TableHeaderColumn>
              <TableHeaderColumn>Award Id</TableHeaderColumn>
              <TableHeaderColumn>Award Number</TableHeaderColumn>
              <TableHeaderColumn>Document Number</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>{this.state.award.title}</TableRowColumn>
              <TableRowColumn>{this.state.award.awardId}</TableRowColumn>
              <TableRowColumn>{this.state.award.awardNumber}</TableRowColumn>
              <TableRowColumn>
                <a href={docUrl}>{this.state.award.docNbr}</a>
              </TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>);
  }
  render() {
    if(!this.state.awardPosts) {
      return (<div>
        {this.getAwardReactElements()}
      </div>);
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
        />,
      <FlatButton
        label="Post to Financials"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
        />,
    ];

    return (
      <div>
        {this.getAwardReactElements()}
        <h3>Award Post Information</h3>

        <TextField value={this.state.awardId} onChange={(e) => this.setState({awardId:e.target.value})} hintText="Award id"/>
        <RaisedButton label="Refresh" default={true} onClick={() => this.fetchAwardPosts()} style={{marginTop: 20,display: "block", float:"right"}}/>

        <Table  style={{marginTop: 40}}>
          <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Account Number</TableHeaderColumn>
              <TableHeaderColumn>Award Id</TableHeaderColumn>
              <TableHeaderColumn>Document Number</TableHeaderColumn>
              <TableHeaderColumn>Posted</TableHeaderColumn>
              <TableHeaderColumn>Active</TableHeaderColumn>
              <TableHeaderColumn>Toggle status</TableHeaderColumn>
              <TableHeaderColumn>Financial Data</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.awardPosts.filter(awardPost => {
              return awardPost.awardId == this.state.awardId
            }).map(awardPost => {
                return (<TableRow>
                  <TableRowColumn>{awardPost.accountNumber}</TableRowColumn>
                  <TableRowColumn>{awardPost.awardId}</TableRowColumn>
                  <TableRowColumn>{awardPost.documentNumber}</TableRowColumn>
                  <TableRowColumn>{awardPost.posted ? 'Yes' : 'No'}</TableRowColumn>
                  <TableRowColumn>{awardPost.active ? 'Yes' : 'No'}</TableRowColumn>
                  <TableRowColumn>
                  </TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton label="Toggle Status" onClick={() => this.toggleStatus(awardPost.id)}/>
                  </TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton label="Financial Data" onClick={this.handleOpen}/>
                    <Dialog
                      title="Dialog With Actions"
                      actions={actions}
                      modal={false}
                      open={this.state.open}
                      onRequestClose={this.handleClose}
                      >
                      {this.getFinancialData(awardPost)}
                    </Dialog>
                  </TableRowColumn>
                </TableRow>)
              }
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default App;
