import { QueryClient } from '@tanstack/react-query'

export const qC = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 2
		}
	}
})
