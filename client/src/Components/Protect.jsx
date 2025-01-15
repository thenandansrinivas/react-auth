import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../Hooks/useAuth.js'
import { Loading } from './Loading'

const ProtectedRoute = ({ children }) => {
	const location = useLocation()
	const { Me, authLoading } = useAuth()
	return authLoading ? (
		<Loading />
	) : Me ? (
		children
	) : (
		<Navigate to="/login" state={{ from: location.pathname }} replace={true} />
	)
}

export default ProtectedRoute
