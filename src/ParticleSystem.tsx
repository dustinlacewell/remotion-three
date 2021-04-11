import { ECSContext, Emitter, Entity, Facet, Tuple3, useECS, useQuery, useSystem, View } from "@ldlework/react-ecs";
import { Box } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { FC, useContext } from "react";
import { interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Color, Mesh, MeshBasicMaterial, Vector3 } from "three";

class Velocity extends Facet<Velocity> {
    velocity? = new Vector3(0, 0, 0);
}

class Lifetime extends Facet<Lifetime> {
    timeleft = 0;
}

const RandomColorSystem: FC = () => {
    useQuery(e => e.has(View), {
        added: ({ current }) => {
            const view = current.get(View);
            if (view) {
                const mesh = view.ref.current as Mesh;
                const material = mesh.material as MeshBasicMaterial;
                material.color.set(
                    new Color(Math.random(), Math.random(), Math.random()),
                );
            }
        },
    });

    return null;
};

const VelocitySystem: FC = () => {
    const query = useQuery(e => e.hasAll(View, Velocity));

    return useSystem((dt: number) => {
        query.loop([View, Velocity], (e, [view, motion]) => {
            const transform = view.ref.current;
            if (transform) {
                transform.position.add(
                    motion.velocity.clone().multiplyScalar(dt),
                );
            }
        });
    });
};

const GravitySystem: FC<{ gravity: Tuple3 }> = props => {
    const query = useQuery(e => e.hasAll(View, Velocity));

    return useSystem((dt: number) => {
        query.loop([View, Velocity], (e, [view, motion]) => {
            const transform = view.ref.current;
            if (transform) {
                const scaledGravity = new Vector3(
                    ...props.gravity,
                ).multiplyScalar(dt);
                const adjustedVelocity = motion.velocity
                    .clone()
                    .add(scaledGravity);
                motion.velocity = adjustedVelocity;
            }
        });
    });
};

const LifetimeSystem: FC = () => {
    const { engine } = useContext(ECSContext);
    const query = useQuery(e => e.hasAll(Lifetime));

    return useSystem((dt: number) => {
        query.loop([Lifetime], (e, [lifetime]) => {
            lifetime.timeleft -= dt;

            if (lifetime.timeleft <= 0) {
                engine.removeEntity(e);
            }
        });
    });
};

export const ParticleSystem: FC = () => {
    const ECS = useECS();

    ECS.update(.16);

    return (
	<>
		<ECS.Provider>
			<LifetimeSystem />
			<VelocitySystem />
			<GravitySystem gravity={[0, -10, 0]} />
			<RandomColorSystem />

			<Emitter>
				{() => {
                        const rnd = (s: number) => Math.random() * s - s * 0.5;
                        const randomVector = (s: number) =>
                            new Vector3(rnd(s), rnd(s), rnd(s));
                        return (
	<Entity>
		<Lifetime timeleft={3} />
		<Velocity velocity={randomVector(10)} />
		<View>
			<Box />
		</View>
	</Entity>
                        );
                    }}
			</Emitter>
		</ECS.Provider>
	</>
    );
};

export const ParticleSystemStory: FC = () => {
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
						<ParticleSystemStory />
					</Canvas>
				</Sequence>
			</div>
		</div>
	);
};
