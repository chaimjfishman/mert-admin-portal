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

export default class Routes extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (

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
                    <Route
                        path="/appInfo"
                        render={() => (
                            <AppInfo />
                        )}
                    />
                </Switch>
            </Router>
		);
	}
}