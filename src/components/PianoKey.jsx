import React from "react";

const PianoKey = ({ note, octave, playSound }) => {
  return (
    <div>
      <button className="piano-key" onClick={() => playSound(note + octave)}>
        {note + octave}
      </button>
    </div>
  );
};

export default PianoKey;
