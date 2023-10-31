import PianoKey from "./PianoKey";
import Timeline from "./Timeline";
import * as Tone from "tone";

const notes = ["B", "A", "G", "F", "E", "D", "C"];

const PianoRoll = ({
  volume,
  octave,
  reset,
  setReset,
  play,
  setPlay,
  musicArray,
  setScore,
  formData,
}) => {
  const playSound = (note) => {
    if (typeof note === "number") note = notes[note] + octave;
    const synth = new Tone.Synth().toDestination();
    synth.volume.value = volume;
    const now = Tone.now();
    synth.triggerAttack(note, now);
    synth.triggerRelease(now + 0.025);
  };

  return (
    <div className="piano-roll">
      <div className="keys">
        {notes.map((note) => (
          <PianoKey
            key={note}
            note={note}
            octave={octave}
            playSound={playSound}
          />
        ))}
      </div>
      <Timeline
        numOfNotes={notes.length}
        reset={reset}
        setReset={setReset}
        playSound={playSound}
        play={play}
        setPlay={setPlay}
        musicArray={musicArray}
        setScore={setScore}
        formData={formData}
      />
    </div>
  );
};

export default PianoRoll;
