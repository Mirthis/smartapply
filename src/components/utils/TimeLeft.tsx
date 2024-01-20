import { useState } from "react";
import { TimeLeft } from "~/types/types";

import { getTimeLeftObject } from "~/lib/formatter";
import { useInterval } from "~/lib/hooks";

const TimeLeft = ({ endDate }: { endDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    getTimeLeftObject(endDate)
  );

  useInterval(
    () => {
      setTimeLeft(getTimeLeftObject(endDate));
    },
    1000,
    false
  );


  return (
    <div className="flex gap-5  text-center">
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.days } as React.CSSProperties}
          ></span>
        </span>
        days
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.hours } as React.CSSProperties}
          ></span>
        </span>
        hours
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.minutes } as React.CSSProperties}
          ></span>
        </span>
        min
      </div>
      <div>
        <span className="countdown font-mono text-4xl">
          <span
            style={{ "--value": timeLeft.seconds } as React.CSSProperties}
          ></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default TimeLeft;