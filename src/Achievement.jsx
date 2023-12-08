import { useEffect } from 'react';

function Achievement(props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.removeAchievement();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
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
  );
}

export default Achievement;
