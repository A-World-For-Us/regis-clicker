import toml from 'toml';
import { useEffect, useReducer, useRef, useState } from 'react';
import regis from './assets/regis.png';
import totoroIcon from './totoro-icon.jpeg';
import upgrades from './upgrades.toml?raw';

const defaultState = {
  trainings: 0,
  moneys: 0,
  trainingsPerTick: 0,
  trainingMultiplier: 1,
  moneysPerTraining: 1,
};

const upgradesParsed = toml.parse(upgrades);

function App() {
  const [{ trainings, moneys }, dispatch] = useReducer(reducer, defaultState);

  useInterval(() => {
    dispatch({ type: 'tick' });
  }, 1000);

  return (
    <>
      <main>
        <div className='title'>Régis clicker</div>
        <p className="trainings">
          {prettyBigNumber(trainings)} Personnes formées
        </p>
        <p className="moneys">{prettyBigNumber(moneys)}$ disponible</p>
        <div className="clicker-wrapper" onClick={() => dispatch({ type: 'click' })}>
          <img
            className="clicker"
            src={regis}
          />
        </div>
        {trainings == 0 && <p>Cliquer pour commencer à donner des formations !</p>}

      </main>
      <aside>
        <h1>Améliorations</h1>
        {Object.entries({
          collaborators: 'Collaborateurs',
          trainings: 'Formations',
          certifications: 'Certifications',
          features: 'Fonctionnalités',
          modality: 'Modalités',
        }).map(([key, name]) => (
          <UpgradeCategory
            key={key}
            name={name}
            upgrades={upgradesParsed[key]}
            moneys={moneys}
            dispatch={dispatch}
          />
        ))}
      </aside>
    </>
  );
}
import PropTypes from 'prop-types';

const UpgradeCategory = ({ name, upgrades, moneys, dispatch }) => {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <p className="upgrade-category" onClick={() => setOpen(!open)}><span className={`material-symbols-outlined ${open ? 'arrow-open' : 'arrow-close'}`}>arrow_drop_down</span>{name}</p>
      {upgrades.map(upgrade => (
         <Upgrade
         open= {open}
          key={upgrade.name}
          name={upgrade.name}
          description={upgrade.description}
          baseCost={upgrade.cost}
          costIncreaseRate={upgrade.costIncreaseRate || 1.1}
          moneys={moneys}
          dispatch={dispatch}
          max={upgrade.max || Infinity}
          dispatchValue={{
            trainingsPerTick: upgrade.trainingsPerTick || 0,
            trainingMultiplier: upgrade.trainingMultiplier || 1,
            moneysPerTraining: upgrade.moneysPerTraining || 0,
          }}
        />
      ))}
    </div>
  );
};

UpgradeCategory.propTypes = {
  name: PropTypes.string.isRequired,
  upgrades: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      costIncreaseRate: PropTypes.number,
      trainingsPerTick: PropTypes.number,
      trainingMultiplier: PropTypes.number,
      moneysPerTraining: PropTypes.number,
    }),
  ).isRequired,
  moneys: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  max: PropTypes.number.isRequired,
};

const Upgrade = ({
  open,
  name,
  description,
  moneys,
  baseCost,
  costIncreaseRate,
  dispatch,
  dispatchValue,
  max,
}) => {
  const [cost, setCost] = useState(baseCost);
  const [amount, setAmount] = useState(0);

  const buy = () => {
    if (moneys > cost && amount < max) {
      dispatch({ ...dispatchValue, type: 'buy', cost: cost });
      setCost(it => it * costIncreaseRate);
      setAmount(it => it + 1);
    }
  };

  if (open) return (
    <div className="upgrade-capsule" onClick={buy} disabled={moneys < cost}>
      {moneys > cost && amount < max ? (
        <img className="upgrade-capsule__icon" src={totoroIcon} />
      ) : (
        <p className="upgrade-capsule__icon">🔒</p>
      )}

      <div className="upgrade-capsule__body">
        <p className="upgrade-capsule__name">{name}</p>
        <p>{description}</p>
        <div className="debug">
          <p>Pour debug, ça fait quoi d'acheter ça :</p>
          <p>{JSON.stringify(dispatchValue, null, 2)}</p>
        </div>
      </div>
      <div className="upgrade-capsule__amount">
        <p>{amount >= max ? 'max' : 'x' + amount}</p>
        <p>{amount < max && formatBigNumber(cost)}</p>
      </div>
    </div>
  );
};

Upgrade.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  moneys: PropTypes.number.isRequired,
  baseCost: PropTypes.number.isRequired,
  costIncreaseRate: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  max: PropTypes.number.isRequired,
  dispatchValue: PropTypes.shape({
    trainingsPerTick: PropTypes.number,
    trainingMultiplier: PropTypes.number,
    moneysPerTraining: PropTypes.number,
  }).isRequired,
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
        trainingMultiplier: state.trainingMultiplier * trainingMultiplier,
        moneysPerTraining: state.moneysPerTraining + moneysPerTraining,
      };
    }
  }
};

const formatBigNumber = number => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(number);
};

const prettyBigNumber = number =>
  Intl.NumberFormat('fr-Fr', { maximumFractionDigits: 0 }).format(number);

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
