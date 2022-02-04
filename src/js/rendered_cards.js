import cardsTpl from '../templates/cards.hbs';
import Notiflix from 'notiflix';
import PicturesApiService from './fetch_api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const picturesApiService = new PicturesApiService();

const searchForm = document.querySelector('#search-form');
const picturesContainer = document.querySelector('.gallery');
const guardian = document.querySelector('#guardian');

Notiflix.Notify.init({
	position: 'top-right',
	width: '400px',
	fontSize: '18px',
});

searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
	e.preventDefault();
	picturesApiService.query = e.currentTarget.elements.searchQuery.value;

	if (picturesApiService.query === '') {
		return Notiflix.Notify.failure('Wrong attempt bro, please enter something');
	}

	picturesApiService.resetPage();
	clearPicturesContainer();

	picturesApiService.fetchPictures().then(pictures => {
		console.log(pictures.data.totalHits);
		if (pictures.data.totalHits !== 0) {
			Notiflix.Notify.success(
				`Hooray! We found ${pictures.data.totalHits} images.`,
			);
		}

		if (pictures.data.hits.length === 0) {
			return Notiflix.Notify.failure(
				'Sorry, there are no images matching your search query. Please try again.',
			);
		}
		insertPicturesMarkup(pictures);
		picturesApiService.incrementPage();
		const lightbox = new SimpleLightbox('.gallery a', {
			captionsData: 'alt',
			captionDelay: 250,
		});
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
			picturesApiService.fetchPictures().then(pictures => {
				insertPicturesMarkup(pictures);
				const lightbox = new SimpleLightbox('.gallery a', {
					captionsData: 'alt',
					captionDelay: 250,
				});
				lightbox.refresh();
				picturesApiService.incrementPage();
			});
		}
	});
};

const observer = new IntersectionObserver(onEntry, {
	rootMargin: '150px',
});
observer.observe(guardian);
