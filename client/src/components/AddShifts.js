import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/AddShifts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextField from '@material-ui/core/TextField';

export default class AddShifts extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            selectedMember: "",
            selectedType: "",
            selectedStart: null,
            selectedEnd: null,
            members: [],
            shiftTypes: ['day', 'overnight', 'standby', 'athletic'],
            types: []
        }
        
        this.addShift = this.addShift.bind(this);
        this.handleMemberChange = this.handleMemberChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
    }
    
    componentDidMount() {
        let typesDivs = this.state.shiftTypes.map((type, i) =>
            <option value={type}> {type} </option>
        );

        this.setState({
            types: typesDivs
        })

        // Send an HTTP request to the server.
        fetch("http://localhost:8081/members", {
          method: 'GET' // The type of HTTP request.
        })
          .then(res => res.json()) // Convert the response data to a JSON.
          .then(memberList => {
            if (!memberList) return;

            // Map each memberObj in memberList to an HTML element:
            // A button which triggers the showMovies function for each genre.
            let memberDivs = memberList.map((memberObj, i) =>
                <option value={memberObj.id}> {memberObj.email} </option>
            );
    
            this.setState({
                members: memberDivs
            })
          })
          .catch(err => console.log(err))	// Print the error if there is one.
    }

    addShift() {
        // Send an HTTP request to the server.
        // let url = `http://localhost:8081/addshift/${this.state.selectedMember}/${this.state.selectedStart}/${this.state.selectedEnd}/${this.state.selectedType}`
        let url = `http://localhost:8081/addshift/${this.state.selectedMember}/${this.state.selectedStart}/${this.state.selectedEnd}/${this.state.selectedType}`
        console.log(`urs is ${url}`)
        fetch(url, { 
                method: 'GET' // The type of HTTP request.
            })
            .then(res => res.json()) // Convert the response data to a JSON.
            .then(resCode => {
                console.log(resCode)
            })
            .catch(err => console.log(err))	// Print the error if there is one.
    }

    handleMemberChange(e) {
		this.setState({
			selectedMember: e.target.value
        }, () => console.log(`member changed to ${this.state.selectedMember}`));   
    }

    handleTypeChange(e) {
		this.setState({
			selectedType: e.target.value
        }, () => console.log(`type changed to ${this.state.selectedType}`));
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
	
	render() {

		return (
			<div className="Shifts">
				<PageNavbar active="shifts" />

                    <div className="container addshifts-container" style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}>
                        <div className="jumbotron" >

                        <select value={this.state.selectedDecade} onChange={this.handleMemberChange} className="dropdown" id="decadesDropdown">
                            <option select value> -- select member -- </option>
                            {this.state.members}
                        </select>

                        <div>
                            <br/>
                            <br/>
                        </div>

                        <select value={this.state.selectedDecade} onChange={this.handleTypeChange} className="dropdown" id="decadesDropdown">
                            <option select value> -- select shift type -- </option>
                            {this.state.types}
                        </select>

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
                    </div>  
                </div>
		    </div>
		);
	}
}