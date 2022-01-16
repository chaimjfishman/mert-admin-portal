import React from 'react';

import Routes from './Routes';
import Login from './Login';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            authenticated: sessionStorage.getItem( 'token' ) || false
        }
        
        this.authenticateUser = this.authenticateUser.bind(this);
    }

	// getInitialState() {
	// 	var selectedOption = localStorage.getItem( 'adminPortalUserAuthenticated' ) || false;
	// 	return selectedOption;
	// }


	authenticateUser() {
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