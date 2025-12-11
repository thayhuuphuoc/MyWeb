import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Đã xảy ra lỗi!"
      backButtonHref="/auth/login"
      backButtonLabel="Quay lại đăng nhập"
    >
      <div className="w-full flex justify-center items-center">
      <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
