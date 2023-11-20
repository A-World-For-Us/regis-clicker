# Regis Clicker

Regis Clicker (tentative name) is the Digiforma 2023 Christmas Game.

Inspired by famous [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/) and [Paperclips Idle Game](https://www.decisionproblem.com/paperclips/index2.html), Regis must deliver a maximum of trainings to affor his Christmas presents.

During the course of the Game, Regis will become exponentionally more productive and training the whole galaxy !

# TODO

## Project

- [x] Populate the information correctly in the ReadMe
- [ ] Create a clean project (prettier, tests, file separation, etc.)
- [x] Implement a small CI
- [x] Set up automatic deployment and the domain (Amplify?)

## Engine

- [x] Automatically generate upgrades from `upgrades.toml`
- [ ] _SUPER IMPORTANT_ Develop a prerequisite purchase system
- [x] Manage the maximum number of repeated purchases for each upgrade
- [ ] Save system
- [ ] Pause system
- [ ] Reset system
- [ ] _SUPER IMPORTANT_ Achievement system
- [ ] _SUPER IMPORTANT_ Notifications system
- [ ] Achievement sharing system

## Front-end

- [x] General layout
- [ ] Cool clicker effects
- [ ] Stylish upgrade buttons
- [ ] Display information about the current game state
- [ ] Animation on each click
- [ ] Ambient animations and music

## Todo

- [ ] Improve the todo list with more details

# Setup

- `asdf isntall` : install node
- `npm i` : install dependencies
- `npm run start` : run development server (with hot module reloading !)

# Format

Automatically format the code with prettier

- `npx prettier --write .`

# Deployment

This project is automatically deployed on [AWS Amplify](https://eu-west-1.console.aws.amazon.com/amplify/home?region=eu-west-1#/d2sk9y4ym3y2h6) on every push to `main`.

The game is publicly available [here](https://main.d2sk9y4ym3y2h6.amplifyapp.com/)

# Vite + React

This project is scaffolded with Vite and uses React as the main view framework, read more about it here :

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
