import { ReactNode } from "react";

export const metadata = {
  title: "لوحة التحكم - هله بغداد",
  description: "لوحة تحكم إدارة مهرجان هله بغداد",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
