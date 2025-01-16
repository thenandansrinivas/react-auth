import { Tabs } from 'antd'
import App from './App'
import Profile from './Profile'

const items = [
	{
		key: '1',
		label: <h1 className="text-3xl font-semibold">App</h1>,
		children: <App />
	},
	{
		key: '2',
		label: <h1 className="text-3xl font-semibold">Profile</h1>,
		children: <Profile />
	}
]

const Page = () => {
	return (
		<div className="h-full">
			<Tabs
				defaultActiveKey="1"
				size="large"
				items={items}
				indicator={{ align: 'center' }}
				centered
				className="h-full"
			/>
		</div>
	)
}

export default Page
