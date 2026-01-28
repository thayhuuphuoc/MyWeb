import { LoginForm } from "@/components/auth/login-form";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Đăng nhập',
}
const LoginPage = () => {
  return (
    <LoginForm />
  );
}

export default LoginPage;
