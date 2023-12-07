import { useEffect, useReducer, useRef, useState } from 'react';
import toml from 'toml';
import achievements from './achievements.toml?raw';

const achievementsParsed = toml.parse(achievements).achievements.reverse();

function AchievementsList(props) {
  return (
    <div className="achievementsList">
      <h1>Trophées débloqués</h1>
      {achievementsParsed.map(a => {
        if (
          a.trainings <= props.trainings &&
          a.trainingsPerSecond <= props.trainingsPerSecond
        ) {
          return (
            <p>
              <strong>{a.name}</strong>
              <br />
              {a.description}
            </p>
          );
        }
      })}
    </div>
  );
}

export default AchievementsList;
