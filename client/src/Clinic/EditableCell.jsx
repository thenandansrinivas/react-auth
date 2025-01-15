import { Form, Input } from 'antd'

export const EditableCell = ({ editing, dataIndex, title, record, children, ...restProps }) => {
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`
						}
					]}>
					<Input className="w-full px-2 py-1" />
				</Form.Item>
			) : (
				children
			)}
		</td>
	)
}
