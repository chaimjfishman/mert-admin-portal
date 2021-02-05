import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/PushNotificationSender.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Multiselect } from 'multiselect-react-dropdown';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class PushNotificationSender extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            allSelected: false,
            options: [],
            title: "",
            message: "",
            displaySucessAlert: false,
            displayErrorAlert: false,
            displayWarningAlert: false,
            warningMsg: ""
        }

        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.resetSelcted = this.resetSelcted.bind(this);
        this.sendPushNotification = this.sendPushNotification.bind(this);      
        this.selectAllChange = this.selectAllChange.bind(this);     
        this.handleTitleChange = this.handleTitleChange.bind(this);     
        this.handleMessageChange = this.handleMessageChange.bind(this);     
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
    
            this.setState({
                options: memberList
            })
          })
          .catch(err => {
                this.setState({
                    warningMsg: 'Error retrieving member list from server!'
                }, () => this.openWarningAlert())
                console.log(err)
            })	// Print the error if there is one.
    }

    sendPushNotification() {
        if (this.state.title === '' || this.state.message === '') {
            this.setState({
                warningMsg: 'You must include both a title and message in the notification!'
            }, () => this.openWarningAlert())
            return;
        }

        let allRecipients = this.state.allSelected ? this.state.options : this.multiselectRef.current.getSelectedItems()
        let pushTokens=''
        allRecipients.forEach(recipient => pushTokens+=recipient.pushToken+',')

        if (pushTokens === '') {
            this.setState({
                warningMsg: 'You must select at least one member to recieve the notification!'
            }, () => this.openWarningAlert())
            return;
        }

        let url = `http://localhost:8081/notifications/${pushTokens}/${this.state.title}/${this.state.message}`
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
            })	// Print the error if there is one.
    }

    handleTitleChange(e) {
        this.setState({ 
            title: e.target.value 
        })
    }

    handleMessageChange(e) {
        this.setState({ 
            message: e.target.value 
        })
    }

    onSelect(selectedList, selectedItem) {}
    
    onRemove(selectedList, removedItem) {}

    resetSelcted() {
        this.multiselectRef.current.resetSelectedValues()
    }

    selectAllChange() {
        this.setState({
            allSelected: !this.state.allSelected
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
			<div className="PushNotificationSender">
                <PageNavbar active="notifications" />

                <div className="container addshifts-container" style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <div className="jumbotron" >

                        <div className="form-check">
                            <input className="form-check-input" 
                                type="checkbox" value="" 
                                id="defaultCheck1"
                                onClick={this.selectAllChange}
                            />
                            
                            <label className="form-check-label">
                                Notify Everyone!
                            </label>
                        </div>

                        <Multiselect
                            options={this.state.options} // Options to display in the dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="email" // Property name to display in the dropdown options
                            ref={this.multiselectRef}
                            closeOnSelect={false}
                            disable={this.state.allSelected}
                            showCheckbox={true}
                        />

                        <button 
                            className="submit-btn" 
                            id="resetBtin" 
                            onClick={this.resetSelcted}
                        >
                            Reset Selection
                        </button>

                        <div>
                            <br/><br/><br/>
                        </div>

                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-sm">Title</span>
                            </div>
                            <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.handleTitleChange}/>
                        </div>

                        <div>
                            <br/>
                        </div>

                        <div class="input-group input-group-sm mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-sm">Message</span>
                            </div>
                            <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={this.handleMessageChange}/>
                        </div>

                        <div>
                            <br/><br/><br/><br/><br/><br/><br/><br/>
                        </div>
                        
                        <button 
                            className="submit-btn" 
                            id="decadesSubmitBtn" 
                            onClick={this.sendPushNotification}
                        >
                            Send Notification
                        </button>

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