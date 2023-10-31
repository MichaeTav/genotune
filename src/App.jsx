import "./App.css";
import AlgoInfo from "./components/AlgoInfo";
import Controls from "./components/Controls";
import PianoRoll from "./components/PianoRoll";
import { useEffect, useState } from "react";
import { evaluateMelody, initialFormData } from "./util/MelodyUtils";
import Header from "./components/Header";

function App() {
  const [volume, setVolume] = useState(-15);
  const [octave, setOctave] = useState(4);
  const [score, setScore] = useState(0);
  const [reset, setReset] = useState(false);
  const [play, setPlay] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [musicArray, setMusicArray] = useState(
    Array.from({ length: 7 }, () => Array.from({ length: 32 }, () => false))
  );
  const [formData, setFormData] = useState(initialFormData);

  const changeOctave = (octave) => {
    if (octave != 1 && octave != 7) {
      setOctave(octave);
    }
  };

  useEffect(() => {
    setScore(evaluateMelody(musicArray, formData));
  }, [formData]);

  return (
    <div style={{ height: "100%" }}>
      <Header score={score} iteration={iteration} generating={generating} />
      <PianoRoll
        volume={volume}
        octave={octave}
        reset={reset}
        setReset={setReset}
        play={play}
        setPlay={setPlay}
        musicArray={musicArray}
        setScore={setScore}
        formData={formData}
      />
      <div className="bottom">
        <Controls
          setVolume={setVolume}
          setOctave={changeOctave}
          octave={octave}
          setReset={setReset}
          setPlay={setPlay}
          play={play}
          setMusicArray={setMusicArray}
        />
        <AlgoInfo
          score={score}
          setMusicArray={setMusicArray}
          formData={formData}
          setFormData={setFormData}
          setIteration={setIteration}
          generating={generating}
          setGenerating={setGenerating}
        />
      </div>
    </div>
  );
}

export default App;
