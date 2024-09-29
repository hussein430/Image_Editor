"use strict";

//Selectors
const fileInput = document.querySelector(".file-input"),
chooseImage = document.querySelector(".upload"),
previewImage = document.querySelector(".imageBox img"),
filterSlider = document.querySelector(".degree input"),
filterValue = document.querySelector(".degree p"),
filterOption = document.querySelectorAll(".masks button"),
filterTitle = document.querySelector(".degreeFilter");

let brightness = 100,
saturation = 100,
inversion = 0,
grayscale = 0;

//set the filters 
function applyFilters() {
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

//change the title of name the filter when we click on a specific button
filterOption.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".masks .active").classList.remove("active");
        option.classList.add("active");
        filterTitle.innerText = option.innerText;

        if (option.id === "brightness"){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`
        }else if (option.id === "saturation"){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        }else if (option.id === "inversion"){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`
        }else{
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`
        }
    })
})

//Upload image
fileInput.addEventListener("change", function () {
  let file = fileInput.files[0];
  if (!file) return;
  previewImage.src = URL.createObjectURL(file);
  previewImage.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disable");
  });
});

//change the value of the filter
filterSlider.addEventListener("input", updateFilter);
function updateFilter() {
  filterValue.textContent = `${filterSlider.value}%`;

  const selectedFilter = document.querySelector(".masks .active");

  if (selectedFilter.id === "brightness"){
    brightness = filterSlider.value;
  }else if (selectedFilter.id === "inversion"){
    inversion = filterSlider.value;
  }else if (selectedFilter.id === "saturation"){
    saturation = filterSlider.value;
  }else{
    grayscale = filterSlider.value;
  }
  applyFilters();
}

//Event listener to upload image
chooseImage.addEventListener("click", () => fileInput.click());
