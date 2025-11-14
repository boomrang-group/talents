import LoginForm from '@/components/auth/login-form';
import AuthLayout from '@/components/auth/auth-layout';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Connectez-vous à votre compte"
      description="Accédez à votre tableau de bord et continuez l'aventure Talents Bantudemy."
    >
      <LoginForm />
    </AuthLayout>
  );
}
