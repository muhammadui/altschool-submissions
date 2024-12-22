import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
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
import { Input } from "@/components/ui/input";

// Schema for email validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgetPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  // Updated onSubmit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); // Set loading state to true
    try {
      // Send a POST request to the backend to trigger the forgot password process
      const response = await fetch(
        "http://localhost:3000/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      if (!response.ok) {
        // Handle backend errors
        const errorData = await response.json();
        toast.error(
          errorData.error ||
            "Failed to send password reset email. Please try again."
        );
        return;
      }

      // If the request was successful
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      // Handle any network errors
      console.error("Error sending password reset email", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  return (
    <div className="mx-auto container items-center justify-center h-dvh">
      <div className="flex min-h-[40vh] h-full w-full items-center justify-center px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4">
                  {/* Email Field */}
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors />
    </div>
  );
}
