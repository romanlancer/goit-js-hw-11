import cardsTpl from '../templates/cards.hbs';
import Notiflix from 'notiflix';
import PicturesApiService from './fetch_api';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const picturesApiService = new PicturesApiService();

const searchForm = document.querySelector('#search-form');
const picturesContainer = document.querySelector('.gallery');
const guardian = document.querySelector('#guardian');
const spinner = document.querySelector('.spinner-border');

Notiflix.Notify.init({
	position: 'top-right',
	width: '400px',
	fontSize: '18px',
});

const lightbox = new SimpleLightbox('.gallery a', {
	captionsData: 'alt',
	captionDelay: 250,
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
	spinner.classList.remove('is-hidden');

	picturesApiService.fetchPictures().then(pictures => {
		if (pictures.data.totalHits !== 0 && pictures.data.hits.length !== 0) {
			Notiflix.Notify.success(
				`Hooray! We found ${pictures.data.totalHits} images.`,
			);
		} else {
			Notiflix.Notify.failure(
				'Sorry, there are no images matching your search query. Please try again.',
			);
		}

		insertPicturesMarkup(pictures);
		picturesApiService.incrementPage();

		lightbox.refresh();
		spinner.classList.add('is-hidden');
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
			spinner.classList.remove('is-hidden');

			picturesApiService
				.fetchPictures()
				.then(pictures => {
					if (
						pictures.data.hits.length === 0 &&
						pictures.data.totalHits !== 0
					) {
						Notiflix.Notify.info(
							"We're sorry, but you've reached the end of search results.",
						);
					}

					insertPicturesMarkup(pictures);

					lightbox.refresh();
					picturesApiService.incrementPage();
					spinner.classList.add('is-hidden');
				})
				.catch(error => {
					spinner.classList.add('is-hidden');
					Notiflix.Notify.info(
						"We're sorry, but you've reached the end of search results.",
					);
				});
		}
	});
};

const observer = new IntersectionObserver(onEntry, {
	rootMargin: '150px',
});
observer.observe(guardian);
