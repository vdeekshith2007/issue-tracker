"use client";

import React, { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Callout,
  Tabs,
  Box,
} from "@radix-ui/themes";
import Spinner from "@/app/components/Spinner";
import axios from "axios";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
        callbackUrl,
      });

      if (res?.error) {
        setLoginError("Invalid email or password. Please try again.");
        setIsLoggingIn(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setLoginError("An unexpected error occurred during login.");
      setIsLoggingIn(false);
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoginError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegError("");
    setRegSuccess("");

    try {
      await axios.post("/api/register", {
        name: regName,
        email: regEmail,
        password: regPassword,
      });

      setRegSuccess("Account created successfully! You can now sign in.");
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
      setIsRegistering(false);
    } catch (err: any) {
      setIsRegistering(false);
      setRegError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  return (
    <Flex justify="center" align="center" className="min-h-[75vh]">
      <Card size="4" className="w-full max-w-md shadow-lg p-6">
        <Flex direction="column" gap="4">
          <Box className="text-center">
            <Heading size="6" className="text-zinc-900 font-bold">
              Issue Tracker Pro
            </Heading>
            <Text size="2" color="gray">
              Sign in to manage issues, sprints, and priorities
            </Text>
          </Box>

          <Tabs.Root defaultValue="login">
            <Tabs.List className="w-full justify-center mb-4">
              <Tabs.Trigger value="login">Sign In</Tabs.Trigger>
              <Tabs.Trigger value="register">Create Account</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <Callout.Root color="red">
                    <Callout.Text>⚠ {loginError}</Callout.Text>
                  </Callout.Root>
                )}

                <div>
                  <Text size="2" weight="medium" mb="1" as="div">
                    Email Address
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Text size="2" weight="medium" mb="1" as="div">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <Button className="w-full cursor-pointer" disabled={isLoggingIn}>
                  {isLoggingIn ? <Spinner /> : "Sign In"}
                </Button>

                <Box className="pt-3 border-t border-zinc-100">
                  <Text size="1" color="gray" weight="medium" as="div" mb="2">
                    Quick demo credentials:
                  </Text>
                  <Flex gap="2" wrap="wrap">
                    <Button
                      type="button"
                      variant="soft"
                      size="1"
                      onClick={() =>
                        handleQuickFill(
                          "vataparthideekshith18@gmail.com",
                          "Deekshith@8077"
                        )
                      }
                    >
                      👤 Deekshith
                    </Button>
                    <Button
                      type="button"
                      variant="soft"
                      size="1"
                      onClick={() =>
                        handleQuickFill(
                          "sarah.chen@issuetracker.pro",
                          "Password123!"
                        )
                      }
                    >
                      Sarah (Lead)
                    </Button>
                  </Flex>
                </Box>
              </form>
            </Tabs.Content>

            <Tabs.Content value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {regError && (
                  <Callout.Root color="red">
                    <Callout.Text>⚠ {regError}</Callout.Text>
                  </Callout.Root>
                )}

                {regSuccess && (
                  <Callout.Root color="green">
                    <Callout.Text>✓ {regSuccess}</Callout.Text>
                  </Callout.Root>
                )}

                <div>
                  <Text size="2" weight="medium" mb="1" as="div">
                    Full Name
                  </Text>
                  <TextField.Root
                    placeholder="Your Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div>
                  <Text size="2" weight="medium" mb="1" as="div">
                    Email Address
                  </Text>
                  <TextField.Root
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Text size="2" weight="medium" mb="1" as="div">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>

                <Button className="w-full cursor-pointer" disabled={isRegistering}>
                  {isRegistering ? <Spinner /> : "Create Account"}
                </Button>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </Flex>
      </Card>
    </Flex>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SignInContent />
    </Suspense>
  );
}
