window.getMenuCss = (styles) => `
:root {
  --bg-image: ${styles.bgImage ? `url('${styles.bgImage}')` : `url('background.jpg')`};
  --bg-color-fallback: ${styles.bgColor || '#4c7253'};

  /* Dynaamiset fonttiasetukset */
  --font-heading: '${styles.fontHeading}', serif;
  --font-body: '${styles.fontBody}', sans-serif;
  --base-font-size-content: ${styles.fontSizeContent}px;
  --base-font-size-bars: ${styles.fontSizeBars}px;

  --line-height-global: 1.05;

  --color-text-main: #664322;
  --color-text-secondary: #36672e;
  --color-text-allergen: #A36B36;
  --color-text-heading: #FFFFFF;
  --color-text-solid: #2C4230;

  --color-price-bg: #D36C22;
  --color-price-text: #FFFFFF;
  --color-price-label: #D5E0D7;

  --color-bg-header: rgba(0, 0, 0, 0.3);
  --color-bg-card: rgba(255, 255, 255, 0.7);
  --color-bg-pill: rgba(54, 103, 46, 0.3);

  --color-border-card: rgba(195, 205, 197, 0.65);
  --color-border-col-line: #ffffff;

  --radius-card: 6px;
  --radius-pill: 10px;
  --radius-badge: 15px;

  /* Asettelut pidetään staattisina rem-yksiköillä (perustuu 24px html-fonttiin) */
  --height-header: 7.5vh;
  --height-footer: 6vh;
  --grid-gap: 0.6rem;
  --col-gap: 4px;
  --padding-main: 0.4rem 0.6rem;
  --padding-card: 0.2rem 0.4rem;
  --padding-pill: 0.1rem 0.5rem;

  --blur-header-footer: 10px;
  --blur-card: 15px;
  --blur-pill: 5px;

  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.35);
  --shadow-pill: 0 1px 1px rgba(0, 0, 0, 0.5);
  --shadow-header: 0 2px 10px rgba(0, 0, 0, 0.2);
  --shadow-footer: 0 -2px 10px rgba(0, 0, 0, 0.1);
  --shadow-price-badge: 0 3px 6px rgba(211, 108, 34, 0.5);

  --light-border-rgb: 255, 255, 255;
  --light-border-alpha: 0.1;
  --light-border-softness: 10px;
  --light-border-glow: 10px;

  --dark-border-rgb: 0, 0, 0;
  --dark-border-alpha: 0.1;
  --dark-border-softness: 10px;
  --dark-border-glow: 10px;

  --shadow-text-light:
  -1px -1px var(--light-border-softness) rgba(var(--light-border-rgb), var(--light-border-alpha)),
  1px -1px var(--light-border-softness) rgba(var(--light-border-rgb), var(--light-border-alpha)),
  -1px  1px var(--light-border-softness) rgba(var(--light-border-rgb), var(--light-border-alpha)),
  1px  1px var(--light-border-softness) rgba(var(--light-border-rgb), var(--light-border-alpha)),
  0px  0px var(--light-border-glow)     rgba(var(--light-border-rgb), 1);

  --shadow-text-dark:
  -1px -1px var(--dark-border-softness) rgba(var(--dark-border-rgb), var(--dark-border-alpha)),
  1px -1px var(--dark-border-softness) rgba(var(--dark-border-rgb), var(--dark-border-alpha)),
  -1px  1px var(--dark-border-softness) rgba(var(--dark-border-rgb), var(--dark-border-alpha)),
  1px  1px var(--dark-border-softness) rgba(var(--dark-border-rgb), var(--dark-border-alpha)),
  0px  0px var(--dark-border-glow)     rgba(var(--dark-border-rgb), 1);

  /* Fonttikoot suhteessa omaan osioonsa em-yksiköllä */
  --size-food-base: 1em;
  --size-food-header: calc(var(--size-food-base) * 1.05);
  --size-food-extra: calc(var(--size-food-base) * 0.85);
  --size-food-desc: calc(var(--size-food-base) * 0.8);
  --size-food-allergen: calc(var(--size-food-base) * 0.75);
  --size-food-sub-title: calc(var(--size-food-base) * 0.7);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 24px; }

body {
  width: 100vw; height: 100vh; overflow: hidden;
  background-color: var(--bg-color-fallback);
  background-image: var(--bg-image);
  background-size: cover; background-position: center;
  background-attachment: fixed; background-repeat: no-repeat;
  color: var(--color-text-main); font-family: var(--font-body); font-weight: 700;
  display: flex; flex-direction: column; line-height: var(--line-height-global);
  text-shadow: var(--shadow-text-light);
}

.header {
  font-size: var(--base-font-size-bars);
  flex-shrink: 0; height: var(--height-header); background-color: var(--color-bg-header);
  color: var(--color-text-heading); display: flex; justify-content: space-between;
  align-items: center; padding: 0 1.5rem; box-shadow: var(--shadow-header); z-index: 10;
  backdrop-filter: blur(var(--blur-header-footer)); -webkit-backdrop-filter: blur(var(--blur-header-footer));
  text-shadow: var(--shadow-text-dark);
}
.header-main { display: flex; flex-direction: column; }
.header-main h1 { font-family: var(--font-heading); font-size: 1.8em; letter-spacing: 0.5px; margin-bottom: -0.1em; }

.prices { display: flex; gap: 1rem; align-items: center; }
.price-group { display: flex; align-items: center; gap: 0.3rem; }
.price-label { font-size: 1.05em; color: var(--color-price-label); }

.price-badge, .price {
  background-color: var(--color-price-bg); color: var(--color-price-text);
  padding: 0.1em 0.5em; border-radius: var(--radius-badge); font-size: 1.35em;
  box-shadow: var(--shadow-price-badge); text-shadow: var(--shadow-text-dark);
}
.price { white-space: nowrap; margin-left: 0.4rem; flex-shrink: 0; align-self: center; }

.main-content {
  font-size: var(--base-font-size-content);
  flex: 1; padding: var(--padding-main); display: grid;
  grid-template-columns: repeat(4, 1fr); gap: var(--grid-gap); overflow: hidden;
}
.column { display: flex; flex-direction: column; gap: var(--col-gap); height: 100%; }

.col-header {
  font-family: var(--font-heading); font-size: 1.5em; text-transform: uppercase;
  color: var(--color-text-heading); border-bottom: 2px solid var(--color-border-col-line);
  padding-bottom: 0.1em; margin-bottom: 0.2rem; display: flex; justify-content: center;
  align-items: baseline; gap: 0.4rem; letter-spacing: 0.5px; text-shadow: var(--shadow-text-dark);
}
.col-header span { font-size: 0.85em; font-family: var(--font-body); text-transform: none; font-style: italic; }

.menu-card {
  background: var(--color-bg-card); border: 1px solid var(--color-border-card);
  border-radius: var(--radius-card); padding: var(--padding-card); box-shadow: var(--shadow-card);
  backdrop-filter: blur(var(--blur-card)); -webkit-backdrop-filter: blur(var(--blur-card));
}
.menu-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 0; font-size: var(--size-food-base); }

.name-col { display: flex; flex-direction: column; flex: 1; }
.name-row { display: flex; align-items: baseline; gap: 0.4rem; flex-wrap: wrap; }
.name { color: var(--color-text-main); }
.desc { font-size: var(--size-food-desc); color: var(--color-text-secondary); margin-top: 0.15rem; }
.allergen { font-size: var(--size-food-allergen); color: var(--color-text-allergen); font-style: italic; }

.flex-wrap { display: flex; flex-wrap: wrap; gap: 0.25rem; }

.sub-item, .topping-item {
  background: var(--color-bg-pill); border: 1px solid var(--color-border-card);
  box-shadow: var(--shadow-pill); display: flex; align-items: baseline; gap: 0.2rem;
  color: var(--color-text-main); backdrop-filter: blur(var(--blur-pill)); -webkit-backdrop-filter: blur(var(--blur-pill));
}
.sub-item { padding: var(--padding-pill); border-radius: var(--radius-pill); font-size: var(--size-food-desc); }
.mt-2 { margin-top: 0.25rem; }

.footer {
  font-size: var(--base-font-size-bars);
  flex-shrink: 0; height: var(--height-footer); background: var(--color-bg-card);
  border-top: 1px solid var(--color-border-card); display: flex; justify-content: space-between;
  align-items: center; padding: 0 1.5rem; box-shadow: var(--shadow-footer); z-index: 10;
  backdrop-filter: blur(var(--blur-header-footer)); -webkit-backdrop-filter: blur(var(--blur-header-footer));
}
.toppings { display: flex; align-items: center; gap: 0.8rem; }
.topping-title { color: var(--color-text-solid); font-size: 1.2em; }
.topping-list { display: flex; gap: 0.5rem; font-size: 1.2em; flex-wrap: wrap; }
.topping-item { padding: 0.15em 0.5em; border-radius: var(--radius-badge); }
`;

