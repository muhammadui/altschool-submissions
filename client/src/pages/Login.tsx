import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { NavLink } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { PasswordInput } from "@/components/ui/password-input";

// Improved schema with additional validation rules
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("http://localhost:3000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        toast.error(errorData.message || "Login failed");
        return;
      }

      const data = await response.json();
      console.log(data);
      // Handle successful login
      toast.success("Login successful! Redirecting...");

      // Optional: Redirect or set authentication state
      // router.push('/dashboard');
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="mx-auto container items-center justify-center h-dvh">
      <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="johndoe@mail.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <NavLink
                            to="/forget-password"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </NavLink>
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <NavLink to="/register" className="underline">
                Sign up
              </NavLink>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
