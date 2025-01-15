import { Button, Card, Layout as AntLayout, Menu, Flex } from 'antd'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Hospital, Monitor, Plus, Settings2, UsersRound } from 'lucide-react'
import { useCallback, useMemo, useState, useEffect } from 'react'
import classNames from 'classnames'

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
	const name = location.pathname.split('/')[1]
	const [openModal, setOpenModal] = useState(() => {})

	// Initialize collapsed state from localStorage or default to false
	const [collapsed, setCollapsed] = useState(() => {
		const savedState = localStorage.getItem('sidebarCollapsed')
		return savedState ? JSON.parse(savedState) : false
	})

	const [logoUrl, setLogoUrl] = useState(localStorage.getItem('logoUrl') || '/logo.svg')

	useEffect(() => {
		const handleStorageChange = () => {
			const newLogoUrl = localStorage.getItem('logoUrl')
			if (newLogoUrl && newLogoUrl !== logoUrl) {
				setLogoUrl(newLogoUrl)
			}
		}

		window.addEventListener('storage', handleStorageChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [logoUrl])

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

	// Calculate sidebar width based on collapsed state
	const sidebarWidth = collapsed ? 80 : 200

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
				<div className="flex justify-center items-center h-16 m-5">
					<img
						src={logoUrl}
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
					className="h-[calc(100vh-64px)] my-3 px-3 font-semibold text-xl"
				/>
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
