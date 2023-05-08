# Music for Web Browsers

_Make ambient music in your web browser!_

## Some technical details

This project is built using [React](https://react.dev/). All audio is handled by [Tone.js](https://tonejs.github.io/).

Page components are stored in `src/components`. Many components are packaged with corresponding `.css` styles. Global styles are stored in `src/styles/index.css`.

Audio files can be found in `src/audio`, and any other assets (images, `.svg`s, etc.) are in `src/assets`.

Custom hooks (currently unused) are stored in the `src/hooks` directory, and any plain JS scripts (also currently unused) are in `src/scripts`.

### Build
This site was built in React using [`create-react-app`](https://create-react-app.dev/). To modify and test the website locally:

1. Install [Node.js](https://nodejs.org/en).
2. Clone or download this repository.
3. Navigate into the project directory and install the Node modules:

```bash
$ cd capstone
$ npm install
```

4. Start the local server:

```bash
$ npm start
```

## Possible future work
- Separate audio from rendered components
  - track deletion
- More samples!

## Other Notes

- This site hasn't been tested on mobile and may break (😓).
- Performance is not optimized and questionable at best. Animation slows down a bit when under load.
