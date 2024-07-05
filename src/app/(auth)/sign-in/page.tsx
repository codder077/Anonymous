"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {  Loader2 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";



function page() {

    const [isSubmitting, setIsSubmitting] = useState(false);


    const { toast } = useToast();
    const router = useRouter()
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {

            identifier: "",
            password: "",
        },
    });


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })

        if (result?.error) {
            if (result?.error == "CredentialsSignin") {
                toast: ({
                    title: "Login failed",
                    description: " Incorrect username or password",
                    variant: "destructive"
                })
            } else {
                toast: ({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
        }
        if (result?.url) {
            router.replace("/dashboard")
        }
    }



    return (

        <div className="flex justify-center item-center min-h-screen bg-gray-100 p-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign in to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input

                                            placeholder="email/username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}

                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} >
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : ('Signin')
                            }
                        </Button>
                    </form>
                </Form>
                <p>
                    Already a member?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}


export default page;