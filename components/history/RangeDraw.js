import "react-input-range/lib/css/index.css";
import InputRange from "react-input-range";
import { useEffect, useRef } from "react";

const RangeDraw = ({
  min,
  max,
  step,
  value,
  label = "",
  setRangeDraw,
  pathSteps,
  fullPathGroup,

  drawselectedsteps,
  workstep,
  locInfo,
  isFromState,
  drawOptions,
}) => {
  const firstRangeRef = useRef();
  const larstRangeRef = useRef();

  useEffect(() => {
    let debounce;
    if (firstRangeRef.current || larstRangeRef.current) {
      debounce = setTimeout(() => {
        let pathStepsRange = pathSteps.slice(
          firstRangeRef.current,
          larstRangeRef.current
        );

        drawselectedsteps(
          workstep,
          pathStepsRange,
          locInfo,
          isFromState,
          drawOptions,
          true
        );
      }, 500);
    }

    return () => {
      clearTimeout(debounce);
    };
  }, [firstRangeRef.current, larstRangeRef.current]);

  const onChange = (range) => {
    fullPathGroup && fullPathGroup.clearLayers();
    setRangeDraw({ min, max, step, value: range });
    firstRangeRef.current = range.min;
    larstRangeRef.current = range.max;
  };

  const currValue = { min: value.min, max: value.max < 0 ? max : value.max };

  return (
    <div className="rangeDraw">
      <label>{label}</label>
      <InputRange
        minValue={min}
        maxValue={max}
        step={step}
        onChange={onChange}
        value={currValue}
      />
    </div>
  );
};

export default RangeDraw;
