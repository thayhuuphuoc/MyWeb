"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useTransition, useState, useEffect} from "react";
import { useSession } from "next-auth/react";

import { Switch } from "@/components/ui/switch";
import { SettingsSchema } from "@/schemas/auth.schema";
import {
  Card,
  CardHeader,
  CardContent, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/auth/settings";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/forms/form-error";
import { FormSuccess } from "@/components/forms/form-success";
import {useIntersectionObserver} from "usehooks-ts";

const Security = (props: {
  observe: () => void
}) => {
  const [ref, entry] = useIntersectionObserver({
    threshold: 1,
    root: null,
    rootMargin: "32px",
    onChange: isIntersecting => {
      isIntersecting && props.observe()
    }
  });

  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      confirm_newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      isPasswordSet: user?.isPasswordSet || undefined,
    }
  });

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      settings(values)
        .then(async (res) => {
          if (res.error) {
            setError(res.error);
          }

          if (res.success) {
            update()
            form.reset()
            setSuccess(res.success);
          }
        })
        .catch((e) => {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error in security update:", e);
          }
          setError("Đã xảy ra lỗi!")
        });
    });
  }

  return (
    <Card className={'mb-8 scroll-mt-20'} id={'security'} ref={ref}>
      <CardHeader className={'px-0 mx-6 pb-4 mb-4 border-b'}>
        <CardTitle>
          Bảo Mật
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6 max-w-lg"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              {Boolean(user?.isPasswordSet) && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className={'flex flex-col md:flex-row md:gap-5'}>
                      <FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
                        Mật khẩu hiện tại
                      </FormLabel>
                      <div className={'space-y-2 flex-grow'}>
                       <FormControl>
                         <Input
                           {...field}
                           placeholder="******"
                           type="password"
                           disabled={isPending}
                           value={field.value || ""}
                         />
                       </FormControl>
                       <FormMessage />
                     </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className={'flex flex-col md:flex-row md:gap-5'}>
                    <FormLabel className={'flex-shrink-0 md:w-40 md:mt-4'}>
                      Mật khẩu mới
                    </FormLabel>
                    <div className={'space-y-2 flex-grow'}>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={isPending}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_newPassword"
                render={({ field }) => (
                  <FormItem className={'flex flex-col md:flex-row md:gap-5'}>
                    <FormLabel className={'flex-shrink-0 md:w-40 md:mt-4 leading-snug'}>
                      Nhập lại Mật khẩu mới
                    </FormLabel>
                    <div className={'space-y-2 flex-grow'}>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={isPending}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Xác thực hai lớp</FormLabel>
                      <FormDescription>
                        Gửi mã xác thực tới email mỗi khi đăng nhập
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              variant={'secondary'}
              disabled={isPending}
              type="submit"
            >
              Lưu lại
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
   );
}

export default Security
