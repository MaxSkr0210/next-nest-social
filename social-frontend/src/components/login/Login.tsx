'use client';

import styles from './Login.module.css';
import { CustomInput } from '@/components/ui/input/Input';
import Image from 'next/image';
import { CustomButton } from '@/components/ui/button/customButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthApi } from '@/api/auth.api';
import { ILoginInput, LoginSchema } from '@/schemas/login.schema';
import { EUrl } from '@/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CustomLink } from '@/components/ui/link/link';
import { isAxiosError } from 'axios';
import { ErrorMessage } from '@/components/ui/errorMessage/errorMessage';

export const Login = () => {
    const router = useRouter();
    const [titleText, setTitleText] = useState('');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ILoginInput>({
        resolver: zodResolver(LoginSchema),
    });
    const authApi = AuthApi.getInstance();

    const onClickHandler = async (data: ILoginInput) => {
        try {
            await authApi.login(data);
            router.push(EUrl.HOME);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.status === 404) {
                    setError('email', {
                        message: error.response!.data.message,
                    });
                }
            }
        }
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1500px)');

        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setTitleText(e.matches ? 'Login' : 'Welcome Back!');
        };

        handleMediaChange(mediaQuery);

        mediaQuery.addEventListener('change', handleMediaChange);

        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    return (
        <div className={styles.window}>
            <div className={styles.formBlock}>
                <h2 className={styles.title}>{titleText}</h2>
                <form className={styles.form} onSubmit={handleSubmit(onClickHandler)}>
                    <CustomInput
                        label={'Email'}
                        type={'email'}
                        placeholder={'email@gmail.com'}
                        {...register('email')}
                    />
                    <CustomInput
                        label={'Password'}
                        type={'password'}
                        placeholder={'Enter your password'}
                        {...register('password')}
                    />
                    <CustomButton className={styles.btn}>Login</CustomButton>
                </form>
                <ErrorMessage error={errors.email?.message || errors.password?.message} />
                <p className={styles.text}>
                    Don’t have an account? <CustomLink href={EUrl.REGISTER}>Sign up</CustomLink>
                </p>
            </div>
            <div className={styles.figure}></div>
            <div className={styles.men}>
                <Image
                    src={'/images/login_image.png'}
                    alt={'image'}
                    height={500}
                    width={500}
                    className={styles.image}
                />
            </div>
        </div>
    );
};
