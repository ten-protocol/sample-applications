import { AnimatePresence, motion } from 'framer-motion';

import HudWindow from '@/components/HudWindow/HudWindow';
import { useContractStore } from '@/stores/contractStore';

import styles from './styles.module.scss';

export default function ProcessingNotification() {
    const [guessState, lastError, resetGuessState] = useContractStore((state) => [
        state.guessState,
        state.lastError,
        state.resetGuessState,
    ]);

    let footerContent = <div />;
    let bodyContent = <div />;

    const handleClose = () => {
        resetGuessState();
    };

    const CloseButton = <button onClick={handleClose}>Close</button>;

    if (guessState === 'IDLE') return null;

    if (guessState === 'STARTED') {
        footerContent = <p>Processing...</p>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg bg-stone-900 inline-block px-1">
                    Target locked and confirmed.
                </p>
                <p className="text-sm bg-stone-900 px-1">Initiating plasma cannon sequence</p>
            </div>
        );
    }

    if (guessState === 'ERROR') {
        footerContent = <div>{CloseButton}</div>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg bg-red-600 inline-block px-1">WEAPON ACTIVATION FAILED</p>
                <p className="text-sm bg-red-600 px-1">Error detected</p>
                <p className="text-sm bg-red-600 px-1">{lastError}</p>
            </div>
        );
    }

    if (guessState === 'TRANSACTION_SUCCESS') {
        footerContent = <p>CANNONS FIRED...</p>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg bg-neutral-900 inline-block px-1">
                    Ordinance en route to target
                </p>
                <p className="text-sm bg-neutral-900 inline-block px-1">
                    Monitor for impact confirmation
                </p>
            </div>
        );
    }

    if (guessState === 'MISS') {
        footerContent = <div>{CloseButton}</div>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg bg-red-600 inline-block px-1">Miss detected</p>
                <p className="text-lg bg-neutral-900 inline-block px-1">
                    Shot failed to find target
                </p>
                <p className="text-sm bg-neutral-900 inline-block px-1">
                    Initiate trajectory analysis and recalibrate targeting systems
                </p>
            </div>
        );
    }

    if (guessState === 'HIT') {
        footerContent = <div>{CloseButton}</div>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg bg-blue-600 inline-block px-1">DIRECT HIT</p>
                <p className="text-lg bg-neutral-900 inline-block px-1">Impact confirmed</p>
                <p className="text-sm bg-neutral-900 inline-block px-1">
                    Assess damage and prepare for immediate re-engagement
                </p>
            </div>
        );
    }

    console.log(guessState);

    const variants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    };

    return (
        <div className={styles.container}>
            <HudWindow
                headerTitle="Striking coordinates"
                speed={0.1}
                footerContent={
                    <div>
                        <motion.div
                            key={guessState}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={variants}
                        >
                            {footerContent}
                        </motion.div>
                    </div>
                }
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={guessState}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={variants}
                    >
                        {bodyContent}
                    </motion.div>
                </AnimatePresence>
            </HudWindow>
        </div>
    );
}
