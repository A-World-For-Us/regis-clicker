import { useEffect, useReducer, useRef, useState } from 'react';
import toml from 'toml';
import achievements from './achievements.toml?raw';
import Achievement from './Achievement';

const achievementsParsed = toml.parse(achievements);

function Achievements(props) {
  const [achievementsShown, setachievementsShown] = useState([]);
  const prevTrainingsRef = useRef(0);
  const prevTrainingsPerTickRef = useRef(0);

  useEffect(() => {
    const isAchievementJustUnlocked = achievement => {
      const unlockedNow =
        props.trainings >= achievement.trainings &&
        props.trainingsPerTick >= achievement.trainingsPerTick;
      const unlockedBefore =
        prevTrainingsRef.current >= achievement.trainings &&
        prevTrainingsPerTickRef.current >= achievement.trainingsPerTick;
      return unlockedNow && !unlockedBefore;
    };

    achievementsParsed.achievements.forEach(a => {
      if (isAchievementJustUnlocked(a)) {
        setachievementsShown([...achievementsShown, a]);
      }
    });

    prevTrainingsRef.current = props.trainings;
    prevTrainingsPerTickRef.current = props.trainingsPerTick;
  }, [props.trainings, props.trainingsPerTick]);

  return (
    <>
      {achievementsShown.map(a => {
        return (
          <Achievement
            key={a.id}
            id={a.id}
            name={a.name}
            description={a.description}
            removeAchievement={() => {
              setachievementsShown(
                achievementsShown.filter(e => e.id !== a.id),
              );
            }}
          />
        );
      })}
    </>
  );
}

export default Achievements;
