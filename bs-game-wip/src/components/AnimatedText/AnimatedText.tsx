import {motion, useMotionValue, useTransform, animate} from 'framer-motion';
import {useEffect, useState} from "react";
import styles from "./styles.module.scss"

type Props = {
    text: string,
    delay?: number,
    speed?: number,
    classes?: string,
    onComplete?: () => void
}

export default function AnimatedText({text, delay = 0, speed = .05, classes,  onComplete }: Props) {
    const [done, setDone] = useState(false);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    const displayText = useTransform(rounded, (latest) =>
        text.slice(0, latest)
    );

    const handleLineCompletion = () => {
        setDone(true);
        onComplete && onComplete()
    }

    useEffect(() => {
        const controls = animate(count, text.length, {
            type: "tween",
            duration: text.length * speed,
            ease: "easeInOut",
            delay,
            onComplete: () => handleLineCompletion()
        });
        return controls.stop;
    }, []);

    return (
        <>
            <motion.span className={classes}>{displayText}</motion.span>
            {!done && (
                <span className={styles.cursor}/>
            )}
        </>
    );
};