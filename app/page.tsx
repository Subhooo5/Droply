"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  CloudUpload,
  Shield,
  Folder,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                Store your <span className="text-primary">images</span> with ease
              </h1>
              <p className="text-lg text-muted-foreground">Simple. Secure. Fast.</p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <SignedOut>
                  <Link href="/sign-up">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button size="lg">
                      Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </SignedIn>
              </div>
            </div>

            <div className="flex justify-center order-first lg:order-last">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-24 md:h-32 w-24 md:w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-muted">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">What You Get</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition">
              <CardContent className="p-6 text-center">
                <CloudUpload className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Quick Uploads</h3>
                <p className="text-muted-foreground">Drag, drop, done.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardContent className="p-6 text-center">
                <Folder className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Organization</h3>
                <p className="text-muted-foreground">Keep it tidy, find it fast.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">Locked Down</h3>
                <p className="text-muted-foreground">Your images, your eyes only.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Ready?</h2>
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg">
                  Let's Go <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg">
                  Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <CloudUpload className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Droply</span>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Droply</p>
        </div>
      </footer>
    </div>
  );
}
