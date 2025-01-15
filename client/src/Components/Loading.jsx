import { Spin } from 'antd'

export const Loading = ({ size = 'default' }) => {
	return (
		<div className="flex items-center justify-center w-dvw h-dvh">
			<Spin size={size} />
		</div>
	)
}
