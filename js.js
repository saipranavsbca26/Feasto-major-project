javascript
// Active User Allergies State
let activeAllergies = ["Peanuts", "Dairy"];

// Restaurant & Menu Data Model
const restaurantsData = [
    {
        id: "bistro",
        name: "The Grand Bistro",
        isHeroDonor: true,
        image: "[suspicious link removed]",
        location: "124 Culinary Ave, Downtown",
        rating: "4.8 ★ (320 Reviews)",
        about: "Luxury dining experience with daily food donation drives to orphanages.",
        menu: [
            { name: "Creamy Mushroom Pasta", calories: "650 kcal", ingredients: ["Mushroom", "Dairy", "Pasta"], price: "$18", image: "[suspicious link removed]" },
            { name: "Grilled Herb Chicken", calories: "480 kcal", ingredients: ["Chicken", "Herbs", "Olive Oil"], price: "$22", image: "[suspicious link removed]" },
            { name: "Peanut Sauce Skewers", calories: "520 kcal", ingredients: ["Chicken", "Peanuts", "Soy"], price: "$14", image: "[suspicious link removed]" }
        ]
    },
    {
        id: "greenhouse",
        name: "Greenhouse Vegan Cafe",
        isHeroDonor: false,
        image: "[suspicious link removed]",
        location: "45 Eco Street, Midtown",
        rating: "4.6 ★ (180 Reviews)",
        about: "Fresh organic plant-based meals crafted with regional ingredients.",
        menu: [
            { name: "Avocado Quinoa Salad", calories: "380 kcal", ingredients: ["Avocado", "Quinoa", "Lemon"], price: "$15", image: "[suspicious link removed]" },
            { name: "Tofu Stir Fry", calories: "410 kcal", ingredients: ["Tofu", "Soy", "Vegetables"], price: "$16", image: "[suspicious link removed]" }
        ]
    }
];

// Initialize Application DOM Events
document.addEventListener("DOMContentLoaded", () => {
    renderRestaurantDirectory();
    renderAllergyBadges();
    fetchPHPState();
});

// Asynchronously Fetch Server-Side PHP Session State
function fetchPHPState() {
    fetch('process.php?fetch_state=true')
        .then(res => res.json())
        .then(data => {
            if (data.allergies && data.allergies.length > 0) {
                activeAllergies = data.allergies;
                renderAllergyBadges();
            }
            if (data.donations) {
                renderDonationLeaderboard(data.donations);
            }
        })
        .catch(() => console.log("Running without active PHP server."));
}

// Single-Page Navigation Function
function showPage(pageId) {
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active-page"));
    document.getElementById(pageId).classList.add("active-page");
}

// Render Restaurant Cards into the DOM
function renderRestaurantDirectory() {
    const container = document.getElementById("restaurant-list");
    if (!container) return;
    container.innerHTML = "";
    
    restaurantsData.forEach(rest => {
        const card = document.createElement("div");
        card.className = "restaurant-card";
        card.innerHTML = `
            <img src="${rest.image}" alt="${rest.name}">
            <div class="card-body">
                ${rest.isHeroDonor ? '<span class="hero-tag">🦸 Hero Donor</span>' : ''}
                <h3>${rest.name}</h3>
                <p>📍 ${rest.location}</p>
                <p>${rest.rating}</p>
                <button onclick="viewRestaurant('${rest.id}')" class="btn-primary" style="margin-top:1rem; width:100%;">View Restaurant</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Open Restaurant View & Dynamically Filter Out Allergenic Dishes
function viewRestaurant(restId) {
    const rest = restaurantsData.find(r => r.id === restId);
    const container = document.getElementById("restaurant-detail-container");

    // Dynamic Array Filtering based on User Allergies
    const safeDishes = rest.menu.filter(dish => 
        !dish.ingredients.some(ing => activeAllergies.includes(ing))
    );

    container.innerHTML = `
        <div class="card-box">
            <h2>${rest.name} ${rest.isHeroDonor ? '<span class="hero-tag">🦸 Hero Donor</span>' : ''}</h2>
            <p><strong>Location:</strong> ${rest.location}</p>
            <p><strong>Rating:</strong> ${rest.rating}</p>
            <p style="margin-top:0.5rem;">${rest.about}</p>
            <button onclick="openModal()" class="btn-primary" style="margin-top:1rem;">📅 Book Your Reservation</button>
        </div>

        <h3>Available Menu Options</h3>
        <p style="color:#64748b; margin-bottom:1rem;">
            Safety Exclusion Active: Dishes containing your saved allergies (${activeAllergies.join(", ") || "None"}) have been automatically removed.
        </p>
        
        <div class="menu-grid">
            ${safeDishes.map(dish => `
                <div class="menu-card">
                    <img src="${dish.image}" alt="${dish.name}">
                    <div class="card-body">
                        <h4>${dish.name} - ${dish.price}</h4>
                        <p><strong>Calories:</strong> ${dish.calories}</p>
                        <p><strong>Ingredients:</strong> ${dish.ingredients.join(", ")}</p>
                        <div style="margin-top:1rem; display:flex; gap:0.5rem;">
                            <button onclick="alert('Order placed for ${dish.name}!')" class="btn-primary">Order</button>
                            <button onclick="alert('Takeaway requested for ${dish.name}!')" class="btn-secondary">Takeaway</button>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
    showPage("restaurant-detail-page");
}

// Render Active Allergy Badges
function renderAllergyBadges() {
    const list = document.getElementById("active-allergies-list");
    if (list) {
        list.innerHTML = activeAllergies.map(a => `<span class="allergy-badge">⚠️ ${a}</span>`).join("");
    }
}

// Render Donation Leaderboard
function renderDonationLeaderboard(donations) {
    const list = document.getElementById("donations-list");
    if (list) {
        list.innerHTML = donations.map(d => `
            <li style="margin-bottom:0.8rem;">
                <strong>${d.name}</strong> donated <em>${d.items}</em> to ${d.target}
            </li>
        `).join("");
    }
}

// Reservation Modal Controllers
function openModal() { document.getElementById("reservation-modal").style.display = "flex"; }
function closeModal() { document.getElementById("reservation-modal").style.display = "none"; }
function confirmReservation(e) {
    e.preventDefault();
    alert(`🎉 Reservation confirmed for ${document.getElementById("res-name").value}!`);
    closeModal();
}
 