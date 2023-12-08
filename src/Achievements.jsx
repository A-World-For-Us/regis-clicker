import { useEffect, useRef, useState } from 'react';
import toml from 'toml';
import achievements from './achievements.toml?raw';
import Achievement from './Achievement';

const achievementsParsed = toml.parse(achievements);

function Achievements(props) {
  const [achievementsShown, setachievementsShown] = useState();
  const prevTrainingsRef = useRef(0);
  const prevTrainingsPerSecondRef = useRef(0);

  useEffect(() => {
    const isAchievementJustUnlocked = achievement => {
      const unlockedNow =
        props.trainings >= achievement.trainings &&
        props.trainingsPerSecond >= achievement.trainingsPerSecond;
      const unlockedBefore =
        prevTrainingsRef.current >= achievement.trainings &&
        prevTrainingsPerSecondRef.current >= achievement.trainingsPerSecond;
      return unlockedNow && !unlockedBefore;
    };

    achievementsParsed.achievements.forEach(a => {
      if (isAchievementJustUnlocked(a)) {
        setachievementsShown(a);
      }
    });

    prevTrainingsRef.current = props.trainings;
    prevTrainingsPerSecondRef.current = props.trainingsPerSecond;
  }, [props.trainings, props.trainingsPerSecond]);

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
