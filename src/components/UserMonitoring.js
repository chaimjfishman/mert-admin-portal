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
            serverUrl: "http://localhost:8081/",
            allUsers: null,
            selectedMember: null,
            members: [],
            newEmail: "",
            displaySucessAlert: false,
            displayErrorAlert: false,
            displayWarningAlert: false,
            warningMsg: ""
        }
   
        this.handleMemberChange = this.handleMemberChange.bind(this);
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
        fetch(this.state.serverUrl + "members", {
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

            let users = {}
            memberList.forEach(user => {
                users[user.id] = user;
            });
    
            this.setState({
                allUsers: users,
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

    handleMemberChange(e) {
        if (e.target.value === 'true') {
            return;
        }
		this.setState({
			selectedMember: this.state.allUsers[e.target.value]
        }, () => console.log(this.state.selectedMember));   
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
        
        let url = `${this.state.serverUrl}whitelist/${this.state.newEmail}`;
        // Send an HTTP request to the server.
        fetch(url, {
                method: 'GET' // The type of HTTP request.
            })
            .then(res => {
                if (res.status === 200) this.openSuccessAlert();
                else this.openErrorAlert();
            })
            .catch(err => {
                this.openErrorAlert();
                console.log(err) 
            })
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
                            <select value={this.state.selectedMember} onChange={this.handleMemberChange} className="dropdown" id="membersDropdown">
                                <option select value> -- select member -- </option>
                                {this.state.members}
                            </select>
                        </div>

                        <div className='rowEl'>
                            <Card style={{ width: '25rem' }}>
                                <Card.Body>
                                    <Card.Title>{this.state.selectedMember ? this.state.selectedMember.fullName : 'Name'}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{this.state.selectedMember ? this.state.selectedMember.email: 'Email'}</Card.Subtitle>
                                    <Card.Text>
                                        Board Position: {this.state.selectedMember ? this.state.selectedMember.boardPosition : ''} <br/>
                                        Rank: {this.state.selectedMember ? this.state.selectedMember.rank : ''} <br/>
                                        Completed Form: {this.state.selectedMember ? (this.state.selectedMember.formCompleted ? "Yes" : "No") : ''} <br/>
                                        Athletic Shift Completed: {this.state.selectedMember ? (this.state.selectedMember.takenAthleticShift ? "Yes" : "No") : ''} <br/>
                                        Board Position: {this.state.selectedMember ? this.state.selectedMember.boardPosition : ''}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className='rowEl3'>
                            <button 
                                className="submit-btn" 
                                id="deleteUserBtn" 
                                onClick={console.log('deleted')}
                            >
                                Remove User
                            </button>
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