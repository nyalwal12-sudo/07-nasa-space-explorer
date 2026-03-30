// Find our date picker inputs, button, and modal elements on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const fetchButton = document.getElementById('fetchImages');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalImageContainer = document.getElementById('modalImageContainer');
const modalDescription = document.getElementById('modalDescription');

const funFacts = [
  'Venus spins backward compared to most planets.',
  'A day on Venus is longer than a year on Venus.',
  'Saturn could float in water because it is mostly gas.',
  'An astronaut’s footprint on the Moon can last millions of years.',
  'There are more stars in the universe than grains of sand on Earth.',
  'Neutron stars can spin 600 times per second.',
  'The Sun makes up 99.8% of the solar system’s mass.',
  'Jupiter’s Great Red Spot is a storm larger than Earth.',
  'Space is not completely empty; it contains tiny particles and radiation.'
];

// Set up the date pickers using dateRange.js
setupDateInputs(startInput, endInput);

fetchButton.addEventListener('click', () => {
  if (startInput.value && endInput.value) {
    loadGallery(startInput.value, endInput.value);
  }
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

function loadGallery(startDate, endDate) {
  clearGallery();
  showLoading();

  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startDate}&end_date=${endDate}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const items = Array.isArray(data) ? data : [data];

      if (items.length === 0) {
        showPlaceholder('No images found for that date range.');
        return;
      }

      gallery.innerHTML = '';
      items.forEach(item => {
        gallery.appendChild(createGalleryItem(item));
      });
    })
    .catch(error => {
      console.error('Error fetching APOD images:', error);
      showPlaceholder('Unable to load space images right now. Please try again later.');
    });
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoading() {
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';

  const icon = document.createElement('div');
  icon.className = 'placeholder-icon';
  icon.textContent = '🛰️';

  const text = document.createElement('p');
  text.textContent = 'Loading space images...';

  const funFact = document.createElement('p');
  funFact.textContent = `Fun fact: ${fact}`;
  funFact.style.marginTop = '10px';

  placeholder.appendChild(icon);
  placeholder.appendChild(text);
  placeholder.appendChild(funFact);
  gallery.appendChild(placeholder);
}

function showPlaceholder(message) {
  clearGallery();

  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';

  const icon = document.createElement('div');
  icon.className = 'placeholder-icon';
  icon.textContent = '🔭';

  const text = document.createElement('p');
  text.textContent = message;

  placeholder.appendChild(icon);
  placeholder.appendChild(text);
  gallery.appendChild(placeholder);
}

function createGalleryItem(apod) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.addEventListener('click', () => openModal(apod));
  item.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(apod);
    }
  });

  if (apod.media_type === 'image') {
    const img = document.createElement('img');
    img.src = apod.url;
    img.alt = apod.title;
    item.appendChild(img);
  } else {
    const preview = document.createElement('div');
    preview.className = 'gallery-video-preview';

    const icon = document.createElement('span');
    icon.textContent = '🎥';
    preview.appendChild(icon);

    const label = document.createElement('span');
    label.textContent = 'Video';
    preview.appendChild(label);

    item.appendChild(preview);
  }

  return item;
}

function openModal(apod) {
  modalTitle.textContent = apod.title;
  modalDate.textContent = apod.date;
  modalDescription.textContent = apod.explanation;

  modalImageContainer.innerHTML = '';

  if (apod.media_type === 'image') {
    const image = document.createElement('img');
    image.src = apod.hdurl || apod.url;
    image.alt = apod.title;
    modalImageContainer.appendChild(image);
  } else {
    const description = document.createElement('p');
    description.textContent = 'This APOD is a video or interactive media item. Open it using the link below.';
    modalImageContainer.appendChild(description);

    const link = document.createElement('a');
    link.href = apod.url;
    link.textContent = 'Open this APOD video in a new tab';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    modalImageContainer.appendChild(link);
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}
