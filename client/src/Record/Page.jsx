import { useOutletContext } from 'react-router-dom'
import NewRecordModal from './Model'
import { useCallback, useEffect, useState } from 'react'
import { useClinicData } from '../Hooks/useClinic.js'
import { useRecord } from '../Hooks/useRecord.js'
import { useGlobalMessage } from '../Context/MessageContext'
import { Flex, Input, Modal, Select } from 'antd'
import Table from './Table'
import TimeLine from './TImeLine'
import { debounce } from 'lodash'

const Page = () => {
	const message = useGlobalMessage()
	const [searchInput, setSearchInput] = useState('')
	const [apiFilters, setApiFilters] = useState({
		status: '',
		clinic: '',
		search: '',
		gender: '',
		page: 1,
		limit: 5,
		sortBy: 'createdAt',
		orderBy: 'desc'
	})

	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalItems: 0,
		totalPages: 0,
		itemsPerPage: 5,
		hasNextPage: false,
		hasPrevPage: false
	})

	const {
		Records,
		isRecordLoading,
		checkRecordMutate,
		newRecordMutate,
		updateTrayStatusMutate,
		updateTrayTypeStatusMutate,
		completeRecordMutate,
		removeRecordMutate,
		refetch,
		addTrayMutate,
		removeTrayMutate,
		deleteTrayTypeMutate,
		displayLogsMutate
	} = useRecord(apiFilters)

	const [isOpen, setIsOpen] = useState(false)
	const [openLog, setOpenLog] = useState(false)
	const [logs, setLogs] = useState({})
	const { setOpenModal } = useOutletContext()
	const { clinicNames } = useClinicData({})

	// Update pagination when Records data changes
	useEffect(() => {
		if (Records?.pagination) {
			setPagination(Records.pagination)
		}
	}, [Records])

	const handleOpenModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	const debouncedSearch = debounce(searchTerm => {
		setApiFilters(prev => ({
			...prev,
			search: searchTerm,
			page: 1 // Reset to first page on new search
		}))
	}, 500)

	const handleFilterChange = (key, value) => {
		setApiFilters(prev => ({
			...prev,
			[key]: value,
			page: 1 // Reset to first page on filter change
		}))
	}

	const handleSearchChange = useCallback(e => {
		const newValue = e.target.value
		setSearchInput(newValue)
		debouncedSearch(newValue)
	}, [])

	const handleSearchSubmit = useCallback(
		e => {
			if (e.key === 'Enter') {
				debouncedSearch.cancel()
				setApiFilters(prev => ({
					...prev,
					search: searchInput,
					page: 1
				}))
			}
		},
		[searchInput]
	)

	const handlePageChange = (page, pageSize) => {
		setApiFilters(prev => ({
			...prev,
			page,
			limit: pageSize
		}))
	}

	const handleSortChange = (sortField, sortOrder) => {
		setApiFilters(prev => ({
			...prev,
			sortBy: sortField,
			orderBy: sortOrder === 'ascend' ? 'asc' : 'desc'
		}))
	}

	useEffect(() => {
		setOpenModal(() => handleOpenModal)
		return () => setOpenModal(null)
	}, [setOpenModal, handleOpenModal])

	useEffect(() => {
		return () => {
			debouncedSearch.cancel()
		}
	}, [])

	const handleRecordSubmit = data => {
		checkRecordMutate(data, {
			onSuccess: () => {
				newRecordMutate(data, {
					onSettled: () => {
						refetch()
					},
					onSuccess: () => {
						message.success('Record Created')
					}
				})
			},
			onError: error => {
				if (error.status === 409) {
					Modal.confirm({
						title: 'Active Record Exists',
						content:
							'There is already an active record for this patient. Do you want to create a new record anyway?',
						onOk: () => {
							newRecordMutate(data, {
								onSettled: () => {
									refetch()
								},
								onSuccess: () => {
									message.success('Record created')
								}
							})
						}
					})
				}
			}
		})
	}

	const handleEdit = record => {
		completeRecordMutate(record, {
			onSuccess: () => {
				message.success('Record Completed')
				refetch()
			}
		})
	}

	const handleDelete = record => {
		removeRecordMutate(record, {
			onSuccess: () => {
				message.success('Deleted')
				refetch()
			}
		})
	}

	const handleTrayStatusChange = (parentId, trayId, field, checked, remarks) => {
		updateTrayStatusMutate(
			{
				rid: parentId,
				tid: trayId,
				field,
				status: checked,
				remarks
			},
			{
				onSuccess: () => {
					message.success('Updated')
					refetch()
				}
			}
		)
	}

	const handleTrayTypeStatusChange = (parentId, trayId, trayTypeId, checked) => {
		updateTrayTypeStatusMutate(
			{ rid: parentId, tid: trayId, type: trayTypeId, status: checked },
			{
				onSuccess: () => {
					message.success('Updated')
					refetch()
				}
			}
		)
	}

	const handleAddTrayMutate = data => {
		addTrayMutate(data, {
			onSuccess: () => {
				message.success('Tray Added')
				refetch()
			}
		})
	}

	const handleDeleteTray = data => {
		removeTrayMutate(data, {
			onSuccess: () => {
				message.success('Tray Deleted')
				refetch()
			},
			onError: () => {
				message.error('At least one record should be there or else try deleting entire record')
				refetch()
			}
		})
	}

	const handleDeleteTrayType = data => {
		deleteTrayTypeMutate(data, {
			onSuccess: () => {
				message.success('Tray Type Deleted')
				refetch()
			},
			onError: () => {
				message.error('At least one Type should be there or else try deleting entire record')
				refetch()
			}
		})
	}

	const handleRecordLogsFn = data => {
		displayLogsMutate(data, {
			onSuccess: res => {
				setLogs(res)
				setOpenLog(true)
			}
		})
	}

	const handleCloseLog = () => {
		setOpenLog(false)
		setLogs({})
	}

	const handleTableChange = (field, order, page, pageSize) => {
		setApiFilters(prev => ({
			...prev,
			sortBy: field || prev.sortBy,
			orderBy: order || prev.orderBy,
			page: page || prev.page,
			limit: pageSize || prev.limit
		}))
	}

	return (
		<div className="">
			<Flex gap={10} justify="space-between" className="my-4">
				<Flex gap={10}>
					<Select
						showSearch
						value={apiFilters.status}
						onChange={value => handleFilterChange('status', value)}
						options={[
							{ value: '', label: 'All' },
							{ value: 'active', label: 'Active' },
							{ value: 'reopened', label: 'Reopened' },
							{ value: 'completed', label: 'Completed' }
						]}
						size="large"
						style={{ width: 200 }}
						allowClear
					/>
					<Select
						showSearch
						value={apiFilters.clinic}
						onChange={value => handleFilterChange('clinic', value)}
						options={[
							{ value: '', label: 'All' },
							...(clinicNames || []).map(clinic => ({
								value: clinic._id,
								label: clinic.name
							}))
						]}
						size="large"
						style={{ width: 200 }}
						allowClear
					/>
				</Flex>
				<Flex>
					<Input
						value={searchInput}
						onChange={handleSearchChange}
						onPressEnter={handleSearchSubmit}
						placeholder="Search..."
						className="mr-2"
						size="large"
						allowClear
					/>
					<Select
						showSearch
						value={apiFilters.gender}
						onChange={value => handleFilterChange('gender', value)}
						options={[
							{ value: '', label: 'All' },
							{ value: 'male', label: 'Male' },
							{ value: 'female', label: 'Female' }
						]}
						size="large"
						style={{ width: 200 }}
						allowClear
					/>
				</Flex>
			</Flex>
			<Table
				data={Records?.data || []}
				isLoading={isRecordLoading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				handleTrayStatusChange={handleTrayStatusChange}
				handleTrayTypeStatusChange={handleTrayTypeStatusChange}
				handleAddTay={handleAddTrayMutate}
				handleDeleteTray={handleDeleteTray}
				handleDeleteTrayType={handleDeleteTrayType}
				handleRecordLogs={handleRecordLogsFn}
				pagination={Records?.pagination}
				onSort={handleTableChange}
				sortField={apiFilters.sortBy}
				sortOrder={apiFilters.orderBy === 'asc' ? 'ascend' : 'descend'}
			/>
			<NewRecordModal
				clinics={clinicNames || []}
				onRecordSubmit={handleRecordSubmit}
				open={isOpen}
				onCancel={() => setIsOpen(false)}
				footer={null}
			/>
			<TimeLine data={logs} open={openLog} onCancel={handleCloseLog} />
		</div>
	)
}

export default Page
