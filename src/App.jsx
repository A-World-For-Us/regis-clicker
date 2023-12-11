import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import toml from 'toml';
import totoroIcon from './totoro-icon.jpeg';
import upgrades from './upgrades.toml?raw';
import achievements from './achievements.toml?raw';
import Achievements from './Achievements';
import AchievementsList from './AchievementsList';
import WinScreen from './WinScreen';
import Snowfall from 'react-snowfall';
import Ornament from './Ornament';
import { ParticleCanvas } from './particle_system/ParticleCanvas';
import Welcome from './Welcome';

const upgradesParsed = toml.parse(upgrades);
const achievementsParsed = toml.parse(achievements);

const STARTING_PRICE = 10;
const PRICE_INCREASE_RATE = 2;
const PROD_INCREASE_FLAT = 1;
const PROD_INCREASE_RATE = 1.5;
const PRICE_PER_TRAINING = 1;
const MONEY_PER_TRAINING_INCREASE_RATE = 2;
const TICKS_PER_SECONDS = 10;

const KEY = 'regis-clicker-save';
const IMGS = {
  Régis: 'Regis.png',
  Pétronille: 'Petronille.png',
  'Kat Jépété': 'Cat_jépété.png',
  'OF Connect': 'OFconnect.png',
  Formalerte: 'formalerte.png',
  Excel: 'Excel.png',
  Digiforma: 'Digiforma.png',
  'Salle de classe': 'Salle_de_classe.png',
  Amphithéâtre: 'Amphi.png',
  'Réalité Virtuelle': 'Réalitévirtuelle.png',
  'Signature Électronique': 'Signature_électronique.png',
  Marketplace: 'Skills.png',
  Visio: 'visio.png',
  'Multi-Centres': 'Multi-centres.png',
  Qualiopi: 'qualiopi.png',
  'Audit de surveillance': 'Audit1.png',
  'Audit de surveillance 2': 'Audit2.png',
  'OC Connect': 'OCconnect.png',
  MOOC: 'Mooc.png',
  'Paiement en ligne': 'Paiement_en_ligne.png',
  'Référencement RS': 'RS.png',
  'Digiformag 4': 'mag4.png',
  Digiformag: 'mag1.jpg',
  'Digiformag 2': 'mag2.jpg',
  'Digiformag 3': 'mag3.jpg',
  'Digiformag 5': 'mag5.jpg',
  'Certification Numérique': 'Diplome.png',
  'Une armée de formateurs': 'army.png',
};

let defaultState = {
  trainings: 0,
  moneys: 0,
  clicks: 0,
  supers: [],
  trainingsPerSecond: 0,
  moneysPerTraining: PRICE_PER_TRAINING,
  price: STARTING_PRICE,
  upgrades: [],
  clicksMultiplier: 1,
};
let savedState = localStorage.getItem(KEY);
if (savedState) {
  defaultState = {
    ...defaultState,
    ...JSON.parse(localStorage.getItem(KEY)),
  };
}

const nextPrice = previousPrice => previousPrice * PRICE_INCREASE_RATE;
const nextTrainingsPerSecond = (previousTrainingsPerSecond, level) =>
  previousTrainingsPerSecond +
  (level * PROD_INCREASE_FLAT) / 2 +
  (level > 10 ? (level - 10) * PROD_INCREASE_RATE : 0);
const nextMoneysPerTraining = (previousMoneyPerTraining, level) =>
  previousMoneyPerTraining +
  Math.floor(level / 10) * MONEY_PER_TRAINING_INCREASE_RATE;

