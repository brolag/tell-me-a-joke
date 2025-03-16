"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft } from "lucide-react"
import type { JokeSettings } from "@/types/settings"
import { defaultSettings, jokeTopics, jokeTones, jokeTypes } from "@/types/settings"
import { SettingsCard } from "@/components/settings-card"

export default function Settings() {
  const [settings, setSettings] = useState<JokeSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("jokeSettings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        // Validate that all required fields exist
        if (
          parsed.topic &&
          parsed.tone &&
          parsed.jokeType &&
          typeof parsed.temperature === 'number'
        ) {
          setSettings(parsed)
        }
      }
    } catch (e) {
      console.error("Error parsing saved settings:", e)
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem("jokeSettings", JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-amber-900/40">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">
          Tell Me A<span className="text-orange-500"> Joke</span>
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <SettingsCard settings={settings} />

          {/* Settings Form */}
          <div className="bg-black/20 border border-amber-800/30 rounded-3xl p-6 backdrop-blur-sm">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-gray-300 flex items-center gap-2">
                  Topic
                </Label>
                <Select 
                  value={settings.topic} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, topic: value }))}
                >
                  <SelectTrigger id="topic" className="bg-transparent border-amber-800/30">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    {jokeTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic.charAt(0).toUpperCase() + topic.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone" className="text-gray-300 flex items-center gap-2">
                  Tone
                </Label>
                <Select 
                  value={settings.tone} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, tone: value }))}
                >
                  <SelectTrigger id="tone" className="bg-transparent border-amber-800/30">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    {jokeTones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joke-type" className="text-gray-300 flex items-center gap-2">
                  Type
                </Label>
                <Select 
                  value={settings.jokeType} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, jokeType: value }))}
                >
                  <SelectTrigger id="joke-type" className="bg-transparent border-amber-800/30">
                    <SelectValue placeholder="Select a joke type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    {jokeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="temperature" className="text-gray-300 flex items-center gap-2">
                    Creativity
                  </Label>
                  <span className="text-orange-400 font-medium">{Math.round(settings.temperature * 100)}%</span>
                </div>
                <Slider
                  id="temperature"
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={[settings.temperature]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, temperature: value }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Predictable</span>
                  <span>Creative</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={saveSettings}
                className={`w-full rounded-full p-6 text-xl font-bold transition-all transform hover:scale-105 ${
                  saved 
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {saved ? '✨ Settings Saved!' : 'Save Settings'}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 