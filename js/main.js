/***********************************************************************************
 * Student Name: MD Arafat Koyes
 * Student Email: 133682229
 * Seneca Email: makoyes@myseneca.ca
 ***********************************************************************************/
let page = 1;
const perPage = 13;
let searchName = null;
const BASE_URL = "https://web422iota.vercel.app/";
function constructApiUrl() {
  let url = `${BASE_URL}/listings?page=${page}&perPage=${perPage}`;
  if (searchName) {
    url += `&name=${encodeURIComponent(searchName)}`;
  }
  console.log("Constructed API URL:", url);
  return url;
}

async function retrieveListingsData() {
  const url = constructApiUrl();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data fetched from API:", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

function processListingsData(data) {
  if (data.length) {
    renderListings(data);
  } else {
    displayNoListingsMessage();
  }
}

function renderListings(listings) {
  const tableBody = document.querySelector("#listingsTable tbody");
  if (!tableBody) return;

  const listingsHTML = listings
    .map(
      (listing) => `
        <tr data-id="${listing._id}">
            <td>${listing.name}</td>
            <td>${listing.room_type}</td>
            <td>${listing.address.street}</td>
            <td>${
              listing.summary
                ? listing.summary.substring(0, 100) + "..."
                : "No summary available"
            }<br/><br/>
                <strong>Accommodates:</strong> ${listing.accommodates}<br/>
                <strong>Rating:</strong> ${Math.round(
                  listing.review_scores.review_scores_rating
                )} (${listing.number_of_reviews} Reviews)
            </td>
        </tr>
    `
    )
    .join("");

  tableBody.innerHTML = listingsHTML;

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const listingId = row.getAttribute("data-id");
      displayListingDetails(listingId);
    });
  });
}

async function displayListingDetails(listingId) {
  try {
    const response = await fetch(`${BASE_URL}/listings/${listingId}`);
    const listing = await response.json();

    const modalTitle = document.querySelector("#detailsModal .modal-title");
    const modalBody = document.querySelector("#detailsModal .modal-body");

    if (modalTitle) modalTitle.textContent = listing.name;

    if (modalBody) {
      modalBody.innerHTML = `
                <img id="photo"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" 
                    class="img-fluid w-100"
                    src="${
                      listing.images.picture_url ||
                      "https://placehold.co/600x400?text=Photo+Not+Available"
                    }"
                >
                <br/><br/>
                ${
                  listing.neighborhood_overview ||
                  "No neighborhood overview available"
                }
                <br/><br/>
                <strong>Price:</strong> $${listing.price.toFixed(2)}<br/>
                <strong>Room:</strong> ${listing.room_type}<br/>
                <strong>Bed:</strong> ${listing.bed_type} (${
        listing.beds
      })<br/><br/>
            `;
    }

    const modal = new bootstrap.Modal(document.getElementById("detailsModal"));
    modal.show();
  } catch (error) {
    console.error("Error fetching listing details:", error);
  }
}

function displayNoListingsMessage() {
  const tableBody = document.querySelector("#listingsTable tbody");
  if (!tableBody) return;

  if (page > 1) {
    page--;
    loadDataForPage();
  } else {
    tableBody.innerHTML =
      '<tr><td colspan="4"><strong>No data available</strong></td></tr>';
    updatePaginationControls(false);
  }
}

function updatePaginationControls(hasNextPage) {
  const previousButton = document.getElementById("previous-page");
  const nextButton = document.getElementById("next-page");
  const currentPageElement = document.getElementById("current-page");

  if (previousButton) previousButton.classList.toggle("disabled", page === 1);
  if (nextButton) nextButton.classList.toggle("disabled", !hasNextPage);
  if (currentPageElement) currentPageElement.textContent = page;
}

async function loadDataForPage() {
  try {
    const data = await retrieveListingsData();
    console.log("Data passed to processListingsData:", data);
    if (data.length) {
      renderListings(data);
      updatePaginationControls(data.length === perPage);
    } else {
      displayNoListingsMessage();
    }
  } catch (error) {
    console.error("Error loading listings:", error);
    displayNoListingsMessage();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadDataForPage();

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nameInput = document.getElementById("name");
      searchName = nameInput ? nameInput.value : null;
      page = 1;
      loadDataForPage();
    });
  }

  const clearFormButton = document.getElementById("clearForm");
  if (clearFormButton) {
    clearFormButton.addEventListener("click", function () {
      const nameInput = document.getElementById("name");
      if (nameInput) nameInput.value = "";
      searchName = null;
      page = 1;
      loadDataForPage();
    });
  }

  const previousButton = document.getElementById("previous-page");
  const nextButton = document.getElementById("next-page");

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      if (page > 1) {
        page--;
        loadDataForPage();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      page++;
      loadDataForPage();
    });
  }
});