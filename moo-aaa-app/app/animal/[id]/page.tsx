"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Camera, Heart, Zap, Droplets, TrendingUp, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareDialog } from "@/components/share-dialog"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Mock data - in real app this would come from API
const animalData = {
  "L-101": {
    id: "L-101",
    name: "Lali",
    breed: "Sahiwal Cattle",
    breedConfidence: 98,
    age: "4 years",
    sex: "Female",
    overallScore: 85,
    image: "/sahiwal-cattle.jpg",
    lastAssessed: "2 days ago",
    keyInsight: "Score is primarily impacted by a narrower-than-ideal chest width, limiting milk production capacity.",
    metrics: {
      lifespan: {
        score: 85,
        ideal: "80-100",
        insight: "Excellent body confirmation suggests strong long-term health.",
      },
      reproductivity: {
        score: 65,
        ideal: "70-100",
        insight: "Rump angle is slightly steep, which can impact calving ease.",
      },
      productivity: {
        score: 58,
        ideal: "75-100",
        insight: "Chest width is 15cm below breed standard, reducing feed efficiency.",
      },
      dairy: {
        score: 90,
        ideal: "80-100",
        insight: "Udder conformation and teat placement are near ideal for milking.",
      },
    },
    measurements: {
      height: "132 cm",
      bodyLength: "155 cm",
      chestWidth: "45 cm",
    },
    history: [
      { date: "Jan", score: 78 },
      { date: "Feb", score: 82 },
      { date: "Mar", score: 85 },
      { date: "Apr", score: 85 },
    ],
    recommendations: [
      "For improved Productivity (Chest Width): Focus on a high-protein diet during the next growth phase. Consult a nutritionist for feed options.",
      "For improved Reproductivity: Schedule a vet check to discuss breeding plans. This animal may require assisted calving.",
    ],
  },
}

