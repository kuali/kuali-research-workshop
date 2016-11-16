import React, { Component } from 'react';
import authToken from './auth-token';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { BarChart } from 'react-d3';
import { reduce, values, sortBy } from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { awards : [], awardAmountInfos: [] }
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
        if (response.ok) {
          return response.json();
        } else {
          console.log('error fetching awards');
        }
      }).then((data) => {
          this.setState({awards: data.awards});
      });
      fetch('/award/api/v1/award-amount-infos/', init)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.log('error fetching award infos');
          }
        }).then((data) => {
          this.setState({awardAmountInfos: data});
        });
  }

  render() {
    return (
      <div>
        {this.state.awards.length > 0 &&
        <BarChart
          data={generateAwardDollarAmountBySponsor(this.state.awards, this.state.awardAmountInfos)}
          width={1200}
          height={500}
          fill={'#3182bd'}
          title='Bar Chart'/>}
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

function generateAwardCountStatsBySponsor(awards) {
  const stats = sortBy(values(reduce(awards, (result, award) => {
    if (!result[award.sponsor.sponsorName]) {
      result[award.sponsor.sponsorName] = { x : award.sponsor.sponsorName.substring(0, Math.min(award.sponsor.sponsorName.length, 20)) + '...', y : 1 };
    } else {
      result[award.sponsor.sponsorName].y++;
    }
    return result;
  }, {})), 'y').reverse().slice(0, 6);
  return [{ name : "Series A", values : stats || [] }];
}

function generateAwardDollarAmountBySponsor(awards, awardAmountInfos) {
  const stats = sortBy(values(reduce(awards, (result, award) => {
    if (!result[award.sponsor.sponsorName]) {
      result[award.sponsor.sponsorName] =
        { x : award.sponsor.sponsorName.substring(0, Math.min(award.sponsor.sponsorName.length, 20)) + '...',
        y :  getTotalObligatedAmountForAward(award, awardAmountInfos)};
    } else {
      result[award.sponsor.sponsorName].y += getTotalObligatedAmountForAward(award, awardAmountInfos);
    }
    return result;
  }, {})), 'y').reverse().slice(0, 6);
  return [{ name : "Series A", values : stats || [] }];
}

function getTotalObligatedAmountForAward(award, awardAmountInfos) {
  return reduce(awardAmountInfos.filter(info => info.awardNumber === award.awardNumber), (result, info) => result + info.amountObligatedToDate, 0.0);
}

export default App;
