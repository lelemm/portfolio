import * as THREE from "three";
import {
  Decal,
  Plane,
  Text,
  useCursor,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  BallCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

type BadgeProps = {
  position: readonly [number, number, number];
};

export function Badge({ position }: BadgeProps) {
  const { scene, materials } = useGLTF("/badge.glb");
  const { scene: scene_clip, materials: materials_clip } = useGLTF("/clip.glb");
  const fixedJoin = useRef<RapierRigidBody>(null);
  const join1 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const strapGeometry = useRef<any>(null);
  const strapMaterial = useRef<any>(null);

  useRopeJoint(fixedJoin, join1, [[0, 0, 0], [0, 0, 0], 5]);
  useRopeJoint(join1, card, [[0, 0, 0], [0, 1.4, 0], 1]);

  const [hovered, setHover] = useState(false);
  useCursor(hovered, "pointer", "auto", document.body);
  const pic = useTexture("/pic.png");
  const linkedIn = useTexture("/linkedin.svg");
  const github = useTexture("/github.svg");
  const whatsapp = useTexture("/WhatsApp.svg");
  const mail = useTexture("/mail.svg");

  Object.values(materials).forEach((material) => {
    const convertedMaterial = material as THREE.MeshStandardMaterial;
    convertedMaterial.roughness = 0.3;
    convertedMaterial.metalness = 0.05;
    convertedMaterial.color = new THREE.Color(0xffffff);
  });

  Object.values(materials_clip).forEach((material) => {
    const convertedMaterial = material as THREE.MeshStandardMaterial;
    convertedMaterial.roughness = 0;
    convertedMaterial.metalness = 0.7;
    convertedMaterial.color = new THREE.Color(0xeeeeee);
  });

  const glossyMaterial = new THREE.MeshStandardMaterial();
  glossyMaterial.roughness = 0.3;
  glossyMaterial.metalness = 0.05;
  glossyMaterial.color = new THREE.Color(0xffffff);

  useEffect(() => {
    if (strapGeometry.current) {
      strapGeometry.current.setPoints([
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (card.current) {
        card.current.applyImpulseAtPoint(
          { x: 0, y: 0, z: -2 },
          { x: -1, y: -2, z: 0 },
          true
        );
      }
    }, 100);
  }, [card]);

  useFrame(() => {
    if (fixedJoin.current && card.current) {
      const fixedPosition = fixedJoin.current.translation();
      const joinPosition = card.current.translation();

      strapGeometry.current.setPoints([
        new THREE.Vector3(
          fixedPosition.x + 2,
          fixedPosition.y,
          fixedPosition.z - 1
        ),
        new THREE.Vector3(
          joinPosition.x + 0.05,
          joinPosition.y + 2.1,
          joinPosition.z + 0.2
        ),
        new THREE.Vector3(
          joinPosition.x + 0.05,
          joinPosition.y + 2.1,
          joinPosition.z + 0.4
        ),
        new THREE.Vector3(
          fixedPosition.x - 2,
          fixedPosition.y,
          fixedPosition.z + 1
        ),
      ]);
    }
  });

  return (
    <>
      <RigidBody ref={fixedJoin} type="fixed" position={[0, 7, 0]} />
      <RigidBody ref={join1} position={[0, 1.5, 0]}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody ref={card} type={hovered ? "kinematicPosition" : "dynamic"} linearDamping={0.2} angularDamping={0.2}>
        <CuboidCollider args={[0, 0, 0.01]} />
        <group
          position={[0, -1.0, 0]}
          onPointerDown={() => {
            if (card.current)
              card.current.applyImpulseAtPoint(
                { x: 0, y: 0, z: -0.5 },
                { x: -1, y: -2, z: 0 },
                true
              );
          }}
        >
          <group rotation={[0, -Math.PI / 2, 0]}>
            <primitive object={scene} />
          </group>
          <mesh>
            <Plane
              args={[2.8, 3.4]}
              position={[position[0], position[1] + 0.5, position[2]]}
              material={glossyMaterial}
            >
              <Decal
                position={[0, 0.3, 0]}
                rotation={[0, 0, 0]}
                scale={[2, 2, 2]}
              >
                <meshStandardMaterial
                  transparent={true}
                  roughness={0.05}
                  metalness={0.05}
                  map={pic}
                  emissive={new THREE.Color(0xffffff)}
                  emissiveIntensity={0.01}
                  polygonOffset
                  polygonOffsetUnits={-110}
                />
              </Decal>
              <Decal
                position={[-0.3, -1.3, 0.001]}
                rotation={[0, 0, 0]}
                scale={[0.5, 0.5, 0.5]}
                onPointerEnter={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onPointerDown={() => {
                  window.location.href =
                    "https://www.linkedin.com/in/leandromacielmenezes/";
                }}
              >
                <meshBasicMaterial
                  map={linkedIn}
                  transparent={true}
                  polygonOffset
                  polygonOffsetUnits={-10}
                />
              </Decal>

              <Decal
                position={[0.3, -1.3, 0.001]}
                rotation={[0, 0, 0]}
                scale={[0.5, 0.5, 0.5]}
                onPointerEnter={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onPointerDown={() => {
                  window.location.href = "https://github.com/lelemm/";
                }}
              >
                <meshBasicMaterial
                  map={github}
                  transparent={true}
                  polygonOffset
                  polygonOffsetUnits={-10}
                />
              </Decal>

              <Decal
                position={[-0.9, -1.3, 0.001]}
                rotation={[0, 0, 0]}
                scale={[0.5, 0.5, 0.5]}
                onPointerEnter={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onPointerDown={() => {
                  window.location.href =
                    "https://api.whatsapp.com/send/?phone=5511963050544";
                }}
              >
                <meshBasicMaterial
                  map={whatsapp}
                  transparent={true}
                  polygonOffset
                  polygonOffsetUnits={-110}
                />
              </Decal>
              <Text
                position={[0, 1.65, 0.001]}
                anchorX="center"
                anchorY="top"
                scale={0.45}
                fontSize={0.5}
                fontWeight={700}
                color="black"
                depthOffset={-10}
                textAlign="left"
                material={
                  new THREE.MeshStandardMaterial({
                    color: "white",
                    side: THREE.FrontSide,
                  })
                }
              >
                Leandro Menezes
              </Text>

              <Text
                position={[0, -0.7, 0.001]}
                anchorX="center"
                anchorY="top"
                scale={0.45}
                fontSize={0.5}
                fontWeight={500}
                color="black"
                depthOffset={-10}
                textAlign="left"
                material={
                  new THREE.MeshStandardMaterial({
                    color: "white",
                    side: THREE.FrontSide,
                  })
                }
              >
                Software Engineer
              </Text>              

              {/* <Text
                position={[-0.7, -0.06, 0.001]}
                anchorX="left"
                anchorY="top"
                scale={0.45}
                fontSize={0.4}
                color="black"
                depthOffset={-10}
                textAlign="left"
                material={
                  new THREE.MeshStandardMaterial({
                    color: "white",
                    side: THREE.FrontSide,
                  })
                }
              >
                55 (11) 96305-0544
              </Text> */}

              <Decal
                position={[0.9, -1.3, 0.001]}
                rotation={[0, 0, 0]}
                scale={[0.5, 0.5, 0.5]}
                onPointerEnter={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onPointerDown={() => {
                  window.location.href = "mailto:lelemm@gmail.com";
                }}
              >
                <meshBasicMaterial
                  map={mail}
                  transparent={true}
                  polygonOffset
                  polygonOffsetUnits={-110}
                />
              </Decal>

              {/* <Text
                position={[-0.7, -0.55, 0.001]}
                anchorX="left"
                anchorY="top"
                scale={0.45}
                fontSize={0.4}
                color="black"
                depthOffset={-10}
                textAlign="left"
                material={
                  new THREE.MeshStandardMaterial({
                    color: "white",
                    side: THREE.FrontSide,
                  })
                }
              >
                lelemm@gmail.com
              </Text> */}
{/* 
              <Text
                position={[-1.3, -1.2, 0.001]}
                anchorX="left"
                anchorY="top"
                scale={0.4}
                fontSize={0.4}
                color="black"
                depthOffset={-10}
                textAlign="left"
                material={
                  new THREE.MeshStandardMaterial({
                    color: "white",
                    side: THREE.FrontSide,
                  })
                }
              >
                Socials:
              </Text> */}
            </Plane>
          </mesh>
        </group>
        <group position={[0, -1.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <primitive object={scene_clip} />
        </group>
      </RigidBody>
      {/* Neck Strap */}
      <mesh>
        <meshLineGeometry ref={strapGeometry} />
        <meshLineMaterial
          ref={strapMaterial}
          lineWidth={0.08}
          color="black"
          depthWrite={false}
          transparent
        />
      </mesh>
    </>
  );
}

useGLTF.preload("/badge.glb");
