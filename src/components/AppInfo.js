import React from 'react';
import PageNavbar from './PageNavbar';
import authFetch from '../utils/authFetch';
import '../style/AppInfo.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class Appinfo extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            serverUrl: process.env.REACT_APP_SERVER_URL,
            newFormURL: "",
            newFormTitle: "",
            newContactName: "",
            newContactNumber: "",
            displaySucessAlert: false,
            displayErrorAlert: false,
            displayWarningAlert: false,
            warningMsg: "",
            successMsg: "",
            errorMsg: "",

            crew: false,
            lead: false,
            emt: false,
            probemt: false
        }
        
        this.handleFormTitleChange = this.handleFormTitleChange.bind(this);
        this.handleFormURLChange = this.handleFormURLChange.bind(this);
        this.handleContactNameChange = this.handleContactNameChange.bind(this);
        this.handleContactNumberChange = this.handleContactNumberChange.bind(this);

        this.addForm = this.addForm.bind(this);
        this.addContact = this.addContact.bind(this);

        this.crewChange = this.crewChange.bind(this);
        this.leadChange = this.leadChange.bind(this);
        this.emtChange = this.emtChange.bind(this);
        this.probemtChange = this.probemtChange.bind(this);

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

    handleFormURLChange(e) {
        this.setState({ 
            newFormURL: e.target.value
        });
    }

    handleFormTitleChange(e) {
        this.setState({ 
            newFormTitle: e.target.value
        });
    }

    handleContactNameChange(e) {
        this.setState({ 
            newContactName: e.target.value
        });
    }

    handleContactNumberChange(e) {
        this.setState({ 
            newContactNumber: e.target.value
        });
    }

    addForm(e) {
        e.preventDefault();

        if (this.state.newFormURL === '' || this.state.newFormTitle === '') {
            this.setState({
                warningMsg: 'You must enter both a Title and URL for the new form'
            }, () => this.openWarningAlert())
            return;
        }

        let availableRanks = "";
        if (this.state.crew) availableRanks += "Crew Chief,"
        if (this.state.lead) availableRanks += "Lead,"
        if (this.state.emt) availableRanks += "EMT,"
        if (this.state.probemt) availableRanks += "Probationary EMT,"
        if (!availableRanks) availableRanks = "none"
        else availableRanks = availableRanks.replace(/,\s*$/, "")

        let url = `${this.state.serverUrl}addform`;
        let dat = JSON.stringify({
            url: this.state.newFormURL,
            title: this.state.newFormTitle,
            ranks: availableRanks
        })
        // Send an HTTP request to the server.
        authFetch(url, {
                method: 'POST',
                body: dat,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        newFormURL: "",
                        newFormTitle: "",
                        successMsg: "Form successfully added"
                    });
                    this.openSuccessAlert();
                } else {
                    this.setState({
                        errorMsg: `Status ${res.status} from server. (${res.statusText})`
                    })
                    this.openErrorAlert();
                };
            })
            .catch(err => {
                this.setState({
                    errorMsg: err.message
                });
                this.openErrorAlert();
                console.log(err) 
            })        
    }

    addContact(e) {
        e.preventDefault();
        
        if (this.state.newContactName === '' || this.state.newContactNumber === '') {
            this.setState({
                warningMsg: 'You must enter both a Name and Number for the new contact'
            }, () => this.openWarningAlert())
            return;
        }
        
        let url = `${this.state.serverUrl}addcontact/`;
        let dat = JSON.stringify({
            name: this.state.newContactName,
            number: this.state.newContactNumber
        })
        // Send an HTTP request to the server.
        authFetch(url, {
                method: 'POST',
                body: dat,
                headers: {
                    'Content-Type': "application/json"
                }
            })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        newContactName: "",
                        newContactNumber: "",
                        successMsg: "Contact successfully added"
                    })
                    this.openSuccessAlert();
                } else {
                    this.setState({
                        errorMsg: `Status ${res.status} from server. (${res.statusText})`
                    });
                    this.openErrorAlert();
                }
            })
            .catch(err => {
                this.setState({
                    errorMsg: err.message
                });
                this.openErrorAlert();
                console.log(err) 
            })
    }

    crewChange() {
        this.setState({
            crew: !this.state.crew
        })
    }

    leadChange() {
        this.setState({
            lead: !this.state.lead
        })
    }

    emtChange() {
        this.setState({
            emt: !this.state.emt
        })
    }

    probemtChange() {
        this.setState({
            probemt: !this.state.probemt
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
                <PageNavbar active="appInfo" />

                {/* Previous inline style:
                
                style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}*/}
                <div className="container addshifts-container">

                    <div className="jumbotron" >

                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Forms</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Form Title" onChange={this.handleFormTitleChange} value={this.state.newFormTitle}/>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Form URL" onChange={this.handleFormURLChange} value={this.state.newFormURL}/>
                            
                            <div className="checkboxes">
                                <span>
                                    <input type="checkbox" id="crew" name="crew" value="crew" onChange={this.crewChange} value={this.state.crew}/>
                                    <label for="vehicle1"> Crew Chief </label>
                                    <input type="checkbox" id="lead" name="lead" value="lead" onChange={this.leadChange} value={this.state.lead}/>
                                    <label for="vehicle2"> Lead</label>
                                    <input type="checkbox" id="emt" name="emt" value="emt" onChange={this.emtChange} value={this.state.emt}/>
                                    <label for="vehicle3"> EMT</label>
                                    <input type="checkbox" id="probemt" name="probemt" value="probemt" onChange={this.probemtChange} value={this.state.probemt}/>
                                    <label for="vehicle3"> Probationary EMT</label>
                                </span>
                            </div>
                        </div>

                        <button className="btn btn-primary" onClick={this.addForm}>Add New Form</button>
                    </form>

                    <hr></hr>

                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Contacts</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Contact Name" onChange={this.handleContactNameChange} value={this.state.newContactName}/>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Contact Number" onChange={this.handleContactNumberChange} value={this.state.newContactNumber}/>
                        </div>
                        <button className="btn btn-primary" onClick={this.addContact}>Add New Contact</button>
                    </form>

                    </div>
                </div>
                <Snackbar open={this.state.displaySuccessAlert} autoHideDuration={6000} onClose={this.closeSuccessAlert}>
                    <Alert onClose={this.closeSuccessAlert} severity="success">
                        {this.state.successMsg}
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.displayErrorAlert} autoHideDuration={6000} onClose={this.closeErrorAlert}>
                    <Alert onClose={this.closeErrorAlert} severity="error">
                        {this.state.errorMsg}
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