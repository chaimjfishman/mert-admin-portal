import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/AddShifts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

import moment from 'moment';
import 'moment-timezone';


import { INITIAL_EVENTS, createEventId } from './event-utils'

// import Moment from 'react-moment';
// import 'moment-timezone';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }
  
  function renderSidebarEvent(event) {
    return (
      <li key={event.id}>
        <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
        <i>{event.title}</i>
      </li>
    );
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
            warningMsg: "",

            initialEvents: [],
            currentEvents: []
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

        this.getAllShifts = this.getAllShifts.bind(this);


        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEvents = this.handleEvents.bind(this);
        // this.renderEventContent = this.renderEventContent.bind(this);
        // this.renderSidebarEvent = this.renderSidebarEvent.bind(this);
    }
    
    componentDidMount() {

        // Send an HTTP request to the server.
        fetch(this.state.serverUrl + "getallshifts", {
            method: 'GET' // The type of HTTP request.
            })
            .then(res => res.json()) // Convert the response data to a JSON.
            .then(shiftsList => {
                if (!shiftsList) {
                    this.setState({
                        warningMsg: 'Error retrieving shifts list from server!'
                    }, () => this.openWarningAlert())
                    return;
                }

                // Map each memberObj in memberList to an HTML element:
                let shifts = shiftsList.map((shiftObj, i) => {
                    return {
                        'id': shiftObj.userID,
                        'start': shiftObj.startTime,
                        'end' : shiftObj.endTime,
                        'title' : shiftObj.role
                    }
                });

                this.setState({
                    initialEvents: shifts
                })
            })
            .catch(err => {
                    this.setState({
                        warningMsg: 'Error retrieving member list from server!'
                    }, () => this.openWarningAlert())
                    console.log(err)
                }) 
        
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

        // create Date object for current location
        var newYork = moment.tz(this.state.selectedStart, "America/New_York");
        console.log(newYork.toString());
        var philly = moment.tz(this.state.selectedEnd, "America/New_York");
        console.log(philly.toString());
        this.state.selectedStart = newYork.toString();
        this.state.selectedEnd = philly.toString();
    
        // create new Date object for different city
        // using supplied offset

        console.log(this.state.selectedStart);
        console.log(this.state.selectedEnd);

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

    getAllShifts() {
                // Send an HTTP request to the server.
                fetch(this.state.serverUrl + "getallshifts", {
                    method: 'GET' // The type of HTTP request.
                    })
                    .then(res => res.json()) // Convert the response data to a JSON.
                    .then(shiftsList => {
                        if (!shiftsList) {
                            this.setState({
                                warningMsg: 'Error retrieving shifts list from server!'
                            }, () => this.openWarningAlert())
                            return;
                        }
        
                        // Map each memberObj in memberList to an HTML element:
                        let shifts = shiftsList.map((shiftObj, i) => {
                            return {
                                'id': shiftObj.userID,
                                'start': shiftObj.startTime,
                                'end' : shiftObj.endTime,
                                'title' : shiftObj.role
                            }
                        });
        
                        this.setState({
                            initialEvents: shifts
                        })
                    })
                    .catch(err => {
                            this.setState({
                                warningMsg: 'Error retrieving member list from server!'
                            }, () => this.openWarningAlert())
                            console.log(err)
                        }) 
    }

    
      handleDateSelect = (selectInfo) => {
          console.log('handleDateSelect')
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar
    
        calendarApi.unselect() // clear date selection
    
        if (title) {
          calendarApi.addEvent({
            id: createEventId(),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
          })
        }
      }
    
      handleEventClick(clickInfo) {
        // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        //   clickInfo.event.remove()
        // }
        console.log(clickInfo.event)
        // clickInfo.event.remove()
      }
    
      handleEvents(events) {
        this.setState({
          currentEvents: events
        })
      }
    

    renderEventContent(eventInfo) {
      return (
        <>
          <b>{eventInfo.timeText}</b>
          <i>{eventInfo.event.title}</i>
        </>
      )
    }
    
    renderSidebarEvent(event) {
      return (
        <li key={event.id}>
          <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
          <i>{event.title}</i>
        </li>
      )
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

        fetch(`https://mert-import-server.herokuapp.com/import`, options)
        .then(res => {
            if (res.status === 200) this.openSuccessAlert();
            else this.openErrorAlert();
        })
        .catch(err => {
            this.openErrorAlert();
            console.log(err)
        });	// Print the error if there is one.
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

    renderSidebar() {
        return (
          <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
                <select value={this.state.selectedMember} onChange={this.handleMemberChange} className="dropdown" id="membersDropdown">
                    <option select value> -- select member -- </option>
                    {this.state.members}
                </select>

                <div>
                    <br/>
                </div>

                Role
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
        )
      }
	
	render() {

		return (
			<div className="Shifts">
				<PageNavbar active="shifts" />

                <div className="container addshifts-container" style={{
                    position: 'absolute', left: '50%', top: '60%',
                    transform: 'translate(-50%, -50%)'
                }}>

                    <div className='demo-app'>
                        {this.renderSidebar()}
                        <div className='demo-app-main'>
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                initialView='dayGridMonth'
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                weekends={true}
                                initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
                                select={this.handleDateSelect}
                                eventContent={this.renderEventContent} // custom render function
                                eventClick={this.handleEventClick}
                                eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                                // eventAdd={this.getAllShifts}
                                /* you can update a remote database when these fire:
                                
                                eventChange={function(){}}
                                eventRemove={function(){}}
                                */
                            />
                        </div>
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