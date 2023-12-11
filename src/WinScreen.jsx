function WinScreen(_props) {
  return (
    <div className="achievementsList">
      <h1>Bravo ! Vous avez fini le jeu 🥳</h1>
      <p><a href="badge-jeu-de-noel-2023.png" download className="win-screen-link">Téléchargez le badge du Jeu de Noël 2023.</a></p>
      <p>
        <a
          href="https://app.digiforma.com/user/custom_badges/new"
          target="_blank"
          className="win-screen-link"
        >
          Importez le sur l'éditeur de badge de Digiforma !
        </a>
      </p>

      <a href="/6.png" target="_blank" download="badge-jeu-de-noel-2023.png">
        <img
          src="/6.png"
          alt="Le badge du Jeu de Noël 2023"
          className="win-screen-img"
        />
      </a>
    </div>
  );
}

export default WinScreen;
