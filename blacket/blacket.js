// VALUES HAVE BEEN MOVEN TO `values.json`

let cardData;

fetch(
  "https://raw.githubusercontent.com/tremblero/collectibles/main/blacket/values.json"
)
  .then((r) => r.json())
  .then((data) => {
    cardData = data;
  })
  .catch((error) => {
    console.error("Error fetching JSON:", error);
  });

setTimeout(() => {
  const cardContainer = document.getElementById("card-container");
  const rapButton = document.getElementById("rap-button");
  const copiesButton = document.getElementById("copies-button");
  const nameButton = document.getElementById("name-button");
  const fragment = document.createDocumentFragment();

  function createCard(data) {
    const card = document.createElement("div");
    card.classList.add("card");

    const name = document.createElement("h2");
    name.textContent = data.name;
    card.appendChild(name);

    const image = document.createElement("img");
    const imageSrc = `https://blacket.org/content/blooks/${data.name}${
      data.rarity === "Mystical" || data.rarity === "Iridescent"
        ? ".gif"
        : ".png"
    }`;
    image.src = imageSrc;
    image.alt = data.name;
    card.appendChild(image);

    const rap = document.createElement("p");
    rap.textContent = `RAP: ${commaify(data.rap)}`;
    card.appendChild(rap);

    const copies = document.createElement("p");
    copies.textContent = `COPIES: ${commaify(data.copies)}`;
    card.appendChild(copies);

    const rarity = document.createElement("p");
    rarity.textContent = `RARITY: ${data.rarity}`;
    card.appendChild(rarity);

    const hoard = document.createElement("p");
    hoard.textContent = `LARGEST HOARD: ${data.hoard.user} with ${commaify(
      data.hoard.amount
    )}`;
    card.appendChild(hoard);

    return card;
  }

  function commaify(number) {
    const numberStr = number.toString();
    let result = "";
    let length = numberStr.length;

    for (let i = 0; i < length; i++) {
      if ((length - i) % 3 === 0 && i !== 0) {
        result += ",";
      }
      result += numberStr.charAt(i);
    }

    return result;
  }

  function reorder(func) {
    cardContainer.innerHTML = "";
    cardData.sort(func);

    cardData.forEach(function (card) {
      const cardElement = createCard(card);
      fragment.appendChild(cardElement);
    });

    cardContainer.appendChild(fragment);
  }

  function sortByRap() {
    function compare(a, b) {
      if (a.rap === "O/C" && b.rap !== "O/C") {
        return -1;
      } else if (a.rap !== "O/C" && b.rap === "O/C") {
        return 1;
      } else if (a.rap === "O/C" && b.rap === "O/C") {
        return a.copies - b.copies;
      } else {
        return b.rap - a.rap;
      }
    }

    reorder(compare);
  }

  function sortByCopies() {
    reorder((a, b) => b.copies - a.copies);
  }

  function sortByName() {
    reorder((a, b) => a.name.localeCompare(b.name));
  }

  rapButton.addEventListener("click", sortByRap);
  copiesButton.addEventListener("click", sortByCopies);
  nameButton.addEventListener("click", sortByName);

  const searchInput = document.getElementById("search-input");

  function search() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = cardData.filter((card) =>
      card.name.toLowerCase().includes(searchTerm)
    );

    cardContainer.innerHTML = "";

    filteredData.forEach((card) => {
      const cardElement = createCard(card);
      fragment.appendChild(cardElement);
    });

    cardContainer.appendChild(fragment);
  }

  searchInput.addEventListener("input", search);

  sortByRap();
}, 500);
