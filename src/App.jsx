import { useEffect, useReducer, useRef, useState } from 'react';
import toml from 'toml';
import totoroIcon from './totoro-icon.jpeg';
import upgrades from './upgrades.toml?raw';
import Achievements from './Achievements';
import AchievementsList from './AchievementsList';
import Snowfall from 'react-snowfall';

const upgradesParsed = toml.parse(upgrades);

const STARTING_PRICE = 10;
const PRICE_INCREASE_RATE = 2;
const PROD_INCREASE_FLAT = 1;
const PROD_INCREASE_RATE = 1.5;
const PRICE_PER_TRAINING = 1;
const MONEY_PER_TRAINING_INCREASE_RATE = 2;
const KEY = 'regis-clicker-save';
let defaultState = {
  trainings: 0,
  moneys: 0,
  trainingsPerTick: 0,
  moneysPerTraining: PRICE_PER_TRAINING,
  price: STARTING_PRICE,
  upgrades: [],
};
let savedState = localStorage.getItem(KEY);
if (savedState) {
  defaultState = JSON.parse(localStorage.getItem(KEY));
}

const nextPrice = previousPrice => previousPrice * PRICE_INCREASE_RATE;
const nextTrainingsPerTick = (previousTrainingsPerTick, level) =>
  previousTrainingsPerTick +
  (level * PROD_INCREASE_FLAT) / 2 +
  (level > 10 ? (level - 10) * PROD_INCREASE_RATE : 0);
const nextMoneysPerTraining = (previousMoneyPerTraining, level) =>
  previousMoneyPerTraining +
  Math.floor(level / 10) * MONEY_PER_TRAINING_INCREASE_RATE;

