import BandJS from '../band.js/dist/band';
import React, { Component } from 'react';

class Audio extends Component {
	constructor(props) {
		super(props);
		this.state = { player: '' };
	}
	playHandler = () => {
		if (typeof this.state.player == 'function') {
			console.log(this.state.player);
			this.state.player.stop();
		}
		let conductor = new BandJS();
		let sectionsProps = [];
		this.props.analysis.sections.forEach((section) => {
			sectionsProps.push([section.duration * 1000, section.tempo]);
		});
		console.log(sectionsProps);
		conductor.setTimeSignature(4, 4);
		conductor.setTempo(sectionsProps[0][1]);
		let piano = conductor.createInstrument('sine');
		piano.note('quarter', 'G3');
		this.setState({ player: conductor.finish() }, () => {
			console.log(this.state.player);
			this.state.player.loop(true);
			rhythmTimer(sectionsProps[0][0]);
		});

		function rhythmTimer(time) {
			Audio.state.player.play();
			sectionsProps.shift();
			setTimeout(() => {
				Audio.state.player.stop();
				if (sectionsProps.length != 0) {
					conductor.setTempo(sectionsProps[0][1]);
					Audio.setState({ player: conductor.finish() });
					Audio.state.player.loop(true);
					rhythmTimer(sectionsProps[0][0]);
				}
			}, time);
		}
	};
	render() {
		return <p onClick={this.playHandler}>click Me</p>;
	}
}

export default Audio;
