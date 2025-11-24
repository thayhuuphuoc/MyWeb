import {Metadata} from "next";
import PageHeading from "@/components/dashboard/page-heading";
import Settings from "@/app/(protected)/dashboard/settings/settings";

export const metadata: Metadata = {
  title: 'Cài đặt Tài khoản',
}

const SettingsPage = async () => {
  return (
    <>
      <PageHeading title={'Cài đặt Tài khoản'} />
      <Settings/>
    </>
  );
}

export default SettingsPage;
