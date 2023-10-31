import React from "react";

const formFields = [
  {
    type: "number",
    name: "gapPenalty",
    title: "Gap Penalty",
  },
  {
    type: "number",
    name: "gapSize",
    title: "Gap Size",
  },
  {
    type: "number",
    name: "notePenalty",
    title: "Number of Notes Penalty",
  },
  {
    type: "number",
    name: "consecutiveNotePenalty",
    title: "Consecutive Note Penalty",
  },
  {
    type: "number",
    name: "stepReward",
    title: "Step Reward",
  },
  {
    type: "number",
    name: "iterations",
    title: "Iterations",
  },
  {
    type: "number",
    name: "childrenPerIter",
    title: "Children per Iteration",
  },
  {
    type: "number",
    name: "mutationPercentage",
    title: "Mutation Percentage",
  },
  {
    type: "number",
    name: "addNotePercentage",
    title: "Add Note Percentage",
  },
  {
    type: "number",
    name: "removeNotePercentage",
    title: "Remove Note Percentage",
  },
];

const babyMethods = [
  {
    name: "split",
    title: "Split",
  },
  {
    name: "bestHalfs",
    title: "Best Halfs of Parents",
  },
];

const selections = [
  {
    name: "roulette",
    title: "Roulette Selection",
  },
  {
    name: "topPerformers",
    title: "Top 2 Performers",
  },
];

const Form = ({ formData, setFormData, generating }) => {
  const handleInputChange = (e) => {
    e.preventDefault();
    let { id, value } = e.target;
    // there must be at least 2 children per iteration
    if (id === "childrenPerIter" && value < 3) {
      value = 2;
    }

    if (id === "babyMethod" || id === "selection") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: Number(value),
      }));
    }
  };

  return (
    <form className="parameter-form">
      {formFields.map((field) => (
        <div key={field.name} className="parameter-input">
          <label htmlFor={field.name}>{field.title}</label>
          <input
            type={field.type}
            id={field.name}
            disabled={generating}
            onChange={handleInputChange}
            value={formData[field.name]}
          />
        </div>
      ))}
      <div className="parameter-input">
        <label htmlFor="babyMethod">Baby Creation</label>
        <select
          id="babyMethod"
          value={formData["babyMethod"]}
          onChange={handleInputChange}
        >
          {babyMethods.map((method) => (
            <option key={method.name} value={method.name}>
              {method.title}
            </option>
          ))}
        </select>
      </div>
      <div className="parameter-input">
        <label htmlFor="selection">Selection Method</label>
        <select
          id="selection"
          value={formData["selection"]}
          onChange={handleInputChange}
        >
          {selections.map((selection) => (
            <option key={selection.name} value={selection.name}>
              {selection.title}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default Form;
