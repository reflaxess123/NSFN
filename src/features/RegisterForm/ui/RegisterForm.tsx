import { registerUser } from '@/entities/User';
import { LoginForm } from '@/features/LoginForm';
import { ButtonVariant } from '@/shared/components/Button/model/types';
import { Button } from '@/shared/components/Button/ui/Button';
import { Input } from '@/shared/components/Input';
import { useAppDispatch, useModal } from '@/shared/hooks';
import { useRegisterForm } from '../model/hooks';
import type { RegisterFormSchema } from '../model/schema';
import styles from './RegisterForm.module.scss';

export const RegisterForm = () => {
  const { register, handleSubmit, formState, getFieldError } =
    useRegisterForm();

  const dispatch = useAppDispatch();

  const loginModal = useModal('login-modal');
  const registerModal = useModal('register-modal');

  const handleOpenLogin = () => {
    loginModal.open(<LoginForm />);
    registerModal.close();
  };

  const onSubmit = (data: RegisterFormSchema) => {
    dispatch(registerUser({ email: data.username, password: data.password }));
  };

  return (
    <>
      <div className={styles.registerForm}>
        <p className={styles.title}>Register form</p>
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
            variant={ButtonVariant.GHOST}
            disabled={formState.isSubmitting}
            onClick={handleOpenLogin}
          >
            Login
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Loading...' : 'Register'}
          </Button>
        </div>
      </div>
    </>
  );
};
