
document.addEventListener('DOMContentLoaded', function () {
 
  initNotesSearch();
});




function initNotesSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const grid = document.getElementById('papersGrid');
  const noResults = document.getElementById('noResults');


  if (!searchInput || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.paper-card'));

  function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(function (card) {
      const subject = (card.dataset.subject || '').toLowerCase();
      const heading = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const isMatch = query === '' || subject.includes(query) || heading.includes(query);

      card.style.display = isMatch ? '' : 'none';
      if (isMatch) visibleCount++;
    });


    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }


  searchInput.addEventListener('input', filterCards);


  if (searchBtn) {
    searchBtn.addEventListener('click', filterCards);
  }


  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterCards();
    }
  });
}



