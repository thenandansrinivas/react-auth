import { Table as AntTable, Form } from 'antd'
import { EditableCell } from './EditableCell'

const Table = ({
	form,
	clinicList,
	visibleColumnsArray,
	selectedRowKeys,
	setSelectedRowKeys,
	tableParams,
	handleTableChange,
	isLoading,
	title // Important: Accept the title prop
}) => {
	return (
		<Form form={form} component={false}>
			<AntTable
				components={{
					body: {
						cell: EditableCell
					}
				}}
				dataSource={clinicList?.data}
				columns={visibleColumnsArray}
				rowKey="_id"
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
					preserveSelectedRowKeys: true
				}}
				pagination={{
					showSizeChanger: true,
					showQuickJumper: true,
					showPrevNextJumpers: true,
					current: clinicList?.pagination?.currentPage,
					total: clinicList?.pagination?.totalItems,
					pageSize: parseInt(tableParams.limit),
					showTotal: total => `Total ${total} items`,
					pageSizeOptions: ['5', '10', '20', '50', '100', clinicList?.pagination?.totalItems],
					className: 'px-3'
				}}
				onChange={handleTableChange}
				loading={isLoading}
				className="border border-gray-200 rounded-lg"
				title={title} // Pass the title function to AntTable
				scroll={{ y: 500 }}
			/>
		</Form>
	)
}

export default Table
