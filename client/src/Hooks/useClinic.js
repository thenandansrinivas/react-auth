import { useMutation, useQuery } from '@tanstack/react-query'
import {
	ClinicFn,
	RemoveClinicFn,
	BulkRemoveClinicFn,
	UpdateClinicFn,
	ClinicNamesFn,
	createNewClinic
} from '../Clinic/apiFn.js'

export const useClinicData = ({ searchText, tableParams, onSuccess }) => {
	// Query for fetching clinic data
	const {
		data: clinicList,
		isLoading,
		refetch
	} = useQuery({
		queryKey: ['clinic', searchText, tableParams],
		queryFn: () =>
			ClinicFn({
				...tableParams,
				...(searchText && {
					name: searchText,
					phone: searchText,
					mail: searchText
				})
			})
	})

	const { data: clinicNames } = useQuery({
		queryKey: ['clinicNames'],
		queryFn: ClinicNamesFn
	})

	// Mutation for deleting a single clinic
	const { mutate: removeClinic } = useMutation({
		mutationFn: RemoveClinicFn,
		onSettled: () => {
			onSuccess('Deleted')
			refetch()
		}
	})

	// Mutation for bulk deleting clinics
	const { mutate: removeBulkClinics } = useMutation({
		mutationFn: BulkRemoveClinicFn,
		onSettled: () => {
			onSuccess('Deleted All')
			refetch()
		}
	})

	// Mutation for updating clinic
	const { mutate: updateClinic } = useMutation({
		mutationFn: ({ id, data }) => UpdateClinicFn({ id, data }),
		onSettled: () => {
			onSuccess('Updated')
			refetch()
		}
	})

	const { mutate: createNewClinicMutate } = useMutation({
		mutationFn: createNewClinic
	})

	return {
		refetch,
		clinicNames,
		clinicList,
		isLoading,
		removeClinic,
		removeBulkClinics,
		updateClinic,
		createNewClinicMutate
	}
}
