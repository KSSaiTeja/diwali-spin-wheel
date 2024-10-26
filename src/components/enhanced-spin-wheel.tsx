  "use client";

  import React, { useState, useEffect, useCallback } from "react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import dynamic from "next/dynamic";
  import Image from "next/image";
  import confetti from "canvas-confetti";
  import Link from "next/link";
  import { ChevronLeft } from "lucide-react";

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
      option: "Flat ₹2500 off",
      style: { backgroundColor: "#F81782", textColor: "black" },
    },
    {
      option: "Flat ₹500 off",
      style: { backgroundColor: "#FFC94D", textColor: "black" },
    },
    {
      option: "At just ₹1",
      style: { backgroundColor: "#F81782", textColor: "black" },
    },
    {
      option: "Flat ₹1000 off",
      style: { backgroundColor: "#71FFF0", textColor: "black" },
    },
    {
      option: "Try Again",
      style: { backgroundColor: "#FFC94D", textColor: "black" },
    },
  ];

  // const probabilityDistribution = [
  //   ...Array(20).fill(0), // Creates 20 occurrences of 0
  //   ...Array(35).fill(1), // Creates 35 occurrences of 1
  //   ...Array(1).fill(2), // Creates 1 occurrence of 2
  //   ...Array(30).fill(3), // Creates 30 occurrences of 3
  //   ...Array(14).fill(4), // Creates 14 occurrences of 4
  // ];

  const probabilityDistribution = [
    ...Array(1).fill(0),   // Creates 1 occurrence of 0 (₹1 offer)
    ...Array(40).fill(1),  // Creates 40 occurrences of 1 (₹500 off)
    ...Array(5).fill(2),   // Creates 5 occurrences of 2 (₹2500 off)
    ...Array(35).fill(3),  // Creates 35 occurrences of 3 (₹1000 off)
    ...Array(19).fill(4),  // Creates 19 occurrences of 4 (Try Again)
  ];

  const getOfferDetails = (offer: string) => {
    const basePrice = 6499;
    switch (offer) {
      case "Flat ₹2500 off":
        return {
          discountAmount: 2500,
          finalPrice: basePrice - 2500,
          subscriptionType: "Savart X",
        };
      case "Flat ₹500 off":
        return {
          discountAmount: 500,
          finalPrice: basePrice - 500,
          subscriptionType: "Savart X",
        };
      case "At just ₹1":
        return {
          discountAmount: basePrice - 1,
          finalPrice: 1,
          subscriptionType: "Savart X",
        };
      case "Flat ₹1000 off":
        return {
          discountAmount: 1000,
          finalPrice: basePrice - 1000,
          subscriptionType: "Savart X",
        };
      default:
        return {
          discountAmount: 0,
          finalPrice: basePrice,
          subscriptionType: "Savart X",
        };
    }
  };

  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSeeHgX3-7eXbLu45i0MCLXjPZsY1eBVUSYk732bJrrWyTBcEw/formResponse";

  const sendToGoogleForm = async (data: Record<string, string>) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    try {
      const response = await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      console.log("Form submission response:", response);
    } catch (error) {
      console.error("Error sending data to Google Form:", error);
      throw error;
    }
  };

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
    const [uniqueId, setUniqueId] = useState("");
    const [remainingChances, setRemainingChances] = useState(3);

    useEffect(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        const savedOffer = localStorage.getItem("currentOffer");
        const savedPhoneNumber = localStorage.getItem("currentPhoneNumber");
        const savedUniqueId = localStorage.getItem("uniqueId");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const savedSpinCount = localStorage.getItem("spinCount");
        const savedRemainingChances = localStorage.getItem("remainingChances");
        if (savedOffer && savedPhoneNumber && savedUniqueId) {
          setCurrentOffer(savedOffer);
          setPhoneNumber(savedPhoneNumber);
          setUniqueId(savedUniqueId);
          setRemainingChances(
            savedRemainingChances ? parseInt(savedRemainingChances) : 3,
          );
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
      if (!mustSpin) {
        const randomIndex = Math.floor(
          Math.random() * probabilityDistribution.length,
        );
        const newPrizeNumber = probabilityDistribution[randomIndex];
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
        setIsSpinning(true);
        setWheelClassName("");
        setRemainingChances((prevChances) => {
          const newChances = prevChances - 1;
          localStorage.setItem("remainingChances", newChances.toString());
          return newChances;
        });
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
      const newUniqueId = Date.now().toString();
      setUniqueId(newUniqueId);
      if (typeof window !== "undefined") {
        localStorage.setItem("currentOffer", newOffer);
        localStorage.setItem("currentPhoneNumber", phoneNumber);
        localStorage.setItem("uniqueId", newUniqueId);
      }
      if (newOffer !== "Try Again" && isMounted) {
        playSound("/cracker-sound.wav");
        playSound("/confetti-sound.wav");

        if (typeof DynamicConfetti === "function") {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        sendToGoogleForm({
          "entry.1861090374": phoneNumber,
          "entry.875710030": newOffer,
          "entry.1128347265": newUniqueId,
        }).catch((error) => console.error("Failed to send initial data:", error));

        setStep(3);
      } else if (remainingChances > 0) {
        setStep(4);
      } else {
        setStep(5);
        setHasPlayed(true);
      }
    };

    const handleSubmitDetails = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitError("");

      try {
        await sendToGoogleForm({
          "entry.1861090374": phoneNumber,
          "entry.875710030": currentOffer,
          "entry.975279933": name,
          "entry.1286515812": email,
          "entry.1128347265": uniqueId,
        });
        if (typeof window !== "undefined") {
          const playedUsers = JSON.parse(
            localStorage.getItem("playedUsers") || "{}",
          );
          playedUsers[phoneNumber] = true;
          localStorage.setItem("playedUsers", JSON.stringify(playedUsers));
          localStorage.removeItem("currentOffer");
          localStorage.removeItem("currentPhoneNumber");
          localStorage.removeItem("uniqueId");
          localStorage.removeItem("spinCount");
          localStorage.removeItem("remainingChances");
        }
        setStep(6);
      } catch (error) {
        console.error("Error submitting entry:", error);
        setSubmitError("Failed to submit entry. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-start relative overflow-hidden">
        <div className="w-full bg-gray-900 py-2 px-4 flex justify-start mt-4">
          <Link href="https://savart.com" passHref>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#101827] text-white border-[#314d81] hover:bg-[#314d81] hover:border-[#101827] hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="w-full text-white relative mt-4">
          <div className="relative w-full" style={{ aspectRatio: "1920/450" }}>
            <Image
              src="/newbanner.svg"
              alt="Deepavali Spin the Wheel Banner"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
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
          {step < 3 && (
            <div className="w-full px-4 sm:px-0 md:hidden">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
                HEY YOU,
                <br />
                SPIN TO WIN!
              </h1>
              <p className="mb-4 text-sm sm:text-base text-white text-center">
                exciting discounts on investment advice await you!
              </p>
            </div>
          )}

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
            {step < 3 && (
              <div className="hidden md:block">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-8 text-left">
                  HEY YOU,
                  <br />
                  SPIN TO WIN!
                </h1>
                <p className="mb-4  text-sm sm:text-base md:text-lg text-white text-left">
                  exciting discounts on investment advice await you!
                </p>
              </div>
            )}
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
                  aria-invalid={!!phoneError}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  className={`border-gray-500 bg-white text-black p-2 sm:p-3 text-sm sm:text-base ${
                    phoneError ? "border-red-500" : ""
                  }`}
                />
                {phoneError && (
                  <p id="phone-error" className="text-red-500 text-sm">
                    {phoneError}
                  </p>
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
                  aria-label={
                    isSpinning
                      ? "Spinning..."
                      : hasPlayed
                      ? "You have already played"
                      : "Spin The Fortune Wheel"
                  }
                >
                  {isSpinning
                    ? "Spinning..."
                    : hasPlayed
                    ? "You have already played"
                    : "Spin The Fortune Wheel"}
                </Button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center md:text-left bg-[#1A2231] p-6 rounded-lg border border-gray-300">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                  Congratulations!
                </h3>
                <p className="text-lg sm:text-xl font-semibold text-white mb-4">
                  You've won {getOfferDetails(currentOffer).subscriptionType}{" "}
                  subscription at flat ₹
                  {getOfferDetails(currentOffer).discountAmount} off
                </p>
                <p className="text-base sm:text-lg text-white mb-4">
                  You get premium investment advice worth ₹ 5 Lakh at just
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                  <span className="text-lg sm:text-xl text-gray-400 line-through font-bold">
                    ₹6499
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    ₹{getOfferDetails(currentOffer).finalPrice}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-white mb-6">
                  Incredible! Now your investments will not just glow, they'll
                  grow!!
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
                  Uh Oh! You Missed!
                </h3>
                <p className="mb-6 text-sm sm:text-base text-white">
                  You've {remainingChances} more{" "}
                  {remainingChances === 1 ? "chance" : "chances"} to win!
                </p>
                <Button
                  onClick={handleSpinClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base w-full md:w-auto"
                  disabled={isSpinning}
                >
                  {isSpinning ? "Spinning..." : "Try Again"}
                </Button>
              </div>
            )}
            {step === 5 && (
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                  Better Luck Next Time!
                </h3>
                <p className="mb-6 text-sm sm:text-base text-white">
                  Thank you for participating. Unfortunately, you didn't win a
                  discount this time.
                </p>
                <Button
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base w-full md:w-auto"
                >
                  Start Over
                </Button>
              </div>
            )}
            {step === 6 && (
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                  Thank you for participating!
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white">
                  We'll contact you soon with more details about your special
                  offer.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-white">
                  It&apos;d be sweet of you to spread the word about <br />{" "}
                  Savart&apos;s Diwali Fortune Wheel.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