window.generatePreviewHtml = function(state, escape, googleFontsUrl) {
  let html = `<!DOCTYPE html>
  <html lang="fi">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ravintola Menu - Kokoa Oma Annos</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFontsUrl}" rel="stylesheet" crossorigin="anonymous">
  <style>
  ${window.getMenuCss(state.styles)}
  </style>
  </head>
  <body>

  <header class="header">
  <div class="header-main">
  <h1>${escape(state.header.title)}</h1>
  </div>
  <div class="prices">`;

  state.header.prices.forEach(p => {
    html += `
    <div class="price-group">
    <span class="price-label">${escape(p.label)}</span>
    <span class="price-badge">${escape(p.value)}</span>
    </div>`;
  });

  html += `
  </div>
  </header>

  <main class="main-content">`;

  state.columns.forEach(col => {
    html += `

    <div class="column">
    <div class="col-header">${escape(col.title)} <span>${escape(col.subtitle)}</span></div>`;

    col.cards.forEach(card => {
      html += `

      <div class="menu-card" data-image="${escape(card.image || '')}">
      <div class="menu-item">
      <div class="name-col">
      <div class="name-row">
      <span class="name">${escape(card.name)}</span>`;
      if (card.allergen) html += `\n            <span class="allergen">${escape(card.allergen)}</span>`;
      html += `
      </div>`;
      if (card.desc) html += `\n          <span class="desc">${escape(card.desc)}</span>`;
      html += `
      </div>`;
      if (card.price) html += `\n        <span class="price">${escape(card.price)}</span>`;
      html += `
      </div>`;

      if (card.pills && card.pills.length > 0) {
        html += `
        <div class="menu-card-body">
        <div class="flex-wrap mt-2">`;
        card.pills.forEach(pill => {
          if (pill.name.trim()) {
            html += `\n          <div class="sub-item">${escape(pill.name)}</div>`;
          }
        });
        html += `
        </div>
        </div>`;
      }

      html += `
      </div>`;
    });

    html += `
    </div>`;
  });

  html += `
  </main>

  <footer class="footer">
  <div class="toppings">
  <span class="topping-title">${escape(state.footer.title)}</span>
  <div class="topping-list">`;

  state.footer.toppings.forEach(top => {
    html += `\n      <span class="topping-item">${escape(top.name)}`;
    if (top.allergen) html += ` <span class="allergen">${escape(top.allergen)}</span>`;
    html += `</span>`;
  });

  html += `
  </div>
  </div>
  </footer>

  </body>
  </html>`;

  return html;
};
