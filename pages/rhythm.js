import React, { Fragmant, Component } from 'react';
import axios from 'axios';
import TracksResults from './TracksResults';

class Rhythm extends Component {
	constructor() {
		super();
		this.state = {
			token: null,
			track_list: [],
			query: ''
		};
	}

	componentDidMount() {
		const hash = window.location.hash
			.substring(1)
			.split('&')
			.reduce((initial, item) => {
				if (item) {
					var parts = item.split('=');
					initial[parts[0]] = decodeURIComponent(parts[1]);
				}
				return initial;
			}, {});
		this.setState({ token: hash.access_token, token_type: hash.token_type });
	}

	getTracks = () => {
		axios
			.get(
				`https://api.spotify.com/v1/search?q=${this.state.query}&type=track&limit=5`,
				{
					headers: {
						Authorization: `${this.state.token_type} ${this.state.token}`
					}
				}
			)
			.then(data => {
				this.setState({ track_list: data.data.tracks.items });
			})
			.catch(err => {
				console.log(err);
			});
	};

	changeHandler = () => {
		this.setState({ query: this.search.value }, () => {
			if (this.state.query && this.state.query.length > 1) {
				this.getTracks();
			} else {
				this.setState({ track_list: [] });
			}
		});
	};

	render() {
		return (
			<>
				{!this.state.token && (
					<button>
						<a href='https://accounts.spotify.com/authorize?client_id=58b9c4063c904cda87af80186a732f01&redirect_uri=http:%2F%2Flocalhost:3000&response_type=token'>
							Login With Spotify
						</a>
					</button>
				)}
				{this.state.token && (
					<>
						<input
							ref={input => (this.search = input)}
							onChange={this.changeHandler}
						/>
						<TracksResults
							authorization={`${this.state.token_type} ${this.state.token}`}
							tracks={this.state.track_list}
						></TracksResults>
					</>
				)}
			</>
		);
	}
}

export default Rhythm;
