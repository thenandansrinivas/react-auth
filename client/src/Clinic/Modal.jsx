import { Controller, useForm } from 'react-hook-form'
import { Modal as AntModal, Form, Input, Typography } from 'antd'

const { Text } = Typography

const Modal = ({ open, onCancel, onSubmit }) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm()

	const onSubmitWrapper = data => {
		onSubmit(data)
		reset() // Reset form after successful submission
	}

	return (
		<div>
			<AntModal open={open} onCancel={onCancel} onOk={handleSubmit(onSubmitWrapper)} title="New Clinic">
				<Form layout="vertical" size="small">
					<Form.Item
						label={<Text strong> Name</Text>}
						required
						validateStatus={errors.name ? 'error' : ''}
						help={errors.name?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="name"
							control={control}
							rules={{
								required: 'Name is required',
								minLength: {
									value: 3,
									message: 'Name must be at least 3 characters'
								},
								maxLength: {
									value: 50,
									message: 'Name must not exceed 50 characters'
								}
							}}
							render={({ field }) => (
								<Input
									{...field}
									size="large"
									status={errors.name ? 'error' : ''}
									placeholder="Enter name"
								/>
							)}
						/>
					</Form.Item>
					<Form.Item
						label={<Text strong> Phone</Text>}
						required
						validateStatus={errors.phone ? 'error' : ''}
						help={errors.phone?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="phone"
							control={control}
							rules={{
								required: 'Phone number is required',
								pattern: {
									value: /^\d{10}$/,
									message: 'Please enter a valid 10-digit phone number'
								}
							}}
							render={({ field }) => (
								<Input
									{...field}
									size="large"
									maxLength={10}
									status={errors.phone ? 'error' : ''}
									placeholder="Enter Phone"
									onChange={e => {
										const value = e.target.value.replace(/\D/g, '')
										field.onChange(value)
									}}
								/>
							)}
						/>
					</Form.Item>

					<Form.Item
						label={<Text strong> Email</Text>}
						validateStatus={errors.mail ? 'error' : ''}
						help={errors.mail?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="mail"
							control={control}
							rules={{
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Please enter a valid email address'
								}
							}}
							render={({ field }) => (
								<Input
									{...field}
									size="large"
									status={errors.mail ? 'error' : ''}
									placeholder="Enter Email"
								/>
							)}
						/>
					</Form.Item>

					<Form.Item
						label={<Text strong> Address</Text>}
						required
						validateStatus={errors.address ? 'error' : ''}
						help={errors.address?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="address"
							control={control}
							rules={{
								required: 'Address is required',
								minLength: {
									value: 3,
									message: 'Address must be at least 3 characters'
								},
								maxLength: {
									value: 50,
									message: 'Address must not exceed 50 characters'
								}
							}}
							render={({ field }) => (
								<Input.TextArea
									{...field}
									size="large"
									status={errors.address ? 'error' : ''}
									placeholder="Enter Address"
								/>
							)}
						/>
					</Form.Item>
				</Form>
			</AntModal>
		</div>
	)
}

export default Modal
