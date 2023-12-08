import { useEffect, useReducer, useRef, useState } from 'react';

const colors = [
  '#5f6f52',
  '#EE7214',
  '#820000',
  '#E5AD15',
  '#7769AF',
  '#B99470',
  '#4E9525',
  '#EDF0C7',
];

const imgs = {
  Régis: 'Regis.png',
  Pétronille: 'Petronille.png',
  'Kat Jépété': 'Cat jépété.png',
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
  'Audit de surveillance': 'surveillance.png',
};

function Ornament(props) {
  const [size, setSize] = useState(`${Math.random() * 150 + 50}px`);
  const [left, setLeft] = useState(`${Math.random() * 60}vw`);
  const [rand, setRand] = useState(`${Math.random() * 100 + 20}px`);
  const [v, setV] = useState(`${Math.random() * 10 + 10}s`);
  const [color, setColor] = useState(
    colors[Math.floor(Math.random() * colors.length)],
  );
  return (
    <>
      <div
        className="ornament"
        style={{
          '--ornament-size': size,
          '--ornament-left': left,
          '--ornament-rand': rand,
          '--ornament-v': v,
          '--ornament-color': color,
        }}
      >
        <div className="ornament-top"></div>
        <div className="ornament-buckle"></div>
        <img className="ornament-img" src={imgs[props.upgrade]} />
      </div>
    </>
  );
}
export default Ornament;
