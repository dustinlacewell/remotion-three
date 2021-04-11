import { Canvas } from '@react-three/fiber';
import React, { FC } from 'react';
import { interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { SpinningCubeStory } from './SpinningCube';

export const HelloWorld: FC = () => {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();

	const opacity = interpolate(
		frame,
		[videoConfig.durationInFrames - 25, videoConfig.durationInFrames - 15],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	return (
		<div style={{flex: 1, backgroundColor: 'white'}}>
			<div style={{opacity}}>
				<Sequence from={0} durationInFrames={videoConfig.durationInFrames}>
					<Canvas frameloop="always" style={{width: "100%", height: "100%"}}>
						<SpinningCubeStory frame={frame}/>
					</Canvas>
				</Sequence>
			</div>
		</div>
	);
};
