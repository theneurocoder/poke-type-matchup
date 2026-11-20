const pokemonForm = document.getElementById("pokemon-form");
const pokemonNameInput = document.getElementById("pokemon-name-input");
const pokemonNotFound = document.getElementById("pokemon-not-found");
const matchupsContainer = document.getElementById("matchups-container");
const ownTypesContainer = document.getElementById("own-types-container");
const attackingMatchupsContainer = document.getElementById(
  "attacking-matchups-container",
);
const defendingMatchupsContainer = document.getElementById(
  "defending-matchups-container",
);
const pokemonName = document.getElementById("pokemon-name");

// Form submission event
pokemonForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const pokemonName = pokemonNameInput.value.trim().toLowerCase();
  validatePokemon(pokemonName);
  pokemonNameInput.value = "";

  // Hide matchups container to only display it if pokemon is found
  matchupsContainer.classList.add("hidden");

  // Reset inner HTML of containers to remove previous content
  ownTypesContainer.innerHTML = "";
  attackingMatchupsContainer.innerHTML = "<h3>Attacking</h3>";
  defendingMatchupsContainer.innerHTML = "<h3>Defending</h3>";
});

// Function to retrieve names of all Pokemon and validate input
async function validatePokemon(pokemonName) {
  try {
    const response = await fetch("https://graphqlpokemon.favware.tech/v8", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
                    {
                        getAllPokemon(take: 1469) {
                            key
                        }
                    }
                `,
      }),
    });

    const allPokemon = await response.json();

    // Compare the keys (i.e. names) of the Pokemon from getAllPokemon to the inputted Pokemon name
    let pokemonExists = false;

    for (let pokemon of allPokemon.data.getAllPokemon) {
      if (pokemon.key === pokemonName) {
        pokemonExists = true;
        break;
      }
    }

    // If pokemon name was inputted correctly, call getPokemon function
    if (pokemonExists) {
      getPokemon(pokemonName);
      pokemonNotFound.classList.add("hidden");
      matchupsContainer.classList.remove("hidden");
    } else {
      pokemonNotFound.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Could not validate Pokémon:", error);
    matchupsContainer.innerHTML = "Could not validate Pokémon.";
    matchupsContainer.classList.remove("hidden");
  }
}

// Function to get Pokemon info
async function getPokemon(pokemonName) {
  try {
    const response = await fetch("https://graphqlpokemon.favware.tech/v8", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
                {
                getPokemon(pokemon:${pokemonName}) {
                key
                types {
                    name
                    matchup {
                        attacking {
                            doubleEffectiveTypes
                            doubleResistedTypes
                            effectiveTypes
                            effectlessTypes
                            normalTypes
                            resistedTypes    
                            }
                        defending {
                            doubleEffectiveTypes
                            doubleResistedTypes
                            effectiveTypes
                            effectlessTypes
                            normalTypes
                            resistedTypes
                        }
                        
                    }
                }
            }
        }
            `,
      }),
    });
    const pokemonData = await response.json();

    // Call displayMatchups function
    displayMatchups(pokemonData);
  } catch (error) {
    console.error("Could not retrieve Pokémon:", error);
    matchupsContainer.innerHTML = "Could not retrieve Pokémon.";
  }
}

