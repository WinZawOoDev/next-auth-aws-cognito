import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function OAuth2Fail() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authorization Failed</CardTitle>
          <CardDescription>
            We couldn't complete the authorization process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Authorization code is required but was not found in the URL
              parameters.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Go Back</Button>
          <Button>Retry Authorization</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
