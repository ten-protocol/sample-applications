import { useEffect, useState } from 'react';

import AnimatedText from '@/components/AnimatedText/AnimatedText';
import HudWindow from '@/components/HudWindow/HudWindow';
import { Message, useMessageStore } from '@/stores/messageStore';

import styles from './styles.module.scss';

export default function MessageLog() {
    const [messages] = useMessageStore((state) => [state.messages]);
    const [displayedItems, setDisplayedItems] = useState<Message[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [readyForNewLine, setReadyForNewLine] = useState(true);

    useEffect(() => {
        if (currentIndex < messages.length && readyForNewLine) {
            setReadyForNewLine(false);
            setDisplayedItems((prev) => [...prev, messages[currentIndex]]);
            setCurrentIndex((prev) => prev + 1);
        }
    }, [messages, readyForNewLine]);

    const handleCompletedLine = () => {
        setReadyForNewLine(true);
    };

    return (
        <HudWindow
            headerTitle={
                currentIndex < messages.length || !readyForNewLine
                    ? 'Incoming message....'
                    : 'Message Log'
            }
        >
            <div className="overflow-y-auto max-h-40">
                <ul className="flex flex-col-reverse justify-start">
                    {displayedItems.map((message, i) => (
                        <li className={styles.line} key={message.id + i}>
                            <AnimatedText
                                classes="text-sm"
                                text={message.text}
                                onComplete={handleCompletedLine}
                            />
                        </li>
                    ))}
                    {readyForNewLine && (
                        <li>
                            <span className={`${styles.cursor} ${styles.withFlash}`} />
                        </li>
                    )}
                </ul>
            </div>
        </HudWindow>
    );
}
