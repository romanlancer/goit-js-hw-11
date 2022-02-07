import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

export default class PicturesApiService {
	constructor() {
		this.searchQuery = '';
		this.page = 1;
	}

	async fetchPictures() {
		try {
			const searchParams = new URLSearchParams({
				key: '25512826-4fc03a8129b56e35440cc764c',
				q: this.searchQuery,
				image_type: 'photo',
				per_page: 40,
				orientation: 'horizontal',
				page: this.page,
			});

			const url = `${BASE_URL}?${searchParams}`;

			const response = await axios.get(url);

			return response;
		} catch (error) {
			return error;
		}
	}

	incrementPage() {
		this.page += 1;
		
	}

	resetPage() {
		this.page = 1;
	}

	get query() {
		return this.searchQuery;
	}

	set query(newQuery) {
		this.searchQuery = newQuery;
	}
}


