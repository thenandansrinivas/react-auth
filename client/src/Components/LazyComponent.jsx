import { Suspense } from 'react'

const Loading = () => null

const LazyComponent = ({ component: Component }) => (
	<Suspense fallback={<Loading size="large" />}>
		<Component />
	</Suspense>
)

export default LazyComponent
