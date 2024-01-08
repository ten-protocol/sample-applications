/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				yellow: "#FAEC00",
				red: "#F05",
				aqua: "rgba(97, 198, 255, 0.2)",
				"gray-light": "rgba(157, 157, 157, 0.2)",
				"gray-dark": "rgba(113, 124, 150, 0.7)",
				"gray-blue": "rgba(113, 124, 150, 1)",
				"gray-dot": "rgba(0, 0, 0, 0.10)",
			},
		},
	},
	plugins: [],
};