function App({ setScore }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const {
    trainings,
    moneys,
    trainingsPerSecond,
    upgrades,
    clicks,
    moneysPerTraining,
    price,
    supers,
    clicksMultiplier,
  } = state;

  const hasWon = useMemo(() => {
    return (
      upgrades.length ===
        Object.values(upgradesParsed).flatMap(a => a).length ||
      achievementsParsed.achievements.every(
        a =>
          a.trainings <= trainings &&
          a.trainingsPerSecond <= trainingsPerSecond,
      )
    );
  }, [achievementsParsed, trainings, trainingsPerSecond]);

  const [openTrophies, setOpenTrophies] = useState(false);
  const [openWelcomeScreen, setOpenWelcomeScreen] = useState(
    shouldShowWelcomeScreen,
  );
  const toggleWelcomeScreen = () => {
    localStorage.setItem('regis-clicker-welcome', false);
    setOpenWelcomeScreen(!openWelcomeScreen);
  };
  const [openWinScreen, setOpenWinScreen] = useState(hasWon);

  useInterval(() => {
    dispatch({ type: 'tick' });
  }, 1000 / TICKS_PER_SECONDS);

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
          if (openTrophies || openWinScreen) {
            setOpenTrophies(false);
            setOpenWinScreen(false);
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }}
    >
      {upgrades.map(upgrade => {
        return <Ornament upgrade={upgrade} key={upgrade} />;
      })}

      {supers.map(it => (
        <Ornament
          onClick={e => {
            window.dispatchEvent(
              new CustomEvent('new-particle', {
                detail: {
                  emoji: '💸',
                  x: e.clientX,
                  y: e.clientY,
                  count: 10 + 3 * upgrades.length,
                },
              }),
            );
            dispatch({ type: 'super', value: it });
          }}
          upgrade={'super'}
          key={it}
        />
      ))}

      <ParticleCanvas />
      <Snowfall snowflakeCount={70} color="rgba(255, 255, 255, 0.7)" />
      <div className="app">
        <main>
          <div className="background" />
          <div className="title">Cliquer Pour Former</div>
          <div className="subtitle">avec Régis</div>
          <p className="trainings">
            {trainings > 1 ? 'Personnes formées' : 'Personne formée'}
            &#x202F;:&#x202F;
            {prettyBigNumber(trainings)}
          </p>
          <p className="moneys">
            Digidollars&#x202F;:&#x202F;{prettyBigNumber(moneys)} Ð
          </p>
          <div
            className="clicker-wrapper-outer"
            onClick={e => {
              dispatch({ type: 'click' });

              const self = e.currentTarget;

              requestAnimationFrame(() => {
                self.style.animationName = 'none';
                setTimeout(() => {
                  self.style.animationName = 'click';
                }, 1);
              });

              let count = Math.min(3, Math.floor(1 + trainingsPerSecond) / 30);
              count = Math.max(1, count);
              count = Math.floor(count * clicksMultiplier);

              window.dispatchEvent(
                new CustomEvent('new-particle', {
                  detail: {
                    x: e.clientX,
                    y: e.clientY,
                    count,
                  },
                }),
              );
            }}
          >
            <div className="clicker-wrapper">
              <div className="clicker-top"></div>
              <div className="clicker-buckle"></div>

              <img
                draggable={false}
                className="clicker"
                src={imageName(upgrades)}
              />
            </div>
          </div>
          {trainings == 0 && (
            <p className="clicker-tips">
              Cliquer pour commencer à donner des formations ! 🎓
            </p>
          )}
          {trainings > 0 && trainings < 10 && (
            <p className="clicker-tips">
              Continuez de cliquer pour donner toujours plus de formations ! 🧑‍🏫
            </p>
          )}
          {trainings >= 10 && upgrades.length === 0 && (
            <p className="clicker-tips">
              Regardez à droite, des améliorations sont disponibles 👀
            </p>
          )}
          {trainings < 100 && upgrades.length > 0 && (
            <p className="clicker-tips">
              Continuez comme ça pour explorer toute la Galaxy Digiforma 🪐
            </p>
          )}
          <div className="button-list">
            <p className="trophy" onClick={toggleWelcomeScreen}>
              <span className="trophy-top"></span>
              <span className="trophy-buckle"></span>
              🏠
            </p>
            <p className="trophy" onClick={() => setOpenTrophies(true)}>
              <span className="trophy-top"></span>
              <span className="trophy-buckle"></span>
              <p>🏆</p>
            </p>
            {hasWon && (
              <>
                <p className="trophy" onClick={() => setOpenWinScreen(true)}>
                  <span className="trophy-top"></span>
                  <span className="trophy-buckle"></span>
                  🥇
                </p>
                {openWinScreen && <WinScreen />}
              </>
            )}
          </div>
          {openWelcomeScreen && <Welcome toggle={toggleWelcomeScreen} />}
          {openTrophies && (
            <AchievementsList
              trainings={trainings}
              trainingsPerSecond={trainingsPerSecond}
            />
          )}

          <Achievements
            trainings={trainings}
            trainingsPerSecond={trainingsPerSecond}
          />
        </main>
        <aside>
          <Upgrades
            current={upgrades}
            all={upgradesParsed}
            moneys={moneys}
            dispatch={dispatch}
            price={price}
            trainingsPerSecond={trainingsPerSecond}
            moneysPerTraining={moneysPerTraining}
            clicksMultiplier={clicksMultiplier}
            clicks={clicks}
          />
        </aside>
      </div>
    </div>
  );
}

