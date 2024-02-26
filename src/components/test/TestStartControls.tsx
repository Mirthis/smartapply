import React from "react";

import { TEST_ALL_SKILLS } from "~/lib/constants";

import { useTestStore } from "~/store/testStore";

import { ProMarker } from "../utils";

const TestStartControls = ({
  jobSkills,
  hasPro,
  isLoadingQuestion,
  onStartTest,
}: {
  jobSkills: string[];
  hasPro: boolean;
  isLoadingQuestion: boolean;
  onStartTest: () => void;
}) => {
  const { skill: testSkill, setTestSkill } = useTestStore((state) => state);

  return (
    <div className="flex flex-col gap-2">
      {jobSkills.length > 0 && (
        <div className="flex flex-col  gap-2 md:flex-row">
          <label className="label shrink-0">
            <span className="label-text font-semibold text-primary">
              Test on:
            </span>
          </label>
          <select
            aria-label="Select Skill"
            className="select-bordered select w-full md:w-fit"
            value={testSkill}
            onChange={(e) => setTestSkill(e.target.value)}
            disabled={!hasPro}
          >
            <option value={TEST_ALL_SKILLS}>All skills</option>
            {jobSkills.map((s, i) => (
              <option key={`skill-${i}`} value={s}>
                {s}
              </option>
            ))}
          </select>
          {!hasPro && <ProMarker />}
        </div>
      )}
      <div className="text-center">
        <button
          aria-label="Start Test"
          disabled={isLoadingQuestion}
          className="btn-primary btn w-full sm:w-96"
          onClick={onStartTest}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default TestStartControls;
