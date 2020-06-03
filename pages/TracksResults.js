import axios from 'axios';
import Audio from './Audio';
const TracksResults = (props) => {
	const trackRef = React.createRef();
	let analysis;
	let [sa, sas] = React.useState(analysis);

	let getAnalysis = (e) => {
		axios
			.get('https://api.spotify.com/v1/audio-analysis/' + e.target.id, {
				headers: {
					Authorization: props.authorization,
				},
			})
			.then((data) => {
				sas(data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<ul ref={trackRef}>
			{props.tracks.map((track) => {
				return (
					<li id={track.id} key={track.id} onClick={getAnalysis}>
						{track.name} - {track.artists[0].name} ({track.popularity})
					</li>
				);
			})}
			{}
			<Audio analysis={sa}></Audio>
		</ul>
	);
};

export default TracksResults;
