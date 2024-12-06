import { Canvas } from "@react-three/fiber";
import { Badge } from "./components/Badge";
import useNarrowWidth from "./hooks/useNarrowWidth";
import { Physics } from "@react-three/rapier";
import { Bloom } from "@react-three/postprocessing";

function App() {
  const isNarrow = useNarrowWidth(600);
  return (
    <div
      style={{
        width: "90vw",
        height: "70vh",
        display: "flex",
        flexDirection: isNarrow ? "column" : "row",
      }}
    >
      <div></div>
      <div id="canvas-container" style={{ flexGrow: 1 }}>
        <Canvas shadows>
          <Physics
            interpolate
            gravity={[0, -10, 0]}
            timeStep={1 / 60}
          >
            <Badge position={[0, 0, 0]} />
          </Physics>
          <ambientLight intensity={1.0} />
          <directionalLight position={[0, 0, 5]} color="white" intensity={1} />
          <pointLight position={[0, 2, 3]} intensity={0.8} />
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </Canvas>
      </div>
      <div></div>
    </div>
  );
}

export default App;
