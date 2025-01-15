import { useOutletContext } from 'react-router-dom'
import NewRecordModal from './Model'
import { useCallback, useEffect, useState } from 'react'
import { useClinicData } from '../Hooks/useClinic.js'
import { useRecord } from '../Hooks/useRecord.js'
import { useGlobalMessage } from '../Context/MessageContext'
import { Modal } from 'antd'
import Table from './Table'
import TimeLine from './TImeLine'

const Page = () => {
	const message = useGlobalMessage()
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
	} = useRecord()
	const [isOpen, setIsOpen] = useState(false)
	const [openLog, setOpenLog] = useState(false)
	const [logs, setLogs] = useState({})
	const { setOpenModal } = useOutletContext()
	const { clinicNames } = useClinicData({})

	const handleOpenModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	const handleRecordSubmit = data => {
		checkRecordMutate(data, {
			onSuccess: () => {
				newRecordMutate(data, {
					onSuccess: () => {
						message.success('Record Created')
						refetch()
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
								onSuccess: () => {
									message.success('Record created')
									refetch()
								}
							})
						}
					})
				}
			}
		})
	}

	useEffect(() => {
		setOpenModal(() => handleOpenModal)
		return () => setOpenModal(null)
	}, [setOpenModal, handleOpenModal])

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
				message.error('Atleast one record should be there or else try deleting entire record')
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
				message.error('Atleast one Type should be there or else try deleting entire record')
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

	return (
		<div className="">
			<Table
				data={Records || []}
				isLoading={isRecordLoading}
				onEdit={handleEdit}
				onDelete={handleDelete}
				handleTrayStatusChange={handleTrayStatusChange}
				handleTrayTypeStatusChange={handleTrayTypeStatusChange}
				handleAddTay={handleAddTrayMutate}
				handleDeleteTray={handleDeleteTray}
				handleDeleteTrayType={handleDeleteTrayType}
				handleRecordLogs={handleRecordLogsFn}
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
