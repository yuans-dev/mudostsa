import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	throw redirect(307, 'https://forms.gle/VF8CTRrdXGZ6d7SK6');
	const renewal = url.searchParams.get('renewal');
	return { title: `Apply`, renewal: renewal ?? null };
};