// Function to display Pokemon matchups
function displayMatchups(pokemonData) {
  const getPokemon = pokemonData.data.getPokemon;
  const getPokemonTypes = getPokemon.types;
  const numberOfTypes = getPokemon.types.length;
  const pokemonKey = getPokemon.key;

  let typeNames = [];

  let attackingDoubleEffectiveTypes = [];
  let attackingDoubleResistedTypes = [];
  let attackingEffectiveTypes = [];
  let attackingEffectlessTypes = [];
  let attackingNormalTypes = [];
  let attackingResistedTypes = [];

  let defendingDoubleEffectiveTypes = [];
  let defendingDoubleResistedTypes = [];
  let defendingEffectiveTypes = [];
  let defendingEffectlessTypes = [];
  let defendingNormalTypes = [];
  let defendingResistedTypes = [];

  // Add Pokemon's name
  pokemonName.textContent = pokemonKey;

  // Loop through all types and create an array for each property (new Set is used
  // to prevent duplication)
  for (let i = 0; i < numberOfTypes; i++) {
    // Create an array for type names (use toLowerCase method because Pokémon's own type names are capitalized)
    getPokemonTypes[i].name = getPokemonTypes[i].name.toLowerCase();
    typeNames.push(getPokemonTypes[i].name);

    // Create arrays for attacking type matchups
    attackingDoubleEffectiveTypes.push(
      ...getPokemonTypes[i].matchup.attacking.doubleEffectiveTypes,
    );
    attackingDoubleEffectiveTypes = [...new Set(attackingDoubleEffectiveTypes)];

    attackingDoubleResistedTypes.push(
      ...getPokemonTypes[i].matchup.attacking.doubleResistedTypes,
    );
    attackingDoubleResistedTypes = [...new Set(attackingDoubleResistedTypes)];

    attackingEffectiveTypes.push(
      ...getPokemonTypes[i].matchup.attacking.effectiveTypes,
    );
    attackingEffectiveTypes = [...new Set(attackingEffectiveTypes)];

    attackingEffectlessTypes.push(
      ...getPokemonTypes[i].matchup.attacking.effectlessTypes,
    );
    attackingEffectlessTypes = [...new Set(attackingEffectlessTypes)];

    attackingNormalTypes.push(
      ...getPokemonTypes[i].matchup.attacking.normalTypes,
    );
    attackingNormalTypes = [...new Set(attackingNormalTypes)];

    attackingResistedTypes.push(
      ...getPokemonTypes[i].matchup.attacking.resistedTypes,
    );
    attackingResistedTypes = [...new Set(attackingResistedTypes)];

    // Create arrays for defending type matchups
    defendingDoubleEffectiveTypes.push(
      ...getPokemonTypes[i].matchup.defending.doubleEffectiveTypes,
    );
    defendingDoubleEffectiveTypes = [...new Set(defendingDoubleEffectiveTypes)];

    defendingDoubleResistedTypes.push(
      ...getPokemonTypes[i].matchup.defending.doubleResistedTypes,
    );
    defendingDoubleResistedTypes = [...new Set(defendingDoubleResistedTypes)];

    defendingEffectiveTypes.push(
      ...getPokemonTypes[i].matchup.defending.effectiveTypes,
    );
    defendingEffectiveTypes = [...new Set(defendingEffectiveTypes)];

    defendingEffectlessTypes.push(
      ...getPokemonTypes[i].matchup.defending.effectlessTypes,
    );
    defendingEffectlessTypes = [...new Set(defendingEffectlessTypes)];

    defendingNormalTypes.push(
      ...getPokemonTypes[i].matchup.defending.normalTypes,
    );
    defendingNormalTypes = [...new Set(defendingNormalTypes)];

    defendingResistedTypes.push(
      ...getPokemonTypes[i].matchup.defending.resistedTypes,
    );
    defendingResistedTypes = [...new Set(defendingResistedTypes)];
  }

  // Create elements for own types
  const numberOfTypeNames = typeNames.length;
  for (let i = 0; i < numberOfTypeNames; i++) {
    const ownTypeItem = document.createElement("span");
    const ownTypeImg = document.createElement("img");
    ownTypeImg.classList.add("type-image");
    ownTypeImg.src = "icons/" + typeNames[i] + ".svg";
    ownTypeImg.alt = "An icon for " + typeNames[i] + " type Pokémon.";

    ownTypeItem.classList.add("type");

    ownTypeItem.append(ownTypeImg);
    ownTypesContainer.append(ownTypeItem);
    ownTypeItem.append(typeNames[i]);
  }

  // Create elements for attacking double effective types
  const numberOfAttackingDoubleEffectiveTypes =
    attackingDoubleEffectiveTypes.length;

  if (numberOfAttackingDoubleEffectiveTypes > 0) {
    const attackingDoubleEffectiveTypesContainer =
      document.createElement("div");
    attackingDoubleEffectiveTypesContainer.classList.add("types-container");
    matchupsContainer.append(attackingDoubleEffectiveTypesContainer);

    const attackingDoubleEffectivetypesStrength = document.createElement("div");
    attackingDoubleEffectivetypesStrength.classList.add("strength");
    attackingDoubleEffectivetypesStrength.textContent = "4x";
    attackingDoubleEffectiveTypesContainer.append(
      attackingDoubleEffectivetypesStrength,
    );

    for (let i = 0; i < numberOfAttackingDoubleEffectiveTypes; i++) {
      const attackingDoubleEffectiveTypeItem = document.createElement("span");
      const attackingDoubleEffectiveTypeImg = document.createElement("img");
      attackingDoubleEffectiveTypeImg.classList.add("type-image");
      attackingDoubleEffectiveTypeImg.src =
        "icons/" + attackingDoubleEffectiveTypes[i] + ".svg";
      attackingDoubleEffectiveTypeImg.alt =
        "An icon for " + attackingDoubleEffectiveTypes[i] + " type Pokémon.";

      attackingDoubleEffectiveTypeItem.classList.add("type");

      attackingDoubleEffectiveTypeItem.append(attackingDoubleEffectiveTypeImg);
      attackingDoubleEffectiveTypesContainer.append(
        attackingDoubleEffectiveTypeItem,
      );
      attackingDoubleEffectiveTypeItem.append(attackingDoubleEffectiveTypes[i]);
      attackingMatchupsContainer.append(attackingDoubleEffectiveTypesContainer);
    }
  }

  // Create elements for attacking effective types
  const numberOfAttackingEffectiveTypes = attackingEffectiveTypes.length;

  if (numberOfAttackingEffectiveTypes > 0) {
    const attackingEffectiveTypesContainer = document.createElement("div");
    attackingEffectiveTypesContainer.classList.add("types-container");
    matchupsContainer.append(attackingEffectiveTypesContainer);

    const attackingEffectivetypesStrength = document.createElement("div");
    attackingEffectivetypesStrength.textContent = "2x";
    attackingEffectivetypesStrength.classList.add("strength");
    attackingEffectiveTypesContainer.append(attackingEffectivetypesStrength);

    for (let i = 0; i < numberOfAttackingEffectiveTypes; i++) {
      const attackingEffectivetypeItem = document.createElement("span");
      const attackingEffectiveTypeImg = document.createElement("img");
      attackingEffectiveTypeImg.classList.add("type-image");
      attackingEffectiveTypeImg.src =
        "icons/" + attackingEffectiveTypes[i] + ".svg";
      attackingEffectiveTypeImg.alt =
        "An icon for " + attackingEffectiveTypes[i] + " type Pokémon.";

      attackingEffectivetypeItem.classList.add("type");

      attackingEffectivetypeItem.append(attackingEffectiveTypeImg);
      attackingEffectiveTypesContainer.append(attackingEffectivetypeItem);
      attackingEffectivetypeItem.append(attackingEffectiveTypes[i]);
      attackingMatchupsContainer.append(attackingEffectiveTypesContainer);
    }
  }

  // Create elements for attacking normal types
  const numberOfAttackingNormalTypes = attackingNormalTypes.length;

  if (numberOfAttackingNormalTypes > 0) {
    const attackingNormalTypesContainer = document.createElement("div");
    attackingNormalTypesContainer.classList.add("types-container");
    matchupsContainer.append(attackingNormalTypesContainer);

    const attackingNormaltypesStrength = document.createElement("div");
    attackingNormaltypesStrength.classList.add("strength");
    attackingNormaltypesStrength.textContent = "1x";
    attackingNormalTypesContainer.append(attackingNormaltypesStrength);

    for (let i = 0; i < numberOfAttackingNormalTypes; i++) {
      const attackingNormaltypeItem = document.createElement("span");
      const attackingNormalTypeImg = document.createElement("img");
      attackingNormalTypeImg.classList.add("type-image");
      attackingNormalTypeImg.src = "icons/" + attackingNormalTypes[i] + ".svg";
      attackingNormalTypeImg.alt =
        "An icon for " + attackingNormalTypes[i] + " type Pokémon.";

      attackingNormaltypeItem.classList.add("type");

      attackingNormaltypeItem.append(attackingNormalTypeImg);
      attackingNormalTypesContainer.append(attackingNormaltypeItem);
      attackingNormaltypeItem.append(attackingNormalTypes[i]);
      attackingMatchupsContainer.append(attackingNormalTypesContainer);
    }
  }

  // Create elements for attacking effectless types
  const numberOfAttackingEffectlessTypes = attackingEffectlessTypes.length;

  if (numberOfAttackingEffectlessTypes > 0) {
    const attackingEffectlessTypesContainer = document.createElement("div");
    attackingEffectlessTypesContainer.classList.add("types-container");
    matchupsContainer.append(attackingEffectlessTypesContainer);

    const attackingEffectlesstypesStrength = document.createElement("div");
    attackingEffectlesstypesStrength.classList.add("strength");
    attackingEffectlesstypesStrength.textContent = "0x";
    attackingEffectlessTypesContainer.append(attackingEffectlesstypesStrength);

    for (let i = 0; i < numberOfAttackingEffectlessTypes; i++) {
      const attackingEffectlesstypeItem = document.createElement("span");
      const attackingEffectlessTypeImg = document.createElement("img");
      attackingEffectlessTypeImg.classList.add("type-image");
      attackingEffectlessTypeImg.src =
        "icons/" + attackingEffectlessTypes[i] + ".svg";
      attackingEffectlessTypeImg.alt =
        "An icon for " + attackingEffectlessTypes[i] + " type Pokémon.";

      attackingEffectlesstypeItem.classList.add("type");

      attackingEffectlesstypeItem.append(attackingEffectlessTypeImg);
      attackingEffectlessTypesContainer.append(attackingEffectlesstypeItem);
      attackingEffectlesstypeItem.append(attackingEffectlessTypes[i]);
      attackingMatchupsContainer.append(attackingEffectlessTypesContainer);
    }
  }

  // Create elements for attacking resisted types
  const numberOfAttackingResistedTypes = attackingResistedTypes.length;

  if (numberOfAttackingResistedTypes > 0) {
    const attackingResistedTypesContainer = document.createElement("div");
    attackingResistedTypesContainer.classList.add("types-container");
    matchupsContainer.append(attackingResistedTypesContainer);

    const attackingResistedtypesStrength = document.createElement("div");
    attackingResistedtypesStrength.classList.add("strength");
    attackingResistedtypesStrength.textContent = "0.5x";
    attackingResistedTypesContainer.append(attackingResistedtypesStrength);

    for (let i = 0; i < numberOfAttackingResistedTypes; i++) {
      const attackingResistedtypeItem = document.createElement("span");
      const attackingResistedTypeImg = document.createElement("img");
      attackingResistedTypeImg.classList.add("type-image");
      attackingResistedTypeImg.src =
        "icons/" + attackingResistedTypes[i] + ".svg";
      attackingResistedTypeImg.alt =
        "An icon for " + attackingResistedTypes[i] + " type Pokémon.";

      attackingResistedtypeItem.classList.add("type");

      attackingResistedtypeItem.append(attackingResistedTypeImg);
      attackingResistedTypesContainer.append(attackingResistedtypeItem);
      attackingResistedtypeItem.append(attackingResistedTypes[i]);
      attackingMatchupsContainer.append(attackingResistedTypesContainer);
    }
  }

  // Create elements for attacking double resisted types
  const numberOfAttackingDoubleResistedTypes =
    attackingDoubleResistedTypes.length;

  if (numberOfAttackingDoubleResistedTypes > 0) {
    const attackingDoubleResistedTypesContainer = document.createElement("div");
    attackingDoubleResistedTypesContainer.classList.add("types-container");
    matchupsContainer.append(attackingDoubleResistedTypesContainer);

    const attackingDoubleResistedtypesStrength = document.createElement("div");
    attackingDoubleResistedtypesStrength.classList.add("strength");
    attackingDoubleResistedtypesStrength.textContent = "0.25x";
    attackingDoubleResistedTypesContainer.append(
      attackingDoubleResistedtypesStrength,
    );

    for (let i = 0; i < numberOfAttackingDoubleResistedTypes; i++) {
      const attackingDoubleResistedtypeItem = document.createElement("span");
      const attackingDoubleResistedTypeImg = document.createElement("img");
      attackingDoubleResistedTypeImg.classList.add("type-image");
      attackingDoubleResistedTypeImg.src =
        "icons/" + attackingDoubleResistedTypes[i] + ".svg";
      attackingDoubleResistedTypeImg.alt =
        "An icon for " + attackingDoubleResistedTypes[i] + " type Pokémon.";

      attackingDoubleResistedtypeItem.classList.add("type");

      attackingDoubleResistedtypeItem.append(attackingDoubleResistedTypeImg);
      attackingDoubleResistedTypesContainer.append(
        attackingDoubleResistedtypeItem,
      );
      attackingDoubleResistedtypeItem.append(attackingDoubleResistedTypes[i]);
      attackingMatchupsContainer.append(attackingDoubleResistedTypesContainer);
    }
  }

  // Create elements for defending double effective types
  const numberOfDefendingDoubleEffectiveTypes =
    defendingDoubleEffectiveTypes.length;

  if (numberOfDefendingDoubleEffectiveTypes > 0) {
    const defendingDoubleEffectiveTypesContainer =
      document.createElement("div");
    defendingDoubleEffectiveTypesContainer.classList.add("types-container");
    matchupsContainer.append(defendingDoubleEffectiveTypesContainer);

    const defendingDoubleEffectivetypesStrength = document.createElement("div");
    defendingDoubleEffectivetypesStrength.classList.add("strength");
    defendingDoubleEffectivetypesStrength.textContent = "4x";
    defendingDoubleEffectiveTypesContainer.append(
      defendingDoubleEffectivetypesStrength,
    );

    for (let i = 0; i < numberOfDefendingDoubleEffectiveTypes; i++) {
      const defendingDoubleEffectivetypeItem = document.createElement("span");
      const defendingDoubleEffectiveTypeImg = document.createElement("img");
      defendingDoubleEffectiveTypeImg.classList.add("type-image");
      defendingDoubleEffectiveTypeImg.src =
        "icons/" + defendingDoubleEffectiveTypes[i] + ".svg";
      defendingDoubleEffectiveTypeImg.alt =
        "An icon for " + defendingDoubleEffectiveTypes[i] + " type Pokémon.";

      defendingDoubleEffectivetypeItem.classList.add("type");

      defendingDoubleEffectivetypeItem.append(defendingDoubleEffectiveTypeImg);
      defendingDoubleEffectiveTypesContainer.append(
        defendingDoubleEffectivetypeItem,
      );
      defendingDoubleEffectivetypeItem.append(defendingDoubleEffectiveTypes[i]);
      defendingMatchupsContainer.append(defendingDoubleEffectiveTypesContainer);
    }
  }

  // Create elements for defending effective types
  const numberOfDefendingEffectiveTypes = defendingEffectiveTypes.length;

  if (numberOfDefendingEffectiveTypes > 0) {
    const defendingEffectiveTypesContainer = document.createElement("div");
    defendingEffectiveTypesContainer.classList.add("types-container");
    matchupsContainer.append(defendingEffectiveTypesContainer);

    const defendingEffectivetypesStrength = document.createElement("div");
    defendingEffectivetypesStrength.classList.add("strength");
    defendingEffectivetypesStrength.textContent = "2x";
    defendingEffectiveTypesContainer.append(defendingEffectivetypesStrength);

    for (let i = 0; i < numberOfDefendingEffectiveTypes; i++) {
      const defendingEffectivetypeItem = document.createElement("span");
      const defendingEffectiveTypeImg = document.createElement("img");
      defendingEffectiveTypeImg.classList.add("type-image");
      defendingEffectiveTypeImg.src =
        "icons/" + defendingEffectiveTypes[i] + ".svg";
      defendingEffectiveTypeImg.alt =
        "An icon for " + defendingEffectiveTypes[i] + " type Pokémon.";

      defendingEffectivetypeItem.classList.add("type");

      defendingEffectivetypeItem.append(defendingEffectiveTypeImg);
      defendingEffectiveTypesContainer.append(defendingEffectivetypeItem);
      defendingEffectivetypeItem.append(defendingEffectiveTypes[i]);
      defendingMatchupsContainer.append(defendingEffectiveTypesContainer);
    }
  }

  // Create elements for defending normal types
  const numberOfDefendingNormalTypes = defendingNormalTypes.length;

  if (numberOfDefendingNormalTypes > 0) {
    const defendingNormalTypesContainer = document.createElement("div");
    defendingNormalTypesContainer.classList.add("types-container");
    matchupsContainer.append(defendingNormalTypesContainer);

    const defendingNormaltypesStrength = document.createElement("div");
    defendingNormaltypesStrength.classList.add("strength");
    defendingNormaltypesStrength.textContent = "1x";
    defendingNormalTypesContainer.append(defendingNormaltypesStrength);

    for (let i = 0; i < numberOfDefendingNormalTypes; i++) {
      const defendingNormaltypeItem = document.createElement("span");
      const defendingNormalTypeImg = document.createElement("img");
      defendingNormalTypeImg.classList.add("type-image");
      defendingNormalTypeImg.src = "icons/" + defendingNormalTypes[i] + ".svg";
      defendingNormalTypeImg.alt =
        "An icon for " + defendingNormalTypes[i] + " type Pokémon.";

      defendingNormaltypeItem.classList.add("type");

      defendingNormaltypeItem.append(defendingNormalTypeImg);
      defendingNormalTypesContainer.append(defendingNormaltypeItem);
      defendingNormaltypeItem.append(defendingNormalTypes[i]);
      defendingMatchupsContainer.append(defendingNormalTypesContainer);
    }
  }

  // Create elements for defending effectless types
  const numberOfDefendingEffectlessTypes = defendingEffectlessTypes.length;

  if (numberOfDefendingEffectlessTypes > 0) {
    const defendingEffectlessTypesContainer = document.createElement("div");
    defendingEffectlessTypesContainer.classList.add("types-container");
    matchupsContainer.append(defendingEffectlessTypesContainer);

    const defendingEffectlesstypesStrength = document.createElement("div");
    defendingEffectlesstypesStrength.classList.add("strength");
    defendingEffectlesstypesStrength.textContent = "0x";
    defendingEffectlessTypesContainer.append(defendingEffectlesstypesStrength);

    for (let i = 0; i < numberOfDefendingEffectlessTypes; i++) {
      const defendingEffectlesstypeItem = document.createElement("span");
      const defendingEffectlessTypeImg = document.createElement("img");
      defendingEffectlessTypeImg.classList.add("type-image");
      defendingEffectlessTypeImg.src =
        "icons/" + defendingEffectlessTypes[i] + ".svg";
      defendingEffectlessTypeImg.alt =
        "An icon for " + defendingEffectlessTypes[i] + " type Pokémon.";

      defendingEffectlesstypeItem.classList.add("type");

      defendingEffectlesstypeItem.append(defendingEffectlessTypeImg);
      defendingEffectlessTypesContainer.append(defendingEffectlesstypeItem);
      defendingEffectlesstypeItem.append(defendingEffectlessTypes[i]);
      defendingMatchupsContainer.append(defendingEffectlessTypesContainer);
    }
  }

  // Create elements for defending resisted types
  const numberOfDefendingResistedTypes = defendingResistedTypes.length;

  if (numberOfDefendingResistedTypes > 0) {
    const defendingResistedTypesContainer = document.createElement("div");
    defendingResistedTypesContainer.classList.add("types-container");
    matchupsContainer.append(defendingResistedTypesContainer);

    const defendingResistedtypesStrength = document.createElement("div");
    defendingResistedtypesStrength.classList.add("strength");
    defendingResistedtypesStrength.textContent = "0.5x";
    defendingResistedTypesContainer.append(defendingResistedtypesStrength);

    for (let i = 0; i < numberOfDefendingResistedTypes; i++) {
      const defendingResistedtypeItem = document.createElement("span");
      const defendingResistedTypeImg = document.createElement("img");
      defendingResistedTypeImg.classList.add("type-image");
      defendingResistedTypeImg.src =
        "icons/" + defendingResistedTypes[i] + ".svg";
      defendingResistedTypeImg.alt =
        "An icon for " + defendingResistedTypes[i] + " type Pokémon.";

      defendingResistedtypeItem.classList.add("type");

      defendingResistedtypeItem.append(defendingResistedTypeImg);
      defendingResistedTypesContainer.append(defendingResistedtypeItem);
      defendingResistedtypeItem.append(defendingResistedTypes[i]);
      defendingMatchupsContainer.append(defendingResistedTypesContainer);
    }
  }

  // Create elements for defending double resisted types
  const numberOfDefendingDoubleResistedTypes =
    defendingDoubleResistedTypes.length;

  if (numberOfDefendingDoubleResistedTypes > 0) {
    const defendingDoubleResistedTypesContainer = document.createElement("div");
    defendingDoubleResistedTypesContainer.classList.add("types-container");
    matchupsContainer.append(defendingDoubleResistedTypesContainer);

    const defendingDoubleResistedtypesStrength = document.createElement("div");
    defendingDoubleResistedtypesStrength.classList.add("strength");
    defendingDoubleResistedtypesStrength.textContent = "0.25x";
    defendingDoubleResistedTypesContainer.append(
      defendingDoubleResistedtypesStrength,
    );

    for (let i = 0; i < numberOfDefendingDoubleResistedTypes; i++) {
      const defendingDoubleResistedtypeItem = document.createElement("span");
      const defendingDoubleResistedTypeImg = document.createElement("img");
      defendingDoubleResistedTypeImg.classList.add("type-image");
      defendingDoubleResistedTypeImg.src =
        "icons/" + defendingDoubleResistedTypes[i] + ".svg";
      defendingDoubleResistedTypeImg.alt =
        "An icon for " + defendingDoubleResistedTypes[i] + " type Pokémon.";

      defendingDoubleResistedtypeItem.classList.add("type");

      defendingDoubleResistedtypeItem.append(defendingDoubleResistedTypeImg);
      defendingDoubleResistedTypesContainer.append(
        defendingDoubleResistedtypeItem,
      );
      defendingDoubleResistedtypeItem.append(defendingDoubleResistedTypes[i]);
      defendingMatchupsContainer.append(defendingDoubleResistedTypesContainer);
    }
  }
}
