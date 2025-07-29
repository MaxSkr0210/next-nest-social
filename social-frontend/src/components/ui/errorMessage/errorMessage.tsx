import styles from './errorMessage.module.css';

interface IProps {
    error?: string;
}

export const ErrorMessage = ({ error }: IProps) => {
    return <>{error && <span className={styles.error}>{error}</span>}</>;
};
