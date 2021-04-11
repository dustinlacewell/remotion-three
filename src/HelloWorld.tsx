import { Box } from '@react-three/drei';
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
					<h1>Frame: {frame}</h1>
					<Canvas frameloop="demand" style={{width: "100%", height: "100%"}}>
						<Box position={[0, 0, 0]} rotation={[frame * .16, frame * .16, frame * .16]} />
						<SpinningCubeStory frame={frame}/>
					</Canvas>
				</Sequence>
			</div>
		</div>
	);
};
