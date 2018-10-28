import React from 'react';
import ReactDOM from 'react-dom';
const constants = require('./constants.js');

class MusicPlayer extends React.Component
{
    constructor(props)
    {
        super(props);

        this.MopidyPlayer = props.MopidyPlayer.Name;
        this.eventEmitter = props.MopidyPlayer.eventEmitter
        

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
        this.setState( { currentTrack : this.MopidyPlayer.CurrentTrack } );
    }

    componentDidMount()
    {
        this.eventEmitter.on(constants.CURRENT_TRACK_UPDATED_EVENT, this.updateCurrentTrackInfo);
    }

    componentWillUnmount()
    {

    }
}

export default MusicPlayer;