import { useState } from 'react'
import { Table as AntTable, Card, Flex, Popover, Switch, Select, Badge, Modal, Input, Popconfirm } from 'antd'
import { CircleCheckBig, CirclePlus, CircleX, Clock, GitPullRequestArrow, Trash2 } from 'lucide-react'
import classNames from 'classnames'
import { format, formatDistance } from 'date-fns'

const Table = ({
	data,
	isLoading,
	onEdit,
	onDelete,
	handleTrayStatusChange,
	handleTrayTypeStatusChange,
	handleAddTay,
	handleDeleteTray,
	handleDeleteTrayType,
	handleRecordLogs,
	pagination,
	onSort,
	sortField,
	sortOrder
}) => {
	const [expandedRowKeys, setExpandedRowKeys] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [remarks, setRemarks] = useState('')
	const [pendingStatusChange, setPendingStatusChange] = useState(null)
	const [isTrayModalOpen, setIsTrayModalOpen] = useState(false)
	const [trayNumber, setTrayNumber] = useState('')
	const [selectedRecord, setSelectedRecord] = useState(null)
	const TimeDisplay = ({ timeline, action }) => {
		const timeEntry = timeline?.find(item => item.action === action)

		if (!timeEntry?.time) return null

		return (
			<div className="text-xs text-gray-500 mt-1">
				{format(new Date(timeEntry.time), 'do MMM yyyy h:mm a')}
				<span className="ml-1">
					({formatDistance(new Date(timeEntry.time), new Date(), { addSuffix: true })})
				</span>
			</div>
		)
	}

	const StatusSelect = ({ value, onChange, disabled, previousStepDone, currentStepDone }) => {
		const isDisabled = disabled || !previousStepDone || currentStepDone

		return (
			<Select
				value={value ? 'done' : 'pending'}
				onChange={onChange}
				disabled={isDisabled}
				className="w-fit"
				size="small"
				options={[
					{ value: 'pending', label: 'Pending' },
					{ value: 'done', label: 'Done' }
				]}
			/>
		)
	}

	const handleTrayModalOpen = record => {
		setSelectedRecord(record)
		setIsTrayModalOpen(true)
	}

	const handleTrayModalOk = () => {
		handleAddTay({ rid: selectedRecord._id, num: trayNumber })
		setIsTrayModalOpen(false)
		setTrayNumber('')
		setSelectedRecord(null)
	}

	const handleTrayModalCancel = () => {
		setIsTrayModalOpen(false)
		setTrayNumber('')
		setSelectedRecord(null)
	}

	const renderPatientDetails = record => {
		return (
			<div className="capitalize font-semibold">
				<p>{record.name}</p>
				<p>{record.phone}</p>
				<p>{record.gender}</p>
				<p>{record?.age}</p>
				<p>{record?.dob}</p>
			</div>
		)
	}

	const handleStatusChange = (parentId, recordId, status, value) => {
		setPendingStatusChange({
			parentId,
			recordId,
			status,
			checked: value === 'done'
		})
		setIsModalOpen(true)
	}

	const handleModalOk = () => {
		if (pendingStatusChange) {
			const { parentId, recordId, status, checked } = pendingStatusChange
			handleTrayStatusChange(parentId, recordId, status, checked, remarks)
			setIsModalOpen(false)
			setRemarks('')
			setPendingStatusChange(null)
		}
	}

	const handleModalCancel = () => {
		setIsModalOpen(false)
		setRemarks('')
		setPendingStatusChange(null)
	}

	const handleDeleteTrayRecord = data => {
		handleDeleteTray(data)
	}

	const handleDeleteTrayTypeRecord = data => {
		handleDeleteTrayType(data)
	}

	const handleTableChange = (pag, filters, sorter, extra) => {
		const { field, order } = sorter
		if (extra.action === 'sort') {
			onSort(field, order === 'ascend' ? 'asc' : 'desc', pag.current, pag.pageSize)
		} else if (extra.action === 'paginate') {
			onSort(sortField, sortOrder === 'ascend' ? 'asc' : 'desc', pag.current, pag.pageSize)
		}
	}

	const Columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: true,
			sortOrder: sortField === 'name' ? sortOrder : null,
			width: 200,
			render: (name, record) => (
				<p className="text-sm font-medium text-gray-900 capitalize">
					<Popover content={renderPatientDetails(record)} placement="left" className="text-wrap">
						{name}
					</Popover>
				</p>
			)
		},
		{
			title: 'Phone',
			dataIndex: 'phone',
			key: 'phone',
			sorter: true,
			sortOrder: sortField === 'phone' ? sortOrder : null,
			width: 100,
			render: phone => <p className="text-sm font-medium text-gray-900 capitalize">{phone}</p>
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
			sorter: true,
			sortOrder: sortField === 'age' ? sortOrder : null,
			width: 50,
			render: (age, record) => (
				<p className="text-sm font-medium text-gray-900 capitalize">
					{record.age ? record.age : new Date().getFullYear() - new Date(record?.dob).getFullYear()}
				</p>
			)
		},
		{
			title: 'Clinic',
			dataIndex: ['clinic', 'name'],
			key: 'clinic.name',
			width: 100,
			render: name => <p className="text-sm font-medium text-gray-900 capitalize">{name}</p>
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: true,
			sortOrder: sortField === 'status' ? sortOrder : null,
			width: 50,
			render: status => (
				<p
					className={classNames(
						'text-sm font-semibold capitalize px-3 py-1 rounded-full w-fit',
						status === 'active'
							? 'bg-green-600 text-white'
							: status === 'completed'
								? 'bg-red-600 text-white'
								: 'bg-yellow-500 text-gray-900'
					)}>
					{status}
				</p>
			)
		},
		{
			title: 'Record',
			dataIndex: 'trays',
			key: 'trays',
			sorter: true,
			sortOrder: sortField === 'trays' ? sortOrder : null,
			width: 50,
			render: trays => <p className="text-sm font-medium text-gray-900 capitalize">{trays?.length}</p>
		},

		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			width: 50,
			render: (_, record) => (
				<div className="hover:cursor-pointer m-2">
					<Flex justify="space-around" align="center">
						<Clock
							onClick={() => {
								handleRecordLogs(record._id)
							}}
							size={20}
							className="hover:text-yellow-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150"
						/>

						<Popconfirm
							title="Are you sure?"
							okText="Yes"
							cancelText="No"
							onConfirm={() => onEdit({ rid: record._id, status: 'reopened' })}
							className={classNames(record.status === 'completed' ? '' : 'hidden')}>
							<GitPullRequestArrow
								size={20}
								className="hover:text-blue-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150"
							/>
						</Popconfirm>

						<CirclePlus
							size={20}
							onClick={e => {
								e.stopPropagation()
								handleTrayModalOpen(record)
							}}
							className={classNames(
								'hover:text-green-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150',
								record.status !== 'completed' ? '' : 'hidden'
							)}
						/>

						<Popconfirm
							title="Are you sure?"
							onConfirm={() => onEdit({ rid: record._id, status: 'completed' })}
							okText="Yes"
							cancelText="No"
							className={classNames(record.status !== 'completed' ? '' : 'hidden')}>
							<CircleCheckBig
								size={20}
								className="hover:text-green-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150"
							/>
						</Popconfirm>
						<Popconfirm
							title="Are you sure?"
							okText="Yes"
							cancelText="No"
							onConfirm={() => onDelete(record._id)}>
							<CircleX
								size={20}
								className="hover:text-red-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150"
							/>
						</Popconfirm>
					</Flex>
				</div>
			)
		}
	]

	const TraysColumns = [
		{
			title: 'Id',
			dataIndex: '_id',
			key: '_id',
			width: 100,
			align: 'center',
			render: _id => <p className="text-sm font-medium text-gray-900 capitalize">{_id}</p>
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: true,
			width: 50,
			align: 'center',
			render: status => (
				<div className="flex ">
					<p className="text-sm font-semibold text-gray-900 capitalize">
						{status !== 'Delivered' ? `Ready to ${status}` : 'Delivered'}
					</p>
					<Badge status={status === 'process' ? 'processing' : ''} className="mx-3" />
				</div>
			)
		},
		{
			title: 'Scaling',
			dataIndex: 'Scaling',
			key: 'isScaling',
			width: 50,
			align: 'center',
			render: (scaling, record) => (
				<div className="space-y-5">
					<StatusSelect
						value={scaling}
						onChange={value => handleStatusChange(record.parentId, record._id, 'Scaling', value)}
						previousStepDone={true} // Scaling is the first step, so always enabled for new records
						currentStepDone={scaling}
					/>
					<TimeDisplay timeline={record?.Timeline} action="Scaling" />
				</div>
			)
		},
		{
			title: 'Processing',
			dataIndex: 'Processing',
			key: 'isProcessing',
			width: 50,
			align: 'center',
			render: (processing, record) => (
				<div className="space-y-5">
					<StatusSelect
						value={processing}
						onChange={value => handleStatusChange(record.parentId, record._id, 'Processing', value)}
						previousStepDone={record?.Scaling}
						currentStepDone={processing}
					/>
					<TimeDisplay timeline={record?.Timeline} action="Processing" />
				</div>
			)
		},
		{
			title: 'Dispatched',
			dataIndex: 'Dispatched',
			key: 'isDispatched',
			width: 50,
			align: 'center',
			render: (dispatched, record) => (
				<div className="space-y-5">
					<StatusSelect
						value={dispatched}
						onChange={value => handleStatusChange(record.parentId, record._id, 'Dispatched', value)}
						previousStepDone={record?.Processing}
						currentStepDone={dispatched}
					/>
					<TimeDisplay timeline={record?.Timeline} action="Dispatched" />
				</div>
			)
		},
		{
			title: 'Delivered',
			dataIndex: 'Delivered',
			key: 'isDelivered',
			width: 50,
			align: 'center',
			render: (delivered, record) => (
				<div className="space-y-5">
					<StatusSelect
						value={delivered}
						onChange={value => handleStatusChange(record.parentId, record._id, 'Delivered', value)}
						previousStepDone={record?.Dispatched}
						currentStepDone={delivered}
					/>
					<TimeDisplay timeline={record?.Timeline} action="Delivered" />
				</div>
			)
		},
		{
			title: 'Trays',
			dataIndex: 'tray',
			key: 'tray',
			width: 100,
			align: 'center',
			render: (tray, record) => (
				<Card size="small" className="p-2">
					{tray?.map(item => (
						<Flex justify="space-between" key={item._id} align="center" className="mb-1">
							<div className="space-x-2 flex items-baseline">
								<p className="text-sm font-semibold text-gray-900 capitalize">{item.type}</p>
								<Switch
									checked={item.status}
									size="small"
									onChange={checked =>
										handleTrayTypeStatusChange(record.parentId, record._id, item._id, checked)
									}
									disabled={record.parentStatus === 'completed'}
									className={classNames(record.Delivered !== true && 'hidden')}
								/>
							</div>
							<Trash2
								size={16}
								className={classNames(
									'hover:cursor-pointer text-gray-500 hover:text-red-600',
									record.parentStatus === 'completed' && 'hidden'
								)}
								onClick={() => {
									handleDeleteTrayTypeRecord({
										rid: record.parentId,
										tid: record._id,
										typeid: item._id
									})
								}}
							/>
						</Flex>
					))}
				</Card>
			)
		},
		{
			title: 'Actions',
			dataIndex: 'tray',
			key: 'tray',
			width: 50,
			align: 'center',
			render: (tray, record) => (
				<Flex justify="space-around" align="center" className="hover:cursor-pointer">
					<Trash2
						size={20}
						className={classNames(
							'text-gray-500 hover:text-red-600 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150',
							record.parentStatus === 'completed' && 'hidden'
						)}
						onClick={() => handleDeleteTrayRecord({ rid: record.parentId, tid: record._id })}
					/>
				</Flex>
			)
		}
	]

	return (
		<>
			<AntTable
				className="shadow-sm"
				dataSource={data}
				loading={isLoading}
				columns={Columns}
				size="small"
				rowKey="_id"
				onChange={handleTableChange}
				expandable={{
					expandedRowRender: record => {
						const traysWithParentId = record.trays.map(tray => ({
							...tray,
							parentId: record._id,
							parentStatus: record.status,
							key: tray._id
						}))
						return (
							<AntTable
								dataSource={traysWithParentId}
								columns={TraysColumns}
								pagination={false}
								bordered
								size="small"
								rowKey="_id"
							/>
						)
					},
					expandedRowKeys: expandedRowKeys,
					onExpandedRowsChange: keys => {
						setExpandedRowKeys(keys)
					}
				}}
				pagination={{
					total: pagination?.totalItems,
					current: pagination?.currentPage,
					pageSize: pagination?.itemsPerPage,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
					pageSizeOptions: [5, 10, 15, 20, 50, 100]
				}}
			/>

			<Modal
				title="Add Remarks"
				open={isModalOpen}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				okText="Save"
				cancelText="Cancel">
				<Input.TextArea
					placeholder="Enter remarks (optional)"
					value={remarks}
					onChange={e => setRemarks(e.target.value)}
					rows={4}
				/>
			</Modal>

			<Modal
				title="Add Tray"
				open={isTrayModalOpen}
				onOk={handleTrayModalOk}
				onCancel={handleTrayModalCancel}
				okText="Add"
				cancelText="Cancel">
				<Input
					placeholder="e.g., 1,2,3 or 1-5"
					size="large"
					value={trayNumber}
					onChange={e => setTrayNumber(e.target.value)}
					className="mt-2"
				/>
			</Modal>
		</>
	)
}

export default Table
