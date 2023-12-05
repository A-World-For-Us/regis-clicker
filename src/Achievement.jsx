import { useEffect, useReducer, useRef, useState } from 'react';
import { Slide } from 'react-awesome-reveal';

function Achievement(props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.removeAchievement();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Slide direction="up" duration="500">
      <div key={props.id} className="achievement">
        <div className="achievement--emoji">🏆</div>
        <div className="achievement--content">
          <strong>{props.name}</strong>
          <p>{props.description}</p>
        </div>
        <div className="achievement--close" onClick={props.removeAchievement}>
          X
        </div>
      </div>
    </Slide>
  );
}

export default Achievement;
