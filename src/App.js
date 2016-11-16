import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { grey200 } from 'material-ui/styles/colors';
import { Popover, Menu, MenuItem, RaisedButton } from 'material-ui';
import {browserHistory} from 'react-router';

const theme = getMuiTheme({
  raisedButton: {
    color: grey200,
    textTransform: 'none',
    fontSize: '15px'
  }
});


class App extends Component {
  constructor() {
    super();
    this.state = { open: false };
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div>
          <RaisedButton label="Menu" onClick={(e) => this.setState({open: true, anchorEl : e.target})}/>
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            onRequestClose={() => this.setState({open: false})}
          >
            <Menu>
              <MenuItem primaryText="Home" onClick={() => {
                browserHistory.push('/');
                this.setState({open: false});
              }} />
              <MenuItem primaryText="Awards" onClick={() => {
                browserHistory.push('/awards');
                this.setState({open: false});
              }}/>
              <MenuItem primaryText="Award Posts" onClick={() => {
                browserHistory.push('/award-posts');
                this.setState({open: false});
              }}/>
              <MenuItem primaryText="Proposals" onClick={() => {
                browserHistory.push('/proposals');
                this.setState({open: false});
              }} />
              <MenuItem primaryText="Awards" onClick={() => {
                browserHistory.push('/awards');
                this.setState({open: false});
              }} />
              <MenuItem primaryText="COI" onClick={() => {
                browserHistory.push('/coi');
                this.setState({open: false});
              }} />
              <MenuItem primaryText="Protocols" onClick={() => {
                browserHistory.push('/protocols');
                this.setState({open: false});
              }} />

            </Menu>
          </Popover>
          <h1> Kuali Research REST API Workshop</h1>
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
