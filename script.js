document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const accountIcon = document.querySelector('.account');
  const dropdown = document.querySelector('.dropdown');
  const bigView = document.querySelector('.bigView');
  updateBigView("sigma","sigma","sigma","sigma","https://www.google.com")

  cards.forEach(card => {
    if (card.classList.contains('cardSelected')) {
      return;
    }
    bigView.style.display = 'none';
  });

  cards.forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.target.classList.contains('bookmark')) {
        // Prevent unselecting the card when the bookmark button is clicked
        return;
      }

      if (card.classList.contains('cardSelected')) {
        // Unselect the card if it is already selected
        card.classList.remove('cardSelected');
        card.classList.add('card');
        const activeButtonContainer = card.querySelector('.activeButtonContainer');
        if (activeButtonContainer) {
          activeButtonContainer.classList.remove('activeButtonContainer');
          activeButtonContainer.classList.add('inactiveButtonContainer');
        }
        cards.forEach(card => {
          if (card.classList.contains('cardSelected')) {
            return;
          }
          bigView.style.display = 'none';
        });
      } else {
        if(bigView.style.display === 'none') {
          bigView.style.display = 'block';
        }
        // Remove 'cardSelected' class from any currently selected card
        const selectedCard = document.querySelector('.cardSelected');
        if (selectedCard) {
          selectedCard.classList.remove('cardSelected');
          selectedCard.classList.add('card');
          const activeButtonContainer = selectedCard.querySelector('.activeButtonContainer');
          if (activeButtonContainer) {
            activeButtonContainer.classList.remove('activeButtonContainer');
            activeButtonContainer.classList.add('inactiveButtonContainer');
          }
        }

        // Add 'cardSelected' class to the clicked card
        card.classList.remove('card');
        card.classList.add('cardSelected');
        const activeButtonContainer = card.querySelector('.inactiveButtonContainer');
        if (activeButtonContainer) {
          activeButtonContainer.classList.remove('inactiveButtonContainer');
          activeButtonContainer.classList.add('activeButtonContainer');
        }
      }
    });
  });

  
  accountIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (event) => {
    if (dropdown.style.display === 'block' && !dropdown.contains(event.target) && !accountIcon.contains(event.target)) {
      dropdown.style.display = 'none';
    }
  });
});

function bookmark() {
  const bookmarkElement = this;
  const currentSrc = bookmarkElement.src;
  if (currentSrc.includes('bookmarkEmpty.png')) {
    bookmarkElement.src = 'bookmarkFull.png';
  } else {
    bookmarkElement.src = 'bookmarkEmpty.png';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const positionDropdown = document.getElementById("position");
  const locationDropdown = document.getElementById("location");
  const dateDropdown = document.getElementById("date");
  const salaryDropdown = document.getElementById("salary");

  const searchKeywords = ["developer", "engineer", "programmer", "data", "IT", "software", "cybersecurity",
    "agile", "scrum", "kanban", "version control", "git", "api", "restful", "graphql",
    "object-oriented", "oop", "functional programming", "debugging", "unit testing",
    "integration testing", "test automation", "ci/cd", "continuous integration",
    "continuous deployment", "cloud computing", "aws", "azure", "gcp", "docker",
    "kubernetes", "microservices", "serverless", "devops", "frontend", "backend",
    "full stack", "responsive design", "cross-browser compatibility", "ui/ux",
    "user experience", "user interface", "accessibility", "mobile-first", "performance optimization",
    "code review", "pair programming", "agile methodologies", "data structures",
    "algorithms", "database design", "sql", "nosql", "mongodb", "postgresql",
    "data modeling", "data pipelines", "etl", "big data", "machine learning", 
    "artificial intelligence", "nlp", "computer vision", "cloud infrastructure",
    "security best practices", "encryption", "authentication", "authorization",
    "api integration", "sdk", "third-party libraries", "scripting", "linux", "bash",
    "monitoring", "logging", "metrics", "observability", "incident response"
  ];
  const specificCategory = "it-jobs";

  Promise.all(
    searchKeywords.map(keyword =>
      fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=08a72ab0&app_key=874d4ac078fb3738a509c0b786266e21&category=${specificCategory}&what=${keyword}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data && data.results) {
            return data.results.map(job => ({
              id: job.id,
              title: job.title,
              city: job.location?.area?.[1] || null // grabs "London" from ["UK", "London", ...]
            }));
          } else {
            console.error('Unexpected API response structure:', data);
            return [];
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          return [];
        })
    )
  ).then(results => {
    const allJobs = results.flat();
  
    // Get unique job titles
    const uniqueJobs = Array.from(
      new Map(allJobs.map(({ id, title }) => [title.toLowerCase(), [id, title]])).values()
    );
  
    // Get unique cities (skip nulls)
    const citiesSet = new Set(
      allJobs
        .map(({ city }) => city)
        .filter(city => city) // remove null or undefined
    );
    const uniqueCities = Array.from(citiesSet).map(city => [city, city]);
  
    // Populate dropdowns
    populateDropdown(positionDropdown, uniqueJobs, "Position:");
    populateDropdown(locationDropdown, uniqueCities, "Location:");
  });  
});

