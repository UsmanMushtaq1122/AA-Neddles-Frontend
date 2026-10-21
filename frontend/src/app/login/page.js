import LoginPageContent from './LoginPageContent';

export const metadata = {
  title: 'Login — AA Needles',
  description:
    'Sign in to your AA Needles account. Access your orders, wishlist, and exclusive member benefits.',
  openGraph: {
    title: 'Login — AA Needles',
    description: 'Sign in to your AA Needles account.',
    type: 'website',
  },
};

export default function LoginPage() {
  return <LoginPageContent />;
}
