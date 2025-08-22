const cauldron = { herbs:0, berries:0, mushrooms:0, water:0, flowers:0 };
const recipes = [
  { name: 'Healing Potion', ingredients: { herbs:2, berries:1, mushrooms:1 }, color: 'green' },
  { name: 'Mana Potion', ingredients: { herbs:1, flowers:2, water:1 }, color: 'blue' }
];

let currentRecipeIndex = 0;
let correctPotions = 0;

const ingredientsContainer = document.getElementById('ingredients-container');
const bubbleContainer = document.getElementById('bubble-container');
const messageEl = document.getElementById('message');
const recipeText = document.getElementById('recipe-text');
const cauldronEl = document.getElementById('cauldron-image');
const debugTableBody = document.querySelector('#debug-table tbody');

const ingredientIcons = { herbs:'🌿', berries:'🍓', mushrooms:'🍄', water:'💧', flowers:'🌸' };

function addIngredient(ingredient){
    if(cauldron.hasOwnProperty(ingredient)){
        cauldron[ingredient]++;
        animateIngredientPop(ingredient);

        // Oppdater debug-tabell
        updateDebugTable();

        // Log til console
        console.log(`Added ${ingredientIcons[ingredient]} ${ingredient} to the cauldron. Current counts:`, {...cauldron});
    }
}

function animateIngredientPop(ingredient) {
    const icon = document.createElement('div');
    icon.classList.add('ingredient-icon', 'glow-' + ingredient, 'glow');
    const count = cauldron[ingredient];
    icon.textContent = `+${count} ${ingredientIcons[ingredient]}`;

    const containerWidth = ingredientsContainer.offsetWidth;
    const containerHeight = ingredientsContainer.offsetHeight;
    icon.style.left = (containerWidth/2 - 25) + 'px';
    icon.style.top = (containerHeight/2 - 70) + 'px';
    ingredientsContainer.appendChild(icon);

    icon.animate([
        { transform: 'translateY(0px)', opacity: 1 },
        { transform: 'translateY(-40px)', opacity: 0 }
    ], { duration: 900, easing: 'ease-out' });

    setTimeout(() => icon.remove(), 900);
}

function createBubbles(color){
  const containerWidth = bubbleContainer.offsetWidth;
  const grytaRect = cauldronEl.getBoundingClientRect();
  const containerRect = bubbleContainer.getBoundingClientRect();
  const offsetY = grytaRect.top - containerRect.top + 20;

  for(let i=0; i<10; i++){
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = 6 + Math.random()*10;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = (containerWidth/2 - 20 + Math.random()*40) + 'px';
    bubble.style.top = offsetY + 'px';
    bubble.style.backgroundColor = color;
    bubbleContainer.appendChild(bubble);

    const rise = 30 + Math.random()*40;
    const duration = 900 + Math.random()*600;
    bubble.animate([
      { transform: 'translateY(0)', opacity: 0.9 },
      { transform: `translateY(-${rise}px)`, opacity: 0 }
    ], { duration: duration, easing: 'ease-out' });

    setTimeout(()=>bubble.remove(), duration);
  }
}

function checkPotion(){
  const recipe = recipes[currentRecipeIndex];
  let success = true;
  for(const [ing, amount] of Object.entries(recipe.ingredients)){
    if(cauldron[ing]!==amount){ success=false; break; }
  }

  if(success){
    createBubbles(recipe.color);
    messageEl.textContent=`✨ Perfect ${recipe.name}! ✨`;
    messageEl.className = "success";
    correctPotions++;
    console.log(`✨ Perfect ${recipe.name}! ✨ Total correct potions: ${correctPotions}`);
  } else {
    createBubbles("red"); // røde bobler ved feil
    messageEl.textContent=`💀 Potion failed! 💀`;
    messageEl.className = "fail";
    console.log(`💀 Potion failed! 💀 Cauldron contents:`, {...cauldron});
  }

  // Reset cauldron
  for(const key in cauldron) cauldron[key]=0;

  // Oppdater debug-tabell
  updateDebugTable();
}

function switchPotion(){
  currentRecipeIndex = (currentRecipeIndex+1) % recipes.length;
  const recipe = recipes[currentRecipeIndex];
  recipeText.textContent = `🔮 Current recipe: ${recipe.name} — Ingredients: ${Object.entries(recipe.ingredients).map(e=>e[1]+' '+capitalize(e[0])).join(', ')}`;
  messageEl.textContent = `Switched to ${recipe.name}.`;
  messageEl.className = "";

  // Reset cauldron
  for(const key in cauldron) cauldron[key]=0;

  // Oppdater debug-tabell
  updateDebugTable();

  console.log(`Switched to recipe: ${recipe.name}. Cauldron reset.`);
}

// Oppdater debug-tabell med nåværende cauldron-innhold
function updateDebugTable(){
  debugTableBody.innerHTML = "";
  for(const [ingredient, count] of Object.entries(cauldron)){
    const row = document.createElement('tr');
    row.innerHTML = `<td>${ingredientIcons[ingredient]} ${capitalize(ingredient)}</td><td>${count}</td>`;
    debugTableBody.appendChild(row);
  }
}

function capitalize(str){ return str.charAt(0).toUpperCase() + str.slice(1); }

// Init debug-tabell ved start
updateDebugTable();