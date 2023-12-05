import { useEffect, useReducer, useRef, useState } from 'react';
import toml from 'toml';
import achievements from './achievements.toml?raw';
import Achievement from './Achievement';

const achievementsParsed = toml.parse(achievements);

function Achievements(props) {
  const [achievementsShown, setachievementsShown] = useState();
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
        setachievementsShown(a);
      }
    });

    prevTrainingsRef.current = props.trainings;
    prevTrainingsPerTickRef.current = props.trainingsPerTick;
  }, [props.trainings, props.trainingsPerTick]);

  return (
    <>
      {achievementsShown && (
        <Achievement
          key={achievementsShown.id}
          id={achievementsShown.id}
          name={achievementsShown.name}
          description={achievementsShown.description}
          removeAchievement={() => {
            setachievementsShown(null);
          }}
        />
      )}
    </>
  );
}

export default Achievements;
