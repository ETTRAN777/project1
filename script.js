document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const accountIcon = document.querySelector('.account');
  const dropdown = document.querySelector('.dropdown');
  const bigView = document.querySelector('.bigView');

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
            return data.results.map(job => [job.id, job.title]);
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
    const uniqueJobs = Array.from(new Map(allJobs.map(([id, title]) => [title.toLowerCase(), [id, title]])).values());
    populateDropdown(positionDropdown, uniqueJobs, "Position:");
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