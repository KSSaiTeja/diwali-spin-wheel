"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import Image from "next/image";
import confetti from "canvas-confetti";

const DynamicWheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false },
);
const DynamicFireworks = dynamic(() => import("@fireworks-js/react"), {
  ssr: false,
});
const DynamicConfetti = dynamic(
  () => import("canvas-confetti").then((mod) => mod.default),
  { ssr: false },
);

const data = [
  {
    option: "10% Off",
    style: { backgroundColor: "#170e9c", textColor: "white" },
  },
  {
    option: "30% Off",
    style: { backgroundColor: "#004bff", textColor: "white" },
  },
  {
    option: "50% Off",
    style: { backgroundColor: "#007dff", textColor: "white" },
  },
  {
    option: "80% Off",
    style: { backgroundColor: "#548eff", textColor: "white" },
  },
  {
    option: "Try Again",
    style: { backgroundColor: "#5f78a3", textColor: "white" },
  },
];

const probabilityDistribution = [
  ...Array(30).fill(0), // 10% Off
  ...Array(30).fill(1), // 30% Off
  ...Array(20).fill(2), // 50% Off
  ...Array(5).fill(3), // 80% Off
  ...Array(15).fill(4), // Try Again
];

const getOfferMessage = (offer: string) => {
  switch (offer) {
    case "10% Off":
      return "Great spin! Enjoy a 10% discount on our Premium Advisory Plan. Every saving counts towards your financial goals!";
    case "30% Off":
      return "Fantastic! You've unlocked a stellar 30% discount on our Premium Advisory Plan. This is your moment to supercharge your financial journey!";
    case "50% Off":
      return "Incredible! You've won a whopping 50% off our Premium Advisory Plan. Your financial future just got a lot brighter!";
    case "80% Off":
      return "Jackpot! You've hit the big one with an amazing 80% off our Premium Advisory Plan. This is a once-in-a-lifetime opportunity!";
    case "Try Again":
      return "Oh so close! But don't worry, your journey to financial success is just beginning. Thank you for participating!";
    default:
      return "Congratulations on your spin! Every turn of the wheel is a step towards financial empowerment.";
  }
};

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeeHgX3-7eXbLu45i0MCLXjPZsY1eBVUSYk732bJrrWyTBcEw/formResponse"; // Updated Google Form URL

