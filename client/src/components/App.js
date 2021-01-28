import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import AddShifts from './AddShifts';

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
					</Switch>
				</Router>
			</div>
		);
	}
}