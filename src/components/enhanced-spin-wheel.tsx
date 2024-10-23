"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wheel } from "react-custom-roulette";
import confetti from "canvas-confetti";
import Fireworks from "@fireworks-js/react";
import useSound from "use-sound";

/* eslint-disable @typescript-eslint/no-unused-vars */
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
  "https://docs.google.com/forms/d/e/1FAIpQLSeeHgX3-7eXbLu45i0MCLXjPZsY1eBVUSYk732bJrrWyTBcEw/formResponse";

export default function EnhancedSpinWheel() {
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [offer, setOffer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [wheelClassName, setWheelClassName] = useState("animate-wheel-jerk");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [playCrackerSound] = useSound("/cracker-sound.wav");
  const [playConfettiSound] = useSound("/confetti-sound.wav");

  const checkIfPlayed = useCallback((number: string) => {
    const playedUsers = JSON.parse(localStorage.getItem("playedUsers") || "{}");
    return !!playedUsers[number];
  }, []);

  useEffect(() => {
    setHasPlayed(checkIfPlayed(phoneNumber));
  }, [phoneNumber, checkIfPlayed]);

  const handlePlay = () => {
    setStep(1);
    setWheelClassName("");
  };

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    setHasPlayed(checkIfPlayed(newPhoneNumber));
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
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setOffer(data[prizeNumber].option);
    if (data[prizeNumber].option !== "Try Again") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      playCrackerSound();
      playConfettiSound();
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const formData = new FormData();
    formData.append("entry.1861090374", phoneNumber);
    formData.append("entry.975279933", name);
    formData.append("entry.1286515812", email);
    formData.append("entry.875710030", offer);

    try {
      const response = await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      const playedUsers = JSON.parse(
        localStorage.getItem("playedUsers") || "{}",
      );
      playedUsers[phoneNumber] = true;
      localStorage.setItem("playedUsers", JSON.stringify(playedUsers));
      setStep(5);
    } catch (error) {
      console.error("Error submitting entry:", error);
      setSubmitError("Failed to submit entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-4 relative overflow-hidden">
      <Fireworks
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

      <div className="w-full max-w-md flex flex-col items-center justify-center z-20 space-y-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-8 text-center">
          Diwali Special Offer!
        </h1>

        <div
          className={`w-full max-w-[80vw] aspect-square ${wheelClassName} mb-4 sm:mb-8`}
        >
          <Wheel
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
        </div>

        <div className="w-full px-4 sm:px-0">
          {step === 0 && (
            <div className="text-center">
              <p className="mb-4 text-sm sm:text-base md:text-lg text-gray-300">
                Spin the wheel for exclusive Savart advisory plan discounts
              </p>
              <Button
                onClick={handlePlay}
                size="lg"
                className="bg-[#004bff] hover:bg-[#007dff] text-white text-sm sm:text-base"
              >
                Spin the Wheel
              </Button>
            </div>
          )}
          {step === 1 && (
            <form onSubmit={handleSubmitPhone} className="space-y-4">
              <Label
                htmlFor="phone"
                className="text-gray-300 text-sm sm:text-base"
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
                className="border-gray-500 bg-gray-800 text-white p-2 sm:p-3 text-sm sm:text-base"
              />
              <Button
                type="submit"
                className="w-full bg-[#004bff] hover:bg-[#007dff] text-white text-sm sm:text-base"
                disabled={hasPlayed}
              >
                {hasPlayed ? "You have already played" : "Continue"}
              </Button>
              {hasPlayed && (
                <p className="text-red-500 text-center text-sm sm:text-base">
                  You have already participated in this offer.
                </p>
              )}
            </form>
          )}
          {step === 2 && (
            <div className="text-center">
              <p className="mb-4 text-sm sm:text-base md:text-lg text-gray-300">
                Click the button to spin the wheel!
              </p>
              <Button
                onClick={handleSpinClick}
                disabled={mustSpin || hasPlayed}
                className="bg-[#004bff] hover:bg-[#007dff] text-white text-sm sm:text-base"
              >
                {mustSpin ? "Spinning..." : "Spin the Wheel"}
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Congratulations!
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-300 mb-4">
                {offer}
              </p>
              <p className="mb-6 text-sm sm:text-base text-gray-400">
                {getOfferMessage(offer)}
              </p>
              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-gray-500 bg-gray-800 text-white p-2 sm:p-3 text-sm sm:text-base"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-500 bg-gray-800 text-white p-2 sm:p-3 text-sm sm:text-base"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#004bff] hover:bg-[#007dff] text-white text-sm sm:text-base"
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
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Try Again Next Time!
              </h3>
              <p className="mb-6 text-sm sm:text-base text-gray-300">
                {getOfferMessage("Try Again")}
              </p>
              <Button
                onClick={handleSpinClick}
                disabled={mustSpin || hasPlayed}
                className="bg-[#004bff] hover:bg-[#007dff] text-white text-sm sm:text-base"
              >
                {mustSpin ? "Spinning..." : "Spin the Wheel"}
              </Button>
            </div>
          )}
          {step === 5 && (
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                Thank you for participating!
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300">
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
