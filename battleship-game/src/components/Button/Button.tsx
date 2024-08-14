import { ReactNode } from 'react';

import styles from './styles.module.scss';

type Props = {
    onClick?: () => void;
    variant?: 'light' | 'dark';
    children?: ReactNode;
    classes?: string | string[];
};

export default function Button({ onClick, variant = 'dark', children, classes = '' }: Props) {
    return (
        <button
            className={[styles.button, variant === 'light' ? styles.light : '', ...classes].join(
                ' '
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
