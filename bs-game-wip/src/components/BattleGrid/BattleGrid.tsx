import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';

import AnimatedText from '@/components/AnimatedText/AnimatedText';
import HudWindow from '@/components/HudWindow/HudWindow';
import { useWalletStore } from '@/stores/walletStore';

import BattleGridContainer from './BattleGridContainer';
import BattleGridCurrentCoordinates from './BattleGridCurrentCoordinates';

export default function BattleGrid() {
    const isConnected = useWalletStore((state) => state.isConnected);
    const [displayGrid, setDisplayGrid] = useState(false);

    useEffect(() => {
        if (isConnected) {
            setTimeout(() => {
                setDisplayGrid(true);
            }, 3000);
        }
    }, [isConnected]);

    const animation = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { delay: 0, duration: 1 },
    };

    const Disconnected = (
        <div className="text-center w-screen max-w-full">
            <div className="p-8">
                <p className="text-2xl mb-8">SYSTEM OFFLINE.</p>
                <p className="text-sm my-6">
                    <AnimatedText
                        text="Awaiting establishment of connection to primary nexus. Standby mode activated."
                        delay={3}
                        speed={0.05}
                    />
                </p>
                <p className="text-sm my-6">
                    <AnimatedText
                        text="Initiate diagnostic protocol 001. All units remain on high alert and prepare for potential engagement upon connection."
                        delay={7}
                        speed={0.05}
                    />
                </p>
            </div>
        </div>
    );

    return (
        <HudWindow headerTitle="Battle Grid" isOpen={isConnected} closedContent={Disconnected}>
            <div className="w-screen max-w-full" style={{ height: 524 }}>
                {displayGrid ? (
                    <motion.div {...animation}>
                        <BattleGridContainer />
                        <BattleGridCurrentCoordinates />
                    </motion.div>
                ) : (
                    <p>Loading Grid.</p>
                )}
            </div>
        </HudWindow>
    );
}
