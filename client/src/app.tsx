import React, { Component , ChangeEvent } from "react";
import { Draft, parseDraft } from "./draft";
import { Editor } from "./editor";


interface AppState {

  // The draft to be loaded 
  currDraft?: Draft;

  // User inputted Drafter Name 
  drafterName: string;

  // User inputted Drafter ID number 
  drafterID?: number;
  
  // User inputted number of Rounds 
  drafterRounds?: number;

  // User inputted options for the draft, to be split into a string[] 
  inputtedOptions: string;

  // User inputted drafters for the draft, to be split into a string[] 
  inputtedDrafters: string;

}


export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {drafterName : "", inputtedOptions: "", inputtedDrafters: ""};
  }
  
  render = (): JSX.Element => {
    if(this.state.currDraft === undefined){
      return (
      <div>
        <h2>WELCOME TO THE DRAFT!</h2>
        <div>
          <label htmlFor="name"> Drafter (required for either option): </label>
          <input type= "text" id ="name" value= {this.state.drafterName} onChange={this.handleDrafterNameChange} ></input>
        </div>
        <div>
          <h4>Join Existing Draft</h4>
          <label htmlFor="ID"> Draft ID: </label>
          <input type= "number" id ="ID" min = "0" value= {this.state.drafterID} onChange={this.handleDrafterIDChange}></input>
          <p><button type="button" onClick = {this.handleJoin}> Join </button></p>
        </div>
        <div>
          <h4>Create a Draft</h4>
          <label htmlFor="round"> Rounds (Min 1): </label>
          <input type="number" id = "round" min="1" value= {this.state.drafterRounds} onChange={this.handleRoundsChange}/>
        </div>
        <div style={{display: "inline-block", marginRight: 10}}>
          <p><label htmlFor="options">Options (one per line):</label></p>
          <textarea id="options" cols={40} rows={30} value= {this.state.inputtedOptions} onChange={this.handleOptionsChange}></textarea>
        </div>
        <div style={{display: "inline-block"}}>
          <p><label htmlFor="options">Drafters (one per line, in order):</label></p>
          <textarea id="options" cols={40} rows={30} value= {this.state.inputtedDrafters} onChange={this.handleDraftersChange}></textarea>
        </div>
        <p><button type="button" onClick = {this.handleCreate}> Create </button></p>
      </div>);
    }
    else{
      return <Editor name = {this.state.drafterName} initialState={this.state.currDraft} onServerError={this.handleServerError}/>;
    }
  };

  // For when the user types in the name textbox and the string value changes 
  // @param evt the event of the user typing into the textbox, causing a change, we store the new value of the changed textbox for drafter name
  handleDrafterNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({drafterName: evt.target.value});
  };
  
  // For when the user types in the ID numberbox and the string value changes 
  // @param evt the event of the user typing into the numberbox, causing a change, we store the new value of the changed textbox for drafter name
  handleDrafterIDChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({drafterID: parseInt(evt.target.value)});
  };

  // For when the user types in the rounds numberbox and the string value changes 
  // @param evt the event of the user typing into the numberbox, causing a change, we store the new value of the changed textbox for drafter name
  handleRoundsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({drafterRounds: parseInt(evt.target.value)});
  };

  // For when the user types in the options textbox and the string value changes 
  // @param evt the event of the user typing into the textbox, causing a change, we store the new value of the changed textbox for drafter name
  handleOptionsChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({inputtedOptions: (evt.target.value)});
  };

  // For when the user types in the drafters textbox and the string value changes 
  // @param evt the event of the user typing into the textbox, causing a change, we store the new value of the changed textbox for drafter name
  handleDraftersChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({inputtedDrafters: (evt.target.value)});
  };

  // For when the user clicks on the join button
  // Calls handleLoadDraft with the given ID (if it exists)
  handleJoin = (): void => {
    if(this.state.drafterID !== undefined && this.state.drafterName !== ""){
      this.handleLoadDraft(this.state.drafterID);
    }
  }


  // It sends/(fetches a POST request) draft data to the server to be saved
  // it receives ID number for this draft's key (in handleCreateText)
  // Will send an alert if there are not enough options for every drafter to draft every round
  handleCreate = (): void => {
    if(this.state.drafterRounds !== undefined && this.state.drafterRounds>0 && this.state.drafterName !== "" 
    && this.state.inputtedOptions !== "" && this.state.inputtedOptions !== "")
    {
      if(this.state.inputtedOptions.split("\n").length<(this.state.drafterRounds*this.state.inputtedDrafters.split("\n").length)){
        alert("Not enough options! Draft will end before every drafter gets a pick for each round.");
      }
      fetch("/api/saveDraft?", 
      {method: "POST", body: JSON.stringify(
      {drafters: JSON.stringify(this.state.inputtedDrafters.split("\n")), 
      rounds: JSON.stringify(this.state.drafterRounds),
      options: JSON.stringify(this.state.inputtedOptions.split("\n"))}), 
      headers: {"Content-Type": "application/json"}})
      .then(this.handleCreateResponse)
      .catch(this.handleServerError)
    }
  }
  
  //  Function to handle HTTP response for handleCreate 
  //  @param res The server response to our handleCreate request
  handleCreateResponse = (res: Response) => {
    if (res.status === 200) {
      res.text().then(this.handleCreateText).catch(this.handleServerError);
    } else {
      this.handleServerError(res);
    }
  };

  //  Function to handle the returned text data from the handleCreateResponse 
  //  @param val the text value returned from the server
  handleCreateText = (val: any): void => {
    if (typeof (val) !== "string"|| val === null) {
      console.error("bad data from /load: not a string", val)
      return;
    }
    this.handleLoadDraft(parseInt(val));
  };

  //  Function for receiving data from the server for the requested draft (fetching the draft from the given ID)
  //  When the user clicks on the the create or join button, we use this event to switch our UI to the editor and load the draft (if it exists)
  //  @param keyID the ID for the draft we wish to load (passed in by handleJoin or handleCreateText)
  handleLoadDraft = (keyID: number): void => {
    fetch("/api/loadDraft?id="+encodeURIComponent(keyID))
    .then(this.handleLoadDraftResponse)
    .catch(this.handleServerError);
  }


  //  Function to to handle HTTP response for handleLoadDraft and gets the data returned by the server
  //  @param res The server response to our handleLoadDraft request
  //  Gives an alert if the request failed because the draftID is invalid and the draft doesn't exist
  handleLoadDraftResponse = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.handleLoadDraftJson).catch(this.handleServerError);
    } else {
      alert("Not a valid ID!");
      this.handleServerError(res);
    }
  };

  //  Function to handle the returned JSON data from the response 
  //  @param val the JSON value returned from the server
  handleLoadDraftJson = (val: any): void => {
    if (typeof val !== "object" || val === null) {
      console.error("bad data from /loadDraft: not an object", val)
      return;
    }
    const draft = parseDraft(val);
    if (draft !== undefined) {
      this.setState({currDraft : draft});
    }
  };
  
  // Called when we fail to communicate correctly with the server.
  handleServerError = (_: Response) => {
    console.error(`unknown error talking to server`);
  };

}