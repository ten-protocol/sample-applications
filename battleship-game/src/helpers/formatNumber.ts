export default function formatNumber (number: number) {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })

    return formatter.format(number)
} ;