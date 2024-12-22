import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

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

import { PasswordInput } from "@/components/ui/password-input";

// Schema for password validation
const formSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ResetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Invalid or missing reset token. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: values.password,
            token,
          }),
        }
      );

      if (!response.ok) {
        // Assuming error message is in JSON format
        const errorData = await response.json();
        const errorMessage =
          errorData?.error || "Failed to reset the password. Please try again.";
        throw new Error(errorMessage);
      }

      toast.success(
        "Password reset successful. You can now log in with your new password."
      );
    } catch (error: any) {
      console.error("Error resetting password", error);
      // Use only the error message from the response
      toast.error(
        error.message || "Failed to reset the password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto container items-center justify-center h-dvh">
      <div className="flex min-h-[50vh] h-full w-full items-center justify-center px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  {/* New Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="password">New Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="confirmPassword"
                            placeholder="******"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Toaster richColors />
      </div>
    </div>
  );
}
