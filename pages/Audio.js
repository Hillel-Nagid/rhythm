import BandJS from '../band.js/dist/band';
import React, { Component } from 'react';

class Audio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			player: 2,
		};
	}
	playHandler = () => {
		if (this.state.player) {
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
		this.setState({ player: this.state.player + 1 });
		console.log(this.state.player);
		this.state.player.loop(true);
		rhythmTimer(sectionsProps[0][0]);
		function rhythmTimer(time) {
			this.state.player.play();
			sectionsProps.shift();
			setTimeout(() => {
				this.state.player.stop();
				if (sectionsProps.length != 0) {
					conductor.setTempo(sectionsProps[0][1]);
					this.state.player = conductor.finish();
					this.state.player.loop(true);
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
