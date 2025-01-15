import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LazyComponent from './Components/LazyComponent.jsx'
import Protect from './Components/Protect.jsx'

import { qC } from './Utils/queryClient.js'

const Layout = lazy(() => import('./Layout'))
const Login = lazy(() => import('./Auth/Page'))
const Index = lazy(() => import('./Index'))

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
				<RouterProvider router={routes} />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</>
	)
}
export default App
