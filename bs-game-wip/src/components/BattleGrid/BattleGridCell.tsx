import {Graphics, Text} from "@pixi/react";
import { TextStyle } from 'pixi.js'
import React from "react";
import {hexHitArea} from "@/lib/constants";

export default function BattleGridCell ({col, row, x, y, state}) {
    return (
        <>
        <Graphics
            key={`${row}-${col}`}
            draw={g => {
                g.position.set(x, y);
                g.clear();

                if (state === "UNTOUCHED") {
                    g.beginFill(0xD9D9D9, 0)
                    g.lineStyle(1, 0x464646, 1);
                }
                if (state === 'MISSED') {
                    g.beginFill(0x5A5A5A, 1)
                    g.lineStyle(1, 0x4F4F4F, 1);
                }
                if (state === 'HIT') {
                    g.beginFill(0xE16F6F, 1)
                    g.lineStyle(1, 0xE16F6F, 1);
                }

                g.drawPolygon(hexHitArea);
                g.endFill();
            }}
        />
            {/*<Text*/}
            {/*    text={`${col}-${row}`}*/}
            {/*    anchor={0.5}*/}
            {/*    x={x}*/}
            {/*    y={y}*/}
            {/*    style={*/}
            {/*        new TextStyle({*/}
            {/*            align: 'center',*/}
            {/*            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',*/}
            {/*            fontSize: 10,*/}
            {/*            fontWeight: '100',*/}
            {/*            fill: '#ffffff',*/}
            {/*        })*/}
            {/*    }*/}
            {/*/>*/}
        </>
    )
}