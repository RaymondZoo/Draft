import React, {  Component, ChangeEvent} from "react";
import { Draft, parseDraft } from "./draft";


interface EditorProps {
  // name of the drafter in this tab
  name : string;

  // Initial state of the draft.
  initialState: Draft;

  // Passed in callback function from app for Server Error
  onServerError: (_: Response) => void;

}


interface EditorState {
  // The current draft 
  currDraft: Draft;

  // The option chosen by this drafter 
  chosenOption: string;
}


export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: any) {
    super(props);

    this.state = { currDraft: this.props.initialState , chosenOption : "Pick an option: "};
  }

  render = (): JSX.Element => {

    const options: JSX.Element[] = [];
    options.push(<option value = "Pick an option: "> Pick an option: </option>)
    for (const option of this.state.currDraft.options) {
      options.push(<option value = {option} > {option} </option>)
    }
    const selected : JSX.Element[] = [];

    const currDrafter: string = this.state.currDraft.drafters[this.state.currDraft.order%this.state.currDraft.drafters.length]

    if(this.state.currDraft.done){
      selected.push(
        <div>
          <h2>DRAFT COMPLETED!</h2>
        </div>
      );
    }
    else if(currDrafter === this.props.name){
      selected.push(
        <div>
          <p>It's your pick!</p>
          <div style={{display: "inline-block", marginRight: 2}}>
            <select onChange= {this.handleOptionChange} value = {this.state.chosenOption}> {options} </select>
          </div>
          <div style={{display: "inline-block"}}>
            <button type="button" onClick={this.handleDraft}> Draft </button>
          </div>
        </div>
      );
    }
    else{
      selected.push(
      <div>
          <p>Waiting for {currDrafter} to draft ...</p>
          <button type="button" onClick={this.handleRefresh}> Refresh </button>
      </div>
      );
    }

    const picks: JSX.Element[] = [];
    if(this.state.currDraft.drafted.length === 0)
    {
      picks.push(
        <div>
          <p>No picks made yet ... </p>
        </div>
      )
    }
    else{
      picks.push(
      <tr>
        <th>Num</th>
        <th>Pick</th>
        <th>Drafter</th>
      </tr>
      )
      let i = 1;
      for (const pick of this.state.currDraft.drafted) {
      picks.push(
        <tr>
        <td>{i++}</td>
        <td>{pick.option}</td>
        <td>{pick.drafter}</td>
      </tr>);
    }
    }
    
    return (
    <div>
      <h2>WELCOME TO DRAFT "{this.state.currDraft.draftID}"!</h2>
      <h4>Name: {this.props.name} </h4>
      <table width={500}>{picks}</table>
      {selected}
    </div>
    );
  };

  // Function for storing the new option chosen by drafter from the draft
  // @param evt the event of selecting a value from the dropdown bar
  handleOptionChange = (evt: ChangeEvent<HTMLSelectElement>): void => { 
    this.setState({chosenOption: evt.target.value})
  };
  
  // It sends/(fetches a POST request) a pick to the server to be saved to this draft with the given ID
  handleDraft = (): void => {
    if(this.state.chosenOption !== "Pick an option: ")
    {
      fetch("/api/savePick?id="+encodeURIComponent(this.state.currDraft.draftID), 
      {method: "POST",
      body: JSON.stringify( {drafter: JSON.stringify(this.props.name), option: JSON.stringify(this.state.chosenOption)}), 
      headers: {"Content-Type": "application/json"}})
      .then(this.handleDraftResponse)
      .catch(this.props.onServerError)
    }
    this.handleRefresh()
  };

   // Function to handle HTTP response for handleDraft
   // @param res The server response to our handleDraft request
   handleDraftResponse = (res: Response) => {
    if (res.status !== 200) {
      this.props.onServerError;
    }
  };

  // Helper function for loading the draft and setting the new state of the draft (refresh) 
   handleRefresh = (): void => {
     this.handleLoadDraft(this.state.currDraft.draftID);
   };

  // Function for receiving data from the server for the requested file (fetching the fileContents from the given fileName)
  // @param evt the event when the user clicks on the fileName link, we use this event to switch our UI to the editor and load our square
  handleLoadDraft = (keyID: number): void => {
    fetch("/api/loadDraft?id="+encodeURIComponent(keyID))
    .then(this.handleLoadDraftResponse)
    .catch(this.props.onServerError);
  }

  // Function to to handle HTTP response for handleLpad and gets the data returned by the server
  // @param res The server response to our handleLoad request
  handleLoadDraftResponse = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.handleLoadDraftJson).catch(this.props.onServerError);
    } else {
      this.props.onServerError(res);
    }
  };

  // Function to handle the returned text data from the response 
  // @param val the text value returned from the server
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


}
