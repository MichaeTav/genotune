function generateRandomArray(rows, columns) {
  // Initialize an empty 2D array with all false values
  const result = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => false)
  );

  // Iterate through each column and select a random row to set as true
  for (let col = 0; col < columns; col++) {
    if (Math.random() < 0.5) {
      const randomRow = Math.floor(Math.random() * rows);
      result[randomRow][col] = true;
    }
  }

  return result;
}

const initialFormData = {
  gapPenalty: 5,
  gapSize: 3,
  notePenalty: 5,
  consecutiveNotePenalty: 5,
  stepReward: 5,
  iterations: 1000,
  childrenPerIter: 1000,
  splitIndex: 16,
  addNotePercentage: 0.05,
  mutationPercentage: 0.1,
  removeNotePercentage: 0.05,
  babyMethod: "split",
  selection: "topPerformers",
};

function evaluateMelody(melody, vals) {
  let fitness = 0;

  let countSinceLastNote = 0;
  let noteCount = 0;
  let uniqueNotes = new Set();
  const notePositions = [];
  for (let i = 0; i < melody[0].length; i++) {
    let hasNote = false;

    for (let j = 0; j < melody.length; j++) {
      if (melody[j][i]) {
        hasNote = true;
        noteCount++;
        uniqueNotes.add(j);
        notePositions[i] = j;
      }
    }

    // if current col doesn't have note increase count
    if (!hasNote) {
      countSinceLastNote++;
    } else {
      // else get count since last note and subtract penalty from fitness
      if (countSinceLastNote > vals.gapSize) {
        fitness -= vals.gapPenalty;
      }
      // else {
      //   fitness += vals.gapPenalty;
      // }
      countSinceLastNote = 0;
    }
  }
  fitness += uniqueNotes.size;

  // calculate steps between notes
  for (let i = 1; i < notePositions.length; i++) {
    const curr = notePositions[i];
    const prev = notePositions[i - 1];
    if (curr === undefined) continue;
    if (prev === undefined) continue;
    const diff = Math.abs(curr - prev);

    if (diff === 1) fitness += vals.stepReward;
  }

  // penalize the same note being played in row
  for (let row = 0; row < melody.length; row++) {
    for (let col = 1; col < melody[0].length; col++) {
      if (melody[row][col] && melody[row][col - 1]) {
        fitness -= vals.consecutiveNotePenalty;
      }
    }
  }

  if (noteCount < 8) {
    fitness -= vals.notePenalty * (32 - noteCount);
  }

  return fitness;
}

function melodyBaby(father, mother, parameters) {
  switch (parameters.babyMethod) {
    case "bestHalfs":
      return getBabyByBestHalfs(father, mother, parameters);
    case "split":
      return getBabyBySplitting(father, mother, parameters);
    default:
      return father;
  }
}

function getBabyByBestHalfs(father, mother, parameters) {
  const [fatherFirst, fatherSecond] = splitArrayByColumns(
    father,
    parameters.splitIndex
  );
  const [motherFirst, motherSecond] = splitArrayByColumns(
    mother,
    parameters.splitIndex
  );
  // console.log(fatherFirst);
  // console.log(fatherSecond);
  // console.log(evaluateMelody(fatherFirst, parameters));
  const bestOfFather =
    evaluateMelody(fatherFirst, parameters) >
    evaluateMelody(fatherSecond, parameters)
      ? fatherFirst
      : fatherSecond;

  const bestOfMother =
    evaluateMelody(motherFirst, parameters) >
    evaluateMelody(motherSecond, parameters)
      ? motherFirst
      : motherSecond;

  return mutateBaby(
    bestOfFather.map((row, i) => row.concat(bestOfMother[i])),
    parameters
  );
}

function getBabyBySplitting(father, mother, { splitIndex = 16 }) {
  const baby = father.map((row, index) => {
    const firstHalf = row.slice(0, splitIndex);
    const secondHalf = mother[index].slice(splitIndex, 32);
    return firstHalf.concat(secondHalf);
  });

  return baby;
}

function splitArrayByColumns(arr) {
  const numRows = arr.length;

  const subarray1 = [];
  const subarray2 = [];
  for (let i = 0; i < numRows; i++) {
    const part1 = arr[i].slice(0, 16);
    const part2 = arr[i].slice(16, 32);

    subarray1.push(part1);
    subarray2.push(part2);
  }

  return [subarray1, subarray2];
}

function mutateBaby(baby, vals) {
  const mutatedBaby = baby.map((row) => [...row]); // Create a copy of baby

  for (let col = 0; col < mutatedBaby[0].length; col++) {
    let noteIndex = -1;
    for (let row = 0; row < mutatedBaby.length; row++) {
      if (mutatedBaby[row][col]) {
        noteIndex = row;
      }
    }
    // column has note
    if (noteIndex > -1) {
      // move note mutation
      if (Math.random() < vals.mutationPercentage) {
        let newIndex = 0;

        if (Math.random() < 0.5) {
          newIndex = (noteIndex + 1) % 7;
        } else {
          newIndex = (noteIndex - 1 + 7) % 7;
        }

        mutatedBaby[noteIndex][col] = false;
        mutatedBaby[newIndex][col] = true;
      }
      // remove note mutation
      else if (Math.random() < vals.removeNotePercentage) {
        mutatedBaby[noteIndex][col] = false;
      }
    } else {
      // add note mutation
      if (Math.random() < vals.addNotePercentage) {
        const randomRow = Math.floor(Math.random() * 7);
        mutatedBaby[randomRow][col] = true;
      }
    }
  }

  return mutatedBaby;
}

function generateFatherAndMother(evaluatedMelodies, parameters) {
  switch (parameters.selection) {
    case "roulette":
      return rouletteWheelSelection(evaluatedMelodies);
    case "topPerformers":
      return topPerformers(evaluatedMelodies);
  }
}

function topPerformers(evaluatedMelodies) {
  return [evaluatedMelodies[0].melody, evaluatedMelodies[1].melody];
}

function rouletteWheelSelection(sortedMelodies) {
  const selectedMelodies = [];
  const minScore = sortedMelodies[sortedMelodies.length - 1].score;
  const normalizedArray = sortedMelodies.map((melody) => {
    return {
      ...melody,
      score: melody.score + 1 + minScore * -1,
    };
  });
  const totalFitness = normalizedArray.reduce(
    (sum, melody) => sum + melody.score,
    0
  );

  for (let i = 0; i < 2; i++) {
    const rand = Math.random();
    let accumulatedProbability = 0;

    for (let j = 0; j < sortedMelodies.length; j++) {
      const melody = normalizedArray[j].melody;
      const probability = normalizedArray[j].score / totalFitness;
      accumulatedProbability += probability;

      if (accumulatedProbability >= rand) {
        selectedMelodies.push(melody);
        break; // Exit the inner loop after selecting a melody
      }
    }
  }

  const [firstBest, secondBest] = topPerformers(sortedMelodies);

  const finalMelodies = [
    getBabyBySplitting(firstBest, selectedMelodies[0]),
    getBabyBySplitting(selectedMelodies[1], secondBest),
  ];

  return selectedMelodies;
}

// fisher yates
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export {
  generateRandomArray,
  evaluateMelody,
  melodyBaby,
  mutateBaby,
  initialFormData,
  rouletteWheelSelection,
  generateFatherAndMother,
  shuffle,
};
