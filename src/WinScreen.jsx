function WinScreen(_props) {
  return (
    <div className="achievementsList">
      <h1>Bravo ! Vous avez fini le jeu 🥳</h1>
      <p>Téléchargez le badge du Jeu de Noël 2023.</p>
      <p>
        <a
          href="https://app.digiforma.com/user/custom_badges/new"
          target="_blank"
          className="win-screen-link"
        >
          Importez le sur l'éditeur de badge de Digiforma !
        </a>
      </p>

      <a
        href="https://feat-better-progression.d2sk9y4ym3y2h6.amplifyapp.com/6.png"
        target="_blank"
        download="badge-jeu-de-noel-2023.png"
      >
        <img
          src="https://feat-better-progression.d2sk9y4ym3y2h6.amplifyapp.com/6.png"
          alt="Le badge du Jeu de Noël 2023"
          className="win-screen-img"
        />
      </a>
    </div>
  );
}

export default WinScreen;
