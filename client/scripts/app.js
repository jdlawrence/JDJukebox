// Your ReactJS code here
SC.initialize({
  client_id: SOUND_CLOUD_KEY,
  redirect_uri: 'http://example.com/callback'
});

var Welcome = React.createClass({
  render: function() {
    return (
      <div>
      <h1 className="welcomeTitle">Welcome to JDJukebox!!</h1>
      </div>
      );
  }

});

var FindUser = React.createClass({
  getInitialState: function() {
    return {username: ''};
  },
  handleChange: function(event) {
    this.setState({username: event.target.value});

  },
  onSubmit: function(e) {
    var that = this;
    e.preventDefault();
    var users = [];
    // When the user is inputted, a call the soundcloud '/resolve' endpoint that returns 
    // a user object
    SC.get('/users', {q: this.state.username}, (function (users) {
      this.props.getUsers(users);
      // iterate over users, do the matching
      // hit the users api link, get tracks and stream them via their IDs     
    }).bind(this));
    
  },
  render: function() {
    return (
      <div className="MyForm" className="form-group">
      <form onSubmit={this.onSubmit} className="form-group"> 
      <input placeholder="Please enter a SoundCloud username" 
      type="text" 
      value={this.state.username}
      onChange={this.handleChange}
      className="form-control" />
      <button className="btn btn-default" type="submit">Submit</button>
      </form> 
      </div>
      );
  }
})

var UsersView = React.createClass({
  handleClick: function(i) {
    // this.props.updatePlaylists(this.props.users[i].tracks)
    var playlistsArray = [];
    SC.get('/users/' + this.props.users[i].id + '/playlists', {
        limit: 100
      }, 

    (function (playlists) {
      for (var i = 0; i < playlists.length; i++) {
        playlistsArray.push(playlists[i]);
      }

      // When called, this function updates the list of playlists
      this.props.updatePlaylist(playlistsArray);

    }).bind(this));
  },

  render: function(){
    // Iterate through all playlists and display each with the permalink(track title)
    return (
      <div className="col-md-12" >
      <h1>Users</h1>
      {this.props.users.map(function(user, i) {
        return (
          <div onClick={this.handleClick.bind(this, i)} key={i}>
          {user.username} <img onClick={this.handleClick.bind(this, i)} src={user.avatar_url}/>
          </div>
          );
      }, this)}
      </div>
      )
  }
});

var GetPlaylists = React.createClass({
  getInitialState: function() {
    return {username: ''};
  },
  handleChange: function(event) {
    this.setState({username: event.target.value});
    console.log('this.state.username', this.state.username); 

  },
  onSubmit: function(e) {
    var that = this;
    e.preventDefault();
    var playlistsArray = [];
    // When the user is inputted, a call the soundcloud '/resolve' endpoint that returns 
    // a user object
    SC.get('/resolve/?url=https://soundcloud.com/' + this.state.username, {
      limit: 1
    }, (function (result) {
      // take the user id and look up the playlists associated with that user
      console.log('result is:', result);
      SC.get('/users/' + result.id + '/playlists', {
        limit: 100
      }, 

      (function (playlists) {
        for (var i = 0; i < playlists.length; i++) {
          playlistsArray.push(playlists[i]);
        }

        // When called, this function updates the list of playlists
        this.props.updatePlaylist(playlistsArray);

      }).bind(this));

    }).bind(this));

  },
  render: function() {
    return (
      <div className="MyForm" className="form-group">
      <form onSubmit={this.onSubmit} className="form-group"> 
      <input placeholder="Please enter a SoundCloud username" 
      type="text" 
      value={this.state.username}
      onChange={this.handleChange}
      className="form-control" />
      <button className="btn btn-default" type="submit">Submit</button>
      </form> 
      </div>
      );
  }

});

var PlayerView = React.createClass({
  componentDidMount: function () {
    SC.get('/tracks/193733375', {}, function (track){
      SC.oEmbed(track.uri, { 
        auto_play: false, 
        maxwidth: 500, 
        maxheight: 200
      }, document.getElementById('songID'));
    });

  },  
  render: function(){

    return (
      <div id='songID'>
      </div>
      )
  }
});

var PlaylistView = React.createClass({
  handleClick: function(i) {
    this.props.getTracks(this.props.playlists[i].tracks)
  },

  render: function(){
    // Iterate through all playlists and display each with the permalink(track title)
    return (
      <div className="col-md-6" >
      <h1>Playlists</h1>
      {this.props.playlists.map(function(playlist, i) {
        return (
          <div onClick={this.handleClick.bind(this, i)} key={i}>
          {playlist.permalink}
          </div>
          );
      }, this)}
      </div>
      )
  }
});

var TracksView = React.createClass({
  handleClick: function(i) {
    this.props.playATrack(this.props.tracks[i]);
  },

  render: function() {
    return (
      <div className="col-md-6">
      <h1>Tracks</h1>
      {this.props.tracks.map(function(track, i) {
        return (
          <div onClick={this.handleClick.bind(this, i)} key={i} >
          {track.permalink}
          {console.log('&&&&&&&&&&&&', track.artwork_url)}
          </div>
          );
      }, this)}
      </div>
      )
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {playlists: [], tracks: [], users: []};
  },
  updatePlaylist: function(playlists){
    this.setState({playlists: playlists});
  },
  getTracks: function(tracks) {
    this.setState({tracks: tracks});
  },
  getUsers: function(users) {
    console.log('users are', users);
    this.setState({users: users})
  },
  playATrack: function(track) {
    SC.oEmbed(track.uri, { 
      auto_play: true, 
      maxwidth: 500, 
      maxheight: 200
    }, document.getElementById('songID'));
  },
  render: function() {
    return (
      <div>
        <Welcome />
        <div className="container text-center">
          <PlayerView playATrack={this.playATrack}/>
        </div>
        <div className="container text-center">
          <FindUser getUsers={this.getUsers}/>
        </div>
        <div className="container text-center">
          <UsersView users={this.state.users} updatePlaylist={this.updatePlaylist}/>
        </div>
        <div className="row container text-center">
          <PlaylistView playlists={this.state.playlists} getTracks={this.getTracks}/>
          <TracksView tracks={this.state.tracks} playATrack={this.playATrack}/>
        </div>
      </div>
      )
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
  );
