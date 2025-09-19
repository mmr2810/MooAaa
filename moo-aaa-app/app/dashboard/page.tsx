import { ArrowLeft, Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function DashboardPage() {
  const animals = [
    {
      id: "L-101",
      name: "Lali",
      breed: "Sahiwal Cattle",
      score: 85,
      image: "/sahiwal-cattle.jpg",
      lastAssessed: "2 days ago",
      status: "healthy",
    },
    {
      id: "B-203",
      name: "Brownie",
      breed: "Murrah Buffalo",
      score: 72,
      image: "/murrah-buffalo.jpg",
      lastAssessed: "1 week ago",
      status: "good",
    },
    {
      id: "L-045",
      name: "Ganga",
      breed: "Gir Cattle",
      score: 91,
      image: "/gir-cattle.jpg",
      lastAssessed: "3 days ago",
      status: "excellent",
    },
    {
      id: "L-078",
      name: "Shyama",
      breed: "Holstein Friesian",
      score: 68,
      image: "/holstein-friesian-cattle.jpg",
      lastAssessed: "5 days ago",
      status: "needs attention",
    },
    {
      id: "B-156",
      name: "Kala",
      breed: "Nili-Ravi Buffalo",
      score: 79,
      image: "/nili-ravi-buffalo.jpg",
      lastAssessed: "1 day ago",
      status: "good",
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200"
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return "🟢"
      case "healthy":
        return "🟢"
      case "good":
        return "🟡"
      case "needs attention":
        return "🔴"
      default:
        return "⚪"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  My Herd
                </h1>
                <p className="text-sm text-muted-foreground">{animals.length} animals</p>
              </div>
            </div>
            <Link href="/assessment">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Animal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search animals..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Animals List */}
      <main className="container mx-auto px-4 pb-20">
        <div className="space-y-3">
          {animals.map((animal) => (
            <Link key={animal.id} href={`/animal/${animal.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Animal Image */}
                    <img
                      src={animal.image || "/placeholder.svg"}
                      alt={animal.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />

                    {/* Animal Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{animal.name}</h3>
                        <span className="text-xs text-muted-foreground">{animal.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 truncate">{animal.breed}</p>
                      <p className="text-xs text-muted-foreground">Last assessed: {animal.lastAssessed}</p>
                    </div>

                    {/* Status and Score */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-lg mb-1">{getStatusIcon(animal.status)}</div>
                        <div
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold ${getScoreColor(animal.score)}`}
                        >
                          {animal.score}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State (if no animals) */}
        {animals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No animals yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first animal for assessment</p>
            <Link href="/assessment">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add First Animal
              </Button>
            </Link>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/assessment">
          <Button size="lg" className="rounded-full w-14 h-14 shadow-lg">
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
