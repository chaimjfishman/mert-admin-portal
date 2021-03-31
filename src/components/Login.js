import React from 'react';
import '../style/UserMonitoring.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { getRectCenter } from '@fullcalendar/react';
import { pink } from '@material-ui/core/colors';
import '../style/Login.css';

// import { View, StyleSheet } from 'react-native';


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
            <div style={mainDivStyle}>
                <div>
                    <h1 align="center">MERT Admin Portal</h1>
                </div>
                <div class="login">

                <h1>Login to Portal</h1>
                    <form>
                        <p><input type="text" name="login" placeholder="Email" onChange={this.handleEmailChange}/></p>
                        <p><input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange}/></p>
                        <p className="remember_me">
                        </p>
                        <p className="submit"><input type="submit" name="commit" onClick={this.handleLogin} value="Login"/></p>
                    </form>
                </div>
                
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

const mainDivStyle = {
    fontFamily: "Arial, Helvetica, sans-serif",
    position: "fixed",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    backgroundColor: "#F0F8FF",
    margin: "0px",
};

const mainButtonStyle = {
    backgroundColor: "#000080",
    borderColor: '#fff'
}

// const myStyles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center'
//     },
//     title: {

//     },
//     logo: {
//         flex: 1,
//         height: 120,
//         width: 120,
//         alignSelf: "center",
//         margin: 30
//     },
//     input: {
//         height: 48,
//         borderRadius: 5,
//         overflow: 'hidden',
//         backgroundColor: 'white',
//         marginTop: 10,
//         marginBottom: 10,
//         marginLeft: 30,
//         marginRight: 30,
//         paddingLeft: 16
//     },
//     button: {
//         backgroundColor: '#788eec',
//         marginLeft: 30,
//         marginRight: 30,
//         marginTop: 20,
//         height: 48,
//         borderRadius: 5,
//         alignItems: "center",
//         justifyContent: 'center'
//     },
//     buttonTitle: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: "bold"
//     },
//     footerView: {
//         flex: 1,
//         alignItems: "center",
//         marginTop: 20
//     },
//     footerText: {
//         fontSize: 16,
//         color: '#2e2e2d'
//     },
//     footerLink: {
//         color: "#788eec",
//         fontWeight: "bold",
//         fontSize: 16
//     }
// })