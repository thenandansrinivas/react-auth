import { Controller, useForm } from 'react-hook-form'
import { Modal as AntModal, Form, Input, Radio, Select, DatePicker, InputNumber, Typography } from 'antd'
import dayjs from 'dayjs'

const { Text } = Typography

const Modal = ({ open, onCancel, clinics = [], onSubmit: sendData }) => {
	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors }
	} = useForm({
		defaultValues: {
			ageType: 'age'
		}
	})

	const ageType = watch('ageType')

	const onSubmit = data => {
		const filteredData = {
			age: data.age || '',
			dob: data.dob || '',
			name: data.name,
			gender: data.gender,
			phone: data.phone,
			clinic: data.clinic
		}
		sendData(filteredData)
		reset()
		onCancel()
	}

	return (
		<div>
			<AntModal
				open={open}
				onCancel={() => {
					reset()
					onCancel()
				}}
				onOk={handleSubmit(onSubmit)}
				title="New Patient">
				<Form layout="vertical" size="small">
					<Form.Item
						label={<Text strong>Name</Text>}
						required
						validateStatus={errors.name ? 'error' : ''}
						help={errors.name?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="name"
							control={control}
							rules={{
								required: 'Name is required'
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
						label={<Text strong>Phone</Text>}
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
						label={<Text strong>Gender</Text>}
						required
						validateStatus={errors.gender ? 'error' : ''}
						help={errors.gender?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="gender"
							control={control}
							rules={{
								required: 'Gender is required'
							}}
							render={({ field }) => (
								<Radio.Group {...field} size="large">
									<Radio value="male">Male</Radio>
									<Radio value="female">Female</Radio>
								</Radio.Group>
							)}
						/>
					</Form.Item>

					<Form.Item
						label={<Text strong>Age Details</Text>}
						required
						validateStatus={errors.age || errors.dob ? 'error' : ''}
						help={errors.age?.message || errors.dob?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="ageType"
							control={control}
							render={({ field }) => (
								<Radio.Group {...field} size="large" style={{ marginBottom: 8 }}>
									<Radio value="age">Age</Radio>
									<Radio value="dob">Date of Birth</Radio>
								</Radio.Group>
							)}
						/>

						{ageType === 'age' ? (
							<Controller
								name="age"
								control={control}
								rules={{
									required: 'Age is required'
								}}
								render={({ field: { onChange, value, ...field } }) => (
									<InputNumber
										{...field}
										value={value || undefined}
										onChange={val => onChange(val)}
										size="large"
										min={0}
										max={150}
										placeholder="Enter age"
										style={{ width: '100%' }}
									/>
								)}
							/>
						) : (
							<Controller
								name="dob"
								control={control}
								rules={{
									required: 'Date of birth is required'
								}}
								render={({ field: { onChange, value, ...field } }) => (
									<DatePicker
										{...field}
										value={value ? dayjs(value) : undefined}
										onChange={date => {
											const formattedDate = date ? date.format('YYYY-MM-DD') : ''
											onChange(formattedDate)
										}}
										size="large"
										style={{ width: '100%' }}
										placeholder="Select date"
									/>
								)}
							/>
						)}
					</Form.Item>

					<Form.Item
						label={<Text strong>Clinic</Text>}
						required
						validateStatus={errors.clinic ? 'error' : ''}
						help={errors.clinic?.message}
						style={{ marginBottom: 12 }}>
						<Controller
							name="clinic"
							control={control}
							rules={{
								required: 'Clinic is required'
							}}
							render={({ field }) => (
								<Select
									{...field}
									size="large"
									status={errors.clinic ? 'error' : ''}
									placeholder="Select clinic"
									options={clinics.map(clinic => ({
										value: clinic._id,
										label: clinic.name
									}))}
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
