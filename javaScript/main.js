axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;

axios.interceptors.request.use((config) => {
  console.log("Request started:", config);
  document.body.style.cursor = "progress";
  progressBar.style.width = "0%";
  return config;
});

axios.interceptors.response.use((response) => {
  console.log("Request finished:", response);
  document.body.style.cursor = "default";
  progressBar.style.width = "100%";
  return response;
});

async function initialLoad() {
  const breeds = await fetchBreeds();
  populateBreeds(breeds);
  breedSelect.addEventListener("change", handleBreedSelect);
}

async function fetchBreeds() {
  const response = await axios.get("/breeds");
  return response.data;
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
  const response = await axios.get(
    `/images/search?breed_ids=${breedId}&limit=5`,
    {
      onDownloadProgress: updateProgress,
    }
  );
  return response.data;
}

function updateProgress(event) {
  const percent = Math.floor((event.loaded * 100) / event.total);
  progressBar.style.width = `${percent}%`;
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
