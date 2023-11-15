import { useEffect, useReducer, useRef, useState } from 'react';
import totoro from './totoro_noel.jpeg';
import totoroIcon from './totoro-icon.jpeg';

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
    dispatch({ type: 'tick' });
  }, 1000);

  return (
    <>
      <main>
        <p className="trainings">{Math.round(trainings)} Personnes formées</p>
        <p className="moneys">{Math.round(moneys)}$ disponible</p>
        <button className="clicker-wrapper">
          <img
            className="clicker"
            src={totoro}
            onClick={() => dispatch({ type: 'click' })}
          />
          <p>Cliquer pour commencer à donner des formations !</p>
        </button>
      </main>
      <aside>
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
      </aside>
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
    if (moneys > cost) {
      dispatch({ ...dispatchValue, type: 'buy', cost: cost });
      setCost(it => it * costIncreaseRate);
      setAmount(it => it + 1);
    }
  };

  return (
    <div className="upgrade-capsule" onClick={buy} disabled={moneys < cost}>
      {moneys > cost ? (
        <img className="upgrade-capsule__icon" src={totoroIcon} />
      ) : (
        <p className="upgrade-capsule__icon">🔒</p>
      )}

      <div className="upgrade-capsule__body">
        <p>{name}</p>
        <p>une petite description marrante</p>
      </div>
      <div className="upgrade-capsule__amount">
        <p>x{amount}</p>
        <p>{formatBigNumber(cost)}</p>
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
    trainingMultiplier = 1,
    moneysPerTraining = 0,
  },
) => {
  switch (type) {
    case 'tick': {
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
    case 'click': {
      return {
        ...state,
        trainings: state.trainings + state.trainingMultiplier,
        moneys:
          state.moneys + state.trainingMultiplier * state.moneysPerTraining,
      };
    }
    case 'buy': {
      return {
        ...state,
        moneys: state.moneys - cost,
        trainingsPerTick: state.trainingsPerTick + trainingsPerTick,
        trainingMuliplier: state.trainingMuliplier * trainingMultiplier,
        moneysPerTraining: state.moneysPerTraining + moneysPerTraining,
      };
    }
  }
};

const formatBigNumber = number => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
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
