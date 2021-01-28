import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/PushNotificationSender.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Multiselect } from 'multiselect-react-dropdown';



export default class PushNotificationSender extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
            members: [],
            options: [{name: 'd', id: 1},{name: 'a', id: 1},{name: 'b', id: 1},{name: 'c', id: 1},{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]
        }

        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.resetSelcted = this.resetSelcted.bind(this);
        this.sendPushNotification = this.sendPushNotification.bind(this);        

        this.multiselectRef = React.createRef();
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

    sendPushNotification() {
        console.log(this.multiselectRef.current.getSelectedItems())
    }

    onSelect(selectedList, selectedItem) {
        console.log('selected')
    }
    
    onRemove(selectedList, removedItem) {
        console.log('removed')
    }

    resetSelcted() {
        this.multiselectRef.current.resetSelectedValues()
    }
	
	render() {
		return (
			<div className="PushNotificationSender">
                <PageNavbar active="notifications" />

                <div className="container addshifts-container" style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <div className="jumbotron" >

                        <button 
                            className="submit-btn" 
                            id="decadesSubmitBtn" 
                            onClick={this.sendPushNotification}
                        >
                            Send Notification
                        </button>

                        <Multiselect
                            options={this.state.options} // Options to display in the dropdown
                            onSelect={this.onSelect} // Function will trigger on select event
                            onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            ref={this.multiselectRef}
                        />
                        

                    </div>
                </div>
		    </div>
		);
	}
}