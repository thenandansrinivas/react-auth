

// App.jsx
import { lazy, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LazyComponent from './Components/LazyComponent'
import Protect from './Components/Protect'
import { MessageProvider } from './Context/MessageContext'
import { qC } from './Utils/queryClient.js'
import { setNavigate } from './Utils/navigate.js'

// Lazy load components
const Layout = lazy(() => import('./Layout'))
const Login = lazy(() => import('./Auth/Page'))
const Record = lazy(() => import('./Record/Page'))
const Clinic = lazy(() => import('./Clinic/Page'))
const Patient = lazy(() => import('./Patient/Page'))
const AppPage = lazy(() => import('./App/Page'))

const App = () => {
	const navigate = useNavigate()

	useEffect(() => {
		setNavigate(navigate)
	}, [navigate])

	return (
		<QueryClientProvider client={qC}>
			<MessageProvider>
				<Routes>
					<Route
						path="/"
						element={
							<Protect>
								<LazyComponent component={Layout} />
							</Protect>
						}>
						<Route index element={<LazyComponent component={Record} />} />
						<Route path="clinic" element={<LazyComponent component={Clinic} />} />
						<Route path="patient" element={<LazyComponent component={Patient} />} />
						<Route path="settings" element={<LazyComponent component={AppPage} />} />
					</Route>
					<Route path="/login" element={<LazyComponent component={Login} />} />
				</Routes>
			</MessageProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default App
