import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LazyComponent from './Components/LazyComponent.jsx'
import Protect from './Components/Protect.jsx'
import { MessageProvider } from './Context/MessageContext'

import { qC } from './Utils/queryClient.js'

const Layout = lazy(() => import('./Layout'))
const Login = lazy(() => import('./Auth/Page'))
const Index = lazy(() => import('./Index'))
const Clinic = lazy(() => import('./Clinic/Page'))
const Patient = lazy(() => import('./Patient/Page'))

const routes = createBrowserRouter([
	{
		path: '/',
		element: (
			<Protect>
				<LazyComponent component={Layout} />
			</Protect>
		),
		children: [
			{
				index: true,
				element: <LazyComponent component={Index} />
			},
			{
				path: 'clinic',
				element: <LazyComponent component={Clinic} />
			},
			{
				path: 'patient',
				element: <Patient />
			}
		]
	},
	{
		path: '/login',
		element: <Login />
	}
])

const App = () => {
	return (
		<>
			<QueryClientProvider client={qC}>
				<MessageProvider>
					<RouterProvider router={routes} />
				</MessageProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</>
	)
}
export default App
