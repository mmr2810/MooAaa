import { Camera, Users, BookOpen, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Moo-Aaa
              </h1>
            </div>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Welcome to Moo-Aaa
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            AI-powered livestock assessment for better farming. Take a photo of your cattle or buffalo to get instant
            health scores and breed classification.
          </p>
        </div>

        {/* Recent Animals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Recent Assessments
            </h3>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sample recent animals */}
            {[
              { id: "L-101", name: "Lali", breed: "Sahiwal Cattle", score: 85, image: "/sahiwal-cattle.jpg" },
              { id: "B-203", name: "Brownie", breed: "Murrah Buffalo", score: 72, image: "/murrah-buffalo.jpg" },
              { id: "L-045", name: "Ganga", breed: "Gir Cattle", score: 91, image: "/gir-cattle.jpg" },
            ].map((animal) => (
              <Link key={animal.id} href={`/animal/${animal.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={animal.image || "/placeholder.svg"}
                        alt={animal.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{animal.name}</h4>
                        <p className="text-sm text-muted-foreground">{animal.id}</p>
                        <p className="text-xs text-muted-foreground">{animal.breed}</p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                          animal.score >= 80
                            ? "bg-green-100 text-green-700"
                            : animal.score >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {animal.score}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Link href="/assessment">
            <Button size="lg" className="w-64 h-16 rounded-full shadow-lg text-lg font-semibold">
              <Camera className="w-6 h-6 mr-3" />
              New Assessment
            </Button>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
                <Users className="w-5 h-5" />
                <span className="text-xs">My Herd</span>
              </Button>
            </Link>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Learn</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
