"use strict";

// Selectors
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

// Lock editing tools initially
const editingTools = document.querySelectorAll(
  "button:not(.upload), .degree input"
);

// Function to toggle editing tools
function toggleEditingTools(enable) {
  editingTools.forEach((tool) => (tool.disabled = !enable));
}

// Initially lock tools
toggleEditingTools(false);

// Function to apply filters
function applyFilters() {
  previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

// Event listener for clicking the upload button
chooseImage.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default behavior
  fileInput.click(); // Open file dialog
});

// Event listener for when an image is selected
fileInput.addEventListener("change", function () {
  let file = fileInput.files[0];
  if (!file) return;

  // Display the uploaded image
  previewImage.src = URL.createObjectURL(file);

  previewImage.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disable");

    // Unlock editing tools after the image loads
    toggleEditingTools(true);
  });
});

// Change the title and update filter slider when clicking on a filter button
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

// Update filter values when the slider is adjusted
filterSlider.addEventListener("input", () => {
  filterValue.textContent = `${filterSlider.value}%`;

  const selectedFilter = document.querySelector(".masks .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilters();
});

// Rotate and flip functionalities
let rotate = 0;
let flipHorizontal = 1;
let flipVertical = 1;

const rotateRightBtn = document.getElementById("rotateRight");
const rotateLeftBtn = document.getElementById("rotateLeft");
const flipHorizontalBtn = document.getElementById("flipHorizontal");
const flipVerticalBtn = document.getElementById("flipVertical");

function applyTransformations() {
  previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
}

rotateRightBtn.addEventListener("click", () => {
  rotate += 90;
  applyTransformations();
});

rotateLeftBtn.addEventListener("click", () => {
  rotate -= 90;
  applyTransformations();
});

flipHorizontalBtn.addEventListener("click", () => {
  flipHorizontal *= -1;
  applyTransformations();
});

flipVerticalBtn.addEventListener("click", () => {
  flipVertical *= -1;
  applyTransformations();
});

// Reset button functionality
const resetBtn = document.querySelector(".filter-Rest button");

resetBtn.addEventListener("click", () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;

  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;

  applyFilters();
  applyTransformations();

  filterSlider.value = brightness;
  filterValue.textContent = `${brightness}%`;
  filterTitle.textContent = "Brightness";

  document.querySelector(".masks .active").classList.remove("active");
  document.querySelector("#brightness").classList.add("active");
});

// Save button functionality
const saveBtn = document.querySelector(".save");

saveBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "edited-image.jpg";
  link.href = canvas.toDataURL("image/jpeg");
  link.click();
});
