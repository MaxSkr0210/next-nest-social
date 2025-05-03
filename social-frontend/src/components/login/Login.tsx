'use client';

import styles from './Login.module.css';
import { CustomInput } from '@/components/ui/input/Input';
import Image from 'next/image';
import { CustomButton } from '@/components/ui/button/customButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthApi } from '@/api/auth.api';
import { ILoginInput, LoginSchema } from '@/schemas/login.schema';
import { ACCESS_TOKEN_KEY } from '@/constants/constatnts';

export const Login = () => {
    const { register, handleSubmit } = useForm<ILoginInput>({
        resolver: zodResolver(LoginSchema),
    });
    const authApi = AuthApi.getInstance();

    const onClickHandler = async (data: ILoginInput) => {
        try {
            const user = await authApi.login(data);
            localStorage.setItem(ACCESS_TOKEN_KEY, user.accessToken);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className={styles.window}>
            <div className={styles.formBlock}>
                <h2>Welcome Back!</h2>
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
            </div>
            <div className={styles.figure}></div>
            <div className={styles.men}>
                <Image src={'/images/login_image.png'} alt={'image'} height={500} width={500} />
            </div>
        </div>
    );
};
