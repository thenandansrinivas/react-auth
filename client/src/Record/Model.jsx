import { Modal as AntModal, Input, Form, Radio, Select, DatePicker, InputNumber, Row, Col, Typography } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dayjs from 'dayjs'

const { Text } = Typography

const validationSchema = z
	.object({
		name: z
			.string()
			.min(1, 'Name is required')
			.transform(val => val.trim().toLowerCase()),
		gender: z.enum(['male', 'female']).transform(val => val.trim().toLowerCase()),
		phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
		ageType: z.enum(['age', 'dob']).transform(val => val.trim().toLowerCase()),
		age: z.union([z.number(), z.string()]).transform(val => {
			if (typeof val === 'string' && val === '') return 0
			return Number(val)
		}),
		dob: z.string(),
		clinic: z.string().min(1, 'Please select a clinic'),
		trays: z.string().min(1, 'Trays are required')
	})
	.refine(
		data => {
			if (data.ageType === 'age') return data.age > 0
			return data.dob !== ''
		},
		{ message: 'Either age or date of birth must be provided' }
	)

const Model = ({ open, onCancel, clinics, onRecordSubmit }) => {
	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues: {
			name: '',
			gender: 'male',
			phone: '',
			ageType: 'age',
			age: 0,
			dob: '',
			clinic: '',
			trays: ''
		}
	})

	const ageType = watch('ageType')

	const onSubmit = data => {
		const filteredData = {
			name: data.name,
			gender: data.gender,
			phone: data.phone,
			age: data.ageType === 'age' ? data.age : 0,
			dob: data.ageType === 'dob' ? data.dob : '',
			clinic: data.clinic,
			trays: data.trays
		}
		console.log(filteredData)
		onRecordSubmit(filteredData)
		reset()
		onCancel()
	}

	return (
		<AntModal
			open={open}
			onCancel={() => {
				reset()
				onCancel()
			}}
			title={
				<Text strong style={{ fontSize: '18px' }}>
					New Record
				</Text>
			}
			onOk={handleSubmit(onSubmit)}
			width={600}
		>
			<Form layout="vertical" size="small">
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label={<Text strong>Patient Name</Text>}
							required
							validateStatus={errors.name ? 'error' : ''}
							help={errors.name?.message}
							style={{ marginBottom: 12 }}>
							<Controller
								name="name"
								control={control}
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
								render={({ field }) => (
									<Input
										{...field}
										size="large"
										maxLength={10}
										status={errors.phone ? 'error' : ''}
										placeholder="10-digit number"
										onChange={e => {
											const value = e.target.value.replace(/\D/g, '')
											field.onChange(value)
										}}
									/>
								)}
							/>
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
								render={({ field }) => (
									<Select
										{...field}
										size="large"
										status={errors.clinic ? 'error' : ''}
										placeholder="Select clinic"
										options={clinics?.map(clinic => ({
											value: clinic._id,
											label: clinic.name
										}))}
									/>
								)}
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							label={<Text strong>Gender</Text>}
							required
							validateStatus={errors.gender ? 'error' : ''}
							help={errors.gender?.message}
							style={{ marginBottom: 12 }}>
							<Controller
								name="gender"
								control={control}
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
							label={<Text strong>Trays</Text>}
							required
							tooltip="Use: 1 or 1,2,3 or 1-5"
							validateStatus={errors.trays ? 'error' : ''}
							help={errors.trays?.message}
							style={{ marginBottom: 12 }}>
							<Controller
								name="trays"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										size="large"
										status={errors.trays ? 'error' : ''}
										placeholder="e.g., 1,2,3 or 1-5"
									/>
								)}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</AntModal>
	)
}

export default Model
