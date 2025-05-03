import styles from './link.module.css';
import Link from 'next/link';
import { AnchorHTMLAttributes, PropsWithChildren } from 'react';
import cn from 'classnames';

interface IProps extends AnchorHTMLAttributes<HTMLAnchorElement>, PropsWithChildren {}

export const CustomLink = ({ children, href, className, ...props }: IProps) => {
    const safeHref = href || '/';

    return (
        <Link {...props} href={safeHref} className={cn(styles.link, className)}>
            {children}
        </Link>
    );
};
