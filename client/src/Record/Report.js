import { format, formatDistance } from 'date-fns'

const Report = ({ details = [], logs = [] }) => {
	// A4 optimized styles with reduced spacing
	const styles = {
		container: `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 210mm;
      background: white;
      color: #1a1a1a;
      line-height: 1.4;
      padding-top: 20px; /* Add top padding for better spacing */
    `,
		header: `
      padding: 20px 40px;
      background: linear-gradient(to right, #f8fafc, #f1f5f9);
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 20px;
    `,
		patientName: `
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #0f172a;
      text-transform: capitalize;
      letter-spacing: -0.02em;
    `,
		patientDetails: `
      color: #475569;
      margin: 0;
      font-size: 14px;
      display: flex;
      gap: 12px;
    `,
		detailDot: `
      color: #94a3b8;
    `,
		timeline: `
      padding: 10px 40px 24px 40px;
    `,
		timelineItem: `
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
  page-break-inside: avoid; /* Prevent timeline items from splitting */
`,
		iconContainer: `
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    `,
		icon: `
      width: 16px;
      height: 16px;
      color: #64748b;
    `,
		timelineContent: `
      flex: 1;
    `,
		timeHeader: `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    `,
		timeText: `
      font-weight: 600;
      color: #0f172a;
      font-size: 14px;
      margin: 0;
    `,
		duration: `
      color: #64748b;
      font-size: 12px;
      font-weight: 500;
    `,
		badgeContainer: `
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    `,
		badge: color => `
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      ${color}
    `,
		remarks: `
      margin: 0;
      color: #475569;
      font-size: 13px;
      line-height: 1.4;
    `
	}

	const getBadgeStyle = type => {
		const colorMap = {
			record: 'background-color: #ecfdf5; color: #047857;',
			create: 'background-color: #f0fdf4; color: #166534;',
			removed: 'background-color: #fef2f2; color: #991b1b;',
			Scaling: 'background-color: #eff6ff; color: #1e40af;',
			Processing: 'background-color: #fefce8; color: #854d0e;',
			Dispatched: 'background-color: #f5f3ff; color: #5b21b6;',
			Delivered: 'background-color: #ecfeff; color: #155e75;',
			opened: 'background-color: #f0fdf4; color: #166534;',
			added: 'background-color: #eff6ff; color: #1e40af;',
			close: 'background-color: #fef2f2; color: #991b1b;',
			tray: 'background-color: #f5f3ff; color: #5b21b6;'
		}
		return colorMap[type] || 'background-color: #f3f4f6; color: #374151;'
	}

	const timelineItems = logs
		?.map(
			(log, index) => `
      <div style="${styles.timelineItem}">
        <div style="${styles.iconContainer}">
          <svg style="${styles.icon}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div style="${styles.timelineContent}">
          <div style="${styles.timeHeader}">
            <p style="${styles.timeText}">
              ${format(new Date(log.time), 'dd MMM yyyy @ h:mm a')}
            </p>
            ${
				index < logs.length - 1
					? `
                  <span style="${styles.duration}">
                    ${formatDistance(new Date(log.time), new Date(logs[index + 1].time))}
                  </span>
                `
					: ''
			}
          </div>
          <div style="${styles.badgeContainer}">
            <span style="${styles.badge(getBadgeStyle(log.type))}">
              ${log.type}
            </span>
            <span style="${styles.badge(getBadgeStyle(log.action))}">
              ${log.action}
            </span>
            ${
				log.trayId
					? `
                  <span style="${styles.badge(getBadgeStyle('tray'))}">
                    Tray ID: ${log.trayId}
                  </span>
                `
					: ''
			}
          </div>
          ${
				log.remarks
					? `
                <p style="${styles.remarks}">${log.remarks}</p>
              `
					: ''
			}
        </div>
      </div>
    `
		)
		.join('')

	return `
  <div style="${styles.container}">
    <div style="${styles.header}">
      <h1 style="${styles.patientName}">${details?.name.toLowerCase()}</h1>
      <p style="${styles.patientDetails}">
        <span>${details?.age} years</span>
        <span style="${styles.detailDot}">•</span>
        <span>${details?.gender}</span>
        <span style="${styles.detailDot}">•</span>
        <span>${details?.clinic}</span>
      </p>
    </div>
    <div style="${styles.timeline}">
      ${timelineItems}
    </div>
  </div>
`.trim()
}

export default Report
