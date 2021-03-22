import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/UserMonitoring.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Card from "react-bootstrap/Card";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class Login extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            serverUrl: "https://mert-app-server.herokuapp.com/",
            newEmail: "",
            newPassword: "",
            displaySucessAlert: false,
            displayErrorAlert: false,
            displayWarningAlert: false,
            warningMsg: ""
        }
   
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);

        this.handleLogin = this.handleLogin.bind(this);

        this.openSuccessAlert = this.openSuccessAlert.bind(this);     
        this.closeSuccessAlert = this.closeSuccessAlert.bind(this);     
        this.openErrorAlert = this.openErrorAlert.bind(this);     
        this.closeErrorAlert = this.closeErrorAlert.bind(this);
        this.openWarningAlert = this.openWarningAlert.bind(this);     
        this.closeWarningAlert = this.closeWarningAlert.bind(this);
        
        this.multiselectRef = React.createRef();
    }
    
    componentDidMount() {
    }


    handleEmailChange(e) {
        this.setState({ 
            newEmail: e.target.value
        });
    }

    handlePasswordChange(e) {
        this.setState({ 
            newPassword: e.target.value
        });
    }


    handleLogin(e) {
        if (this.state.newEmail === '' || this.state.newPassword === '') {
            e.preventDefault();
            this.setState({
                warningMsg: 'You must enter an email address and password'
            }, () => this.openWarningAlert())
            return;
        }
        
        if (!(this.state.newEmail === 'test@gmail.com' && this.state.newPassword === 'password')) {
            e.preventDefault();
            this.setState({
                warningMsg: 'Email and password are not correct'
            }, () => this.openWarningAlert())
            return;
        } 
        
        this.props.authenticateUser();
    }

    

    openSuccessAlert(event, reason) {
        this.setState({
            displaySuccessAlert: true
        })
    };
    
    closeSuccessAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            displaySuccessAlert: false
        })
    };

    openErrorAlert(event, reason) {
        this.setState({
            displayErrorAlert: true
        })
    };
    
    closeErrorAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            displayErrorAlert: false
        })
    };

    openWarningAlert(event, reason) {
        this.setState({
            displayWarningAlert: true
        })
    };
    
    closeWarningAlert(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            displayWarningAlert: false
        })
    };
	
	render() {
		return (
            <div>
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleEmailChange}/>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" onChange={this.handlePasswordChange}/>
                    </div>
                    <button type="submit" class="btn btn-primary" onClick={this.handleLogin}>Login</button>
                </form>
                <Snackbar open={this.state.displaySuccessAlert} autoHideDuration={6000} onClose={this.closeSuccessAlert}>
                    <Alert onClose={this.closeSuccessAlert} severity="success">
                        User Email Successfully Added!
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.displayErrorAlert} autoHideDuration={6000} onClose={this.closeErrorAlert}>
                    <Alert onClose={this.closeErrorAlert} severity="error">
                        Error: There was a problem add the user email.
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.displayWarningAlert} autoHideDuration={6000} onClose={this.closeWarningAlert}>
                    <Alert onClose={this.closeWarningAlert} severity="warning">
                        {this.state.warningMsg}
                    </Alert>
                </Snackbar>
		    </div>
		);
	}
}