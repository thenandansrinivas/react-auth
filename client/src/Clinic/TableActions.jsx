import { Button, Popconfirm, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Trash2, FileDown, Settings } from 'lucide-react'
import { SettingsCard } from './SettingsCard'

const TableActions = ({
	selectedRowKeys = [],
	handleBulkDelete,
	handleDownloadPDF,
	debouncedSearch,
	showSettings,
	setShowSettings,
	visibleColumns,
	setVisibleColumns
}) => {
	return (
		<div className="flex justify-between items-center px-4 py-2">
			<div className="flex gap-2">
				{selectedRowKeys.length > 0 && (
					<Popconfirm
						title={`Delete ${selectedRowKeys.length} items?`}
						onConfirm={handleBulkDelete}
						okText="Yes"
						cancelText="No">
						<Button danger type="primary" className="flex items-center gap-2 h-10">
							<Trash2 className="h-4 w-4" />
							Delete Selected ({selectedRowKeys.length})
						</Button>
					</Popconfirm>
				)}
				<Popconfirm
					title="Download PDF?"
					onConfirm={handleDownloadPDF}
					okText="Yes"
					cancelText="No"
					okButtonProps={{ size: 'small' }}
					cancelButtonProps={{ size: 'small' }}>
					<Button className="flex items-center gap-2 h-10" type="primary">
						<FileDown className="h-4 w-4" />
						Download PDF
					</Button>
				</Popconfirm>
			</div>
			<div className="flex gap-4 ml-auto">
				<Input
					prefix={<SearchOutlined className="text-gray-400" />}
					placeholder="Search by name, phone, or email"
					onChange={e => debouncedSearch(e.target.value)}
					className="w-72"
				/>
				<div className="relative">
					<Settings
						className="h-5 w-5 my-4 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
						onClick={() => setShowSettings(!showSettings)}
					/>
					{showSettings && (
						<SettingsCard visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
					)}
				</div>
			</div>
		</div>
	)
}

export default TableActions
