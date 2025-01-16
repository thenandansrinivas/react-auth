import { Card, Typography, Image, Upload, Input, message } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useApp } from '../hooks/useApp'
import { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'

const { TextArea } = Input
const DEFAULT_LOGO = '/logo.svg'
const { Text } = Typography

const App = () => {
	const { AppInfo, updateAppMutate, updateAppLogoMutate } = useApp()
	const { control, setValue, reset } = useForm({
		defaultValues: {
			name: '',
			phone: '',
			mail: '',
			website: '',
			address: ''
		}
	})

	const [editingFields, setEditingFields] = useState({})
	const [errors, setErrors] = useState({})
	const [logoUrl, setLogoUrl] = useState(() => {
		return localStorage.getItem('logoUrl') || DEFAULT_LOGO
	})

	const validateField = (field, value) => {
		switch (field) {
			case 'name':
				return value.length > 50 ? 'Name must be less than 20 characters' : ''
			case 'phone':
				return !/^\d{10}$/.test(value) ? 'Phone must be exactly 10 digits and contain only numbers' : ''
			case 'mail':
				return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : ''
			case 'website':
				return !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(value)
					? 'Enter domain name without http/https'
					: ''
			case 'address':
				return value.length > 50 ? 'Address must be less than 25 characters' : ''
			default:
				return ''
		}
	}

	useEffect(() => {
		if (AppInfo) {
			reset({
				name: AppInfo.name || '',
				phone: AppInfo.phone || '',
				mail: AppInfo.mail || '',
				website: AppInfo.website || '',
				address: AppInfo.address || ''
			})
		}
	}, [AppInfo, reset])

	useEffect(() => {
		const savedFaviconUrl = localStorage.getItem('faviconUrl')
		if (savedFaviconUrl) {
			const link = document.querySelector('link[rel="icon"]') || document.createElement('link')
			link.rel = 'icon'
			link.href = savedFaviconUrl
			document.head.appendChild(link)
		}
	}, [])

	const handleLogoUpload = file => {
		const isSvg = file.type === 'image/svg+xml' // Check if the file is an SVG
		if (!isSvg) {
			message.error('You can only upload SVG files for the logo.')
			return false
		}

		const formData = new FormData()
		formData.append('oldFile', logoUrl) // old logo value from localStorage

		updateAppLogoMutate(formData, {
			onSuccess: data => {
				const newLogoUrl = data // Assuming the API returns the new logo URL
				setLogoUrl(newLogoUrl)
				localStorage.setItem('logoUrl', newLogoUrl)

				debouncedLogChange('logo', newLogoUrl)

				message.success('Logo updated successfully')
				setTimeout(() => {
					window.location.reload()
				}, 2000)
			},
			onError: () => {
				// Set the logo to default in case of an error
				setLogoUrl(DEFAULT_LOGO)
				localStorage.setItem('logoUrl', DEFAULT_LOGO)
				message.error('Failed to update logo. Reverting to default.')
			}
		})

		return false
	}

	const debouncedLogChange = debounce((field, value) => {
		updateAppMutate({ [field]: value })
	}, 300)

	const handleFieldUpdate = (field, value) => {
		const error = validateField(field, value)
		if (error) {
			setErrors(prev => ({ ...prev, [field]: error }))
			message.error(error)
			return
		}

		setErrors(prev => ({ ...prev, [field]: '' }))

		if (AppInfo?.[field] === value) {
			setEditingFields(prev => ({ ...prev, [field]: false }))
			return
		}

		setValue(field, value)
		debouncedLogChange(field, value)
		setEditingFields(prev => ({ ...prev, [field]: false }))
	}

	return (
		<Card className="w-full p-6 shadow-md">
			<div className="flex flex-col items-center gap-8">
				<Upload accept="image/*" showUploadList={false} beforeUpload={handleLogoUpload}>
					<div className="w-48 h-48 rounded-full bg-gray-200 overflow-hidden cursor-pointer">
						<Image src={logoUrl} alt="Logo" width={200} height={200} preview={false} />
					</div>
				</Upload>

				<div className="w-full space-y-4">
					<div className="grid grid-cols-2 gap-4">
						{['name', 'phone', 'mail', 'website'].map(field => (
							<div key={field} className="flex items-center gap-4">
								<Text className="w-24 text-gray-600 capitalize">{field}:</Text>
								<div className="flex-1">
									<Controller
										name={field}
										control={control}
										render={({ field: { value, onChange } }) => (
											<div
												className="w-full"
												onDoubleClick={() =>
													setEditingFields(prev => ({ ...prev, [field]: true }))
												}>
												{editingFields[field] ? (
													<Input
														value={value}
														onChange={e => onChange(e.target.value)}
														onPressEnter={e => handleFieldUpdate(field, e.target.value)}
														onBlur={() =>
															setEditingFields(prev => ({ ...prev, [field]: false }))
														}
														status={errors[field] ? 'error' : ''}
														autoFocus
													/>
												) : (
													<div className="cursor-pointer py-1">
														{value || `Enter ${field}`}
													</div>
												)}
												{errors[field] && (
													<div className="text-red-500 text-xs mt-1">{errors[field]}</div>
												)}
											</div>
										)}
									/>
								</div>
							</div>
						))}
					</div>

					<div className="flex items-start gap-4">
						<Text className="w-24 text-gray-600 capitalize">address:</Text>
						<div className="flex-1">
							<Controller
								name="address"
								control={control}
								render={({ field: { value, onChange } }) => (
									<div
										className="w-full"
										onDoubleClick={() => setEditingFields(prev => ({ ...prev, address: true }))}>
										{editingFields.address ? (
											<TextArea
												value={value}
												onChange={e => onChange(e.target.value)}
												onPressEnter={e => handleFieldUpdate('address', e.target.value)}
												onBlur={() => setEditingFields(prev => ({ ...prev, address: false }))}
												autoSize={{ minRows: 3, maxRows: 5 }}
												status={errors.address ? 'error' : ''}
												autoFocus
											/>
										) : (
											<div className="cursor-pointer min-h-[80px] py-1">
												{value || 'Enter address'}
											</div>
										)}
										{errors.address && (
											<div className="text-red-500 text-xs mt-1">{errors.address}</div>
										)}
									</div>
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default App
