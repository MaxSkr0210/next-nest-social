import styles from './customButton.module.css';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {}

export const CustomButton = ({ children, className, ...props }: IProps) => {
    return (
        <button {...props} className={cn(styles.btn, className)}>
            {children}
        </button>
    );
};
