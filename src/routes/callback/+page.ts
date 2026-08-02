import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(403, 'Forbidden');
	}

	return {
		code
	};
};
