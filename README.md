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

- [ ] Automatically generate upgrades from `upgrades.toml`
- [ ] Develop a prerequisite purchase system
- [ ] Manage the maximum number of repeated purchases for each upgrade
- [ ] Save system
- [ ] Pause system
- [ ] Reset system
- [ ] Achievement system
- [ ] Achievement sharing system

## Front-end

- [ ] General layout
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

# Vite + React

This project is scaffolded with Vite and uses React as the main view framework, read more about it here :

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
