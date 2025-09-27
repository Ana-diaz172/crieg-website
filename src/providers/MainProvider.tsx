"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export default function MainProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stripePromise = loadStripe(
    "pk_test_51SBlaJ1uxUvOpPGtBSw55Jek8U64zVR0s6tJPNzPVgPbDlaIBgyy4D6Y5zABokFT8jE1HQo7kXkPBMFwHfGdjapx00a5OFBmT4"
  );
  const fetchClientSecret = async () => {
    try {
      const response = await axios.post("/create-checkout-session");
      return response.data.checkoutSessionClientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw error;
    }
  };
  return (
    <CheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <Navbar />
      {children}
      <Footer />
    </CheckoutProvider>
  );
}
