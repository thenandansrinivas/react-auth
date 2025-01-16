import { Button, Card, Layout as AntLayout, Menu, Flex } from 'antd'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Hospital, Monitor, Plus, Settings2, UsersRound, LogOut } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import useAuth from './Hooks/useAuth'
import classNames from 'classnames'
import { qC } from './Utils/queryClient'

const { Sider, Content } = AntLayout

function getItem(label, key, icon, children, path, roles = ['*']) {
	return {
		key,
		icon,
		children,
		label: path ? <NavLink to={path}>{label}</NavLink> : label,
		path,
		roles
	}
}

const Layout = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const name = location.pathname.split('/')[1]
	const [openModal, setOpenModal] = useState(() => {})
	const { logoutMutate } = useAuth()

	// Initialize collapsed state from localStorage or default to false
	const [collapsed, setCollapsed] = useState(() => {
		const savedState = localStorage.getItem('sidebarCollapsed')
		return savedState ? JSON.parse(savedState) : false
	})

	const handleNewClick = useCallback(() => {
		openModal()
	}, [openModal])

	const navItems = [
		getItem('Records', '1', <Monitor size={20} />, null, '/'),
		getItem('Clinic', '2', <Hospital size={20} />, null, '/clinic'),
		getItem('Patient', '3', <UsersRound size={20} />, null, '/patient'),
		getItem('Settings', '4', <Settings2 size={20} />, null, '/settings')
	]

	const findKeyByPath = (items, path) => {
		for (const item of items) {
			if (item.path === path) {
				return item.key
			}
			if (item.children) {
				const key = findKeyByPath(item.children, path)
				if (key) return key
			}
		}
		return null
	}

	const selectedKeys = useMemo(() => {
		const key = findKeyByPath(navItems, location.pathname)
		return key ? [key] : ['1']
	}, [location.pathname])

	const handleCollapse = value => {
		setCollapsed(value)
		localStorage.setItem('sidebarCollapsed', JSON.stringify(value))
	}
	const sidebarWidth = collapsed ? 80 : 200

	const handleLogOut = () => {
		logoutMutate(
			{},
			{
				onSettled: () => {
					qC.clear()
				},
				onSuccess: () => {
					navigate('/login', { replace: true })
				}
			}
		)
	}

	return (
		<AntLayout className="min-h-screen">
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={handleCollapse}
				theme="light"
				className="fixed h-screen overflow-hidden"
				width={200}
				collapsedWidth={80}>
				<div className="flex flex-col h-full">
					<div className="flex justify-center items-center h-16 m-5">
						<img
							src="./logo.svg"
							alt="Logo"
							className={`transition-all duration-300 ${
								collapsed ? 'w-10 h-10' : 'w-24 h-auto max-h-20'
							} object-contain`}
						/>
					</div>
					<Menu
						items={navItems}
						defaultSelectedKeys={['1']}
						selectedKeys={selectedKeys}
						className="flex-1 my-3 px-3 font-semibold text-xl"
					/>
					<div className="p-4 border-t border-gray-200">
						<button
							className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:bg-red-100 rounded-lg transition-colors group"
							onClick={handleLogOut}>
							<LogOut size={20} className="text-red-500 transition-colors" />
							{!collapsed && (
								<span className="font-medium group-hover:text-red-500 font-semibold text-xl">
									Logout
								</span>
							)}
						</button>
					</div>
				</div>
			</Sider>
			<AntLayout style={{ marginLeft: sidebarWidth }}>
				<Content className="p-4 min-h-screen">
					<div className="h-full overflow-auto">
						<Card className={classNames('shadow-sm mb-4 ', name === 'settings' && 'hidden')} bordered>
							<Flex justify="space-between">
								<div className="capitalize">
									<h1 className="text-3xl font-semibold">{name || 'Records'}</h1>
								</div>
								<Button size="large" type="primary" onClick={handleNewClick}>
									<Plus size={20} />
									New
								</Button>
							</Flex>
						</Card>
						<div className="pb-4">
							<Outlet context={{ setOpenModal }} />
						</div>
					</div>
				</Content>
			</AntLayout>
		</AntLayout>
	)
}

export default Layout
