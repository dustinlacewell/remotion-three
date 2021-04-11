import { Box } from '@react-three/drei';
import React, { FC } from 'react';
import { useCurrentFrame } from 'remotion';


export const SpinningCubeStory: FC<{frame: number}> = (props) => {
	const frame = useCurrentFrame();
	console.log(frame);
	console.log(props.frame);

	return (
		<>
			<Box position={[-2, 0, 0]} rotation={[frame * .16, frame * .16, frame * .16]} />
			<Box position={[2, 0, 0]} rotation={[props.frame * .16, props.frame * .16, props.frame * .16]} />
		</>
	);
};
