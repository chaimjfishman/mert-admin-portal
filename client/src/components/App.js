import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import AddShifts from './AddShifts';
import PushNotificationSender from './PushNotificationSender';

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
					</Switch>
				</Router>
			</div>
		);
	}
}