import { useMutation, useQuery } from '@tanstack/react-query'
import { AppFn, UpdateAppFn, updateAppLogoFn } from '../App/apiFn.js'

export const useApp = () => {
	const {
		data: AppInfo,
		refetch,
		isError: isAppError
	} = useQuery({
		queryKey: ['app'],
		queryFn: AppFn,
		staleTime: Infinity
	})

	const { mutate: updateAppMutate } = useMutation({
		mutationFn: UpdateAppFn
	})

	const { mutate: updateAppLogoMutate } = useMutation({
		mutationFn: updateAppLogoFn
	})


	return {
		AppInfo,
		isAppError,
		refetch,
		updateAppMutate,
		updateAppLogoMutate
	}
}