function App({ setScore }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { trainings, moneys, trainingsPerTick, price, upgrades } = state;
  const [isAnimated, setIsAnimated] = useState(false);
  const [openTrophies, setOpenTrophies] = useState(false);

  useInterval(() => {
    dispatch({ type: 'tick' });
  }, 1000);

  useInterval(() => {
    saveState(state);
    setScore(trainings);
  }, 10_000);

  return (
    <div
      className="app--wrapper"
      onClick={e => {
        if (e.target.closest('.achievementsList')) {
          return;
        } else {
          if (openTrophies) {
            setOpenTrophies(false);
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }}
    >
      <Snowfall snowflakeCount={70} color="rgba(255, 255, 255, 0.7)" />
      <div className="app">
        <main>
          <div className="title">Cliquer Pour Former</div>
          <div className="subtitle">avec Régis</div>
          <p className="trainings">
            {prettyBigNumber(trainings)}
            {trainings > 1 ? ' personnes formées' : ' personne formée'}
          </p>
          <p className="moneys">{prettyBigNumber(moneys)}$ disponible</p>
          <div
            className={`clicker-wrapper ${isAnimated ? 'train-animation' : ''}`}
            onClick={() => {
              dispatch({ type: 'click' });
              setIsAnimated(true);
            }}
            onAnimationEnd={() => setIsAnimated(false)}
          >
            <img
              draggable={false}
              className="clicker"
              src={imageName(upgrades)}
            />
          </div>
          {trainings == 0 && (
            <p className="clicker-tips">
              Cliquer pour commencer à donner des formations ! 🎓
            </p>
          )}
          {trainings > 0 && trainings < 10 && (
            <p>
              Continuer de cliquer pour donner toujours plus de formations ! 🧑‍🏫
            </p>
          )}
          {trainings >= 10 && upgrades.length === 0 && (
            <p>Regardez à droite, des améliorations sont disponibles 👀</p>
          )}
          {trainings < 100 && upgrades.length > 0 && (
            <p>
              Continuez comme ça pour explorer toutes la Galaxy Digiforma 🪐
            </p>
          )}
          <div className="has-grow"></div>
          {openTrophies && (
            <AchievementsList
              trainings={trainings}
              trainingsPerTick={trainingsPerTick}
            />
          )}
          <p className="trophy" onClick={() => setOpenTrophies(true)}>
            🏆
          </p>
          <Achievements
            trainings={trainings}
            trainingsPerTick={trainingsPerTick}
          />
        </main>
        <aside>
          <Upgrades
            current={upgrades}
            all={upgradesParsed}
            moneys={moneys}
            dispatch={dispatch}
            price={price}
          />
        </aside>
      </div>
    </div>
  );
}

const Upgrades = ({ current, all, moneys, dispatch, price }) => {
  const categories = Object.entries(all).map(nameAndUpgrade => {
    const [name, upgrades] = nameAndUpgrade;
    return (
      <UpgradeCategory
        key={name}
        name={name}
        upgrades={upgrades}
        current={current}
        moneys={moneys}
        dispatch={dispatch}
        price={price}
      />
    );
  });

  return (
    <>
      <h1>Améliorations</h1>
      {categories}
    </>
  );
};

const UpgradeCategory = ({
  name,
  moneys,
  price,
  dispatch,
  upgrades,
  current,
}) => {
  const [open, setOpen] = useState(true);
  let buyableUpgrades = upgrades.filter(
    upgrade =>
      !current.includes(upgrade.name) &&
      (!upgrade.requirement ||
        upgrade.requirement.every(req => current.includes(req))),
  );

  if (buyableUpgrades.length == 0) {
    return null;
  }

  return (
    <div>
      <p className="upgrade-category" onClick={() => setOpen(!open)}>
        <span
          className={`material-symbols-outlined ${
            open ? 'arrow-open' : 'arrow-close'
          }`}
        >
          arrow_drop_down
        </span>
        {name}
      </p>
      {buyableUpgrades.map(upgrade => (
        <Upgrade
          open={open}
          key={upgrade.name}
          name={upgrade.name}
          description={upgrade.description}
          tips={upgrade.tips}
          buyableTips={upgrade.buyableTips}
          moneys={moneys}
          price={price}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
};

const Upgrade = ({
  open,
  name,
  description,
  moneys,
  price,
  dispatch,
  tips,
  buyableTips,
}) => {
  const buy = () => {
    if (moneys >= price) {
      dispatch({ type: 'buy', name: name });
    }
  };

  if (open)
    return (
      <>
        <div
          className="upgrade-capsule"
          onClick={buy}
          disabled={moneys < price}
        >
          {moneys >= price ? (
            <img className="upgrade-capsule__icon" src={totoroIcon} />
          ) : (
            <p className="upgrade-capsule__icon">🔒</p>
          )}

          <div className="upgrade-capsule__body">
            <p className="upgrade-capsule__name">{name}</p>
            <p>{description}</p>
          </div>
          <div className="upgrade-capsule__amount">
            <p>{formatBigNumber(price)}</p>
          </div>
        </div>
        {tips && moneys < price && (
          <div className="upgrade-capsule--tips">
            <p>⬆️</p>
            <p className="upgrade-capsule--tips-text">{tips}</p>
          </div>
        )}
        {buyableTips && price <= moneys && (
          <div className="upgrade-capsule--tips">
            <p>⬆️</p>
            <p className="upgrade-capsule--tips-text">{buyableTips}</p>
          </div>
        )}
      </>
    );
};

const reducer = (state, { type, name }) => {
  switch (type) {
    case 'tick': {
      return {
        ...state,
        trainings: state.trainings + state.trainingsPerTick,
        moneys: state.moneys + state.trainingsPerTick * state.moneysPerTraining,
      };
    }
    case 'click': {
      return {
        ...state,
        trainings: state.trainings + 1 + state.trainingsPerTick,
        moneys:
          state.moneys + (1 + state.trainingsPerTick) * state.moneysPerTraining,
      };
    }
    case 'buy': {
      return {
        ...state,
        upgrades: state.upgrades.concat(name),
        trainingsPerTick: nextTrainingsPerTick(
          state.trainingsPerTick,
          state.upgrades.length + 1,
        ),
        moneysPerTraining: nextMoneysPerTraining(
          state.moneysPerTraining,
          state.upgrades.length + 1,
        ),
        moneys: state.moneys - state.price,
        price: nextPrice(state.price),
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

function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function imageName(upgrades) {
  if (upgrades.includes('Trophée de la formation')) {
    return '6.png';
  } else if (upgrades.includes('Réalité Virtuelle')) {
    return '5.png';
  } else if (upgrades.includes('Kat Jépété')) {
    return '4.png';
  } else if (upgrades.includes('Audit de surveillance')) {
    return '3.png';
  } else if (upgrades.includes('Pétronille')) {
    return '2.png';
  } else {
    return '1.png';
  }
}

export default App;
