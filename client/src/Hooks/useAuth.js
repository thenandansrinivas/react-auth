import { useMutation, useQuery } from '@tanstack/react-query'
import { logoutFn, meFn } from '../Auth/apiFn.js'

const useAuth = () => {
	const { data: Me, isLoading: authLoading } = useQuery({
		queryKey: ['auth'],
		queryFn: meFn,
		retry: 1,
		staleTime: Infinity
	})

	const { mutate: logoutMutate, isPending: isLogOutPending } = useMutation({
		mutationFn: logoutFn
	})

	return { Me, authLoading, logoutMutate, isLogOutPending }
}

export default useAuth
