import React, { Component } from 'react';
import Rhythm from './rhythm';

class Default extends Component {
	render() {
		return (
			<div className='app'>
				<h1>Rhythm Detector</h1>
				<h2>Select your song at the search bar below</h2>
				<Rhythm></Rhythm>
				{/*	<input type='text' />*/}
				<style global jsx>
					{`
						body,
						html,
						#root {
							margin: 0;
							height: 100%;
						}
						*:active,
						*:focus {
							outline-style: none;
						}
						* {
							box-sizing: border-box;
						}
						#__next {
							display: grid;
							background: linear-gradient(to right, #141e30, #243b55);
							height: 100%;
							width: 100%;
							justify-items: center;
							align-items: center;
							max-height: 100%;
						}
					`}
				</style>
				<style jsx>{`
					h1 {
						font-size: 3rem;
						background: linear-gradient(to right, #f79d00, #64f38c);
						background-clip: text;
						-webkit-text-fill-color: transparent;
						text-shadow: 0px 0px 50px #1ffc442a;
						position: relative;
					}
				`}</style>
			</div>
		);
	}
}

export default Default;
