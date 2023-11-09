import { useEffect, useReducer, useRef } from "react";

const defaultState = {
  trainings: 0,
  moneys: 0,
  trainingsPerTick: 0,
  trainingMultiplier: 1,
  moneysPerTraining: 1000,
};

function App() {
  const [
    {
      trainings,
      moneys,
      trainingsPerTick,
      trainingMuliplier,
      moneysPerTraining,
    },
    dispatch,
  ] = useReducer(reducer, defaultState);

  useInterval(() => {
    dispatch({ type: "tick" });
  }, 1000);

  return (
    <>
      <div> {trainings} personnes formées </div>
      <div> {moneys} digidollars disponibles </div>
      <div>
        <button onClick={() => dispatch({ type: "click" })}>
          Clicker pour former
        </button>
      </div>
    </>
  );
}

const reducer = (
  state,
  {
    type,
    cost = 0,
    trainingsPerTick = 0,
    trainingMultiplier = 0,
    moneysPerTraining = 0,
  },
) => {
  switch (type) {
    case "tick": {
      return {
        ...state,
        trainings:
          state.trainings + state.trainingsPerTick * state.trainingMultiplier,
        moneys:
          state.moneys +
          state.trainingsPerTick *
            state.trainingMultiplier *
            state.moneysPerTraining,
      };
    }
    case "click": {
      return {
        ...state,
        trainings: state.trainings + state.trainingMultiplier,
        moneys:
          state.moneys + state.trainingMultiplier * state.moneysPerTraining,
      };
    }
    case "buy": {
      return {
        ...state,
        moneys: state.moneys - cost,
        trainingsPerTick: state.trainingsPerTick + trainingsPerTick,
        trainingMuliplier: state.trainingMuliplier + trainingMultiplier,
        moneysPerTraining: state.moneysPerTraining + moneysPerTraining,
      };
    }
  }
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval when the component mounts and clear it when it unmounts.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      const intervalId = setInterval(tick, delay);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [delay]);
}

export default App;