const Upgrades = ({
  current,
  all,
  moneys,
  dispatch,
  price,
  trainingsPerSecond,
  moneysPerTraining,
  clicksMultiplier,
  clicks,
}) => {
  const level = current.length;
  const maxLevel = Object.values(all).flat().length;

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
      <Level
        level={level}
        maxLevel={maxLevel}
        clicks={clicks}
        rate={trainingsPerSecond}
        moneyRate={moneysPerTraining}
        clicksMultiplier={clicksMultiplier}
        dispatch={dispatch}
      />
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
            <img className="upgrade-capsule__icon" src={IMGS[name]} />
          ) : (
            <p className="upgrade-capsule__icon">🔒</p>
          )}

          <div className="upgrade-capsule__body">
            <p className="upgrade-capsule__name">{name}</p>
            <p>{description}</p>
          </div>
          <div className="upgrade-capsule__amount">
            <p>{formatBigNumber(price)} Ð</p>
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

const reducer = (state, { type, name, value }) => {
  switch (type) {
    case 'tick': {
      const newTrainings = state.trainingsPerSecond / TICKS_PER_SECONDS;
      let newSupers = state.supers;
      if (Math.random() < 0.005) {
        newSupers = ['💸'];
      }
      return {
        ...state,
        trainings: state.trainings + newTrainings || 0,
        moneys: state.moneys + newTrainings * state.moneysPerTraining || 0,
        supers: newSupers,
      };
    }
    case 'super': {
      return {
        ...state,
        supers: [],
        moneys:
          state.moneys + Math.exp(5 + Math.round(state.upgrades.length / 2)),
      };
    }

    case 'click': {
      const newTrainings = (1 + state.trainingsPerSecond) * state.clicksMultiplier;
      return {
        ...state,
        clicks: state.clicks + 1,
        trainings: state.trainings + newTrainings,
        moneys:
          state.moneys + newTrainings * state.moneysPerTraining,
      };
    }

    case 'multiplierValue': {
      return {
        ...state,
        clicksMultiplier: value,
      };
    }

    case 'buy': {
      return {
        ...state,
        upgrades: state.upgrades.concat(name),
        trainingsPerSecond: nextTrainingsPerSecond(
          state.trainingsPerSecond,
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

// In case it overflows/underflows it sets the max/min
const useStateWithBounds = (initialValue, min, max) => {
  const [value, setValue] = useState(initialValue);
  const setValueWithBounds = newValue => {
    if (newValue > max) {
      setValue(max);
    } else if (newValue < min) {
      setValue(min);
    } else {
      setValue(newValue);
    }
  };
  return [value, setValueWithBounds];
};

const useResettableTimeout = (callback, delay) => {
  const savedCallback = useRef();
  const savedTimeoutId = useRef();

  // Remember the latest callback function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  function tick() {
    if (savedCallback.current) {
      savedCallback.current(function reschedule(ms) {
        savedTimeoutId.current = setTimeout(tick, ms);
      });
    }
  }

  useEffect(() => {
    savedTimeoutId.current = setTimeout(tick, delay);

    return () => {
      clearTimeout(savedTimeoutId.current);
    }
  }, [])

  return () => {
    clearTimeout(savedTimeoutId.current);
    savedTimeoutId.current = setTimeout(tick, delay);
  }
};


const Multiplier = ({ clicksPerSecond, clicks, dispatch }) => {
  const maxProgress = 50;
  const minCPS = 5;
  const [onFireProgress, setOnFireProgress] = useStateWithBounds(0, 0, maxProgress);
  const [multiplier, setMultiplier] = useStateWithBounds(1, 1, 3);

  const reset = useResettableTimeout((reschedule) => {
    if (clicksPerSecond < 4) {
      setOnFireProgress(onFireProgress - 2);
      if (onFireProgress > 0) {
        reschedule(500);
      } else if (multiplier > 1) {
        setMultiplier(multiplier - 0.1)
        reschedule(1000);
      }
    }
  }, 2000);

  useEffect(() => {
    if (clicksPerSecond >= minCPS) {
      setOnFireProgress(onFireProgress + 3 / multiplier);
      if ((onFireProgress + 3 / multiplier) >= maxProgress) {
        setMultiplier(multiplier + 0.1);
        if (multiplier < 2.9) {
          setOnFireProgress(0);
        }
      }
    }
    reset();
  }, [clicks]);

  useEffect(() => {
    dispatch({ type: 'multiplierValue', value: multiplier });
  }, [multiplier]);

  return (
    <div className="level-capsule">
      <p className="level-capsule__title">
        Clics
      </p>
      <p className="level-capsule__text">
        {formatBigNumber(clicks)}{' '}{clicks <= 1 ? 'clic' : 'clics'}{' ('}{clicksPerSecond} par seconde)
      </p>

      <div className="level-capsule__fire-holder">
        <div className="level-capsule__fire-bar" style={{ width: `${onFireProgress / maxProgress * 100}%` }}>
          {multiplier.toFixed(1)}x
        </div>
      </div>

        <p className="level-capsule__help">
          Multipliez vos clicks jusqu&apos;a 3x en cliquant {minCPS} fois par seconde!
        </p>
      </div>
    )
}

const Level = ({ level, maxLevel, moneyRate, clicks, rate, clicksMultiplier, dispatch }) => {
  const [clicksPerSecond, setClicksPerSecond] = useState(0);
  const [lastClicks, setLastClicks] = useState(clicks);

  useInterval(() => {
    const newCPS = clicks - lastClicks;
    setClicksPerSecond(newCPS);
    setLastClicks(clicks);
  }, 1000);

  const increaseRate = rate + clicksPerSecond * clicksMultiplier * (rate + 1);

  return (
    <>
      <div className="level-capsule">
        <p className="level-capsule__title">
          Niveau {level} / {maxLevel}
        </p>
        <p className="level-capsule__text">
          {formatBigNumber(Math.round(increaseRate))}{' '}
          {increaseRate <= 1 ? 'formation' : 'formations'} par seconde
        </p>
        <p className="level-capsule__text">
          {formatBigNumber(moneyRate)}Ð par formation
        </p>
      </div>
      <Multiplier clicksPerSecond={clicksPerSecond} clicks={clicks} dispatch={dispatch} />
    </>
  );
};

const formatBigNumber = number => {
  return Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 3,
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

function shouldShowWelcomeScreen() {
  if (localStorage.getItem('regis-clicker-welcome')) {
    return false;
  } else {
    return true;
  }
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
