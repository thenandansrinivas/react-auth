import { Card, Form, Input, Radio, Typography, Spin } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useGlobalMessage } from '../Context/MessageContext'
import useAuth from '../Hooks/useAuth.js'
import useUser from '../Hooks/useUser.js'
import { useState, useEffect } from 'react'

const { Text } = Typography

const Profile = () => {
	const { Me } = useAuth()
	const message = useGlobalMessage()
	// Assuming useUser hook returns the data in the format you specified
	const { UpdateUserMutate, isUpdatePending, Users, isLoading } = useUser({
		id: Me?._id
	})
	const [editingField, setEditingField] = useState(null)

	// Get the user from the users array in the response
	const user = Users?.users?.[0]

	const { control, handleSubmit, getValues, reset } = useForm({
		defaultValues: {
			name: '',
			phone: '',
			email: '',
			gender: ''
		}
	})

	// Update form when user data is loaded
	useEffect(() => {
		if (user) {
			reset({
				name: user.name || '',
				phone: user.phone || '',
				email: user.email || '',
				gender: user.gender || ''
			})
		}
	}, [user, reset])

	const handleFieldSubmit = fieldName => {
		const value = getValues(fieldName)
		if (user && value !== user[fieldName]) {
			const updatedData = {
				[fieldName]: value
			}
			UpdateUserMutate(
				{ id: Me?._id, data: updatedData },
				{
					onSuccess: () => {
						message.success('Profile updated')
					},
					onError: error => {
						const errArr = error?.response?.data?.errors || 'Something went wrong'
						errArr?.map(err => {
							message.error(`${err?.field} - ${err?.message}`)
						})
					}
				}
			)
		}
		setEditingField(null)
	}

	const renderField = (fieldName, label, inputType = 'text') => (
		<Form.Item label={label} required>
			<Controller
				name={fieldName}
				control={control}
				render={({ field }) => {
					const displayValue = field.value || user?.[fieldName]

					if (editingField === fieldName) {
						return (
							<Input
								{...field}
								autoFocus
								type={inputType}
								onPressEnter={() => handleFieldSubmit(fieldName)}
								onBlur={() => handleFieldSubmit(fieldName)}
								disabled={isUpdatePending}
							/>
						)
					}

					return (
						<Text
							onDoubleClick={() => setEditingField(fieldName)}
							style={{
								minHeight: '32px',
								lineHeight: '32px',
								cursor: 'pointer',
								padding: '4px 11px',
								border: '1px solid transparent',
								display: 'block',
								borderRadius: '6px',
								backgroundColor: displayValue ? 'transparent' : '#f5f5f5',
								':hover': {
									backgroundColor: '#f5f5f5',
									border: '1px dashed #d9d9d9'
								}
							}}>
							{displayValue || `Click to add ${label.toLowerCase()}`}
						</Text>
					)
				}}
			/>
		</Form.Item>
	)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full w-full">
				<Spin size="large" />
			</div>
		)
	}

	return (
		<div className="h-full w-full">
			<Card bordered={false} style={{ height: '100%' }} className="capitalize">
				<Form
					layout="vertical"
					style={{
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						gap: '16px'
					}}>
					{user?.updatedAt && (
						<div className="text-center">
							<p>Last updated: {new Date(user.updatedAt).toLocaleString()}</p>
						</div>
					)}
					{renderField('name', 'Name')}
					{renderField('phone', 'Phone')}
					{renderField('email', 'Email', 'email')}

					<Form.Item label="Gender" required>
						<Controller
							name="gender"
							control={control}
							render={({ field }) => (
								<Radio.Group
									{...field}
									onChange={e => {
										field.onChange(e)
										if (e.target.value !== user?.gender) {
											handleFieldSubmit('gender')
										}
									}}
									disabled={isUpdatePending}>
									<Radio value="male">Male</Radio>
									<Radio value="female">Female</Radio>
								</Radio.Group>
							)}
						/>
					</Form.Item>
				</Form>
			</Card>
		</div>
	)
}

export default Profile
