const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsInPlaylists(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);
    const playlist = playlistResult.rows[0];

    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      LEFT JOIN playlists_songs ON songs.id = playlists_songs.song_id
      WHERE playlists_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songQuery);

    playlist.songs = songsResult.rows;
    return playlist;
  }
}

module.exports = PlaylistsService;