export default function AnimalDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const animal = animalData[params.id as keyof typeof animalData]

  if (!animal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Animal not found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {animal.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {animal.id} • {animal.breed}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <ShareDialog
                animalData={{
                  id: animal.id,
                  name: animal.name,
                  breed: animal.breed,
                  overallScore: animal.overallScore,
                  image: animal.image,
                }}
                trigger={
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                }
              />
              <Link href="/assessment">
                <Button size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Re-assess
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Animal Image */}
              <div className="md:w-1/3">
                <div className="relative">
                  <img
                    src={animal.image || "/placeholder.svg"}
                    alt={animal.name}
                    className="w-full rounded-lg object-cover aspect-[4/3]"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                    {animal.id}
                  </div>
                </div>
              </div>

              {/* Animal Info */}
              <div className="md:w-2/3 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold text-foreground">Classified as: {animal.breed}</h2>
                    <Badge variant="secondary">{animal.breedConfidence}% match</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Age: {animal.age}</span>
                    <span>Sex: {animal.sex}</span>
                    <span>Last assessed: {animal.lastAssessed}</span>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${getScoreBg(animal.overallScore)}`}
                    >
                      <span className={`text-2xl font-bold ${getScoreColor(animal.overallScore)}`}>
                        {animal.overallScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Overall Health Score</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{animal.keyInsight}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="anatomy">Anatomy</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Trait Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Trait-by-Trait Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "lifespan", icon: Heart, label: "Lifespan (Health)", color: "text-red-500" },
                  { key: "reproductivity", icon: Heart, label: "Reproductivity", color: "text-pink-500" },
                  { key: "productivity", icon: Zap, label: "Productivity", color: "text-yellow-500" },
                  { key: "dairy", icon: Droplets, label: "Dairy Improvement", color: "text-blue-500" },
                ].map(({ key, icon: Icon, label, color }) => {
                  const metric = animal.metrics[key as keyof typeof animal.metrics]
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="font-medium text-foreground">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getScoreColor(metric.score)}`}>{metric.score}/100</span>
                          <span className="text-xs text-muted-foreground">Ideal: {metric.ideal}</span>
                        </div>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                      <p className="text-sm text-muted-foreground italic">{metric.insight}</p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {animal.recommendations.map((rec, index) => (
                    <div key={index} className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "lifespan", icon: Heart, label: "Lifespan (Health)", color: "text-red-500" },
                { key: "reproductivity", icon: Heart, label: "Reproductivity", color: "text-pink-500" },
                { key: "productivity", icon: Zap, label: "Productivity", color: "text-yellow-500" },
                { key: "dairy", icon: Droplets, label: "Dairy Improvement", color: "text-blue-500" },
              ].map(({ key, icon: Icon, label, color }) => {
                const metric = animal.metrics[key as keyof typeof animal.metrics]
                return (
                  <Card key={key}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{label}</h3>
                          <p className="text-xs text-muted-foreground">Ideal: {metric.ideal}</p>
                        </div>
                      </div>
                      <div className="text-center mb-4">
                        <div className={`text-3xl font-bold ${getScoreColor(metric.score)} mb-1`}>{metric.score}</div>
                        <div className="text-sm text-muted-foreground">out of 100</div>
                      </div>
                      <Progress value={metric.score} className="mb-3" />
                      <p className="text-sm text-muted-foreground italic">{metric.insight}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="anatomy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Anatomical Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Anatomical Diagram */}
                  <div className="lg:w-2/3">
                    <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                      <svg
                        viewBox="0 0 400 240"
                        className="w-full h-full max-w-md"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        {/* Cow body outline */}
                        <path d="M40 160 Q40 140 60 140 L340 140 Q360 140 360 160 L360 180 Q360 200 340 200 L60 200 Q40 200 40 180 Z" />
                        {/* Head */}
                        <circle cx="320" cy="120" r="16" />
                        {/* Legs */}
                        <line x1="60" y1="200" x2="60" y2="220" strokeWidth="4" />
                        <line x1="120" y1="200" x2="120" y2="220" strokeWidth="4" />
                        <line x1="280" y1="200" x2="280" y2="220" strokeWidth="4" />
                        <line x1="340" y1="200" x2="340" y2="220" strokeWidth="4" />

                        {/* Measurement points */}
                        <circle cx="100" cy="140" r="3" fill="currentColor" />
                        <circle cx="200" cy="140" r="3" fill="currentColor" />
                        <circle cx="300" cy="140" r="3" fill="currentColor" />

                        {/* Measurement lines */}
                        <line x1="60" y1="120" x2="340" y2="120" strokeDasharray="5,5" opacity="0.5" />
                        <line x1="50" y1="140" x2="50" y2="220" strokeDasharray="5,5" opacity="0.5" />
                        <line x1="100" y1="130" x2="300" y2="130" strokeDasharray="5,5" opacity="0.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Measurements */}
                  <div className="lg:w-1/3 space-y-4">
                    <h3 className="font-semibold text-foreground mb-4">Key Measurements</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
                        <span className="text-sm font-medium">Height at Withers</span>
                        <span className="font-bold text-primary">{animal.measurements.height}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
                        <span className="text-sm font-medium">Body Length</span>
                        <span className="font-bold text-primary">{animal.measurements.bodyLength}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-card rounded-lg border">
                        <span className="text-sm font-medium">Chest Width</span>
                        <span className="font-bold text-accent">{animal.measurements.chestWidth}</span>
                      </div>
                    </div>
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">
                        Measurements are automatically calculated from pose estimation analysis
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Score History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={animal.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">Overall health score trend over the last 4 months</p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment History */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "April 15, 2024", score: 85, status: "Excellent health indicators" },
                    { date: "March 12, 2024", score: 85, status: "Stable condition" },
                    { date: "February 8, 2024", score: 82, status: "Slight improvement in chest width" },
                    { date: "January 5, 2024", score: 78, status: "Initial assessment completed" },
                  ].map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div>
                        <p className="font-medium text-foreground">{assessment.date}</p>
                        <p className="text-sm text-muted-foreground">{assessment.status}</p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${getScoreBg(assessment.score)} ${getScoreColor(assessment.score)}`}
                      >
                        {assessment.score}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
