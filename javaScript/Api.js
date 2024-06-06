const API_URL = "https://api.thecatapi.com/v1";
const API_KEY =
  " 'live_MrLJKD4J1Xnnt5JJ6w3znPSMMEkTbodvJ2Firdtjr71M0Iijbv0XDa7H4oo9T2MI';";

const breedSelect = document.getElementById("breedSelect");
const carousel = document.getElementById("carousel");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

async function initialLoad() {
  const breeds = await fetchBreeds();
  populateBreeds(breeds);
  breedSelect.addEventListener("change", handleBreedSelect);
}

async function fetchBreeds() {
  const response = await fetch(`${API_URL}/breeds`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  const data = await response.json();
  return data;
}

function populateBreeds(breeds) {
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

async function handleBreedSelect(event) {
  const breedId = event.target.value;
  const breedInfo = await fetchBreedInfo(breedId);
  displayBreedInfo(breedInfo);
}

async function fetchBreedInfo(breedId) {
  const response = await fetch(
    `${API_URL}/images/search?breed_ids=${breedId}&limit=5`,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  );
  const data = await response.json();
  return data;
}

function displayBreedInfo(breedInfo) {
  carousel.innerHTML = "";
  infoDump.innerHTML = "";

  breedInfo.forEach((info) => {
    const img = document.createElement("img");
    img.src = info.url;
    carousel.appendChild(img);

    const infoDiv = document.createElement("div");
    infoDiv.textContent = `Breed: ${info.breeds[0].name} - ${info.breeds[0].description}`;
    infoDump.appendChild(infoDiv);
  });
}

initialLoad();
// add progress bar functionality
async function handleBreedSelect(event) {
  const breedId = event.target.value;
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";

  const breedInfo = await fetchBreedInfo(breedId);

  progressBar.style.width = "100%";
  document.body.style.cursor = "default";

  displayBreedInfo(breedInfo);
}

async function fetchBreedInfo(breedId) {
  const response = await fetch(
    `${API_URL}/images/search?breed_ids=${breedId}&limit=5`,
    {
      headers: {
        "x-api-key": API_KEY,
      },
      onDownloadProgress: (event) => {
        const percent = Math.floor((event.loaded * 100) / event.total);
        progressBar.style.width = `${percent}%`;
      },
    }
  );
  const data = await response.json();
  return data;
}
// favourite functionality
async function favourite(imageId) {
  try {
    const response = await axios.post("/favourites", { image_id: imageId });
    console.log("Favourited image:", response.data);
  } catch (error) {
    console.error("Error favouriting image:", error);
  }
}

async function getFavourites() {
  try {
    const response = await axios.get("/favourites");
    const favouriteImages = response.data.map((fav) => fav.image);
    displayFavouriteImages(favouriteImages);
  } catch (error) {
    console.error("Error fetching favourites:", error);
  }
}

function displayFavouriteImages(images) {
  carousel.innerHTML = "";
  images.forEach((image) => {
    const img = document.createElement("img");
    img.src = image.url;
    carousel.appendChild(img);
  });
}

getFavouritesBtn.addEventListener("click", getFavourites);
