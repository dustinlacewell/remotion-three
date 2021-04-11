import { Entity, Facet, useECS, useQuery, useSystem, View } from '@ldlework/react-ecs';
import { Box } from '@react-three/drei';
import React, { FC } from 'react';
import { Vector3 } from 'three';

class Spinning extends Facet<Spinning> {
    rotation = new Vector3(0, 0, 0);
}

const SpinningSystem = () => {
    const query = useQuery(e => e.hasAll(View, Spinning));

    return useSystem((dt: number) => {
        query.loop([View, Spinning], (e, [view, spin]) => {
            const transform = view.ref.current!;
            const newRotation = new Vector3(dt, dt, dt);
            transform.rotation.setFromVector3(newRotation);
        });
    });
};

const SpinningCube = () => {
    return (
	<Entity>
		<Spinning rotation={new Vector3(0, 1, 0)} />
		<View>
			<Box />
		</View>
	</Entity>
    );
};


export const SpinningCubeStory: FC<{frame: number}> = (props) => {
	const ECS = useECS();
	ECS.update(props.frame * .16)

    return (
	<ECS.Provider>
		<SpinningSystem />
		<SpinningCube />
	</ECS.Provider>
    );
};