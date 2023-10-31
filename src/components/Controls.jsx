import { useEffect, useState } from "react";
import { generateRandomArray } from "../util/MelodyUtils";

const Controls = ({
  setVolume,
  setOctave,
  octave,
  setReset,
  setPlay,
  play,
  setMusicArray,
}) => {
  const [buttonText, setButtonText] = useState("Play");

  useEffect(() => {
    if (!play) {
      setButtonText("Play");
    }
  }, [play]);

  const handlePlayClick = () => {
    if (buttonText === "Play") {
      setButtonText("Pause");
      setPlay(true);
    } else {
      setButtonText("Play");
      setPlay(false);
    }
  };

  const handleReset = () => {
    setMusicArray(
      Array.from({ length: 7 }, () => Array.from({ length: 32 }, () => false))
    );
    setPlay(false);
    setReset(true);
  };

  const handleRandom = () => {
    setMusicArray(generateRandomArray(7, 32));
  };

  return (
    <div className="controls">
      <h2>Controls</h2>
      <button className="control" onClick={() => handlePlayClick()}>
        {buttonText}
      </button>
      <div className="volume-control">
        <label>Volume</label>
        <input
          type="range"
          min={-25}
          max={0}
          step={1}
          style={{ width: "100%" }}
          defaultValue={-15}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>
      <div className="octave-control">
        <button
          style={{ marginRight: 10 }}
          onClick={() => setOctave(octave - 1)}
        >
          &lt;
        </button>
        Octave: {octave}
        <button
          style={{ marginLeft: 10 }}
          onClick={() => setOctave(octave + 1)}
        >
          &gt;
        </button>
      </div>
      <button className="control" onClick={() => handleReset()}>
        Reset
      </button>
      <button className="control" onClick={() => handleRandom()}>
        Random
      </button>
    </div>
  );
};

export default Controls;
