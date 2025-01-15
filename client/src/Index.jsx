import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import useAuth from './Hooks/useAuth.js'
import { qC } from './Utils/queryClient.js'

const Index = () => {
	const navigate = useNavigate()
	const { Me, logoutMutate, isLogOutPending } = useAuth()

	const signOut = () => {
		logoutMutate(
			{},
			{
				onSettled: () => {
					qC.clear()
					navigate('/login')
				}
			}
		)
	}

	return (
		<>
			<div>{Me?.name}</div>
			<Button onClick={signOut} color="danger" variant="filled" loading={isLogOutPending} iconPosition="end">
				Logout
			</Button>
		</>
	)
}
export default Index
