/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
	pjax: import('./plugin/pjax').PjaxInstance;
	topbar: import('./plugin/topbar').TopbarInstance;
	ViewImage: import('./plugin/view-image').ViewImageInstance;
	pagefind: {
		search: (query: string) => Promise<{
			results: Array<{
				id: string;
				data: () => Promise<{
					url: string;
					content: string;
					meta: Record<string, any>;
				}>;
			}>;
		}>;
	};
}