import { useEffect, useState } from "react";
import { evaluateMelody } from "../util/MelodyUtils";

const Timeline = ({
  numOfNotes,
  reset,
  setReset,
  playSound,
  play,
  setPlay,
  musicArray,
  setScore,
  formData,
}) => {
  const [timelineGrid, setTimelineGrid] = useState(musicArray);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPlayingCol, setCurrentPlayingCol] = useState(0);
  const [currentInterval, setCurrentInterval] = useState();

  const toggleCell = (rowIndex, colIndex) => {
    const updatedGrid = [...timelineGrid];
    updatedGrid[rowIndex][colIndex] = !updatedGrid[rowIndex][colIndex];
    if (updatedGrid[rowIndex][colIndex]) {
      playSound(rowIndex);
    }
    setTimelineGrid(updatedGrid);
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  const handleMouseEnter = (rowIndex, colIndex) => {
    if (isMouseDown) {
      if (!timelineGrid[rowIndex][colIndex]) {
        toggleCell(rowIndex, colIndex);
      }
      setIsDragging(true);
    }
  };

  const handleMouseExit = () => {
    setIsMouseDown(false);
    setIsDragging(false);
  };

  useEffect(() => {
    if (!reset) return;

    setTimelineGrid(
      Array.from({ length: numOfNotes }, () =>
        Array.from({ length: 32 }, () => false)
      )
    );
    setReset(false);
  }, [reset]);

  useEffect(() => {
    setTimelineGrid(musicArray);
  }, [musicArray]);

  // Update score whenever timelineGrid changes
  useEffect(() => {
    setScore(evaluateMelody(timelineGrid, formData));
  }, [timelineGrid]);

  useEffect(() => {
    if (play) {
      let col = 0;
      const intervalId = setInterval(() => {
        if (col >= 32) {
          clearInterval(intervalId);
          setCurrentPlayingCol(0);
          setPlay(false);
        } else {
          timelineGrid.forEach((row, index) => {
            if (row[col]) playSound(index);
          });
          setCurrentPlayingCol(col);
          col++;
        }
      }, 250);
      setCurrentInterval(intervalId);
    } else {
      clearInterval(currentInterval);
      setCurrentPlayingCol(0);
    }
  }, [play]);

  const shouldApplyHoverStyles = (rowIndex, colIndex) => {
    return play && currentPlayingCol === colIndex;
  };

  return (
    <div
      className="timeline"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => handleMouseExit()}
    >
      {timelineGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="timeline-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`timeline-cell ${cell ? "active" : ""} ${
                isDragging ? "dragging" : ""
              } ${shouldApplyHoverStyles(rowIndex, colIndex) ? "hovered" : ""}`}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onClick={() => toggleCell(rowIndex, colIndex)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
