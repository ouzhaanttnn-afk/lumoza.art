// The only script: each game's two screens can be swapped for the next pair.
// Without it the page shows the first two screens and everything else works.
for (const game of document.querySelectorAll('.game[data-screens]')) {
  const screens = JSON.parse(game.dataset.screens);
  const shots = [...game.querySelectorAll('[data-shot]')];
  const button = game.querySelector('[data-next]');
  if (!button || shots.length < 2 || screens.length < 3) continue;
  let index = 0;
  const live = document.createElement('p');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  game.querySelector('.actions').append(live);
  const pair = () => document.documentElement.lang === 'tr' ? `${index + 1}. ve ${((index + 1) % screens.length) + 1}. ekran, toplam ${screens.length}` : `Screens ${index + 1} and ${((index + 1) % screens.length) + 1} of ${screens.length}`;
  for (const s of screens) new Image().src = s.src;
  button.addEventListener('click', () => {
    index = (index + 1) % screens.length;
    shots.forEach((img, i) => {
      const next = screens[(index + i) % screens.length];
      img.classList.add('is-out');
      setTimeout(() => {
        img.src = next.src;
        img.alt = next.alt;
        img.classList.remove('is-out');
      }, 180);
    });
    live.textContent = pair();
  });
}
