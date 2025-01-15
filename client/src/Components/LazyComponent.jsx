import { Suspense } from 'react'

const Loading = () => null

const LazyComponent = ({ component: Component }) => (
	<Suspense fallback={<Loading />}>
		<Component />
	</Suspense>
)

export default LazyComponent
