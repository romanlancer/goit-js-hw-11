import cardsTpl from '../templates/cards.hbs';
import Notiflix from 'notiflix';
import PicturesApiService from './fetch_api';

const picturesApiService = new PicturesApiService();

const searchForm = document.querySelector('#search-form');
const picturesContainer = document.querySelector('.gallery');
const guardian = document.querySelector('#guardian');

Notiflix.Notify.init({
	position: 'center-center',
	width: '400px',
	fontSize: '18px',
});

searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
	e.preventDefault();
	picturesApiService.query = e.currentTarget.elements.searchQuery.value;

	if (picturesApiService.query === '') {
		return Notiflix.Notify.failure('Введи что-то нормальное');
	}

	picturesApiService.resetPage();
	clearPicturesContainer();
	picturesApiService.fetchPictures().then(pictures => {
		console.log(pictures);
		insertPicturesMarkup(pictures);
		picturesApiService.incrementPage();
	});
}

function insertPicturesMarkup(pictures) {
	picturesContainer.insertAdjacentHTML('beforeend', cardsTpl(pictures));
}

function clearPicturesContainer() {
	picturesContainer.innerHTML = '';
}

const onEntry = entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting && picturesApiService.query !== '') {
			// console.log('Пора грузить еще статьи' + Date.now());
			picturesApiService.fetchPictures().then(pictures => {
				insertPicturesMarkup(pictures);
				picturesApiService.incrementPage();
			});
		}
	});
};

const observer = new IntersectionObserver(onEntry, {
	rootMargin: '150px',
});
observer.observe(guardian);
