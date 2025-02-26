"use client";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import "./globals.css";

export default function Home() {
  return (
    <div className="dark:bg-gray-900">
      {/* Toaster must be present in the app */}
      <Toaster />

      <h1>Dashboard</h1>
      <h1 className="text-3xl font-bold underline text-amber-300">
        Hello world!
      </h1>
      <button
        onClick={() => {
          toast.success("Hello, world!");
        }}
      >
        Show Toast
      </button>
    </div>
  );
}
