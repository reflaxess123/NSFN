import { loginUser } from '@/entities/User';
import { useAppDispatch } from '@/shared/hooks';
import { useLoginForm } from '../model/hooks';
import type { LoginFormSchema } from '../model/schema';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const { register, handleSubmit, formState, getFieldError } = useLoginForm();
  const dispatch = useAppDispatch();

  const onSubmit = (data: LoginFormSchema) => {
    dispatch(loginUser({ email: data.username, password: data.password }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={styles.loginForm}
    >
      {formState.errors.username && (
        <p className={styles.error}>{getFieldError('username')}</p>
      )}
      <input {...register('username')} type="email" placeholder="Email" />
      {formState.errors.password && (
        <p className={styles.error}>{getFieldError('password')}</p>
      )}
      <input {...register('password')} type="password" placeholder="Password" />
      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
