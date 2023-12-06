import { useEffect, useReducer, useRef, useState } from 'react';
import toml from 'toml';
import achievements from './achievements.toml?raw';
import { Slide } from 'react-awesome-reveal';

const achievementsParsed = toml.parse(achievements).achievements.reverse();

function AchievementsList(props) {
  return (
    <div className="achievementsList">
      <h1>Trophées débloqués</h1>
      {achievementsParsed.map(a => {
        if (
          a.trainings <= props.trainings &&
          a.trainingsPerTick <= props.trainingsPerTick
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
