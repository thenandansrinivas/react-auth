import { Pencil, Trash2, X, Check } from 'lucide-react'
import { Popconfirm } from 'antd'

const TableColumns = ({ isEditing, save, cancel, edit, handleDelete }) => [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		sorter: true,
		editable: true,
		render: text => <p className="text-base font-medium text-gray-900 capitalize">{text}</p>
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
		sorter: true,
		editable: true,
		render: text => <p className="text-base text-gray-600 capitalize">{text}</p>
	},
	{
		title: 'Phone',
		dataIndex: 'phone',
		key: 'phone',
		sorter: true,
		editable: true,
		render: text => <p className="text-base text-gray-600 capitalize">{text}</p>
	},
	{
		title: 'Mail',
		dataIndex: 'mail',
		key: 'mail',
		sorter: true,
		editable: true,
		render: text => <p className="text-base text-gray-600 capitalize">{text}</p>
	},
	{
		title: 'Actions',
		key: 'actions',
		width: 120,
		render: (_, record) => {
			const editable = isEditing(record)
			return (
				<div className="flex gap-3">
					{editable ? (
						<>
							<Check
								className="h-5 w-5 cursor-pointer text-green-500 hover:text-green-700 transition-colors"
								onClick={() => save(record)}
							/>
							<X
								className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
								onClick={cancel}
							/>
						</>
					) : (
						<>
							<Pencil
								className="h-5 w-5 cursor-pointer text-gray-500 hover:text-green-800 transition-colors"
								onClick={() => edit(record)}
							/>
							<Popconfirm
								title="Are you sure?"
								onConfirm={() => handleDelete(record._id)}
								okText="Yes"
								cancelText="No"
								cancelButtonProps={{
									size: 'small'
								}}
								okButtonProps={{
									size: 'small'
								}}>
								<Trash2 className="h-5 w-5 cursor-pointer text-gray-500 hover:text-red-700 transition-colors" />
							</Popconfirm>
						</>
					)}
				</div>
			)
		}
	}
]

export default TableColumns
