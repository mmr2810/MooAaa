"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Camera, Check, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"

type AssessmentStep = "identity" | "guidance" | "camera" | "review" | "processing" | "complete"

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>("identity")
  const [animalData, setAnimalData] = useState({
    name: "",
    type: "cattle",
    age: "",
    sex: "",
    breed: "",
  })
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const requestCameraAccess = async () => {
    try {
      setCameraError(null)
      console.log("[v0] Requesting camera access...")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      console.log("[v0] Camera access granted")
      setCameraStream(stream)
      setCameraPermission("granted")

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.log("[v0] Camera access error:", error)
      setCameraPermission("denied")
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setCameraError("Camera access denied. Please allow camera access and try again.")
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera found on this device.")
        } else {
          setCameraError("Unable to access camera. Please try again.")
        }
      }
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
        setCapturedImage(imageDataUrl)
        stopCamera()
        setCurrentStep("review")
      }
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  useEffect(() => {
    if (currentStep === "camera" && !cameraStream && cameraPermission !== "denied") {
      requestCameraAccess()
    }
  }, [currentStep])

  const handleNext = () => {
    switch (currentStep) {
      case "identity":
        setCurrentStep("guidance")
        break
      case "guidance":
        setCurrentStep("camera")
        break
      case "camera":
        setCurrentStep("review")
        break
      case "review":
        setCurrentStep("processing")
        // Simulate processing time
        setTimeout(() => {
          setCurrentStep("complete")
        }, 3000)
        break
      case "complete":
        router.push("/dashboard")
        break
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case "guidance":
        setCurrentStep("identity")
        break
      case "camera":
        stopCamera()
        setCurrentStep("guidance")
        break
      case "review":
        setCurrentStep("camera")
        break
      default:
        router.push("/")
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case "identity":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Which animal is this?
              </h2>
              <p className="text-muted-foreground">Help us identify your animal for better analysis</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="name">Animal ID/Nickname</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Lali, Brownie, Tag-109"
                    value={animalData.name}
                    onChange={(e) => setAnimalData({ ...animalData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Animal Type</Label>
                  <RadioGroup
                    value={animalData.type}
                    onValueChange={(value) => setAnimalData({ ...animalData, type: value })}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cattle" id="cattle" />
                      <Label htmlFor="cattle">🐄 Cattle</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buffalo" id="buffalo" />
                      <Label htmlFor="buffalo">🐃 Buffalo</Label>
                    </div>
                  </RadioGroup>
                </div>

                <details className="border rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                    Add more details (optional)
                  </summary>
                  <div className="mt-4 space-y-3">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        placeholder="e.g., 3 years"
                        value={animalData.age}
                        onChange={(e) => setAnimalData({ ...animalData, age: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sex">Sex</Label>
                      <Input
                        id="sex"
                        placeholder="Male/Female"
                        value={animalData.sex}
                        onChange={(e) => setAnimalData({ ...animalData, sex: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="breed">Known Breed</Label>
                      <Input
                        id="breed"
                        placeholder="If known"
                        value={animalData.breed}
                        onChange={(e) => setAnimalData({ ...animalData, breed: e.target.value })}
                      />
                    </div>
                  </div>
                </details>
              </CardContent>
            </Card>

            <Button onClick={handleNext} className="w-full" size="lg">
              Next →
            </Button>
          </div>
        )

      case "guidance":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Get the perfect shot
              </h2>
              <p className="text-muted-foreground">Follow these guidelines for the best analysis results</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <img
                    src="/perfect-cattle-photo-side-view-with-guidelines.jpg"
                    alt="Perfect photo example"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg p-4 max-w-xs">
                      <h3 className="font-semibold text-sm mb-2">Perfect Example</h3>
                      <p className="text-xs text-muted-foreground">Side view with all four legs visible</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Stand parallel to the animal</h4>
                      <p className="text-xs text-muted-foreground">
                        Position yourself to the side for best profile view
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Good, even lighting</h4>
                      <p className="text-xs text-muted-foreground">Avoid harsh shadows or very bright sunlight</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">All four feet visible</h4>
                      <p className="text-xs text-muted-foreground">
                        Make sure all legs are clearly visible on the ground
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Avoid blurry photos</h4>
                      <p className="text-xs text-muted-foreground">
                        Keep the camera steady and wait for the animal to be still
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNext} className="w-full" size="lg">
              <Camera className="w-5 h-5 mr-2" />
              Open Camera
            </Button>
          </div>
        )

      case "camera":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Frame your shot
              </h2>
              <p className="text-muted-foreground">Align the animal with the outline guide</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="relative bg-black rounded-lg aspect-[4/3] flex items-center justify-center overflow-hidden">
                  {cameraStream && cameraPermission === "granted" ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      <div className="absolute inset-4 border-2 border-white/50 rounded-lg flex items-center justify-center pointer-events-none">
                        <div className="w-3/4 h-3/4 border border-white/30 rounded-lg flex items-center justify-center">
                          <svg
                            viewBox="0 0 200 120"
                            className="w-full h-full opacity-30"
                            fill="none"
                            stroke="white"
                            strokeWidth="1"
                          >
                            <path d="M20 80 Q20 70 30 70 L170 70 Q180 70 180 80 L180 90 Q180 100 170 100 L30 100 Q20 100 20 90 Z" />
                            <circle cx="160" cy="60" r="8" />
                            <line x1="30" y1="100" x2="30" y2="110" />
                            <line x1="60" y1="100" x2="60" y2="110" />
                            <line x1="140" y1="100" x2="140" y2="110" />
                            <line x1="170" y1="100" x2="170" y2="110" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Button onClick={capturePhoto} size="lg" className="rounded-full w-16 h-16">
                          <Camera className="w-6 h-6" />
                        </Button>
                      </div>
                    </>
                  ) : cameraError ? (
                    <div className="text-center text-white p-6">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                      <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
                      <p className="text-sm mb-4 text-gray-300">{cameraError}</p>
                      <Button onClick={requestCameraAccess} variant="secondary">
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-white p-6">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">Requesting Camera Access</h3>
                      <p className="text-sm mb-4 text-gray-300">Please allow camera access to continue</p>
                      <Button onClick={requestCameraAccess} variant="secondary">
                        Allow Camera Access
                      </Button>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">Move back to get all four legs in frame</p>
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Does this look good?
              </h2>
              <p className="text-muted-foreground">Review your photo before analysis</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured animal"
                  className="w-full rounded-lg mb-4"
                />
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Great! Posture detected</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep("camera")} className="flex-1">
                Retake
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Use Photo
              </Button>
            </div>
          </div>
        )

      case "processing":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Analyzing your animal
              </h2>
              <p className="text-muted-foreground">This may take a moment. Please do not close the app.</p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg
                      viewBox="0 0 200 120"
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 80 Q20 70 30 70 L170 70 Q180 70 180 80 L180 90 Q180 100 170 100 L30 100 Q20 100 20 90 Z" />
                      <circle cx="160" cy="60" r="8" />
                      <line x1="30" y1="100" x2="30" y2="110" />
                      <line x1="60" y1="100" x2="60" y2="110" />
                      <line x1="140" y1="100" x2="140" y2="110" />
                      <line x1="170" y1="100" x2="170" y2="110" />
                      <circle cx="50" cy="75" r="3" className="animate-pulse" fill="currentColor" />
                      <circle cx="100" cy="70" r="3" className="animate-pulse" fill="currentColor" />
                      <circle cx="150" cy="75" r="3" className="animate-pulse" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Analyzing posture and traits...</p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Calculating scores...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "complete":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Analysis Complete!
              </h2>
              <p className="text-muted-foreground">View your animal's health card and detailed analysis</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-primary">85</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Overall Health Score</h3>
                    <p className="text-sm text-muted-foreground">
                      {animalData.name || "Your animal"} shows excellent health indicators
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNext} className="w-full" size="lg">
              View Detailed Report
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">New Assessment</h1>
              <div className="flex gap-1 mt-1">
                {["identity", "guidance", "camera", "review", "processing", "complete"].map((step, index) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full ${
                      ["identity", "guidance", "camera", "review", "processing", "complete"].indexOf(currentStep) >=
                      index
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-20">{renderStep()}</main>
    </div>
  )
}
