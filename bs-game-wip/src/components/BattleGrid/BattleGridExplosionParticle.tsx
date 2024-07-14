import { useRef, useState } from 'react';

import { Graphics, useTick } from '@pixi/react';

export default function BattleGridExplosionParticle({
    x,
    y,
    vx,
    vy,
    angle,
    rotationSpeed,
    duration,
}) {
    const graphicRef = useRef();
    const [age, setAge] = useState(0);
    const startHeight = 0;
    const endHeight = 400;

    useTick((delta) => {
        if (graphicRef.current) {
            graphicRef.current.x += vx * age;
            graphicRef.current.y += vy * age;
            graphicRef.current.rotation = angle;
            graphicRef.current.width = Math.min(startHeight + age * 2, endHeight);
            setAge((prevAge) => prevAge + delta);

            const opacity = Math.max(1 - age / (duration / 5), 0);
            graphicRef.current.alpha = opacity;
        }
    });

    return (
        <Graphics
            ref={graphicRef}
            draw={(g) => {
                g.clear();
                g.beginFill(0xff8181);
                g.drawRect(0, 0, 1, 1); // Draw a line instead of a particle
                g.endFill();
            }}
            x={x}
            y={y}
        />
    );
}
