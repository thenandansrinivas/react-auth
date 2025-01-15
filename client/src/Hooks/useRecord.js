import { useMutation, useQuery } from '@tanstack/react-query'
import {
	CheckRecordFn,
	newRecordFn,
	RecordFn,
	updateTrayStatusFn,
	updateTrayTypeStatusFn,
	completeRecordFn,
	deleteRecordFn,
	addTrayFn,
	deleteTrayFn,
	deleteTrayTypeFn,
	displayLogsFn,
	reportGenFn
} from '../Record/apiFn.js'

export const useRecord = () => {
	const {
		data: Records,
		isLoading: isRecordLoading,
		refetch
	} = useQuery({
		queryKey: ['record'],
		queryFn: RecordFn
	})
	const { mutate: checkRecordMutate } = useMutation({
		mutationFn: CheckRecordFn
	})

	const { mutate: newRecordMutate } = useMutation({
		mutationFn: newRecordFn
	})

	const { mutate: updateTrayStatusMutate } = useMutation({
		mutationFn: updateTrayStatusFn
	})

	const { mutate: updateTrayTypeStatusMutate } = useMutation({
		mutationFn: updateTrayTypeStatusFn
	})

	const { mutate: completeRecordMutate } = useMutation({
		mutationFn: completeRecordFn
	})

	const { mutate: removeRecordMutate } = useMutation({
		mutationFn: deleteRecordFn
	})

	const { mutate: addTrayMutate } = useMutation({
		mutationFn: addTrayFn
	})

	const { mutate: removeTrayMutate } = useMutation({
		mutationFn: deleteTrayFn
	})

	const { mutate: deleteTrayTypeMutate } = useMutation({
		mutationFn: deleteTrayTypeFn
	})

	const { mutate: displayLogsMutate } = useMutation({
		mutationFn: displayLogsFn
	})

	const { mutate: reportGenMutate, isPending: isReportPending } = useMutation({
		mutationFn: reportGenFn
	})

	return {
		refetch,
		Records,
		isRecordLoading,
		checkRecordMutate,
		newRecordMutate,
		updateTrayStatusMutate,
		updateTrayTypeStatusMutate,
		removeRecordMutate,
		completeRecordMutate,
		addTrayMutate,
		removeTrayMutate,
		deleteTrayTypeMutate,
		displayLogsMutate,
		reportGenMutate,
		isReportPending
	}
}
