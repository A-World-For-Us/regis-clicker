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
  '#095228',
  '#D4423E',
  '#133D22',
  '#8C0B01',
  '#197541',
  '#E9B571',
  '#CB8835',
];

const imgs = {
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
        className={
          'ornament' +
          ' ' +
          (props.upgrade === 'super' ? 'ornament--super' : '')
        }
        onClick={props.onClick || null}
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
        {props.upgrade !== 'super' ? (
          <img className="ornament-img" src={imgs[props.upgrade]} />
        ) : (
          <img className="ornament-img" src={'money.png'} />
        )}
      </div>
    </>
  );
}
export default Ornament;
