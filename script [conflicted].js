"use strict";

//Selectors
const fileInput = document.querySelector(".file-input"),
  chooseImage = document.querySelector(".upload"),
  previewImage = document.querySelector(".imageBox img"),
  filterSlider = document.querySelector(".degree input"),
  filterValue = document.querySelector(".degree p"),
  filterOption = document.querySelectorAll(".masks button"),
  filterTitle = document.querySelector(".degreeFilter"),
  rotateOption = document.querySelectorAll(".processes button"),
  resetFilter = document.querySelector(".resetFilter"),
  saveImage = document.querySelector(".save");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0;

let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

///////////////////////////////////////////////////////////////////////////////////////////////////
// ***** set the filters *****
function applyFilters() {
  previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// ***** change the title of name the filter when we click on a specific button *****
filterOption.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".masks .active").classList.remove("active");
    option.classList.add("active");
    filterTitle.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// ***** Upload image *****
chooseImage.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", function () {
  let file = fileInput.files[0];
  if (!file) return;
  previewImage.src = URL.createObjectURL(file);
  previewImage.addEventListener("load", () => {
    resetFilter.click();
    document.querySelector(".container").classList.remove("disable");
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// ***** change the value of the filter *****
filterSlider.addEventListener("input", updateFilter);
function updateFilter() {
  filterValue.textContent = `${filterSlider.value}%`;

  const selectedFilter = document.querySelector(".masks .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// ***** Rotate and Reflect *****
rotateOption.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else if (option.id === "vertical") {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }

    applyFilters();
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// ***** Reset Filter Button *****
resetFilter.addEventListener("click", () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;

  filterOption[0].click();
  applyFilters();
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// ***** Save Image Button *****
saveImage.addEventListener('click', ()=>{
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate ( canvas.width / 2 ,  canvas.height / 2);
  if (rotate !== 0){
    ctx.rotate(rotate * Math.PI / 180)
  }
  ctx.scale(flipHorizontal, flipVertical );
  ctx.drawImage(previewImage, -canvas.width / 2 , -canvas.height / 2, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
})
