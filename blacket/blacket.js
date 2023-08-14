const cardContainer = document.querySelector('.card-container');
const rapButton = document.getElementById('rap-button');
const copiesButton = document.getElementById('copies-button');
const nameButton = document.getElementById('name-button');
const searchInput = document.getElementById('search-input');

const commaify = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

async function fetchData() {
  try {
    const response = await fetch('./values.json');
    const cardData = await response.json();
    return cardData;
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

function createCard(data) {
  const card = document.createElement('div');
  card.classList.add('card');

  const name = document.createElement('h2');
  name.textContent = data.name;
  card.appendChild(name);

  const image = document.createElement('img');
  const imageSrc = `https://blacket.org/content/blooks/${data.name}${data.rarity === 'Mystical' || data.rarity === 'Iridescent' ? '.gif' : '.png'}`;
  image.src = imageSrc;
  image.alt = data.name;
  image.loading = 'lazy';
  card.appendChild(image);

  const rap = document.createElement('p');
  rap.textContent = `RAP: ${commaify(data.rap)}`;
  card.appendChild(rap);

  const copies = document.createElement('p');
  copies.textContent = `COPIES: ${commaify(data.copies)}`;
  card.appendChild(copies);

  const rarity = document.createElement('p');
  rarity.textContent = `RARITY: ${data.rarity}`;
  card.appendChild(rarity);

  const hoard = document.createElement('p');
  hoard.textContent = `LARGEST HOARD: ${data.hoard.user} with ${commaify(data.hoard.amount)}`;
  card.appendChild(hoard);

  return card;
}

(async () => {
  const cardData = await fetchData();
  if (!cardData) return;

  function reorder(func) {
    cardContainer.innerHTML = '';
    cardData.sort(func);

    cardData.forEach(function (card) {
      const cardElement = createCard(card);
      cardContainer.appendChild(cardElement);
    });
  }

  function sortByRap() {
    function compare(a, b) {
      if (a.rap === 'O/C' && b.rap !== 'O/C') return -1;
      else if (a.rap !== 'O/C' && b.rap === 'O/C') return 1;
      else if (a.rap === 'O/C' && b.rap === 'O/C') return a.copies - b.copies;
      else return b.rap - a.rap;
    };

    reorder(compare);
  }

  const sortByCopies = () => reorder((a, b) => b.copies - a.copies);
  const sortByName = () => reorder((a, b) => a.name.localeCompare(b.name));

  const search = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredData = cardData.filter((card) => card.name.toLowerCase().includes(searchTerm));

    cardContainer.innerHTML = '';
    filteredData.forEach((card) => cardContainer.appendChild(createCard(card)));
  };

  rapButton.addEventListener('click', sortByRap);
  copiesButton.addEventListener('click', sortByCopies);
  nameButton.addEventListener('click', sortByName);
  searchInput.addEventListener('input', search);

  sortByRap();
})();
