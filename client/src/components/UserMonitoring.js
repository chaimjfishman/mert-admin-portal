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

export default class UserMonitoring extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            members: [],
            newEmail: "",
            displaySucessAlert: false,
            displayErrorAlert: false,
            displayWarningAlert: false,
            warningMsg: ""
        }
   
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.openSuccessAlert = this.openSuccessAlert.bind(this);     
        this.closeSuccessAlert = this.closeSuccessAlert.bind(this);     
        this.openErrorAlert = this.openErrorAlert.bind(this);     
        this.closeErrorAlert = this.closeErrorAlert.bind(this);
        this.openWarningAlert = this.openWarningAlert.bind(this);     
        this.closeWarningAlert = this.closeWarningAlert.bind(this);
        
        this.multiselectRef = React.createRef();
    }
    
    componentDidMount() {
        // Send an HTTP request to the server.
        fetch("http://localhost:8081/members", {
          method: 'GET' // The type of HTTP request.
        })
          .then(res => res.json()) // Convert the response data to a JSON.
          .then(memberList => {
            if (!memberList) {
                this.setState({
                    warningMsg: 'Error retrieving member list from server!'
                }, () => this.openWarningAlert())
                return;
            }

            // Map each memberObj in memberList to an HTML element:
            let memberDivs = memberList.map((memberObj, i) =>
                <option value={memberObj.id}> {memberObj.email} </option>
            );
    
            this.setState({
                members: memberDivs
            })
          })
          .catch(err => {
                this.setState({
                    warningMsg: 'Error retrieving member list from server!'
                }, () => this.openWarningAlert())
                console.log(err)
            })   
    }

    handleEmailChange(e) {
        this.setState({ 
            newEmail: e.target.value
        });
    }

    addEmail(e) {
        if (this.state.newEmail === '') {
            e.preventDefault();
            this.setState({
                warningMsg: 'You must enter an email address'
            }, () => this.openWarningAlert())
            return;
        }
        console.log(`added ${this.state.newEmail}`)
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
			<div className="UserMonitoring">
                <PageNavbar active="users" />

                <div className="container addshifts-container" style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>

                <div className="jumbotron" >
                
                    <div className='rowC'>
                        <div className='rowEl1'>
                            <select value={this.state.selectedDecade} onChange={this.handleMemberChange} className="dropdown" id="decadesDropdown">
                                <option select value> -- select member -- </option>
                                {this.state.members}
                            </select>
                        </div>

                        <div className='rowEl'>
                            <Card style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title>Card Title</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                    <Card.Text>
                                    Some quick example <br/>
                                    text to build on the card title and make up the bulk of
                                    the card's content.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    <hr></hr>

                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">User Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleEmailChange}/>
                            <small id="emailHelp" className="form-text text-muted">Users must be added to have permissions to sign up in the app.</small>
                        </div>
                        <button className="btn btn-primary" onClick={this.addEmail}>Add New Email</button>
                    </form>
                </div>
                </div>
                <Snackbar open={this.state.displaySuccessAlert} autoHideDuration={6000} onClose={this.closeSuccessAlert}>
                    <Alert onClose={this.closeSuccessAlert} severity="success">
                        Notification Successfully Sent!
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.displayErrorAlert} autoHideDuration={6000} onClose={this.closeErrorAlert}>
                    <Alert onClose={this.closeErrorAlert} severity="error">
                        Error: There was a problem sending the notification.
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