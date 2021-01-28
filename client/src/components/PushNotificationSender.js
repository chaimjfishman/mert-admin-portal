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
            allSelected: false,
            options: [],
            title: "",
            message: ""
        }

        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.resetSelcted = this.resetSelcted.bind(this);
        this.sendPushNotification = this.sendPushNotification.bind(this);      
        this.selectAllChange = this.selectAllChange.bind(this);     
        this.handleTitleChange = this.handleTitleChange.bind(this);     
        this.handleMessageChange = this.handleMessageChange.bind(this);     
          
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
    
            this.setState({
                options: memberList
            })
          })
          .catch(err => console.log(err))	// Print the error if there is one.
    }

    sendPushNotification() {
        let allRecipients = this.state.allSelected ? this.state.options : this.multiselectRef.current.getSelectedItems()
        let pushTokens=''
        allRecipients.forEach(recipient => pushTokens+=recipient.pushToken+',')

        let url = `http://localhost:8081/notifications/${pushTokens}/${this.state.title}/${this.state.message}`
        // Send an HTTP request to the server.
        fetch(url, {
                method: 'GET' // The type of HTTP request.
            })
            .then(res => res.json()) // Convert the response data to a JSON.
            .then(resCode => {
                console.log(resCode)
            })
            .catch(err => console.log(err))	// Print the error if there is one.
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
		    </div>
		);
	}
}