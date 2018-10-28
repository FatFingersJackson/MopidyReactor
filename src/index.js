import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MopidyServer from './Mopidy';

// Constants like event names
const constants = require('./constants.js');

// Import events module
var events = require('events');
// Create an eventEmitter object
const _eventEmitter = new events.EventEmitter();
// Will be passed on to Application in the ReactDOM.render
var _mopidyPlayer = new MopidyServer(_eventEmitter);

class Application extends React.Component
{

    render()
    {
        return( 
        <div>
            <MusicPlayer MopidyPlayer={this.props.MopidyPlayer}/>
        </div> 
        )
    };
    
    componentDidMount()
    {    
      
    }
}


class MusicPlayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.MopidyPlayer = props.MopidyPlayer.Name;
        this.eventEmitter = props.MopidyPlayer.eventEmitter;
        this.state = {

            currentTrack : {
                name: " - ",
                artist: " - ",
            },
        };
        // Bind the function or setState won't work
        this.updateCurrentTrackInfo = this.updateCurrentTrackInfo.bind(this);
    }

    render()
    {
        return (  
        <div>
             <div>Now Playing <br/>
                 <span>{ this.state.currentTrack.artist } </span> - { this.state.currentTrack.name }</div> 
        </div> ); 
    }

    updateCurrentTrackInfo()
    {
        var MopidyPlayer = this.props.MopidyPlayer;
        this.setState( { currentTrack : MopidyPlayer.CurrentTrack } );
    }

    componentDidMount()
    {
        this.eventEmitter.on(constants.CURRENT_TRACK_UPDATED_EVENT, this.updateCurrentTrackInfo);
    }

    componentWillUnmount()
    {
        this.eventEmitter.off(constants.CURRENT_TRACK_UPDATED_EVENT, this.updateCurrentTrackInfo);
    }
}

  ReactDOM.render(
    <Application MopidyPlayer={ _mopidyPlayer }/>,
    document.getElementById('root')
  );
  
