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
import { ACCESS_TOKEN_KEY } from '@/constants/constatnts';

export const Registration = () => {
    const { register, handleSubmit } = useForm<IRegistrationInput>({
        resolver: zodResolver(RegistrationSchema),
    });
    const authApi = AuthApi.getInstance();

    const onClickHandler = async (data: IRegistrationInput) => {
        if (data.password !== data.rePassword) return;

        try {
            const user = await authApi.registration(data);
            localStorage.setItem(ACCESS_TOKEN_KEY, user.access_token);
        } catch (error) {
            console.error(error);
        }
    };

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
                <h2>Create Account</h2>
                <form className={styles.form} onSubmit={handleSubmit(onClickHandler)}>
                    <CustomInput
                        label={'Email'}
                        type={'email'}
                        placeholder={'email@gmail.com'}
                        {...register('email')}
                    />
                    <CustomInput
                        label={'Username'}
                        placeholder={'Enter your username'}
                        icon={UserIcon}
                        {...register('username')}
                    />
                    <CustomInput
                        label={'Password'}
                        type={'password'}
                        placeholder={'Enter your password'}
                        {...register('password')}
                    />
                    <CustomInput
                        label={'Password'}
                        type={'password'}
                        placeholder={'Repeat your password'}
                        {...register('rePassword')}
                    />
                    <CustomButton className={styles.btn}>Create Account</CustomButton>
                </form>
                <div>
                    <p className={styles.text}>
                        Already have an account? <CustomLink>Sign in</CustomLink>
                    </p>
                </div>
            </div>
        </div>
    );
};
