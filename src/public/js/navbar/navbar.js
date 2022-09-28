document.addEventListener('DOMContentLoaded', () => {
  const
    navBar = document.querySelector('#navBar'),
    list = document.querySelectorAll('.list'),
    inpView = document.querySelector('#inpView');

  navBar.style.display = 'flex';

  // * para darle la clase active a los elementos del navbar (pa que salga el circulo verde)
  navBar.addEventListener('click', (e) => {
    console.log(e.target);
    if (e.target && e.target.classList.contains('list')) {
      list.forEach(elem => {
        elem.classList.remove('active');
      });
      e.target.classList.add('active');
    }

    // ** en caso de que le den click al icono
    if (e.target && e.target.tagName === 'I') {
      const padre = e.target.parentElement.parentElement.parentElement; // para apuntar a '.list' xD
      if (padre.classList.contains('list')) {
        padre.click();
      }
    }

    if (e.target && e.target.tagName === 'SPAN') {
      const padre = e.target.parentElement.parentElement;
      if (padre.classList.contains('list')) {
        padre.click();
      }
    }
  });

  // * para dependiendo de la vista se ponga solo el circulo verde

  if (inpView) {
    const view = inpView.value;

    if (view === 'viewHome') document.querySelector('#itemHome').classList.add('active');
    if (view === 'viewEditTarea') document.querySelector('#itemHome').classList.add('active');
    if (view === 'viewInforme') document.querySelector('#itemInforme').classList.add('active');
    if (view === 'viewAddCate') document.querySelector('#itemAddCate').classList.add('active');
    if (view === 'viewEditCate') document.querySelector('#itemEditCate').classList.add('active');
    if (view === 'viewConfig') document.querySelector('#itemConfig').classList.add('active');
  } else {
    Toast.fire({ icon: 'error', title: 'Informar al dev error de navbar' });
  }


});