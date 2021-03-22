import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import AddShifts from './AddShifts';
import PushNotificationSender from './PushNotificationSender';
import UserMonitoring from './UserMonitoring';
import AppInfo from './AppInfo';
import Routes from './Routes';
import Login from './Login';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            authenticated: localStorage.getItem( 'adminPortalUserAuthenticated' ) || false
        }
        
        this.authenticateUser = this.authenticateUser.bind(this);
    }

	// getInitialState() {
	// 	var selectedOption = localStorage.getItem( 'adminPortalUserAuthenticated' ) || false;
	// 	return selectedOption;
	// }


	authenticateUser() {
		localStorage.setItem( 'adminPortalUserAuthenticated', true );
		this.setState({ 
            authenticated: true
        });
	}

	render() {
		if (!this.state.authenticated) {
			return (
				<div className="App">
					<Login authenticateUser={this.authenticateUser}/>
				</div>
			)
		}
		return (
			<div className="App">
				<Routes/>
			</div>
		)
	}
}