function populateDropdown(dropdown, items, defaultText) {
  dropdown.innerHTML = '';
  const defaultOption = document.createElement("option");
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.value = null;
  defaultOption.textContent = defaultText;
  dropdown.appendChild(defaultOption);

  items.sort((a, b) => a[1].localeCompare(b[1]));

  items.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    dropdown.appendChild(option);
  });
}
//Test

// Function to update the big view with job details
function updateBigView(aboutValue, descriptionValue,salaryValue,datePostedValue,applyButtonValue){
  const about = document.getElementById("aboutValue");
  const description = document.getElementById("descriptionValue");
  const salary = document.getElementById("salaryValue");
  const datePosted = document.getElementById("datePostedValue");
  const applyButton = document.getElementById("applyButtonValue");

  about.innerText = aboutValue;
  description.innerText = descriptionValue;
  salary.innerText = salaryValue;
  datePosted.innerText = datePostedValue;
  applyButton.action = applyButtonValue;
}

function fetchFilteredJobs() {
  const position = document.getElementById("position").value;
  const location = document.getElementById("location").value;
  const date = document.getElementById("date")?.value;
  const salary = document.getElementById("salary")?.value;

  const baseUrl = 'https://api.adzuna.com/v1/api/jobs/us/search/1';
  const appId = '08a72ab0';
  const appKey = '874d4ac078fb3738a509c0b786266e21';
  const category = 'it-jobs';

  let url = `${baseUrl}?app_id=${appId}&app_key=${appKey}&category=${category}`;

  if (position) url += `&what=${encodeURIComponent(position)}`;
  if (location) url += `&where=${encodeURIComponent(location)}`;
  if (salary) url += `&salary_min=${encodeURIComponent(salary)}`;
  if (date) url += `&sort_by=date&max_days_old=${encodeURIComponent(date)}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const job = data.results?.[0];
      if (job) {
        updateBigView(
          job.company.display_name || 'N/A',
          job.description || 'No description provided.',
          `$${job.salary_min || 'N/A'} - $${job.salary_max || 'N/A'}`,
          job.created || 'N/A',
          job.redirect_url || '#'
        );
      } else {
        updateBigView('No Results', '', '', '', '#');
      }
    })
    .catch(err => console.error("Failed to fetch jobs:", err));
}
document.getElementById("position").addEventListener("change", fetchFilteredJobs);
document.getElementById("location").addEventListener("change", fetchFilteredJobs);
if (document.getElementById("date")) {
  document.getElementById("date").addEventListener("change", fetchFilteredJobs);
}
if (document.getElementById("salary")) {
  document.getElementById("salary").addEventListener("change", fetchFilteredJobs);
}