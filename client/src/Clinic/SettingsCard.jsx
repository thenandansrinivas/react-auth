import { Card, Switch } from 'antd'

export const SettingsCard = ({ visibleColumns, setVisibleColumns }) => (
	<Card className="absolute right-0 top-14 z-10 w-52 shadow-lg">
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span>Name</span>
				<Switch
					size="small"
					checked={visibleColumns.name}
					onChange={checked => setVisibleColumns(prev => ({ ...prev, name: checked }))}
				/>
			</div>
			<div className="flex items-center justify-between">
				<span>Address</span>
				<Switch
					size="small"
					checked={visibleColumns.address}
					onChange={checked => setVisibleColumns(prev => ({ ...prev, address: checked }))}
				/>
			</div>
			<div className="flex items-center justify-between">
				<span>Phone</span>
				<Switch
					size="small"
					checked={visibleColumns.phone}
					onChange={checked => setVisibleColumns(prev => ({ ...prev, phone: checked }))}
				/>
			</div>
			<div className="flex items-center justify-between">
				<span>Mail</span>
				<Switch
					size="small"
					checked={visibleColumns.mail}
					onChange={checked => setVisibleColumns(prev => ({ ...prev, mail: checked }))}
				/>
			</div>
		</div>
	</Card>
)
