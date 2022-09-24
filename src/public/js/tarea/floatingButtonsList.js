document.addEventListener('DOMContentLoaded', () => {
  const btnToggleList = document.querySelector('.btn-toggle-list');

  btnToggleList.addEventListener('click', () => {
    btnToggleList.classList.toggle('active-list');
  });

});