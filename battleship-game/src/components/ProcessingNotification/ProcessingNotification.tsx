import { AnimatePresence, motion } from 'framer-motion';

import Button from '@/components/Button/Button';
import HudWindow from '@/components/HudWindow/HudWindow';
import { useContractStore } from '@/stores/contractStore';

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

    const CloseButton = <Button onClick={handleClose}>Close</Button>;

    if (guessState === 'IDLE') return null;

    if (guessState === 'STARTED') {
        footerContent = <p>Processing...</p>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg inline-block px-1">Target locked and confirmed.</p>
                <p className="text-sm px-1">Initiating plasma cannon sequence</p>
            </div>
        );
    }

    if (guessState === 'ERROR') {
        footerContent = <div>{CloseButton}</div>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg bg-red-600 inline-block px-1">WEAPON ACTIVATION FAILED</p>
                <p className="text-sm px-1">Error detected</p>
                <p className="text-sm px-1">{lastError}</p>
            </div>
        );
    }

    if (guessState === 'TRANSACTION_SUCCESS') {
        footerContent = <p>CANNONS FIRED...</p>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg inline-block px-1">Ordinance en route to target</p>
                <p className="text-sm inline-block px-1">Monitor for impact confirmation</p>
            </div>
        );
    }

    if (guessState === 'MISS') {
        footerContent = <div>{CloseButton}</div>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg inline-block px-1">Shot failed to find target</p>
                <p className="text-sm inline-block px-1">
                    Initiate trajectory analysis and recalibrate targeting systems
                </p>
            </div>
        );
    }

    if (guessState === 'HIT') {
        footerContent = <div>{CloseButton}</div>;
        bodyContent = (
            <div className="flex flex-col items-start">
                <p className="text-lg bg-blue-600 inline-block px-1 mb-2">DIRECT HIT</p>
                <p className="text-sm inline-block px-1">
                    Assess damage and prepare for immediate re-engagement
                </p>
            </div>
        );
    }

    const variants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
    };

    return (
        <div className="-mt-60 mb-60">
        <HudWindow
            headerTitle="Striking coordinates"
            speed={0.1}
            modalMode={true}
            transparentOverlay={true}
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
                    className="py-2 w-96"
                >
                    {bodyContent}
                </motion.div>
            </AnimatePresence>
        </HudWindow>
        </div>
    );
}
