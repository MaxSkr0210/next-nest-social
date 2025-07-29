'use client';

import styles from './Registration.module.css';
import { CustomInput } from '@/components/ui/input/Input';
import Image from 'next/image';
import { CustomButton } from '@/components/ui/button/customButton';
import { UserIcon } from '@/components/ui/svg/UserIcon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthApi } from '@/api/auth.api';
import { IRegistrationInput, RegistrationSchema } from '@/schemas/registration.schema';
import { CustomLink } from '@/components/ui/link/link';
import { useRouter } from 'next/navigation';
import { EUrl } from '@/constants';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '@/components/ui/errorMessage/errorMessage';
import { isAxiosError } from 'axios';

export const Registration = () => {
    const router = useRouter();
    const [titleText, setTitleText] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        getValues,
    } = useForm<IRegistrationInput>({
        resolver: zodResolver(RegistrationSchema),
    });
    const authApi = AuthApi.getInstance();

    const onClickHandler = async (data: IRegistrationInput) => {
        if (data.password !== data.rePassword) return;

        try {
            await authApi.registration(data);
            router.push(EUrl.HOME);
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.status === 409) {
                    if (error.response!.data.message.includes('username')) {
                        setError('username', {
                            message: error.response!.data.message,
                        });
                    } else if (error.response!.data.message.includes('email')) {
                        setError('email', {
                            message: error.response!.data.message,
                        });
                    }
                }
            }
        }
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1500px)');

        const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setTitleText(e.matches ? 'Sign-up' : 'Create Account');
        };

        handleMediaChange(mediaQuery);

        mediaQuery.addEventListener('change', handleMediaChange);

        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    return (
        <div className={styles.window}>
            <div className={styles.figure}></div>
            <div className={styles.men}>
                <Image
                    src={'/images/registration_image.png'}
                    alt={'image'}
                    height={700}
                    width={700}
                    className={styles.image}
                />
            </div>
            <div className={styles.formBlock}>
                <h2 className={styles.title}>{titleText}</h2>
                <form className={styles.form} onSubmit={handleSubmit(onClickHandler)}>
                    <CustomInput
                        label={'Email'}
                        type={'email'}
                        placeholder={'email@gmail.com'}
                        {...register('email', {
                            required: true,
                        })}
                    />
                    <CustomInput
                        label={'Username'}
                        placeholder={'Enter your username'}
                        icon={UserIcon}
                        {...register('username', {
                            required: true,
                        })}
                    />
                    <CustomInput
                        label={'Password'}
                        type={'password'}
                        placeholder={'Enter your password'}
                        {...register('password', {
                            required: true,
                        })}
                    />
                    <CustomInput
                        label={'Password'}
                        type={'password'}
                        placeholder={'Repeat your password'}
                        {...register('rePassword', {
                            required: true,
                            validate: match => {
                                const password = getValues('password');
                                return match === password || 'Passwords should match!';
                            },
                        })}
                    />
                    <CustomButton className={styles.btn}>Create Account</CustomButton>
                </form>
                <ErrorMessage
                    error={
                        errors.email?.message ||
                        errors.username?.message ||
                        errors.password?.message ||
                        errors.rePassword?.message
                    }
                />
                <div>
                    <p className={styles.text}>
                        Already have an account? <CustomLink href={EUrl.LOGIN}>Sign in</CustomLink>
                    </p>
                </div>
            </div>
        </div>
    );
};
