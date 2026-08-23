import { CustomerAuthForm } from "@/components/forms/customer-auth-form";
import { PublicHeader } from "@/components/navbar/public-header";

export default function CustomerLoginPage() {
  return (
    <>
      <PublicHeader />
      <CustomerAuthForm />
    </>
  );
}
