import styles from './Input.module.css';
import { InputHTMLAttributes, JSX } from 'react';
import cn from 'classnames';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: () => JSX.Element;
}

export const CustomInput = ({ type, label, icon, ...props }: IProps) => {
    return (
        <label className={cn(styles.label, type === 'email' && styles.emailLabel)}>
            <span className={styles.labelText}>{label}</span>
            {icon && <span className={styles.icon}>{icon()}</span>}
            {type === 'email' && <span className={styles.emailIcon}></span>}
            {type === 'password' && <span className={styles.passwordIconLock}></span>}
            {type === 'password' && <span className={styles.passwordIconShow}></span>}
            <input className={styles.input} {...props} type={type || 'text'} />
        </label>
    );
};
