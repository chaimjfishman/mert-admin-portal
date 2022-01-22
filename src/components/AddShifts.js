import React from 'react';
import PageNavbar from './PageNavbar';
import authFetch from '../utils/authFetch'
import '../style/AddShifts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Multiselect } from 'multiselect-react-dropdown';

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
            serverUrl: process.env.REACT_APP_SERVER_URL,
            selectedMembers: [],
            selectedFile: null,
            selectedStart: null,
            selectedEnd: null,
            options: [],
            shiftTypes: ['day', 'overnight', 'standby', 'athletic'],
            types: [],
            displaySucessAlert: false,
            displayErrorAlert: false,
            displayWarningAlert: false,
            warningMsg: "",

            initialEvents: [],
            currentEvents: [],
            jsonFeed: [],
            calendar: null
        }
        
        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.addShift = this.addShift.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
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
        authFetch(this.state.serverUrl + "calendarshifts", {
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
                
                const eventsList = shiftsList.map(shift => {
                    let maxNum = 3;
                    let numLeads = 0;
                    for (let i=0; i<shift.members.length; i++) {
                        if (shift.members[i].role == 'Crew Chief') {
                            maxNum = 4;
                            break;
                        } else if (shift.members[i].role == 'Lead') {
                            numLeads ++;
                        };
                    }

                    if (numLeads >= 2) {
                        maxNum = 4;
                    }

                    return {
                        start: shift.start,
                        end: shift.end,
                        id: shift.id,
                        title: `${shift.members.length} / ${maxNum}`
                    };
                });

                this.setState({
                    jsonFeed: shiftsList,
                    calendar: 
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
                        dayMaxEvents={false}
                        weekends={true}
                        initialEvents={eventsList} // alternatively, use the `events` setting to fetch from a feed
                        select={this.handleDateSelect}
                        eventContent={this.renderEventContent} // custom render function
                        eventClick={this.handleEventClick}
                        eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                        nextDayThreshold={'06:00:00'}
                        allDaySlot={false}
                        // eventAdd={this.getAllShifts}
                        /* you can update a remote database when these fire:
                        
                        eventChange={function(){}}
                        eventRemove={function(){}}
                        */
                    />
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
        authFetch(this.state.serverUrl + "members", {
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
        let url = `${this.state.serverUrl}addshift`
        const reqMembers = this.state.selectedMembers.map(obj => {
            return {
                id: obj.member.id,
                role: obj.role,
                start: obj.start,
                end: obj.end,
                token: obj.member.pushToken ? obj.member.pushToken : null
            }
        });
        let dat = JSON.stringify({
            start: this.state.selectedStart,
            end: this.state.selectedEnd,
            members: reqMembers
        });
        console.log({
            start: this.state.selectedStart,
            end: this.state.selectedEnd,
            members: reqMembers
        })
        authFetch(url, { 
                method: 'POST',
                body: dat,
                headers: {
                    'Content-Type': 'application/json'
                }
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


    onSelect(selectedList, selectedItem) {
        this.setState(prevState => {
            const newMembers = prevState.selectedMembers;
            newMembers.push({
                member: selectedItem,
                role: "",
                start: this.state.selectedStart,
                end: this.state.selectedEnd
            });
            return newMembers;
        });
    }

    onRemove(selectedList, selectedItem) {
        this.setState(prevState => {
            const newMembers = prevState.selectedMembers;
            for (let i=0; i<newMembers.length; i++) {
                if (newMembers[i].member == selectedItem) {
                    newMembers.splice(i, 1);
                }
            }

            return newMembers;
        })
    }

    handleDateSelect = (selectInfo) => {
        // console.log('handleDateSelect')
        // let title = prompt('Please enter a new title for your event')
        // let calendarApi = selectInfo.view.calendar
    
        // calendarApi.unselect() // clear date selection
    
        // if (title) {
        //   calendarApi.addEvent({
        //     id: createEventId(),
        //     title,
        //     start: selectInfo.startStr,
        //     end: selectInfo.endStr,
        //     allDay: selectInfo.allDay
        //   })
        // }
      }
    
      handleEventClick(clickInfo) {
        const id = clickInfo.event._def.publicId;
        let shift = null;
        let selectedMembers = [];

        for (let i=0; i<this.state.jsonFeed.length; i++) {
            if (id == this.state.jsonFeed[i].id) {
                shift = this.state.jsonFeed[i];
                break
            };
        };

        for (let i=0; i<shift.members.length; i++) {
            for (let k=0; k<this.state.options.length; k++) {
                if (shift.members[i].id == this.state.options[k].id) {
                    selectedMembers.push({
                        member: this.state.options[k],
                        role: shift.members[i].role,
                        start: shift.members[i].start,
                        end: shift.members[i].end
                    })
                };
            };
        };
        this.setState({
            selectedMembers,
            selectedStart: shift.start.slice(0, 16),
            selectedEnd: shift.end.slice(0, 16)
        });
      };
    
      handleEvents(events) {
        this.setState({
          currentEvents: events
        })
      }
    

    renderEventContent(eventInfo) {
      return (
        <>
          <b>{eventInfo.timeText}</b>
          <i>({eventInfo.event.title})</i>
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
        });   
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

        authFetch(`${this.state.serverUrl}import`, options)
        .then(res => {
            if (res.status === 200) this.openSuccessAlert();
            else this.openErrorAlert();
        })
        .catch(err => {
            this.openErrorAlert();
            console.log(err)
        });	// Print the error if there is one.
    }

    handleRoleChange(role, i) {
		this.setState(prevState => {
            const newMembers = prevState.selectedMembers;
            newMembers[i].role = role;
            return newMembers;
        });
    }
    
    handleStartChange(e) {
        const v = e.target.value;
        console.log(v)

		this.setState(prevState => {
            const newMembers = prevState.selectedMembers;
            for (let i=0; i<newMembers.length; i++) {
                newMembers[i].start = v
            };

            return {
                selectedStart: v,
                selectedMembers: newMembers
            };
        });
    }
    
    handleEndChange(e) {
        const v = e.target.value

		this.setState(prevState => {
            const newMembers = prevState.selectedMembers;
            for (let i=0; i<newMembers.length; i++) {
                newMembers[i].end = v;
            };

            return {
                selectedEnd: v,
                selectedMembers: newMembers
            };
        });
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
        const memberMenu = this.state.selectedMembers.map((obj, i) => {
            const availableRoles = ['Probationary EMT', 'EMT', 'Lead', 'Crew Chief'];
            if (obj.member.rank != 'Crew Chief') {
                const j = availableRoles.indexOf(obj.member.rank);
                availableRoles.splice(j + 1);
            };

            const availableOptions = availableRoles.map(role => {
                return <option value={role} key={`${obj.member.id}.${role}`}>{role}</option>;
            });


            return <div key={obj.member.id}>
                <div>{obj.member.fullName}</div>
                <label>Role: </label>
                <select value={this.state.selectedMembers[i].role} onChange={(e) => {
                    this.handleRoleChange(e.target.value, i)
                }}>
                    <option value>--Select Role--</option>
                    {availableOptions}
                </select>
                <hr/>
            </div>
        });

        return (
          <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
                <Multiselect
                    options={this.state.options} // Options to display in the dropdown
                    onSelect={this.onSelect} // Function will trigger on select event
                    onRemove={this.onRemove} // Function will trigger on remove event
                    displayValue="fullName" // Property name to display in the dropdown options
                    ref={this.multiselectRef}
                    closeOnSelect={false}
                    selectionLimit={4}
                    disable={this.state.allSelected}
                    showCheckbox={true}
                />

                <div>
                    <br/>
                </div>
                <div>{this.state.selectedMembers.length} / 4 members selected for this shift</div>
                {memberMenu}
                <div>
                    <br/>
                </div>

                <form >
                    <TextField
                        id="datetime-local"
                        label="Shift Start"
                        type="datetime-local"
                        onChange={this.handleStartChange}
                        value={this.state.selectedStart}
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
                        value={this.state.selectedEnd}
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
                            {this.state.calendar}
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