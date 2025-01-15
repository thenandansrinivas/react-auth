import { lazy, useCallback, useEffect, useState } from 'react'
import { Form } from 'antd'
import debounce from 'lodash/debounce'
import { useGlobalMessage } from '../Context/MessageContext'
import { generateClinicPDF } from './pdf.js'
import { useClinicData } from '../Hooks/useClinic.js'
import TableColumns from './TableColumns'
import { useOutletContext } from 'react-router-dom'
import Modal from './Modal'

const Table = lazy(() => import('./Table'))
const TableActions = lazy(() => import('./TableActions'))

const Page = () => {
	const [form] = Form.useForm()
	const message = useGlobalMessage()
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [isOpen, setIsOpen] = useState(false)
	const { setOpenModal } = useOutletContext()
	const [searchText, setSearchText] = useState('')
	const [editingKey, setEditingKey] = useState('')
	const [showSettings, setShowSettings] = useState(false)
	const [tableParams, setTableParams] = useState({
		page: '1',
		limit: '5'
	})

	const [visibleColumns, setVisibleColumns] = useState({
		name: true,
		address: true,
		phone: true,
		mail: true
	})

	const handleSuccess = msg => {
		message.success(msg)
		if (msg === 'Deleted All') {
			setSelectedRowKeys([])
		}
		if (msg === 'Updated') {
			setEditingKey('')
		}
	}

	const { clinicList, isLoading, removeClinic, removeBulkClinics, updateClinic, createNewClinicMutate, refetch } =
		useClinicData({
			searchText,
			tableParams,
			onSuccess: handleSuccess
		})

	const handleDownloadPDF = () => {
		const doc = generateClinicPDF(clinicList?.data, visibleColumns)
		doc.save('clinic-data.pdf')
		message.success('Downloaded')
	}

	const debouncedSearch = debounce(value => {
		if (value.length >= 3 || !value) {
			setSearchText(value)
			setTableParams(prev => ({ ...prev, page: '1' }))
		}
	}, 500)

	const handleTableChange = (pagination, filters, sorter) => {
		const newParams = {
			page: pagination.current.toString(),
			limit: pagination.pageSize.toString(),
			...(sorter.field && {
				sortField: sorter.field,
				sortOrder: sorter.order === 'descend' ? 'desc' : 'asc'
			})
		}
		setTableParams(newParams)
	}

	const handleDelete = id => {
		removeClinic(id)
	}

	const handleBulkDelete = () => {
		removeBulkClinics(selectedRowKeys)
	}

	const isEditing = record => record._id === editingKey

	const edit = record => {
		form.setFieldsValue({ ...record })
		setEditingKey(record._id)
	}

	const cancel = () => {
		setEditingKey('')
	}

	const save = async record => {
		try {
			const values = await form.validateFields()
			const changes = {}
			Object.keys(values).forEach(key => {
				if (values[key] !== record[key]) {
					changes[key] = values[key]
				}
			})
			updateClinic({ id: record._id, data: changes })
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo)
		}
	}

	const baseColumns = TableColumns({ isEditing, save, cancel, edit, handleDelete })

	const mergedColumns = baseColumns?.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: record => ({
				record,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record)
			})
		}
	})

	const visibleColumnsArray = mergedColumns.filter(col => col.key === 'actions' || visibleColumns[col.dataIndex])

	const handleOpenModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	useEffect(() => {
		setOpenModal(() => handleOpenModal)
		return () => setOpenModal(null)
	}, [setOpenModal, handleOpenModal])

	const handleFormSubmit = data => {
		createNewClinicMutate(data, {
			onSuccess: () => {
				refetch()
				setIsOpen(false)
				message.success('Created')
			}
		})
	}

	return (
		<>
			<div className="relative">
				<Table
					form={form}
					clinicList={clinicList}
					visibleColumnsArray={visibleColumnsArray}
					selectedRowKeys={selectedRowKeys}
					setSelectedRowKeys={setSelectedRowKeys}
					tableParams={tableParams}
					handleTableChange={handleTableChange}
					isLoading={isLoading}
					title={() => (
						<TableActions
							selectedRowKeys={selectedRowKeys}
							handleBulkDelete={handleBulkDelete}
							handleDownloadPDF={handleDownloadPDF}
							debouncedSearch={debouncedSearch}
							showSettings={showSettings}
							setShowSettings={setShowSettings}
							visibleColumns={visibleColumns}
							setVisibleColumns={setVisibleColumns}
						/>
					)}
				/>
			</div>

			<Modal open={isOpen} onCancel={() => setIsOpen(false)} onSubmit={handleFormSubmit} />
		</>
	)
}

export default Page
