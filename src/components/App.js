import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import AddShifts from './AddShifts';
import PushNotificationSender from './PushNotificationSender';
import UserMonitoring from './UserMonitoring';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<AddShifts />
							)}
						/>
						<Route
							path="/shifts"
							render={() => (
								<AddShifts />
							)}
						/>
						<Route
							path="/notifications"
							render={() => (
								<PushNotificationSender />
							)}
						/>
						<Route
							path="/users"
							render={() => (
								<UserMonitoring />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}