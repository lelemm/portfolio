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
import { useRef, useState } from "react";
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
  const fixedJoin = useRef<RapierRigidBody>(null);
  const joint1 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  useRopeJoint(fixedJoin, joint1, [[0, 0, 0], [0, 0, 0], 0.5]);

  useRopeJoint(joint1, card, [[0, 0, 0], [0, 0.8, 0], 2.2]);

  const [hovered, setHover] = useState(false);
  useCursor(hovered, "pointer", "auto", document.body);
  const pic = useTexture("/pic.png");
  const linkedIn = useTexture("/linkedin.svg");
  const github = useTexture("/github.svg");
  const whatsapp = useTexture("/WhatsApp.svg");
  const mail = useTexture("/mail.svg");

  Object.values(materials).forEach((material) => {
    const convertedMaterial = material as THREE.MeshStandardMaterial;
    convertedMaterial.roughness = 0.1; // Glossy
    convertedMaterial.metalness = 0.1; // Reflective
    convertedMaterial.color = new THREE.Color(0xffffff);
  });

  const glossyMaterial = new THREE.MeshStandardMaterial();
  glossyMaterial.roughness = 0.1;
  glossyMaterial.metalness = 0.1;
  glossyMaterial.color = new THREE.Color(0xffffff);

  useFrame(() => {
    if (card.current) {
      const y = card.current.rotation().y;
      if (Math.abs(y) > 0.4) {
        card.current.applyImpulseAtPoint(
          { x: 0, y: 0, z: y < 0 ? 0.009 : -0.009 },
          { x: -1, y: -2, z: 0 },
          true
        );
      }

      if (
        Math.sqrt(
          Math.pow(card.current.angvel().x, 2) +
            Math.pow(card.current.angvel().y, 2) +
            Math.pow(card.current.angvel().z, 2)
        ) > 1
      ) {
        setHover(true);
        setTimeout(() => {
          setHover(false);
        }, 10);
      }

      if (
        Math.sqrt(
          Math.pow(card.current.angvel().x, 2) +
            Math.pow(card.current.angvel().y, 2) +
            Math.pow(card.current.angvel().z, 2)
        ) < 0.1
      ) {
        card.current.applyImpulseAtPoint(
          { x: 0, y: 0, z: y < 0 ? 0.009 : -0.009 },
          { x: -1, y: -2, z: 0 },
          true
        );
      }
    }
  });

  return (
    <>
      <RigidBody ref={fixedJoin} type="fixed" position={[0, 3, 0]} />
      <RigidBody position={[0, 0, 0]} ref={joint1}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody ref={card} type={hovered ? "kinematicPosition" : "dynamic"}>
        <CuboidCollider args={[0, 2, 0.01]} />
        <group position={[0, -1.0, 0]}>
          <group rotation={[0, -Math.PI / 2, 0]}>
            <primitive object={scene} />
          </group>
          <mesh>
            <Plane
              args={[2.8, 3.2]}
              position={[position[0], position[1] + 0.5, position[2]]}
              material={glossyMaterial}
            >
              <Decal
                position={[0, 0.8, 0]}
                rotation={[0, 0, 0]}
                scale={[1, 1, 1]}
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
                position={[-1.1, -0.2, 0.001]}
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
                position={[0, 0.3, 0.001]}
                anchorX="center"
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
                Leandro Menezes
              </Text>

              <Text
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
              </Text>

              <Decal
                position={[-1.1, -0.7, 0.001]}
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

              <Text
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
              </Text>

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
              </Text>
            </Plane>
          </mesh>
        </group>
      </RigidBody>
    </>
  );
}

useGLTF.preload("/badge.glb");
