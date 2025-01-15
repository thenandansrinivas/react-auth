import { format, formatDistance } from 'date-fns'

import { useRecord } from '../Hooks/useRecord.js'
import { Calendar, Download, X } from 'lucide-react'
import Report from './Report.js'
import { Button } from 'antd'

const TimeLine = ({ data, open, onCancel, handleDownloadReport }) => {
	const { reportGenMutate, isReportPending } = useRecord()
	const { details, logs } = data

	const colorMap = {
		create: 'bg-emerald-100 text-emerald-800',
		removed: 'bg-red-100 text-red-800',
		Scaling: 'bg-blue-100 text-blue-800',
		Processing: 'bg-yellow-100 text-yellow-800',
		Dispatched: 'bg-purple-100 text-purple-800',
		Delivered: 'bg-cyan-100 text-cyan-800',
		opened: 'bg-emerald-100 text-emerald-800',
		added: 'bg-blue-100 text-blue-800',
		close: 'bg-red-100 text-red-800',
		record: 'bg-cyan-100 text-cyan-800',
		tray: 'bg-purple-100 text-purple-800'
	}

	const getTrayColor = trayId => {
		if (!trayId) return ''
		const colors = [
			'bg-orange-100 text-orange-800',
			'bg-blue-100 text-blue-800',
			'bg-green-100 text-green-800',
			'bg-indigo-100 text-indigo-800',
			'bg-purple-100 text-purple-800',
			'bg-pink-100 text-pink-800',
			'bg-yellow-100 text-yellow-800',
			'bg-emerald-100 text-emerald-800'
		]
		const index = parseInt(trayId.slice(-4), 16) % colors.length
		return colors[index]
	}

	const handleDownload = async () => {
		const content = Report({ details, logs })

		const payload = {
			content,
			patientName: details?.name,
			patientDetails: {
				phone: details?.phone,
				age: details?.age,
				gender: details?.gender,
				clinic: details?.clinic
			}
		}

		reportGenMutate(payload, {
			onSuccess: response => {
				if (!response) {
					console.error('No response received for PDF generation')
					return
				}

				const blob = new Blob([response], { type: 'application/pdf' })
				const url = window.URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				const filename = `${details?.name}-${details?.phone}-${format(new Date(), 'EEE do MMM yyyy @ h:mm a')}-TimeLineReport.pdf`
				link.setAttribute('download', filename)
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				window.URL.revokeObjectURL(url)
			},
			onError: error => {
				console.error('Error generating the report:', error)
			}
		})
	}

	return (
		<div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${open ? '' : 'hidden'}`}>
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[calc(100vh-40px)] flex flex-col relative overflow-hidden">
				{/* Header */}
				<div className="border-b border-gray-200 p-4 sticky top-0 bg-white z-[60]">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-gray-900 capitalize">{details?.name}</h2>
							<p className="mt-1 text-sm text-gray-500">
								{details?.age} years • {details?.gender} • {details?.clinic}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button
								onClick={handleDownload}
								loading={isReportPending}
								disabled={isReportPending}
								className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<Download className="h-4 w-4 mr-2" />
								Download
							</Button>
							<button
								onClick={onCancel}
								className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
								<X className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>

				{/* Timeline Content */}
				<div className="overflow-auto p-6 relative z-[55]">
					<div className="space-y-6">
						{logs?.map((log, index) => (
							<div key={index} className="flex items-start gap-4">
								<div className="flex-shrink-0">
									<Calendar className="h-5 w-5 text-gray-400" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium text-gray-900">
											{format(new Date(log.time), 'dd MMM yyyy @ h:mm a')}
										</p>
										{index < logs.length - 1 && (
											<p className="text-xs text-gray-500">
												{formatDistance(new Date(log.time), new Date(logs[index + 1].time))}
											</p>
										)}
									</div>
									<div className="mt-2 flex flex-wrap gap-2">
										<span
											className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[log.type]}`}>
											{log.type}
										</span>
										<span
											className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[log.action]}`}>
											{log.action}
										</span>
										{log.trayId && (
											<span
												className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTrayColor(log.trayId)}`}>
												Tray ID: {log.trayId}
											</span>
										)}
									</div>
									{log.remarks && <p className="mt-2 text-sm text-gray-500">{log.remarks}</p>}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default TimeLine
