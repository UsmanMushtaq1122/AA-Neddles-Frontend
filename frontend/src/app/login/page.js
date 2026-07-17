import LoginPageContent from './LoginPageContent';

export const metadata = {
  title: 'Login — AA Neddles',
  description:
    'Sign in to your AA Neddles account. Access your orders, wishlist, and exclusive member benefits.',
  openGraph: {
    title: 'Login — AA Neddles',
    description: 'Sign in to your AA Neddles account.',
    type: 'website',
  },
};

export default function LoginPage() {
  return <LoginPageContent />;
}
