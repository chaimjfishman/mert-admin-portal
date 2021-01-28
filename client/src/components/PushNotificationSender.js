import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/PushNotificationSender.css';
import 'bootstrap/dist/css/bootstrap.min.css';
export default class PushNotificationSender extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            members: [],
        }

        this.handleMemberChange = this.handleMemberChange.bind(this);
    }
    
    componentDidMount() {
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

    handleMemberChange(e) {
		this.setState({
			selectedMember: e.target.value
        }, () => console.log(`member changed to ${this.state.selectedMember}`));   
    }
	
	render() {
		return (
			<div className="PushNotificationSender">
                <PageNavbar active="notifications" />
                
                <button 
                    className="submit-btn" 
                    id="decadesSubmitBtn" 
                    onClick={this.sendPushNotification}
                >
                    Send Notification
                </button>
		    </div>
		);
	}
}