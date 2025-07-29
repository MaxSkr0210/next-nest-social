import styles from './home.module.css';
import { Sidebar } from '@/components/home/sidebar/sidebar';
import { Main } from '@/components/home/main/main';

export const HomePage = () => {
    return (
        <div className={styles.home}>
            <Sidebar />
            <Main />
        </div>
    );
};
