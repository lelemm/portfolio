import { Canvas } from "@react-three/fiber";
import { Badge } from "./components/Badge";
import useNarrowWidth from "./hooks/useNarrowWidth";
import { Physics } from "@react-three/rapier";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";

function App() {
  const isNarrow = useNarrowWidth(600);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: isNarrow ? "column" : "row",
      }}
    >
      <div></div>
      <div id="canvas-container" style={{ flexGrow: 1 }}>
        <Canvas shadows>
          <Physics interpolate gravity={[0, -10, 0]} timeStep={1 / 60}>
            <Badge position={[0, 0, 0]} />
          </Physics>
          <ambientLight intensity={1.0} />
          <directionalLight position={[-0.7, 0, 5]} color="white" intensity={0.6} />
          <pointLight position={[2, 0, 3]} intensity={0.8} />
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.96}
              luminanceSmoothing={0.1}
              height={300}
            />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Canvas>
      </div>
      <div></div>
    </div>
  );
}

export default App;
