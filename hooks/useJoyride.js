import { useState } from "react";
import useStepDashboard from "./useStepDashboard";
import { useDispatch, useSelector } from "react-redux";
import { toggle as tourToggle, disableTour, enableTour } from "lib/slices/tour";
import { ACTIONS, EVENTS, STATUS } from "react-joyride";

const useJoyride = () => {
  const [toggleMinuTrack, setToggleMinuTrack] = useState(true);
  const tourState = useSelector((state) => state.tour.run);

  const allSteps = useStepDashboard();
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["track"],
  });

  const dispatch = useDispatch();

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
      if (toggleMinuTrack) {
        setToggleMinuTrack((prev) => !prev);
      }
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 11 && action === ACTIONS.PREV) {
        setToggleMinuTrack((prev) => !prev);
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      } else if (data.action === "close" || data.action === "reset") {
        dispatch(disableTour());
      } else {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      }
    }
  };

  const handleToggleMinuTrack = () => {
    setToggleMinuTrack((prev) => !prev);
    if (tourState) {
      dispatch(disableTour());
      setTimeout(() => {
        dispatch(enableTour());
        setState({ stepIndex: 12, steps: steps });
      }, 800);
    }
  };
  return {
    handleToggleMinuTrack,
    handleJoyrideCallback,
    steps,
    toggleMinuTrack,
    setToggleMinuTrack,
    stepIndex,
    tourState,
  };
};

export default useJoyride;
