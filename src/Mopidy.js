
/*  
function MopidyServer() { }
module.exports = new MopidyServer();
*/

const events = require('events');
const constants = require('./constants.js');
var Mopidy = require("mopidy");


class MopidyServer
{

    

    constructor( eventEmitter )
    {
        this.Name = "Mopidyserver";
        this.eventEmitter = eventEmitter;
        

        this.CurrentTrack = null;
        this.CurrentArtist = null;
        this.CurrentTrackTitle = null;
        
        

        this.updateCurrentTrack = function(track)
        {
            console.log("Updating track " +  JSON.stringify(track));
            
            // Update Current Track
            this.CurrentTrack = track;
            
            // Notify listeners that track has changed
            this.eventEmitter.emit(constants.CURRENT_TRACK_UPDATED_EVENT);
             
        };

        this.updateCurrentTrack = this.updateCurrentTrack.bind(this);
    
        var mopidy = new Mopidy({
            webSocketUrl: "ws://192.168.100.14:6680/mopidy/ws/",
            callingConvention: "by-position-only",
        });
        this.mopidy = mopidy;



        mopidy.on("event:trackPlaybackStarted", function (_track){
            var track = _track['tl_track']['track'];
            
            if(!track)
            { console.log("Could not get track info from: " + JSON.stringify(_track) ) };
        
            var trackName = track.name || "unknown";
            var artists = track.artists || "unknown";
        
            // If there are more artists than one returns array
            if( Array.isArray( artists ))
            {
                artists = artists.map( x =>  x.name ).join(',');
            }
            
            console.log("Track Playback started: " + artists + " - " + trackName );
        });
        

        //  Arrow function to allow calling $this
        mopidy.on("state:online",  () => {
            console.log("Ready!");
            try
            {
                // If paused -> Play
                mopidy.playback.getState().then(function(state){
                    if(state !== "playing" )
                    { playDefaultStation(); }
                });
            }catch(e)
            {
                console.log("Error getting current track : " + e);
            }
        
        mopidy.on("event:streamTitleChanged", (info) => {
                //console.log("Stream title changed :" + JSON.stringify(info));
                // info contains only title
                var title = info.title;
                this.updateCurrentStreamTrack(title);
            });

                   // Get current Track
            mopidy.playback.getCurrentTrack()
            .done( (t) =>  {

                if( !t.artist )
                { 
                    // No artist: a stream?
                    mopidy.playback.getStreamTitle().then( (s) => 
                    {
                         //console.log("STREAM:"+ JSON.stringify(s) ); 
                         this.updateCurrentStreamTrack(s);
                    });
                }

                this.updateCurrentTrack(t);
            });
            
            this.updateCurrentStreamTrack = function(title)
            {
                var track = {};
                try{ 
                    // The titles seem to be format 'Artist - Tracktitle '
                    var artistAndTrack = title.split(" - ");
                    track["artist"] = artistAndTrack[0];
                    track["name"] = artistAndTrack[1];
                 }
                catch(e)
                {
                    // In case of another format (not occured yet)
                    // Get the radio stream name for artist and use info.title as trackname
                }
                this.updateCurrentTrack(track);
            }
                        
            function playDefaultStation()
            {
                mopidy.playlists.asList()
                .then(function(res){
        
                    var listUri = "";
                    
                    for(var i = 0; i < res.length; i++)
                    {
                        var list = res[i];
                        if( list.name === "RadioStreams" )
                        { listUri = list.uri; }
                    }
        
                    mopidy.playlists.getItems(listUri)
                    .then(function(trackRes){
                        for(var i = 0; i < trackRes.length; i++)
                        {
                            var track = trackRes[i];
                            
                            if(track.name === "Classic Country")
                            { 
                                var trackUri = track.uri;
                                mopidy.tracklist.add(null, null, trackUri, null);
                                mopidy.playback.play();
                             }
                        }
                    })
                });
            }
            // <-- PlayDefaultStation
            
        }); //<-- State Online
    
        
    }
    // <-- Constructor


    

    getCurrentTrackName()
    {
        var nullTrack = " - ";
        if( this.CurrentTrack == null ) { return nullTrack; }
        return this.CurrentTrack.name || nullTrack;
    }

    printCurrentTrack = function (track) {
        console.log("PrintCurrentTrack")
        if (track) {
            console.log( "Currently playing : " + track.name );
            
            // If paused -> Play
            /*
            mopidy.playback.getState().then(function(state){
                if(state != "playing" )
                {mopidy.playback.play();}
            
            });
            */
        }}
    
}




export default MopidyServer;


