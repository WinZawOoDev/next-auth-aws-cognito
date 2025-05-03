"use client"

import { registerUser } from "@/lib/auth/server-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { useActionState } from "react"

const initialState = {
  success: false,
  errors: {
    form: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  },
}

export default function RegisterForm() {

  const [state, formAction, pending] = useActionState(registerUser, initialState)


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        {state.errors?.form && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {state.errors.form}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className={state.errors?.name ? "text-red-500" : ""}>
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              className={state.errors?.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {state.errors?.name && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {state.errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={state.errors?.email ? "text-red-500" : ""}>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              required
              className={state.errors?.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {state.errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={state.errors?.password ? "text-red-500" : ""}>
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className={state.errors?.password ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            <ul className="text-xs text-muted-foreground space-y-1 mt-2">
              <li className={password8Chars(state)}>Must be at least 8 characters</li>
              <li className={passwordUppercase(state)}>Must include uppercase letter</li>
              <li className={passwordLowercase(state)}>Must include lowercase letter</li>
              <li className={passwordNumber(state)}>Must include number</li>
            </ul>
            {state.errors?.password && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {state.errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={state.errors?.confirmPassword ? "text-red-500" : ""}>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={state.errors?.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {state.errors?.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {state.errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            {pending ? "Registering..." :"Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline-offset-4 hover:underline">
            Sign in
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}

// Helper functions to determine password requirement styling
function password8Chars(state: any) {
  if (state.errors?.password?.includes("at least 8 characters")) {
    return "text-red-500"
  }
  return ""
}

function passwordUppercase(state: any) {
  if (state.errors?.password?.includes("uppercase letter")) {
    return "text-red-500"
  }
  return ""
}

function passwordLowercase(state: any) {
  if (state.errors?.password?.includes("lowercase letter")) {
    return "text-red-500"
  }
  return ""
}

function passwordNumber(state: any) {
  if (state.errors?.password?.includes("number")) {
    return "text-red-500"
  }
  return ""
}