export default function EnhancedSpinWheel() {
  const [step, setStep] = useState(2);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [wheelClassName, setWheelClassName] = useState("animate-wheel-jerk");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentOffer, setCurrentOffer] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const savedOffer = localStorage.getItem("currentOffer");
      const savedPhoneNumber = localStorage.getItem("currentPhoneNumber");
      if (savedOffer && savedPhoneNumber) {
        setCurrentOffer(savedOffer);
        setPhoneNumber(savedPhoneNumber);
        setStep(3);
      }
    }
  }, []);

  const checkIfPlayed = useCallback((number: string) => {
    if (typeof window !== "undefined") {
      try {
        const playedUsers = JSON.parse(
          localStorage.getItem("playedUsers") || "{}",
        );
        const currentPhoneNumber = localStorage.getItem("currentPhoneNumber");
        return !!playedUsers[number] || number === currentPhoneNumber;
      } catch (error) {
        console.error("Error checking played status:", error);
      }
    }
    return false;
  }, []);

  useEffect(() => {
    if (isMounted) {
      setHasPlayed(checkIfPlayed(phoneNumber));
    }
  }, [phoneNumber, checkIfPlayed, isMounted]);

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneError && phoneNumber.length >= 10 && !hasPlayed) {
      const savedOffer = localStorage.getItem("currentOffer");
      if (savedOffer) {
        setCurrentOffer(savedOffer);
        setStep(3);
      } else {
        setIsSpinning(true);
        handleSpinClick();
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);

    if (newPhoneNumber.length > 0 && !/^\d+$/.test(newPhoneNumber)) {
      setPhoneError("Please enter only numbers");
    } else if (newPhoneNumber.length > 0 && newPhoneNumber.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
    } else {
      setPhoneError("");
    }

    if (newPhoneNumber.length >= 10 && isMounted) {
      const hasPlayedBefore = checkIfPlayed(newPhoneNumber);
      setHasPlayed(hasPlayedBefore);
      if (hasPlayedBefore) {
        setPhoneError("You have already participated in this offer.");
      }
    } else {
      setHasPlayed(false);
    }
  };

  const handleSpinClick = () => {
    if (!mustSpin && !hasPlayed) {
      const randomIndex = Math.floor(
        Math.random() * probabilityDistribution.length,
      );
      const newPrizeNumber = probabilityDistribution[randomIndex];
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
      setHasPlayed(true);
      setWheelClassName("");
    }
  };

  const playSound = (soundFile: string) => {
    if (typeof window !== "undefined") {
      const audio = new Audio(soundFile);
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setIsSpinning(false);
    const newOffer = data[prizeNumber].option;
    setCurrentOffer(newOffer);
    const uniqueId = Date.now().toString(); // Generate a unique identifier
    if (typeof window !== "undefined") {
      localStorage.setItem("currentOffer", newOffer);
      localStorage.setItem("currentPhoneNumber", phoneNumber);
      localStorage.setItem("uniqueId", uniqueId); // Store the unique identifier
    }
    if (newOffer !== "Try Again" && isMounted) {
      // Play sounds
      playSound("/cracker-sound.wav");
      playSound("/confetti-sound.wav");

      // Trigger confetti
      if (typeof DynamicConfetti === "function") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      // Send initial data to Google Form
      sendToGoogleForm({
        "entry.1861090374": phoneNumber, // Assuming this is the phone number field
        "entry.875710030": newOffer,
        "entry.1128347265": uniqueId,
      });

      setStep(3);
    } else {
      setStep(4);
    } 
  };

  const sendToGoogleForm = async (data: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
    } catch (error) {
      console.error("Error sending data to Google Form:", error);
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const uniqueId = localStorage.getItem("uniqueId");

    const formData = new FormData();
    formData.append("entry.1861090374", phoneNumber);
    formData.append("entry.875710030", currentOffer);
    formData.append("entry.975279933", name);
    formData.append("entry.1286515812", email);
    formData.append("entry.1128347265", uniqueId || "");

    try {
      await sendToGoogleForm(Object.fromEntries(formData));
      if (typeof window !== "undefined") {
        const playedUsers = JSON.parse(
          localStorage.getItem("playedUsers") || "{}",
        );
        playedUsers[phoneNumber] = true;
        localStorage.setItem("playedUsers", JSON.stringify(playedUsers));
        localStorage.removeItem("currentOffer");
        localStorage.removeItem("currentPhoneNumber");
        localStorage.removeItem("uniqueId");
      }
      setStep(5);
    } catch (error) {
      console.error("Error submitting entry:", error);
      setSubmitError("Failed to submit entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-start relative overflow-hidden">
      {/* Banner */}
      <div className="w-full text-white relative">
        <Image
          src="/banner.png"
          alt="Deepavali Spin the Wheel Banner"
          width={1920}
          height={300}
          className="w-full h-[300px] object-cover"
        />
      </div>

      {isMounted && (
        <DynamicFireworks
          options={{
            opacity: 0.3,
            intensity: 5,
            traceLength: 3,
            traceSpeed: 10,
            rocketsPoint: {
              min: 0,
              max: 100,
            },
            lineWidth: {
              explosion: { min: 1, max: 2 },
              trace: { min: 1, max: 1.5 },
            },
            lineStyle: "round",
            flickering: 30,
            explosion: 3,
            hue: {
              min: 0,
              max: 360,
            },
            delay: {
              min: 30,
              max: 60,
            },
            brightness: {
              min: 50,
              max: 80,
            },
            decay: {
              min: 0.015,
              max: 0.03,
            },
            mouse: {
              click: false,
              move: false,
              max: 1,
            },
          }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center z-20 space-y-8 md:space-y-0 md:space-x-8 p-4 mt-8">
        <div className="w-full px-4 sm:px-0 md:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
            HEY YOU,
            <br />
            SPIN TO WIN!
          </h1>
          <p className="mb-4 text-sm sm:text-base text-white text-center">
            Enter your info for the chance to win big discounts!
          </p>
        </div>
        <div className="w-full md:w-1/2 max-w-[80vw] md:max-w-none aspect-square">
          <div className={`${wheelClassName}`}>
            {isMounted && (
              <DynamicWheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={handleStopSpinning}
                outerBorderColor="#e0e0e0"
                outerBorderWidth={5}
                innerBorderColor="#ffffff"
                innerBorderWidth={20}
                innerRadius={0}
                radiusLineColor="#5f78a3"
                radiusLineWidth={2}
                fontSize={16}
                textDistance={60}
              />
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 px-4 sm:px-0">
          <div className="hidden md:block">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-8 text-left">
              HEY YOU,
              <br />
              SPIN TO WIN!
            </h1>
            <p className="mb-4 text-sm sm:text-base md:text-lg text-white text-left">
              Enter your info for the chance to win big discounts!
            </p>
          </div>
          {step === 2 && (
            <form onSubmit={handleSubmitPhone} className="space-y-4">
              <Label
                htmlFor="phone"
                className="text-white text-sm sm:text-base"
              >
                Enter your phone number to play
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
                className={`border-gray-500 bg-white text-black p-2 sm:p-3 text-sm sm:text-base ${
                  phoneError ? "border-red-500" : ""
                }`}
              />
              {phoneError && (
                <p className="text-red-500 text-sm">{phoneError}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-[#004bff] hover:bg-[#007dff] text-white text-sm sm:text-base"
                disabled={
                  hasPlayed ||
                  !!phoneError ||
                  phoneNumber.length < 10 ||
                  isSpinning
                }
              >
                {isSpinning
                  ? "Spinning..."
                  : hasPlayed
                  ? "You have already played"
                  : "Spin the Wheel"}
              </Button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Congratulations!
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {currentOffer}
              </p>
              <p className="mb-6 text-sm sm:text-base text-white">
                {getOfferMessage(currentOffer)}
              </p>
              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-gray-500 bg-white text-black p-2 sm:p-3 text-sm sm:text-base"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-500 bg-white text-black p-2 sm:p-3 text-sm sm:text-base"
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Claim Your Offer"}
                </Button>
                {submitError && (
                  <p className="text-red-500 mt-2 text-sm sm:text-base">
                    {submitError}
                  </p>
                )}
              </form>
            </div>
          )}
          {step === 4 && (
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Try Again Next Time!
              </h3>
              <p className="mb-6 text-sm sm:text-base text-white">
                {getOfferMessage("Try Again")}
              </p>
              <Button
                onClick={() => setStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base w-full md:w-auto"
              >
                Start Over
              </Button>
            </div>
          )}
          {step === 5 && (
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Thank you for participating!
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-white">
                We'll contact you soon with more details about your special
                offer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
