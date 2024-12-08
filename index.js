//previous
//next
//loader

//повністю перечитати код поки не зрозумію кожну єбану строчку коду
//прописати план для кожної логіки, шо таке прівієс і шо таке некст детально, шо зміниться в коді коли я клікну на них
//так само з лоадером, коли має показувати і коли має сховатися
//проестімейтити скільки це займе часу і скільки зайняло

// прівієс і некст
// по кліку карент сторінка збільшується на 1
// повторюється логіка і загружається всі дані і рендеряться на сторінці
//
//
// лоадер
// створити дів з класом лоадер
// прописати стилі
// коли клікаю на сторінку, має зявитися лоадер:
// треба щоб лоадер показувався поки фетчаться і рендеряться дані
// коли дані зарендерились лоадер має зникнути
// додати клас

const rutik = document;

const dogSabaki = "https://dogapi.dog/api/v2/breeds"; // vytiaguiem vsih sobak
const allBreeds = "https://dog.ceo/api/breeds/list/all"; // vytiaguiem breeds
let dogs = []; // stvoriuiem pustyi array dlia dogiv

let currentPage = 1; // zadaiemo znachennia current storinky
let dogsPerPage = 10; // zadaiemo znachennia dlia kilkosti dogiv na storintsi
let pageURL = `https://dogapi.dog/api/v2/breeds?page[number]=${currentPage}`; // zadaiemo link dlia storinok z dynamichnym znachenniam current storinky

const loader = rutik.getElementById("loader-container");

async function main() {
  showLoader();
  await fetchDogs();
  await fetchBreeds();
  await sklepaiemSobakSmordahamy();
  renderDogs();
  hideLoader();
}

function showLoader() {
  console.log("loader shown");
  loader.classList.add = "show";
}

function hideLoader() {
  console.log("loader hidden");
  loader.classList.remove("show");
}

function handleNextPage() {
  const button = rutik.getElementsByClassName("page-next")[0];
  button.addEventListener("click", () => {
    currentPage++;
    main();
  });
}

handleNextPage();

function handlePrevPage() {
  const button = rutik.getElementsByClassName("page-prev")[0];
  button.addEventListener("click", () => {
    currentPage--;
    main();
  });
}

handlePrevPage();

function paginate() {
  const pageButtons = rutik.getElementsByClassName("page-number"); // vytiaguiem knopky yak html collection
  [...pageButtons].forEach((button) => {
    // usaiem spread operator shob peretvoryty collection v array
    button.addEventListener("click", (event) => {
      // po cliku zminiuye znachennia currentPage na text knopky, tobto nomer storinky
      currentPage = event.target.innerText;
      main();
    });
  });
}

paginate();

function fetchDogs() {
  return fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${currentPage}`) // berem sobak po linku z dynamichnoyu currentPage
    .then((response) => response.json()) // otrymuiem vidpovid i converts to json
    .then((response) => {
      dogs = []; //clear array
      response.data.forEach((dog) => {
        // add dogs data into array
        dogs.push({
          id: dog.id,
          name: dog.attributes.name,
          description: dog.attributes.description,
        });
      });
    });
}

function fetchBreeds() {
  // get all breeds and
  return fetch(allBreeds) //get all breeds with 'message' key in it
    .then((response) => response.json())
    .then((response) => {
      const breeds = Object.keys(response.message).slice(0, 10); //gets all breeds using objectkeys and takes first 10 using slice

      breeds.forEach((breed, index) => {
        dogs[index].breed = breed; //assing breed to each dog by index
      });
    });
}

async function fetchMordahy(breed) {
  const dogMordahy = `https://dog.ceo/api/breed/${breed}/images`; // create url for getting image of a breed
  const response = await fetch(dogMordahy); //
  const data = await response.json();

  return data.message[currentPage]; //returns images url from message for current page
}

async function sklepaiemSobakSmordahamy() {
  for (const dog of dogs) {
    const dogImage = await fetchMordahy(dog.breed); //
    dog.image = dogImage;
  }
}

function renderDogs() {
  const list = rutik.getElementsByClassName("list");

  const spysochok = list[0];
  spysochok.innerHTML = "";

  dogs.forEach((dog) => {
    const listItem = rutik.createElement("li");
    listItem.classList.add("sobaka");

    const dogName = rutik.createElement("h3"); // <h3>{name}</h3>
    const description = rutik.createElement("p");
    const breed = rutik.createElement("span");
    const image = rutik.createElement("img");

    dogName.innerHTML = dog.name;
    description.innerHTML = dog.description;
    breed.innerHTML = dog.breed;
    image.src = dog.image;

    listItem.innerHTML = `${
      dogName.outerHTML +
      description.outerHTML +
      breed.outerHTML +
      image.outerHTML
    }`;

    spysochok.innerHTML += listItem.outerHTML;
  });
}

main();
