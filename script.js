let allPetsData = [];
let currentPetsData = [];

const loadPetAll = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/peddy/pets");
    const data = await res.json();
    allPetsData = data.pets;
    currentPetsData = allPetsData;
    displayPetAll(currentPetsData);
};

const loadCategories = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/peddy/categories");
    const data = await res.json();
    displayCategories(data.categories);
};

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    for (let btn of buttons) {
        btn.classList.remove("active");
    }
};

const loadCategoryPets = async (id) => {
    const petContainer = document.getElementById("box-container");
    petContainer.innerHTML = `
        <div class="flex justify-center items-center col-span-3">
            <span class="loading loading-bars loading-lg"></span>
        </div>
    `;
    removeActiveClass();
    const activeBtn = document.getElementById(`btn-${id}`);
    activeBtn.classList.add("active");

    setTimeout(async () => {
        const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${id}`);
        const data = await res.json();
        currentPetsData = data.data;
        displayPetAll(currentPetsData);
    }, 2000);
};

const sortPetsByPrice = () => {
    const sortedPets = [...currentPetsData].sort((a, b) => b.price - a.price);
    displayPetAll(sortedPets);
};

const showDetails = async (id) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`);
    const data = await res.json();
    const pet = data.petData;
    const modalContainer = document.getElementById("modal-container");

    modalContainer.innerHTML = `
        <dialog id="my_modal_1" class="modal">
            <div class="modal-box pt-[200px] flex flex-col justify-center items-center space-y-3">     
                <img class="rounded-xl" src="${pet.image}" alt="">
                <div class="flex gap-12 border-b-2">
                    <div class="flex flex-col justify-start pb-4">
                        <p><i class="fa-solid fa-vector-square"></i> Breed: ${pet.breed || 'not available'}</p>
                        <p><i class="fa-solid fa-venus"></i> Gender: ${pet.gender || 'not available'}</p>
                        <p><i class="fa-solid fa-venus"></i> Vaccinated status: ${pet.vaccinated_status || 'not available'}</p>
                    </div>
                    <div class="flex flex-col justify-start">
                        <p><i class="fa-solid fa-calendar-days"></i> Birth: ${pet.birthDate || 'not available'}</p>
                        <p><i class="fa-solid fa-dollar-sign"></i> Price: ${pet.price || 'not available'}</p>
                    </div>
                </div>
                <div>
                    <h1 class="font-bold">Details information</h1>
                    <p class="">${pet.pet_details}</p>
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn bg-green-400 px-[150px] lg:px-[200px]">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    `;
    const modal = document.getElementById("my_modal_1");
    modal.showModal();
};

function openModal(petID) {
    const modal = document.getElementById('my_modal_5');
    const timerDisplay = document.getElementById('timer');
    const openModalBtn = document.getElementById(`openModalBtn${petID}`);
    let timeLeft = 3;

    modal.showModal();

    const countdown = setInterval(() => {
        timerDisplay.textContent = ` ${timeLeft} `;
        timeLeft--;
    }, 1000);

    setTimeout(() => {
        clearInterval(countdown);
        timerDisplay.textContent = "";
        openModalBtn.textContent = "Adopted";
        openModalBtn.disabled = true;
        modal.close();
    }, 4500);
}

const addImage = (data) => {
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML += `
        <div class="shadow-xl p-3 lg:p-1 xl:p-3 rounded-xl">
            <img class="rounded-xl col-span-1 w-full" src="${data}">
        </div>
    `;
}

const displayCategories = (datas) => {
    const btns = document.getElementById("btns");
    datas.forEach(data => {
        btns.innerHTML += `
            <button id="btn-${data.category}" onclick="loadCategoryPets('${data.category}')" class="btn category-btn w-[200px] h-[60px] flex items-center justify-center">
                <img class="w-[40px]" src="${data.category_icon}" alt="${data.category}">
                <h1>${data.category}</h1>
            </button>
        `;
    });
};

const displayPetAll = (datas) => {
    const petContainer = document.getElementById("box-container");
    petContainer.innerHTML = "";
    if (datas.length == 0) {
        petContainer.innerHTML = `
            <div class="flex flex-col justify-center items-center col-span-3 text-center">
                <img src="images/error.webp" alt="image">
                <h1 class="font-extrabold text-3xl">No Information Available</h1>
                <p class="text-gray-500">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            </div>
        `;
        return;
    }

    datas.forEach(data => {
        petContainer.innerHTML += `
            <div class="box shadow-xl w-[100%] flex flex-col justify-start p-5 rounded-xl gap-2 col-span-1">
                <img class="rounded-xl" src="${data.image}" alt="${data.name}">
                <h1 class="font-bold text-2xl">${data.pet_name || 'not available'}</h1>
                <p><i class="fa-solid fa-vector-square"></i> Breed: ${data.breed || 'not available'}</p>
                <p><i class="fa-solid fa-calendar-days"></i> Birth: ${data.date_of_birth || 'not available'}</p>
                <p><i class="fa-solid fa-venus"></i> Gender: ${data.gender || 'not available'}</p>
                <p><i class="fa-solid fa-dollar-sign"></i> Price: ${data.price || 'not available'}</p>
                <hr>
                <div class="flex gap-2 lg:gap-1 xl:gap-2 justify-center items-center mt-3">
                    <button onclick="addImage('${data.image}')" class="btn"><i class="fa-solid fa-thumbs-up cursor-pointer"></i></button>
                    <button id="openModalBtn${data.petId}" class="btn bg-white border-green-300 text-green-600" onclick="openModal('${data.petId}')">Adopt</button>
                    <button onclick="showDetails('${data.petId}')" class="btn bg-white border-green-300 text-green-600">Details</button>
                </div>
            </div>
        `;
    });
};

document.getElementById("sorted-btn").addEventListener("click", sortPetsByPrice);
loadPetAll();
loadCategories();
