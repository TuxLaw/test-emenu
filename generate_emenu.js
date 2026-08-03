window.generateEMenuHtml = function(state, escape, googleFontsUrl) {
  // 1. Muunna koot
  const sizesItems = state.header.prices.map((p, i) => {
    const priceMatch = p.value.match(/[-+]?\d+/);
    const price = priceMatch ? parseInt(priceMatch[0], 10) : 0;
    return {
      id: 'size_' + i,
      name: p.label.replace('Pohjahinta: ', '').trim() || 'Koko ' + (i+1),
                                             price: price
    };
  });

  const menuDataObj = {
    sizes: {
      title: "Valitse annoksen koko", limit: 1,
      items: sizesItems
    }
  };

  const stepsOrderArr = ['sizes'];
  const selectionsObj = { sizes: [] };

  // 2. Muunna sarakkeet
  state.columns.forEach((col, i) => {
    const stepId = 'col_' + i;
    stepsOrderArr.push(stepId);
    selectionsObj[stepId] = [];

    let limit = 1;
    const subL = col.subtitle.toLowerCase();
    if (subL.includes('kaksi')) limit = 2;
    else if (subL.includes('kolme')) limit = 3;
    else if (subL.includes('neljä')) limit = 4;
    else {
      // Etsii kaikki numerot ja valitsee isoimman (Esim. "1-2" -> 2)
      const numbers = col.subtitle.match(/\d+/g);
      if (numbers) {
        limit = Math.max(...numbers.map(n => parseInt(n, 10)));
      }
    }

    menuDataObj[stepId] = {
      title: col.title + (col.subtitle ? ' ' + col.subtitle : ''),
                        limit: limit,
                        items: col.cards.map((card, j) => {
                          let price = 0;
                          if (card.price) {
                            const pMatch = card.price.replace(',', '.').match(/[-+]?\d+(\.\d+)?/);
                            if (pMatch) price = parseFloat(pMatch[0]);
                          }
                          let item = {
                            id: stepId + '_' + j,
                            name: card.name,
                            price: price,
                            image: card.image || ''
                          };
                          if (card.desc) item.desc = card.desc;
                          if (card.allergen) item.allergen = card.allergen;
                          if (card.pills && card.pills.length > 0) {
                            const subs = card.pills.map(p => p.name).filter(n => n.trim() !== '');
                            if (subs.length > 0) item.subs = subs;
                          }
                          return item;
                        })
    };
  });

  // 3. Muunna toppings
  stepsOrderArr.push('toppings');
  selectionsObj['toppings'] = [];

  let topPrice = 0;
  if (state.footer.title) {
    const pMatch = state.footer.title.replace(',', '.').match(/[-+]?\d+(\.\d+)?/);
    if (pMatch) topPrice = parseFloat(pMatch[0]);
  }

  menuDataObj['toppings'] = {
    title: state.footer.title || "Lisukkeet",
    limit: 10,
    items: state.footer.toppings.map((t, i) => {
      return {
        id: 'top_' + i,
        name: t.name,
        allergen: t.allergen,
        price: topPrice
      };
    })
  };

  // Välivaiheet ennen yhteenvetoa
  stepsOrderArr.push('review');
  stepsOrderArr.push('summary');

  return `<!DOCTYPE html>
  <html lang="fi">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Ravintola Menu - Kokoa Oma Annos</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFontsUrl}" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"><\/script>
  <style>
  ${window.getMenuCss(state.styles)}

  html { font-size: 24px !important; }

  body {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    padding-bottom: 250px;
    -webkit-overflow-scrolling: touch;
  }

  .step-container { display: none; }
  .step-container.active { display: block; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .step-title {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    margin-bottom: 15px;
    text-align: center;
    color: var(--color-text-heading);
    text-shadow: var(--shadow-text-dark);
  }

  .card {
    background: var(--color-bg-card);
    border: 2px solid var(--color-border-card);
    border-radius: var(--radius-card);
    padding: 15px;
    margin-bottom: 12px;
    box-shadow: var(--shadow-card);
    transition: all 0.2s;
    position: relative;
    cursor: pointer;

    /* SUORITUSKYKY-OPTIMOINTI (Sumennus poistettu) */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  .card.selected {
    background: #ffffff;
    border-color: var(--color-price-bg);
    box-shadow: 0 0 12px rgba(211, 108, 34, 0.6);
  }

  .card-header { display: flex; justify-content: space-between; align-items: stretch; gap: 12px; }
  .card-title { font-size: 1.15rem; font-weight: 700; color: var(--color-text-main); }
  .card-desc { font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 4px; line-height: 1.2; }
  .card-allergen { font-size: 0.8rem; color: var(--color-text-allergen); font-style: italic; }

  .card-thumbnail {
    width: 70px; height: 70px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid var(--color-border-card);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    flex-shrink: 0;
  }

  .price-badge {
    display: inline-block;
    background: var(--color-price-bg);
    color: var(--color-price-text);
    padding: 4px 10px;
    border-radius: var(--radius-badge);
    font-size: 0.9rem;
    font-weight: 700;
    text-shadow: var(--shadow-text-dark);
    margin-top: 8px;
  }
  .price-badge.minus { background: #36672e; }

  .sub-items {
    display: none;
    margin-top: 12px;
    gap: 8px;
    flex-wrap: wrap;
    border-top: 1px dashed rgba(0,0,0,0.1);
    padding-top: 12px;
  }
  .card.selected .sub-items { display: flex; }

  .sub-item {
    background: rgba(255,255,255,0.5);
    color: var(--color-text-main);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    border: 1px solid var(--color-border-card);
    cursor: pointer;
  }
  .sub-item.active {
    background: var(--color-price-bg);
    color: var(--color-price-text);
    border-color: var(--color-price-bg);
    text-shadow: var(--shadow-text-dark);
  }

  .review-item {
    display: flex; gap: 15px; align-items: center;
    background: var(--color-bg-card);
    padding: 12px; border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid var(--color-border-card);
    text-align: left;

    /* GPU-kiihdytys */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  .review-item img {
    width: 60px; height: 60px; object-fit: cover; border-radius: 6px; flex-shrink: 0;
  }
  .action-btn {
    padding: 15px; border-radius: 8px; font-weight: bold; font-size: 1rem;
    cursor: pointer; transition: all 0.2s; width: 100%; display: block;
    margin-bottom: 12px; text-align: center;
  }
  .btn-edit { background: rgba(255,255,255,0.7); border: 1px solid var(--color-border-card); color: var(--color-text-main); }
  .btn-add { background: rgba(255,255,255,0.9); border: 2px dashed var(--color-price-bg); color: var(--color-price-bg); }
  .btn-finish { background: var(--color-price-bg); border: none; color: white; box-shadow: var(--shadow-price-badge); text-shadow: var(--shadow-text-dark); }
  .btn-danger { background: #e74c3c; color: white; border: none; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }

  .bottom-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--color-bg-header);
    border-top: 1px solid var(--color-border-card);
    padding: 15px;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;

    /* GPU-kiihdytys alapalkille */
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  .nav-btn {
    background: var(--color-price-bg);
    color: var(--color-price-text);
    border: none;
    padding: 0 20px;
    height: 54px;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    text-shadow: var(--shadow-text-dark);
    box-shadow: var(--shadow-price-badge);
    min-width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .nav-btn.secondary { background: rgba(255,255,255,0.2); color: var(--color-text-heading); box-shadow: none; border: 1px solid rgba(255,255,255,0.3); }

  .total-info { text-align: center; color: var(--color-text-heading); text-shadow: var(--shadow-text-dark); }
  .total-price { font-size: 1.4rem; font-weight: 700; color: var(--color-price-bg); }
  .progress-info { font-size: 0.85rem; opacity: 0.8; font-weight: normal; }

  .summary-view { text-align: center; }

  .qr-code-wrapper { margin: 20px auto; padding: 15px; background: white; border-radius: 12px; display: inline-block; box-shadow: var(--shadow-card); width: 100%; max-width: 500px; box-sizing: border-box; }
  #qrcode { width: 100% !important; height: auto !important; display: block; margin: 0 auto; }

  .summary-text {
    text-align: left; background: var(--color-bg-card); padding: 15px; border-radius: 8px;
    margin-top: 15px; font-size: 0.9rem; line-height: 1.5; box-shadow: var(--shadow-card);
    border: 1px solid var(--color-border-card);

    /* GPU-kiihdytys */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  #image-modal {
  display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); z-index: 9999; justify-content: center; align-items: center;
  opacity: 0; transition: opacity 0.3s ease;
  }
  #image-modal.show { opacity: 1; }
  #modal-img { max-width: 90%; max-height: 85%; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); object-fit: contain; }
  .modal-close { position: absolute; top: 20px; right: 20px; color: white; font-size: 2rem; cursor: pointer; text-shadow: 0 2px 5px rgba(0,0,0,0.8); }

  </style>
  </head>
  <body>

  <div class="content-area" id="app">
  </div>

  <div class="bottom-bar">
  <button class="nav-btn secondary" id="btn-prev" onclick="goPrev()"></button>
  <div class="total-info">
  <div class="total-price" id="total-price">0€</div>
  <div class="progress-info" id="progress-info">Vaihe 1/7</div>
  </div>
  <button class="nav-btn" id="btn-next" onclick="goNext()"></button>
  </div>

  <!-- Modal -->
  <div id="image-modal" onclick="closeImageModal()">
  <div class="modal-close">&times;</div>
  <img id="modal-img" src="">
  </div>

  <script>
  const menuData = ${JSON.stringify(menuDataObj)};
  const stepsOrder = ${JSON.stringify(stepsOrderArr)};

  let currentStep = 0;
  let selections = ${JSON.stringify(selectionsObj)};
  let cart = [];

  // Modernit, paksut SVG-nuoli-ikonit
  const svgLeftArrow = \`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>\`;
  const svgRightArrow = \`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>\`;

  function initApp() {
    renderCurrentStep();
    updateNavigation();
    updateTotal();
  }

  function animateStep() {
    const app = document.getElementById('app');
    app.scrollTop = 0;
    app.style.animation = 'none';
    void app.offsetWidth;
    app.style.animation = 'fadeIn 0.3s ease-out';
  }

  function getPriceLabel(price) {
    if (price === 0) return '';
    if (price > 0) return \`<div class="price-badge plus">+\${price}€</div>\`;
    return \`<div class="price-badge minus">\${price}€</div>\`;
  }

  function toggleItem(catId, itemId) {
    const limit = menuData[catId].limit;
    const itemData = menuData[catId].items.find(i => i.id === itemId);
    const selArray = selections[catId];
    const index = selArray.findIndex(i => i.id === itemId);

    if (index > -1) {
      selArray.splice(index, 1);
    } else {
      if (selArray.length >= limit) {
        selArray.shift();
      }
      let newItem = Object.assign({}, itemData);
      if (newItem.subs && newItem.subs.length > 0) {
        newItem.selectedSub = newItem.subs[0];
      }
      selArray.push(newItem);
    }

    renderCurrentStep();
    updateNavigation();
    updateTotal();
  }

  function selectSubItem(event, catId, itemId, subName) {
    event.stopPropagation();
    const item = selections[catId].find(i => i.id === itemId);
    if (item) {
      item.selectedSub = subName;
      renderCurrentStep();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeJsArg(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\\\'");
  }

  function openImageModal(event, src) {
    event.stopPropagation();
    const modal = document.getElementById('image-modal');
    document.getElementById('modal-img').src = src;
    modal.style.display = 'flex';
    setTimeout(() => { modal.classList.add('show'); }, 10);
  }

  function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      document.getElementById('modal-img').src = '';
    }, 300);
  }

  function resetSelections() {
    stepsOrder.forEach(s => {
      if (s !== 'summary' && s !== 'review') selections[s] = [];
    });
  }

  function saveToCart() {
    if (calcAnnosTotal(selections) > 0 || selections.sizes.length > 0) {
      cart.push(JSON.parse(JSON.stringify(selections)));
    }
    resetSelections();
  }

  function editCurrentAnnos() {
    currentStep = 0;
    initApp();
    animateStep();
  }

  function addAnotherAnnos() {
    saveToCart();
    currentStep = 0;
    initApp();
    animateStep();
  }

  function finishOrder() {
    saveToCart();
    currentStep = stepsOrder.indexOf('summary');
    initApp();
    animateStep();
  }

  function clearAll() {
    if (confirm('Haluatko varmasti tyhjentää koko tilauksen?')) {
      cart = [];
      resetSelections();
      currentStep = 0;
      initApp();
      animateStep();
    }
  }

  function renderCurrentStep() {
    const app = document.getElementById('app');
    const stepId = stepsOrder[currentStep];

    if (stepId === 'summary') {
      renderSummary(app);
      return;
    }

    if (stepId === 'review') {
      renderReview(app);
      return;
    }

    const data = menuData[stepId];
    let html = \`<div class="step-container active">
    <div class="step-title">\${escapeHtml(data.title)}</div>\`;

    data.items.forEach(item => {
      const isSelected = selections[stepId].find(i => i.id === item.id);

      let subItemsHtml = '';
      if (item.subs && item.subs.length > 0) {
        let subsList = item.subs.map(sub => {
          let isActive = isSelected && isSelected.selectedSub === sub ? 'active' : '';
          return \`<div class="sub-item \${isActive}" onclick="selectSubItem(event, '\${stepId}', '\${item.id}', '\${escapeJsArg(sub)}')">\${escapeHtml(sub)}</div>\`;
        }).join('');
        subItemsHtml = \`<div class="sub-items">\${subsList}</div>\`;
      }

      let cardDesc = item.desc ? \`<div class="card-desc">\${escapeHtml(item.desc)}</div>\` : '';
      let cardAllergen = item.allergen ? \`<div class="card-allergen">\${escapeHtml(item.allergen)}</div>\` : '';
      let priceHtml = stepId === 'sizes' ? \`<div class="price-badge">\${item.price}€</div>\` : getPriceLabel(item.price);
      let imgHtml = item.image ? \`<img src="\${item.image}" class="card-thumbnail" onclick="openImageModal(event, '\${item.image}')">\` : '';

      html += \`
      <div class="card \${isSelected ? 'selected' : ''}" onclick="toggleItem('\${stepId}', '\${item.id}')">
      <div class="card-header">
      <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
      <div class="card-title">\${escapeHtml(item.name)}</div>
      \${cardDesc}
      \${cardAllergen}
      <div>\${priceHtml}</div>
      </div>
      \${imgHtml}
      </div>
      \${subItemsHtml}
      </div>
      \`;
    });

    html += \`</div>\`;
    app.innerHTML = html;
  }

  function renderReview(app) {
    let html = \`<div class="step-container active">
    <div class="step-title">Tarkista valintasi</div>
    <div style="margin-bottom: 20px;">\`;

    stepsOrder.forEach(stepId => {
      if (stepId === 'sizes' || stepId === 'summary' || stepId === 'review') return;
      if (selections[stepId] && selections[stepId].length > 0) {
        selections[stepId].forEach(item => {
          let img = item.image ? \`<img src="\${item.image}">\` : '';
          let sub = item.selectedSub ? \` (\${item.selectedSub})\` : '';
          let catName = menuData[stepId].title.split('(')[0];

          html += \`<div class="review-item">
          \${img}
          <div class="review-item-content">
          <div class="review-item-title">\${escapeHtml(item.name)}\${escapeHtml(sub)}</div>
          <div class="review-item-sub">\${escapeHtml(catName)}</div>
          </div>
          </div>\`;
        });
      }
    });

        html += \`</div>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
        <button class="action-btn btn-edit" onclick="editCurrentAnnos()">Muokkaa tätä annosta</button>

        <div style="text-align:center; font-size:1.1rem; font-weight:bold; margin-top:15px; color: white; text-shadow: var(--shadow-text-dark);">Nyt voit halutessasi lisätä uuden annoksen tähän tilaukseen.</div>
        <button class="action-btn btn-add" onclick="addAnotherAnnos()">+ Lisää annos</button>

        <div style="text-align:center; font-size:1.1rem; font-weight:bold; margin-top:15px; color: white; text-shadow: var(--shadow-text-dark);">tai jos olet valmis, paina</div>
        <button class="action-btn btn-finish" onclick="finishOrder()">Valmis tilaamaan!</button>
        </div>
        </div>\`;

        app.innerHTML = html;
  }

  function formatList(arr) {
    if (!arr || arr.length === 0) return '';
    return arr.map(i => i.name + (i.selectedSub ? \` (\${i.selectedSub})\` : '')).join(', ');
  }

  function renderSummary(app) {
    const total = calculateTotal();
    let textSummary = '';

    cart.forEach((annos, idx) => {
      textSummary += \`--- ANNOS \${idx + 1} ---\\n\`;
      textSummary += \`KOKO: \${annos.sizes[0] ? annos.sizes[0].name : '-'}\\n\\n\`;

      stepsOrder.forEach(stepId => {
        if (stepId === 'sizes' || stepId === 'summary' || stepId === 'review') return;
        const sel = annos[stepId];
        if (sel && sel.length > 0) {
          let catName = menuData[stepId].title.split('(')[0].trim().toUpperCase();
          if (stepId === 'toppings') catName = 'TOPPING';
          textSummary += \`\${catName}:\\n- \${formatList(sel).split(', ').join('\\n- ')}\\n\\n\`;
        }
      });
    });

      textSummary += \`YHTEENSÄ: \${total}€\`;

      app.innerHTML = \`
      <div class="step-container active summary-view">
      <div class="step-title" style="font-size:2rem; margin-top:20px;">Tilaus valmis!</div>
      <p style="text-align:center; margin-bottom:15px; color:white; font-size:1.2rem; font-weight:bold; text-shadow: var(--shadow-text-dark);">Näytä tämä kokille</p>
      <div class="qr-code-wrapper">
      <canvas id="qrcode"></canvas>
      </div>
      <div class="summary-text"><pre style="font-family:inherit; white-space:pre-wrap;">\${escapeHtml(textSummary)}</pre></div>
      <button class="action-btn btn-danger" style="margin-top: 30px;" onclick="clearAll()">Tyhjennä kaikki</button>
      </div>
      \`;

      new QRious({
        element: document.getElementById('qrcode'),
                 value: textSummary,
                 size: 600,
                 background: 'white',
                 foreground: '#000000'
      });
  }

  function calcAnnosTotal(selObj) {
    let t = 0;
    if (selObj.sizes && selObj.sizes.length > 0) t += selObj.sizes[0].price;
    stepsOrder.forEach(stepId => {
      if (stepId === 'sizes' || stepId === 'summary' || stepId === 'review') return;
      if (selObj[stepId]) {
        selObj[stepId].forEach(item => { t += (item.price || 0); });
      }
    });
    return t;
  }

  function calculateTotal() {
    let t = 0;
    cart.forEach(annos => { t += calcAnnosTotal(annos); });
    t += calcAnnosTotal(selections);
    return t;
  }

  function updateTotal() {
    const total = calculateTotal();
    document.getElementById('total-price').innerText = total + '€';
  }

  function updateNavigation() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const progress = document.getElementById('progress-info');
    const stepId = stepsOrder[currentStep];

    const stepsCount = stepsOrder.length - 2;

    // Alustetaan aina näkyviksi
    btnNext.style.visibility = 'visible';
    btnPrev.style.visibility = 'visible';

    if (stepId === 'summary') {
      progress.innerText = 'Valmis';
      btnPrev.style.visibility = 'hidden';

      btnNext.innerHTML = 'Takaisin';
      btnNext.disabled = false;
    } else if (stepId === 'review') {
      progress.innerText = \`Tarkistus\`;

      btnPrev.innerHTML = svgLeftArrow;

      btnNext.style.visibility = 'hidden';
    } else {
      progress.innerText = \`Vaihe \${currentStep + 1} / \${stepsCount}\`;
      btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

      btnPrev.innerHTML = svgLeftArrow;
      btnNext.innerHTML = svgRightArrow;

      const limit = menuData[stepId].limit;
      const curLen = selections[stepId] ? selections[stepId].length : 0;

      if (stepId === 'toppings') {
        btnNext.disabled = false;
      } else {
        btnNext.disabled = curLen < 1;
      }

      progress.innerText = \`Valittu \${curLen}/\${limit}\`;
    }
  }

  function goNext() {
    const stepId = stepsOrder[currentStep];
    if (stepId === 'summary') {
      if (cart.length > 0) {
        selections = cart.pop();
      }
      currentStep = stepsOrder.indexOf('review');
    } else if (stepId === 'review') {
      finishOrder();
      return;
    } else {
      currentStep++;
    }
    initApp();
    animateStep();
  }

  function goPrev() {
    if (currentStep > 0) {
      currentStep--;
      initApp();
      animateStep();
    }
  }

  window.onload = () => {
    initApp();
    animateStep();
  };

  <\/script>
  </body>
  </html>`;
};
