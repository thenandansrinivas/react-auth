import { Button, Typography, Card, Form as AntForm, Input, Image } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { loginSchema } from './Schema.js'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, LogOut, UserIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useGlobalMessage } from '../Context/MessageContext'
import { loginFn } from './apiFn.js'
import { useLocation, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const Page = () => {
	const location = useLocation()
	const message = useGlobalMessage()
	const navigate = useNavigate()
	const redirectUrl = location.state?.redirectUrl || '/'
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
			remember: false
		}
	})

	const { mutate: loginMutateFn, isPending: isLoginPending } = useMutation({
		mutationFn: loginFn,
		onSuccess: () => {
			// First handle the success case
			message.success('Login successful')
			// Then navigate - this ensures both happen in the correct order
			navigate(redirectUrl, { replace: true })
		},
		onError: error => {
			const { message: errMsg } = error?.response?.data
			message.error(errMsg)
		}
	})

	const onSubmit = async data => {
		loginMutateFn(data)
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
			<div className="text-center mb-8">
				<Image src="/logo.svg" preview={false} width={150} />
				<Title level={2} className="mb-2">
					Welcome back
				</Title>
				<Text type="secondary">Please sign in to your account</Text>
			</div>
			<Card className="w-full max-w-sm shadow-md">
				<AntForm layout="vertical" onFinish={handleSubmit(onSubmit)}>
					<Controller
						name="username"
						control={control}
						render={({ field }) => (
							<AntForm.Item
								label="Username"
								validateStatus={errors.username ? 'error' : ''}
								help={errors.username?.message}>
								<Input
									{...field}
									autoFocus={true}
									autoComplete="off"
									maxLength={10}
									prefix={<UserIcon size={16} className="text-gray-400" />}
									placeholder="Enter your username"
									size="large"
								/>
							</AntForm.Item>
						)}
					/>

					<Controller
						name="password"
						control={control}
						render={({ field }) => (
							<AntForm.Item
								label="Password"
								validateStatus={errors.password ? 'error' : ''}
								help={errors.password?.message}>
								<Input.Password
									{...field}
									minLength={6}
									prefix={<LockIcon size={16} className="text-gray-400" />}
									placeholder="Enter your password"
									size="large"
								/>
							</AntForm.Item>
						)}
					/>

					<Button
						type="primary"
						htmlType="submit"
						size="large"
						block
						loading={isLoginPending}
						iconPosition="end">
						Sign in
					</Button>
				</AntForm>
			</Card>
		</div>
	)
}
export default Page
