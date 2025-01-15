import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	envDir: '../',
	server: {
		port: 5000,
		strictPort: true,
		watch: {
			ignored: ['**/node_modules/**']
		}
	},
	build: {
		port: 5000,
		strictPort: true,
		emptyOutDir: true,
		outDir: '../App',
		minify: 'terser',
		cssMinify: 'lightningcss',
		cssCodeSplit: true
	},
	preview: {
		port: 5000,
		strictPort: true
	}
})
