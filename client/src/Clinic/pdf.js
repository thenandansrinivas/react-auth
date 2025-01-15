import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const generateClinicPDF = (data, visibleColumns) => {
	const doc = new jsPDF()

	const columns = [
		{ key: 'name', header: 'Name' },
		{ key: 'address', header: 'Address' },
		{ key: 'phone', header: 'Phone' },
		{ key: 'mail', header: 'Mail' }
	]

	const visibleCols = columns.filter(col => visibleColumns[col.key])
	const tableHeaders = visibleCols.map(col => col.header)
	const tableData = data?.map(item => visibleCols.map(col => item[col.key]))

	doc.setFontSize(20)
	doc.text('Clinic Directory', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' })

	doc.setFontSize(10)
	const dateText = new Date().toLocaleDateString()
	doc.text(`Generated on: ${dateText}`, doc.internal.pageSize.getWidth() - 15, 15, { align: 'right' })

	doc.autoTable({
		head: [tableHeaders],
		body: tableData,
		startY: 25,
		theme: 'grid',
		styles: {
			fontSize: 9,
			cellPadding: 5,
			lineColor: [220, 220, 220],
			lineWidth: 0.5,
			font: 'helvetica'
		},
		headStyles: {
			fillColor: [245, 245, 245],
			textColor: [0, 0, 0],
			fontSize: 10,
			fontStyle: 'bold',
			halign: 'left'
		},
		bodyStyles: {
			textColor: [60, 60, 60],
			halign: 'left'
		},
		columnStyles: {
			0: { cellWidth: 40 },
			1: { cellWidth: 70 },
			2: { cellWidth: 40 },
			3: { cellWidth: 40 }
		},
		alternateRowStyles: {
			fillColor: [250, 250, 250]
		},
		didDrawPage: function (data) {
			doc.setFillColor(245, 245, 245)
			doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F')

			doc.setFillColor(245, 245, 245)
			const pageHeight = doc.internal.pageSize.getHeight()
			doc.rect(0, pageHeight - 15, doc.internal.pageSize.getWidth(), 15, 'F')

			doc.setFontSize(8)
			doc.setTextColor(100, 100, 100)
			doc.text(
				`Page ${data.pageNumber} of ${doc.getNumberOfPages()}`,
				doc.internal.pageSize.getWidth() / 2,
				pageHeight - 5,
				{ align: 'center' }
			)

			doc.setFontSize(8)
			doc.text('Clinic Management System', 15, pageHeight - 5)
			doc.text(dateText, doc.internal.pageSize.getWidth() - 15, pageHeight - 5, { align: 'right' })
		},
		margin: { top: 25, bottom: 20 }
	})

	return doc
}
