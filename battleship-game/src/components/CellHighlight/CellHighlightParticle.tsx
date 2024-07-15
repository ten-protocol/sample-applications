import { useRef, useState } from 'react';

import {Graphics, useTick} from '@pixi/react';
import {Particle} from "./cellHighlights.models";
import PIXI from 'pixi.js'

export default function CellhighLightParticle(p: Particle) {
    const graphicRef = useRef<PIXI.Graphics>(null);
    const [currentAngle, setCurrentAngle] = useState(p.angle);
    const [age, setAge] = useState(0);
    const [ageReset, setAgeReset] = useState(false);

    useTick((delta) => {
        if (graphicRef.current) {
            // Update the angle
            if (p.age && p.ageReset && !ageReset) {
                setAge(p.age);
                setAgeReset(true);
            }

            setCurrentAngle((prevAngle) => prevAngle + p.rotationSpeed * delta);
            setAge((prevAge) => prevAge + delta);

            const radius = Math.max(p.startRadius - age * 6, p.endRadius);
            const height = Math.max(p.startHeight - age * 1.3, p.endHeight);
            const x = p.x + radius * Math.cos(currentAngle);
            const y = p.y + radius * Math.sin(currentAngle);

            graphicRef.current.x = x;
            graphicRef.current.y = y;
            graphicRef.current.height = height;
            graphicRef.current.rotation = currentAngle + Math.PI / 2;
        }
    });

    return (
        <Graphics
            ref={graphicRef}
            draw={(g) => {
                g.clear();
                g.beginFill(p.color);
                g.drawRect(0, 0, 1, 10); // Draw a line instead of a particle
                g.endFill();
            }}
        />
    );
}
