import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/AddShifts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class AddShifts extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            serverUrl: "https://mert-app-server.herokuapp.com/",
            allUsers: null,
            selectedMember: "",
            selectedFile: null,
            selectedRole: null,
            selectedStart: null,
            selectedEnd: null,
            members: [],
            shiftTypes: ['day', 'overnight', 'standby', 'athletic'],
            types: [],
            displaySucessAlert: false,
            displayErrorAlert: false,
            displayWarningAlert: false,
            warningMsg: ""
        }
        
        this.addShift = this.addShift.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleMemberChange = this.handleMemberChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.openSuccessAlert = this.openSuccessAlert.bind(this);     
        this.closeSuccessAlert = this.closeSuccessAlert.bind(this);     
        this.openErrorAlert = this.openErrorAlert.bind(this);     
        this.closeErrorAlert = this.closeErrorAlert.bind(this);
        this.openWarningAlert = this.openWarningAlert.bind(this);     
        this.closeWarningAlert = this.closeWarningAlert.bind(this);
        
    }
    
    componentDidMount() {
        // let typesDivs = this.state.shiftTypes.map((type, i) =>
        //     <option value={type}> {type} </option>
        // );

        // this.setState({
        //     types: typesDivs
        // })

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

    addShift() {
        if (this.state.selectedMember === '') {
            this.setState({
                warningMsg: 'You must select a member to assign the shift!'
            }, () => this.openWarningAlert())
            return;
        }
        if (this.state.selectedRole === '') {
            this.setState({
                warningMsg: 'You must select a role to assign the shift!'
            }, () => this.openWarningAlert())
            return;
        }
        if (!this.state.selectedStart || !this.state.selectedEnd) {
            this.setState({
                warningMsg: 'You must select both a start and end time for the shift!'
            }, () => this.openWarningAlert())
            return;
        }

        // Send an HTTP request to the server.
        let userPushToken = this.state.allUsers[this.state.selectedMember].pushToken;
        let url = `${this.state.serverUrl}addshift/${this.state.selectedMember}/${this.state.selectedRole}/${this.state.selectedStart}/${this.state.selectedEnd}/${userPushToken}`
        console.log(`urs is ${url}`)
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

    async handleFileChange(e) {
        const file = e.target.files.item(0)
        this.setState({
			selectedFile: file
        }, () => console.log(`file changed to ${this.state.selectedFile}`));   
    }

    async handleFileUpload() {
        var file = this.state.selectedFile;
        // var text = await file.text();
        // console.log(text);

        const formData = new FormData();
        formData.append('file', file);
        const options = {
            method: 'POST',
            body: formData,
        }

        fetch(`https://mert-import-server.herokuapp.com/import`, options);
    }

    handleMemberChange(e) {
        if (e.target.value === 'true') {
            e.target.value = ''
        }
		this.setState({
			selectedMember: e.target.value
        }, () => console.log(`member changed to ${this.state.selectedMember}`));   
    }

    handleRoleChange(e) {
		this.setState({
			selectedRole: e.target.value
        }, () => console.log(`role changed to ${this.state.selectedRole}`));
    }
    
    handleStartChange(e) {
		this.setState({
			selectedStart: e.target.value
        }, () => console.log(`start changed to ${this.state.selectedStart}`));
    }
    
    handleEndChange(e) {
		this.setState({
			selectedEnd: e.target.value
        }, () => console.log(`end changed to ${this.state.selectedEnd}`));
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
			<div className="Shifts">
				<PageNavbar active="shifts" />

                    <div className="container addshifts-container" style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}>
                        <div className="jumbotron" >

                        <select value={this.state.selectedMember} onChange={this.handleMemberChange} className="dropdown" id="membersDropdown">
                            <option select value> -- select member -- </option>
                            {this.state.members}
                        </select>

                        <div>
                            <br/>
                            <br/>
                        </div>

                        <form >
                            <input type="text" value={this.state.selectedRole} onChange={this.handleRoleChange} />
                        </form>

                        <div>
                            <br/>
                            <br/>
                        </div>

                        <form >
                            <TextField
                                id="datetime-local"
                                label="Shift Start"
                                type="datetime-local"
                                onChange={this.handleStartChange}
                                // defaultValue="2017-05-24T10:30"
                                // className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>

                        <div>
                            <br/>
                            <br/>
                        </div>

                        <form >
                            <TextField
                                id="datetime-local"
                                label="Shift End"
                                type="datetime-local"
                                onChange={this.handleEndChange}
                                // defaultValue="2017-05-24T10:30"
                                // className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>

                        <div>
                            <br/>
                            <br/>
                        </div>

                        <button 
                            className="submit-btn" 
                            id="shiftSubmitBtn" 
                            onClick={this.addShift}
                        >
                            Add Shift
                        </button>

                        <div>
                            <br/>
                            <br/>
                        </div>

                        <form encType="mulitpart/form-data">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlFile1">Upload Schedule File</label>
                                <input type="file" name="csv_file" onChange={this.handleFileChange}/>
                            </div>
                        </form>
                        <button onClick={this.handleFileUpload}>
                            Import
                        </button>
                    </div>  
                </div>
                <Snackbar open={this.state.displaySuccessAlert} autoHideDuration={6000} onClose={this.closeSuccessAlert}>
                    <Alert onClose={this.closeSuccessAlert} severity="success">
                        Shift Successfully Added!
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.displayErrorAlert} autoHideDuration={6000} onClose={this.closeErrorAlert}>
                    <Alert onClose={this.closeErrorAlert} severity="error">
                        Error: There was a problem adding the shift.
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