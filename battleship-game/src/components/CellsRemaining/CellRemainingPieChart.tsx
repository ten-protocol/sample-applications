import { Cell, Pie, PieChart } from 'recharts';

import formatNumber from '@/helpers/formatNumber';

type Props = {
    totalCells: number;
    revealedCells: number;
};

export default function CellRemainingPieChart({ totalCells, revealedCells }: Props) {
    const percRevealedCells = (revealedCells / totalCells) * 100;
    const percRemaining = 100 - percRevealedCells;
    const data = [
        { name: 'remaining', value: percRemaining, color: '#ffffff' },
        { name: 'revealed', value: percRevealedCells, color: '#353538' },
    ];

    return (
        <PieChart width={200} height={200}>
            <Pie
                dataKey="value"
                data={data}
                cx={100}
                cy={95}
                innerRadius={70}
                outerRadius={80}
                stroke="none"
                startAngle={90}
                endAngle={450}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <text
                x={105}
                y={100}
                fill="white"
                textAnchor="middle"
                fontSize={30}
                fontWeight="bold"
                dominantBaseline="central"
            >
                {`${formatNumber(percRemaining)}%`}
            </text>
            <circle cx={105} cy={100} r={85} fill="none" stroke="#868686" />
        </PieChart>
    );
}
