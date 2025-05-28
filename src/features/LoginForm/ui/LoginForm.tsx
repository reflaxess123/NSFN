import { loginUser } from '@/entities/User';
import { RegisterForm } from '@/features/RegisterForm';
import { ButtonVariant } from '@/shared/components/Button/model/types';
import { Button } from '@/shared/components/Button/ui/Button';
import { Input } from '@/shared/components/Input';
import { useAppDispatch, useModal } from '@/shared/hooks';
import { useLoginForm } from '../model/hooks';
import type { LoginFormSchema } from '../model/schema';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const { register, handleSubmit, formState, getFieldError } = useLoginForm();
  const dispatch = useAppDispatch();
  const loginModal = useModal('login-modal');

  const onSubmit = (data: LoginFormSchema) => {
    dispatch(loginUser({ email: data.username, password: data.password }));
  };

  const registerModal = useModal('register-modal');

  const handleOpenRegisterModal = () => {
    registerModal.open(<RegisterForm />);
    loginModal.close();
  };

  return (
    <>
      <div className={styles.loginForm}>
        <p className={styles.title}>Login form</p>
        {formState.errors.username && (
          <p className={styles.error}>{getFieldError('username')}</p>
        )}
        <Input
          {...register('username')}
          type="email"
          placeholder="Email"
          fullWidth
        />

        {formState.errors.password && (
          <p className={styles.error}>{getFieldError('password')}</p>
        )}
        <Input
          {...register('password')}
          type="password"
          placeholder="Password"
          fullWidth
        />

        <div className={styles.buttons}>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Loading...' : 'Login'}
          </Button>

          <Button
            type="button"
            variant={ButtonVariant.GHOST}
            disabled={formState.isSubmitting}
            onClick={handleOpenRegisterModal}
          >
            Register
          </Button>
        </div>
      </div>
    </>
  );
};
