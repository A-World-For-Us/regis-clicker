const Welcome = ({ toggle }) => {
  return (
    <div className="welcome">
      <h1> Cliquez pour former avec l'équipe Digiforma !</h1>
      <img src="/1.png" alt="voeux 2021" onClick={toggle} />
      <p>
        Une pause bien méritée en cette fin d'année 2023, aidez Régis et
        Pétronille à devenir le plus gros OF de l'Univers (et oui rien que ça).
      </p>
      <p>
        Formez de plus en plus d'apprenants en cliquant sur Régis et en achetant
        toutes les améliorations de la Galaxie Digiforma. Alors qui obtiendra le
        badge ultime ?
      </p>
      {new Date() < new Date('2023-12-21') ? (
        <>
          <p>
            Et avant les fêtes, n'hésitez pas à retrouvez l’équipe Digiforma
            autour d’une pause café en ligne le Jeudi 21 Décembre :
          </p>
          <a
            href="https://app.livestorm.co/p/972d370f-39ce-46cf-8e61-db0d97e0c45f/live?s=b7c1de0c-b5d4-46d3-8eb7-9753ea333537"
            target="_blank"
            rel="noreferrer"
          >
            👉 s’inscrire 👈
          </a>
        </>
      ) : (
        <p>
          Merci pour votre confiance toujours aussi précieuse et Joyeuses fêtes
          à tous ! Rendez-vous en 2024 pour de nouvelles aventures !
        </p>
      )}
      <button onClick={toggle}>Commencer</button>
    </div>
  );
};

export default Welcome;
