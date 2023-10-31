import React, { useEffect, useState } from "react";
import {
  evaluateMelody,
  generateFatherAndMother,
  generateRandomArray,
  initialFormData,
  melodyBaby,
  mutateBaby,
} from "../util/MelodyUtils";
import Form from "./Form";

const AlgoInfo = ({
  score,
  setMusicArray,
  formData,
  setFormData,
  setIteration,
  generating,
  setGenerating,
}) => {
  // const [generating, setGenerating] = useState(false);
  // const [iteration, setIteration] = useState(0);
  const [baby, setBaby] = useState();

  const handleGenerate = () => {
    setGenerating(true);
    setIteration(0); // Reset iteration count

    const generateIteration = (i, melodies) => {
      if (i < formData.iterations) {
        setIteration(i + 1);

        const evaluatedMelodies = melodies.map((melody) => {
          return {
            melody,
            score: evaluateMelody(melody, formData),
          };
        });

        evaluatedMelodies.sort((a, b) => b.score - a.score);

        const [father, mother] = generateFatherAndMother(
          evaluatedMelodies,
          formData
        );
        // const father = evaluatedMelodies[0].melody;
        // const mother = evaluatedMelodies[1].melody;

        const baby = melodyBaby(father, mother, formData);

        let nextSet = [];
        for (let i = 0; i < formData.childrenPerIter; i++) {
          nextSet.push(mutateBaby(baby, formData));
        }

        setBaby(baby);
        setMusicArray(baby);

        setTimeout(() => generateIteration(i + 1, nextSet), 0); // Update iteration state and continue loop
      } else {
        setGenerating(false);
      }
    };

    let melodies = [];
    for (let i = 0; i < formData.childrenPerIter; i++) {
      melodies.push(generateRandomArray(7, 32));
    }

    generateIteration(0, melodies);
  };

  useEffect(() => {
    if (baby && !generating) {
      setMusicArray(baby);
    }
  }, [baby, generating]);

  return (
    <div className="algo controls">
      <h2>Genetic Algorithm Controls</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Form
          formData={formData}
          setFormData={setFormData}
          generating={generating}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "4rem",
          }}
        >
          <button
            className="control"
            onClick={() => setFormData(initialFormData)}
            disabled={generating}
          >
            Reset
          </button>
          <button
            className="control"
            onClick={handleGenerate}
            disabled={generating}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlgoInfo;
