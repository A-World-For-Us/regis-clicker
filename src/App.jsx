import { useEffect, useReducer, useRef, useState } from "react";

const defaultState = {
  trainings: 0,
  moneys: 0,
  trainingsPerTick: 0,
  trainingMultiplier: 1,
  moneysPerTraining: 1000,
};

function App() {
  const [{ trainings, moneys }, dispatch] = useReducer(reducer, defaultState);

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
      <Upgrade
        name="AutoFormateur"
        moneys={moneys}
        baseCost={10000}
        costIncreaseRate={1.05}
        dispatch={dispatch}
        dispatchValue={{ trainingsPerTick: 1 }}
      />
      <Upgrade
        name="Multiplicateur"
        moneys={moneys}
        baseCost={20000}
        costIncreaseRate={1.15}
        dispatch={dispatch}
        dispatchValue={{ trainingMultiplier: 1 }}
      />
    </>
  );
}

const Upgrade = ({
  name,
  moneys,
  baseCost,
  costIncreaseRate,
  dispatch,
  dispatchValue,
}) => {
  const [cost, setCost] = useState(baseCost);
  const [amount, setAmount] = useState(0);

  const buy = () => {
    dispatch({ ...dispatchValue, type: "buy", cost: cost });
    setCost((it) => it * costIncreaseRate);
    setAmount((it) => it + 1);
  };

  return (
    <div>
      <p>{name}</p>
      <p>Vous en avez {amount}</p>
      <p>Coût du prochain {cost} digidollars</p>
      <div>
        <button onClick={buy} disabled={moneys < cost}>
          Acheter
        </button>
      </div>
    </div>
  );
};

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
