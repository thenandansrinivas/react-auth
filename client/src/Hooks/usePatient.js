import { useMutation, useQuery } from '@tanstack/react-query'
import { PatientFn, RemovePatientFn, UpdatePatientFn, createNewPatientFn } from '../Patient/apiFn.js'

export const usePatient = (params = {}) => {
	const queryParams = {
		search: params.search || '',
		page: params.page || 1,
		limit: params.limit || 5,
		name: params.letter !== 'all' ? `^${params.letter}` : '',
		phone: params.phone || '',
		gender: params.gender || '',
		age: parseInt(params.age) || '',
		clinic: params.clinic || '',
		sortBy: params.sortBy || 'createdAt',
		orderBy: params.orderBy || 'desc'
	}

	const {
		data: response,
		isLoading,
		refetch
	} = useQuery({
		queryKey: ['patient', queryParams],
		queryFn: () => PatientFn(queryParams)
	})

	const { mutate: removePatientMutate } = useMutation({
		mutationFn: RemovePatientFn
	})

	const { mutate: updatePatientMutate } = useMutation({
		mutationFn: UpdatePatientFn
	})

	const { mutate: createPatientMutate } = useMutation({
		mutationFn: createNewPatientFn
	})

	return {
		data: response?.data || [],
		pagination: response?.pagination || {
			currentPage: 1,
			totalItems: 0,
			totalPage: 0,
			hasNextPage: false,
			hasPrevPage: false
		},
		sort: response?.sort || {
			sortBy: 'createdAt',
			orderBy: 'desc'
		},
		isLoading,
		refetch,
		removePatientMutate,
		updatePatientMutate,
		createPatientMutate
	}
}
