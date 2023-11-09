import { useReducer } from "react";

const defaultState = {
  trainings: 0,
  moneys: 0,
  trainingsPerTick: 0,
  trainingMultiplier: 1,
  moneysPerTraining: 1000
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
        trainings: state.trainings + trainingsPerTick * trainingMultiplier,
        moneys:
          state.moneys +
          state.trainingsPerTick * state.trainingMultiplier * state.moneysPerTraining,
      };
    }
    case "click": {
      return {
        ...state,
        trainings: state.trainings + state.trainingMultiplier,
        moneys: state.moneys + state.trainingMultiplier * state.moneysPerTraining,
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

  return (
    <>
      <div> {trainings} personnes formées </div>
      <div> {moneys} digidollars disponibles </div>
      <div>
        <button onClick={() => dispatch({type: "click"})}>Clicker pour former</button>
      </div>
    </>
  );
}

export default App;
