import PageHeading from "@/components/dashboard/page-heading";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import React from "react";

export default function NotFound() {
  return (
    <>
      <div className="container min-h-96 flex items-center justify-center">
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-20 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-indigo-600 dark:text-indigo-500">404</h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{'Something\'s missing.'}</p>
              <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Rất tiếc, chúng tôi không tìm thấy trang này. </p>
              <Button size={'lg'} asChild>
                <Link href={'/'}>
                  <ArrowLeft className={'w-5 h-5 mr-3'} /> Quay lại Trang chủ
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
