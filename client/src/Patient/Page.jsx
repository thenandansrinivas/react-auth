import { usePatient } from '../hooks/usePatient'
import { Table as AntTable, Input, Button, Space, Select, DatePicker, Popover, Switch, Popconfirm } from 'antd'
import {
	SearchOutlined,
	CloseOutlined,
	EditOutlined,
	DeleteOutlined,
	CheckOutlined,
	CloseCircleOutlined,
	SettingOutlined
} from '@ant-design/icons'
import { useState, useCallback, useEffect } from 'react'
import { debounce } from 'lodash'
import dayjs from 'dayjs'
import { useGlobalMessage } from '../context/MessageContext'
import { useClinicData } from '../Hooks/useClinic.js'
import { format, formatDistance } from 'date-fns'
import { useOutletContext } from 'react-router-dom'
import Modal from './Modal.jsx'

const Page = () => {
	const message = useGlobalMessage()
	const [isOpen, setIsOpen] = useState(false)
	const { setOpenModal } = useOutletContext()
	const { clinicNames } = useClinicData({})
	const [filters, setFilters] = useState({
		search: '',
		page: 1,
		limit: 10,
		letter: 'all',
		clinic: '' // Added clinic filter
	})
	const clinics = clinicNames || []

	const [searchTerm, setSearchTerm] = useState('')
	const [editingKey, setEditingKey] = useState('')
	const [editedData, setEditedData] = useState({})
	const [visibleColumns, setVisibleColumns] = useState({
		name: true,
		dob: true,
		age: true,
		gender: true,
		clinic: true,
		phone: true
	})

	const { data, pagination, isLoading, removePatientMutate, refetch, updatePatientMutate, createPatientMutate } =
		usePatient(filters)

	// Handler for clinic filter change
	const handleClinicChange = value => {
		setFilters(prev => ({
			...prev,
			clinic: value,
			page: 1
		}))
	}

	const isEditing = record => record._id === editingKey

	const edit = record => {
		setEditingKey(record._id)
		setEditedData({ ...record })
	}

	const cancel = () => {
		setEditingKey('')
		setEditedData({})
	}

	const save = record => {
		// Create an object with only the changed fields
		const changedData = {}

		// Compare each field and add only the changed ones
		Object.keys(editedData).forEach(key => {
			if (key === 'clinic' && editedData[key]?._id !== record[key]?._id) {
				changedData[key] = editedData[key]._id
			} else if (editedData[key] !== record[key]) {
				changedData[key] = editedData[key]
			}
		})

		updatePatientMutate(
			{ id: record._id, data: changedData },
			{
				onSettled: () => {
					refetch()
					message.success('Updated')
				}
			}
		)

		setEditingKey('')
		setEditedData({})
	}

	const handleEdit = (key, value, record) => {
		setEditedData(prev => ({
			...prev,
			[key]: value
		}))
	}

	// Debounced search
	const debouncedSearch = useCallback(
		debounce(value => {
			setFilters(prev => ({
				...prev,
				search: value,
				page: 1
			}))
		}, 500),
		[]
	)

	useEffect(() => {
		return () => {
			debouncedSearch.cancel()
		}
	}, [debouncedSearch])

	const handleSearch = e => {
		const value = e.target.value
		setSearchTerm(value)
		debouncedSearch(value)
	}

	const clearSearch = () => {
		setSearchTerm('')
		setFilters(prev => ({
			...prev,
			search: '',
			page: 1
		}))
		debouncedSearch.cancel()
	}

	const handleLetterFilter = letter => {
		setFilters(prev => ({
			...prev,
			letter,
			page: 1
		}))
	}

	const handleTableChange = (pagination, filters, sorter) => {
		setFilters(prev => ({
			...prev,
			page: pagination.current,
			limit: pagination.pageSize,
			sortBy: sorter.field || 'createdAt',
			orderBy: sorter.order === 'ascend' ? 'asc' : 'desc'
		}))
	}

	const handleDeletePatient = record => {
		removePatientMutate(record, {
			onSuccess: () => {
				message.success('Deleted')
				refetch()
			}
		})
	}

	const handleOpenModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	useEffect(() => {
		setOpenModal(() => handleOpenModal)
		return () => setOpenModal(null)
	}, [setOpenModal, handleOpenModal])

	const alphabet = [
		'all',
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	]

	const allColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: true,
			render: (text, record) => {
				const editing = isEditing(record)
				return editing ? (
					<Input value={editedData.name} onChange={e => handleEdit('name', e.target.value, record)} />
				) : (
					text
				)
			},
			width: 150,
			fixed: 'left'
		},
		{
			title: 'DOB',
			dataIndex: 'dob',
			key: 'dob',
			render: (text, record) => {
				const editing = isEditing(record)
				return editing ? (
					<DatePicker
						value={dayjs(editedData.dob)}
						onChange={date => handleEdit('dob', date?.toISOString(), record)}
					/>
				) : record?.dob ? (
					format(new Date(record?.dob), 'dd/MM/yyyy')
				) : (
					''
				)
			}
		},
		{
			title: 'Age',
			dataIndex: ['age', 'dob'],
			key: 'age',
			width: 150,
			render: (text, record) => {
				const editing = isEditing(record)
				return editing ? (
					<Input
						type="number"
						value={editedData.age}
						onChange={e => handleEdit('age', e.target.value, record)}
					/>
				) : record?.age ? (
					`About ${record?.age} Years`
				) : (
					formatDistance(new Date(record?.dob), new Date())
				)
			}
		},
		{
			title: 'Gender',
			dataIndex: 'gender',
			key: 'gender',
			render: (text, record) => {
				const editing = isEditing(record)
				return editing ? (
					<Select
						value={editedData.gender}
						onChange={value => handleEdit('gender', value, record)}
						style={{ width: '100%' }}>
						<Select.Option value="male">Male</Select.Option>
						<Select.Option value="female">Female</Select.Option>
					</Select>
				) : (
					text
				)
			}
		},
		{
			title: 'Clinic',
			dataIndex: ['clinic', 'name'],
			key: 'clinic',
			render: (text, record) => {
				const editing = isEditing(record)
				return editing ? (
					<Select
						value={editedData.clinic?._id}
						onChange={(value, option) => {
							const selectedClinic = clinics.find(c => c._id === value)
							handleEdit('clinic', selectedClinic, record)
						}}
						style={{ width: '100%' }}
						className="capitalize">
						{clinics.map(clinic => (
							<Select.Option key={clinic._id} value={clinic._id} className="capitalize">
								{clinic.name}
							</Select.Option>
						))}
					</Select>
				) : (
					<span className="capitalize">{text}</span>
				)
			}
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
			key: 'phone',
			render: (text, record) => {
				const editing = isEditing(record)
				return editing ? (
					<Input
						value={editedData.phone}
						onChange={e => handleEdit('phone', e.target.value, record)}
						maxLength={10}
					/>
				) : (
					text
				)
			}
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => {
				const editing = isEditing(record)
				return editing ? (
					<Space>
						<Popconfirm onConfirm={() => save(record)} title="Sure to save ?" okText="Yes" cancelText="No">
							<Button type="link" icon={<CheckOutlined />} />
						</Popconfirm>
						<Button type="link" icon={<CloseCircleOutlined />} onClick={cancel} className="text-red-500" />
					</Space>
				) : (
					<Space>
						<Button
							type="link"
							icon={<EditOutlined />}
							onClick={() => edit(record)}
							disabled={editingKey !== ''}
						/>
						<Popconfirm
							title="Are you sure ?"
							okText="Yes"
							cancelText="No"
							onConfirm={() => handleDeletePatient(record._id)}>
							<Button type="link" icon={<DeleteOutlined />} className="text-red-500" />
						</Popconfirm>
					</Space>
				)
			}
		}
	]

	// Column settings content
	const ColumnSettings = () => (
		<div className="min-w-[200px]">
			<div className="flex flex-col gap-2">
				{Object.keys(visibleColumns).map(column => (
					<div key={column} className="flex justify-between items-center">
						<span className="capitalize">{column}</span>
						<Switch
							checked={visibleColumns[column]}
							size="small"
							onChange={checked =>
								setVisibleColumns(prev => ({
									...prev,
									[column]: checked
								}))
							}
						/>
					</div>
				))}
			</div>
		</div>
	)

	// Filter columns based on visibility
	const activeColumns = allColumns.filter(col => {
		if (col.key === 'action') return true // Always show action column
		return visibleColumns[col.key]
	})

	const handleFormSubmit = data =>
		createPatientMutate(data, {
			onSuccess: () => {
				refetch()
				setIsOpen(false)
				message.success('Created')
			}
		})

	return (
		<>
			<div className="flex flex-col gap-4 ">
				{/* Search, Clinic Filter, and Settings Section */}
				<div className="flex justify-between w-full gap-2 items-center">
					<Select
						className="min-w-[200px] capitalize border-0"
						size="large"
						placeholder="Select Clinic"
						value={filters.clinic}
						onChange={handleClinicChange}>
						<Select.Option value="">All</Select.Option>
						{clinics.map(clinic => (
							<Select.Option key={clinic._id} value={clinic._id} className="capitalize">
								{clinic.name}
							</Select.Option>
						))}
					</Select>
					<div className="flex gap-2 items-center">
						<div className="relative w-full max-w-md">
							<Input
								size="large"
								placeholder="Search patients..."
								prefix={<SearchOutlined />}
								onChange={handleSearch}
								value={searchTerm}
								suffix={
									searchTerm ? (
										<CloseOutlined onClick={clearSearch} className="cursor-pointer" />
									) : null
								}
							/>
						</div>
						<Popover placement="bottomRight" content={<ColumnSettings />} trigger="click">
							<Button icon={<SettingOutlined />} size="large" />
						</Popover>
					</div>
				</div>

				{/* Alphabet Filter */}
				<div className="w-full flex justify-center">
					<div className="w-full overflow-x-auto scrollbar-hide">
						<div className="flex justify-center min-w-max pb-2 px-4">
							{alphabet.map(letter => (
								<Button
									key={letter}
									type={filters.letter === letter ? 'primary' : 'default'}
									onClick={() => handleLetterFilter(letter)}
									className={`min-w-[40px] uppercase mx-1 ${
										filters.letter === letter ? 'bg-blue-500' : ''
									}`}>
									{letter}
								</Button>
							))}
						</div>
					</div>
				</div>

				{/* Table Section */}
				<div className="w-full">
					<AntTable
						tableLayout="auto"
						bordered
						className="capitalize"
						loading={isLoading}
						dataSource={data}
						columns={activeColumns}
						rowKey="_id"
						pagination={{
							current: pagination.currentPage,
							pageSize: filters.limit,
							total: pagination.totalItems,
							showQuickJumper: true,
							showPrevNextJumpers: true,
							pageSizeOptions: ['5', '10', '20', '50', '100', `${pagination.totalItems}`],
							showTotal: total => `Total ${total} patients`
						}}
						onChange={handleTableChange}
						scroll={{ x: 'max-content', y: 'calc(100vh - 500px)' }}
					/>
				</div>
			</div>
			<Modal open={isOpen} onCancel={() => setIsOpen(false)} clinics={clinicNames} onSubmit={handleFormSubmit} />
		</>
	)
}

export default Page
