const Bandeau = ({ prepend, append }) => (
  <div className="news-ticker">
    <div className="ticker-text">
      <span>{prepend}</span>
      {new Date() < new Date('2023-12-21') ? (
        <>
          <span>
            🎄Pour conclure l'année 2023 en beauté, retrouvez l’équipe Digiforma
            autour d’une pause café en ligne le Jeudi 21 Décembre 🎄
          </span>
          <a
            href="https://app.livestorm.co/p/972d370f-39ce-46cf-8e61-db0d97e0c45f/live?s=b7c1de0c-b5d4-46d3-8eb7-9753ea333537"
            target="_blank"
            rel="noreferrer"
          >
            👉 s’inscrire 👈
          </a>
        </>
      ) : (
        <span>
          🎄Toute l'équipe Digiforma vous remercie d'avoir passer une nouvelle
          année en notre compagnie 🎄
        </span>
      )}
      <span>{append}</span>
    </div>
  </div>
);

export default Bandeau;
