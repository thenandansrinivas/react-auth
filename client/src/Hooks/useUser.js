import { useMutation, useQuery } from '@tanstack/react-query'
import { updateUserFn, getUsersFn } from '../User/apiFn.js'

const useUser = (query = {}) => {
	const {
		data: Users,
		isLoading: isUserLoading,
		refetch
	} = useQuery({
		queryKey: ['users', query],
		queryFn: () => getUsersFn(query),
		staleTime: Infinity
	})

	const { mutate: UpdateUserMutate, isPending: isUpdatePending } = useMutation({
		mutationFn: updateUserFn,
		onSuccess: () => {
			refetch()
		}
	})

	return {
		Users,
		isUserLoading,
		refetch,
		UpdateUserMutate,
		isUpdatePending
	}
}

export default useUser
