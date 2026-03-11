"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const INDUSTRIES = [
  { id: "all", name: "All Industries" },
  { id: "cannabis-hemp", name: "Cannabis & Hemp" },
  { id: "pharmaceuticals", name: "Pharmaceuticals" },
  { id: "luxury-goods", name: "Luxury Goods" },
  { id: "electronics", name: "Electronics" },
  { id: "food-beverage", name: "Food & Beverage" },
  { id: "automotive", name: "Automotive" },
  { id: "fashion-apparel", name: "Fashion & Apparel" },
  { id: "cosmetics", name: "Cosmetics" },
  { id: "art-collectibles", name: "Art & Collectibles" },
  { id: "agriculture", name: "Agriculture" },
]

interface IndustryFilterProps {
  value: string
  onChange: (value: string) => void
  count?: Record<string, number>
}

export function IndustryFilter({ value, onChange, count = {} }: IndustryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="industry-filter" className="text-sm font-medium">
        Filter by Industry:
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="industry-filter" className="w-[250px]">
          <SelectValue placeholder="Select industry" />
        </SelectTrigger>
        <SelectContent>
          {INDUSTRIES.map((industry) => (
            <SelectItem key={industry.id} value={industry.id}>
              {industry.name}
              {count[industry.id] !== undefined && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({count[industry.id]})
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
