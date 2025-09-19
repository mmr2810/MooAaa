"use client"

import type React from "react"

import { useState } from "react"
import { Share2, FileText, Shield, DollarSign, Download, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ShareDialogProps {
  animalData: {
    id: string
    name: string
    breed: string
    overallScore: number
    image: string
  }
  trigger?: React.ReactNode
}

export function ShareDialog({ animalData, trigger }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const shareOptions = [
    {
      id: "vet",
      title: "Share with Vet",
      description: "Technical PDF with all measurements, graphs, and detailed analysis",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      features: [
        "Complete anatomical measurements",
        "Detailed health metrics",
        "Historical trends",
        "Technical recommendations",
      ],
    },
    {
      id: "insurance",
      title: "Share for Insurance/Loan",
      description: "Simplified report highlighting animal value and health status",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: ["Overall health score", "Breed classification", "Key health indicators", "Asset valuation summary"],
    },
    {
      id: "buyer",
      title: "Share with Buyer",
      description: "Marketing-focused report emphasizing productivity and breed quality",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Productivity highlights",
        "Breed quality metrics",
        "Dairy improvement scores",
        "Investment potential",
      ],
    },
  ]

  const handleShare = (optionId: string) => {
    // In a real app, this would generate and share the appropriate report
    console.log(`Sharing ${optionId} report for ${animalData.name}`)

    // Simulate report generation
    const reportTypes = {
      vet: "Veterinary Technical Report",
      insurance: "Insurance Valuation Report",
      buyer: "Buyer Information Sheet",
    }

    // Show success message or handle actual sharing
    alert(
      `${reportTypes[optionId as keyof typeof reportTypes]} for ${animalData.name} has been generated and is ready to share.`,
    )
    setIsOpen(false)
  }

  const handleQuickShare = (method: string) => {
    const shareText = `Check out ${animalData.name}'s health assessment! Overall score: ${animalData.overallScore}/100. Breed: ${animalData.breed}. Analyzed with Moo-Aaa livestock assessment app.`

    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
        break
      case "sms":
        window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_blank")
        break
      case "email":
        window.open(
          `mailto:?subject=Livestock Assessment - ${animalData.name}&body=${encodeURIComponent(shareText)}`,
          "_blank",
        )
        break
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share {animalData.name}'s Report
          </DialogTitle>
          <DialogDescription>Choose the type of report to generate and share based on your needs</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Professional Reports */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Professional Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shareOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${option.borderColor}`}
                >
                  <CardHeader className={`${option.bgColor} rounded-t-lg`}>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <option.icon className={`w-5 h-5 ${option.color}`} />
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-xs">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-1 mb-4">
                      {option.features.map((feature, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <div className="w-1 h-1 bg-current rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 text-xs" onClick={() => handleShare(option.id)}>
                        <Download className="w-3 h-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Share */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Share</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={animalData.image || "/placeholder.svg"}
                    alt={animalData.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{animalData.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {animalData.id} • {animalData.breed}
                    </p>
                    <p className="text-sm font-medium text-primary">Score: {animalData.overallScore}/100</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleQuickShare("whatsapp")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleQuickShare("sms")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    SMS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleQuickShare("email")}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Report Preview</h4>
            <p className="text-sm text-muted-foreground">
              All reports include the Moo-Aaa branding and are generated in PDF format for easy sharing and printing.
              Professional reports contain detailed analysis while quick shares provide a summary overview.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
