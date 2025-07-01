"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, User, LogOut, Shield, ArrowRight } from "lucide-react";

export default function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center p-12 space-y-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto shadow-sm">
        <CardHeader className="flex items-center gap-3 border-b">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">User Profile</h2>
        </CardHeader>
        <CardContent className="text-center py-10">
          <div className="mb-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <p className="text-lg font-medium">Not Signed In</p>
            <p className="text-muted-foreground mt-2">
              Please sign in to access your profile
            </p>
          </div>
          <Button
            onClick={() => router.push("/sign-in")}
            className="px-8"
          >
            Sign In
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const email = user.primaryEmailAddress?.emailAddress || "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const userRole = user.publicMetadata.role as string | undefined;

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  return (
    <Card className="max-w-md mx-auto shadow-sm">
      <CardHeader className="flex items-center gap-3 border-b">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">User Profile</h2>
      </CardHeader>

      <CardContent className="py-6 space-y-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.imageUrl} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold">{fullName}</h3>

          {email && (
            <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          )}

          {userRole && (
            <Badge className="mt-3">{userRole}</Badge>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary/70" />
              <span className="font-medium">Account Status</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Active
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary/70" />
              <span className="font-medium">Email Verification</span>
            </div>
            <Badge
              variant="outline"
              className={
                user.emailAddresses?.[0]?.verification?.status === "verified"
                  ? "text-green-600 border-green-600"
                  : "text-yellow-600 border-yellow-600"
              }
            >
              {user.emailAddresses?.[0]?.verification?.status === "verified"
                ? "Verified"
                : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end border-t">
        <Button
          variant="destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}
