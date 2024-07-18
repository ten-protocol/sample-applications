import { Container, Sprite } from '@pixi/react';

import bgImage from '@/assets/bgImg.png';
import { HEX_HEIGHT, VERTICAL_OFFSET } from '@/lib/constants';

export default function BattleGridBackgroundCells() {
    const sections = new Array(10).fill(true);

    return (
        <Container >
            {sections.map((section, index) => (
                <Sprite
                    key={index}
                    image={bgImage}
                    scale={{ x: 0.5, y: 0.5 }}
                    anchor={0}
                    x={0}
                    y={(HEX_HEIGHT - VERTICAL_OFFSET) * index * 10}
                />
            ))}
        </Container>
    );
}
