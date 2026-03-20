"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIStoryPlayer from "@/components/ai-story-player";
import { z } from "zod";
import { getAllIndustries, getTotalMarketSize } from "@/lib/industries";
import { motion, AnimatePresence } from "framer-motion";

// ------------------------------------------------------------
// ZOD SCHEMAS
// ------------------------------------------------------------

const ClassificationSchema = z.object({
  industry: z.string(),
  confidence: z.number(),
});

const WorkflowSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      timestamp: z.string().optional(),
    })
  ),
});

const StorySchema = z.object({
  title: z.string(),
  duration: z.number(),
  transcriptSegments: z.array(
    z.object({
      text: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
});

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ------------------------------------------------------------
// PERFORMANCE METRICS COUNTER
// Animates a number from 0 to a target value
// ------------------------------------------------------------

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

// ------------------------------------------------------------
// MARKET SIZE CHART
// Bar chart showing TAM across industries
// ------------------------------------------------------------

function MarketSizeChart() {
  const industries = getAllIndustries();

  // Parse market size strings to numbers for chart scaling
  const parseMarketSize = (size: string): number => {
    const num = parseFloat(size.replace(/[^0-9.]/g, ""));
    if (size.includes("T")) return num * 1000; // convert T to B
    return num; // already in B
  };

  const data = industries
    .map((ind) => ({
      name: ind.name.split(" & ")[0].split(" ")[0], // short name
      fullName: ind.name,
      icon: ind.icon,
      size: parseMarketSize(ind.marketSize),
      label: ind.marketSize,
    }))
    .sort((a, b) => b.size - a.size);

  const maxSize = Math.max(...data.map((d) => d.size));

  return (
    <div className="w-full space-y-3">
      {data.map((item, i) => (
        <motion.div
          key={item.name}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <span className="text-lg w-8 text-center">{item.icon}</span>
          <span className="text-sm text-white/70 w-24 shrink-0 truncate" title={item.fullName}>
            {item.name}
          </span>
          <div className="flex-1 bg-white/10 rounded-full h-5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${(item.size / maxSize) * 100}%` }}
              transition={{ delay: i * 0.08 + 0.2, duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm font-semibold w-16 text-right text-white/80">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ------------------------------------------------------------
// INDUSTRY SHOWCASE CAROUSEL
// ------------------------------------------------------------

function IndustryCarousel() {
  const industries = getAllIndustries();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % industries.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [industries.length]);

  const industry = industries[current];

  return (
    <div className="relative w-full">
      {/* Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {industries.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-purple-400 w-6" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 bg-white/5 border-white/10 text-center">
            <div className="text-6xl mb-4">{industry.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{industry.name}</h3>
            <p className="text-white/60 mb-4 text-sm">{industry.description}</p>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-1">
              {industry.marketSize} market
            </Badge>
            <div className="mt-6 space-y-2">
              {industry.authenticityFeatures.slice(0, 3).map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <span className="text-green-400">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div className="flex justify-between mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrent((prev) => (prev - 1 + industries.length) % industries.length)}
          className="text-white/60 hover:text-white"
        >
          ← Prev
        </Button>
        <span className="text-white/40 text-sm self-center">
          {current + 1} / {industries.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrent((prev) => (prev + 1) % industries.length)}
          className="text-white/60 hover:text-white"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// PAGE COMPONENT
// ------------------------------------------------------------

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<z.infer<typeof StorySchema> | null>(null);
  const [classification, setClassification] = useState<
    z.infer<typeof ClassificationSchema> | null
  >(null);
  const [workflow, setWorkflow] = useState<z.infer<typeof WorkflowSchema> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    // Show image preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const base64 = await fileToBase64(file);

      const res = await fetch("/api/autoflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) {
        throw new Error(`AutoFlow error: ${res.status}`);
      }

      const json = await res.json();

      // Validate
      const parsedClassification = ClassificationSchema.parse(json.classification);
      const parsedWorkflow = WorkflowSchema.parse(json.workflow);
      const parsedStory = StorySchema.parse(json.story);

      setClassification(parsedClassification);
      setWorkflow(parsedWorkflow);
      setStory(parsedStory);
    } catch (err: unknown) {
      console.error("AutoFlow error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }

    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white">
      <div className="container mx-auto px-4 py-16 space-y-32">

        {/* ── Hero ── */}
        <section className="text-center space-y-4">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-2">
            Live Demo
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            AI AutoFlow™
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Universal product authentication powered by computer vision. Upload any product image
            and receive an instant industry classification, authentication workflow, and AI-generated
            provenance story.
          </p>
        </section>

        {/* ── Performance Metrics Counter ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Products Authenticated", value: 1250000, suffix: "+" },
            { label: "Industries Covered", value: 10, suffix: "" },
            { label: "Avg. Confidence", value: 97, suffix: "%" },
            { label: "Total Market Coverage", value: 14, prefix: "$", suffix: "T+" },
          ].map((metric) => (
            <Card
              key={metric.label}
              className="p-6 bg-white/5 border-white/10 text-center"
            >
              <p className="text-3xl font-bold text-purple-300">
                <AnimatedCounter
                  target={metric.value}
                  suffix={metric.suffix}
                  prefix={metric.prefix ?? ""}
                />
              </p>
              <p className="text-white/50 text-sm mt-1">{metric.label}</p>
            </Card>
          ))}
        </section>

        {/* ── Live Upload Classification Demo ── */}
        <section className="w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Try It Live</h2>
            <p className="text-white/50">
              Upload any product image to trigger the AutoFlow™ classification pipeline.
            </p>
          </div>

          {/* Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              dragOver
                ? "border-purple-400 bg-purple-500/10"
                : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded product"
                className="max-h-48 mx-auto rounded-lg object-contain mb-4"
              />
            ) : (
              <div className="text-5xl mb-4">📸</div>
            )}

            {loading ? (
              <div className="space-y-2">
                <div className="text-white/60">Analyzing with AI AutoFlow™…</div>
                <div className="flex justify-center gap-1 mt-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-white/60 mb-3">
                  Drag & drop a product image or{" "}
                  <span className="text-purple-400 underline">browse files</span>
                </p>
                <p className="text-white/30 text-sm">
                  Supports JPG, PNG, WebP — any product from any of 10 industries
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-center">
              {error}
            </div>
          )}
        </section>

        {/* ── Classification Results ── */}
        {(classification || workflow) && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Classification Results</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {classification && (
                <Card className="p-6 bg-white/5 border-white/10">
                  <h3 className="font-semibold mb-4 text-white/60 uppercase tracking-wide text-xs">
                    Industry Classification
                  </h3>
                  <p className="text-3xl font-bold mb-2">{classification.industry}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-green-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${classification.confidence * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-white/60 text-sm font-mono w-14 text-right">
                      {(classification.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mt-1">Confidence score</p>
                </Card>
              )}

              {workflow && (
                <Card className="p-6 bg-white/5 border-white/10 space-y-3 max-h-80 overflow-y-auto">
                  <h3 className="font-semibold mb-2 text-white/60 uppercase tracking-wide text-xs">
                    Authentication Workflow
                  </h3>
                  {workflow.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-3 pb-3 border-b border-white/10 last:border-0"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-purple-400 font-bold text-sm mt-0.5 w-5 shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-sm">{step.title}</div>
                        <div className="text-white/50 text-xs">{step.description}</div>
                        {step.timestamp && (
                          <div className="text-purple-400/60 text-xs mt-1">
                            {step.timestamp}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </Card>
              )}
            </div>
          </section>
        )}

        {/* ── Story Player ── */}
        {story && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-center">AI-Generated Provenance Story</h2>
            <AIStoryPlayer
              title={story.title}
              duration={story.duration}
              transcriptSegments={story.transcriptSegments.map((seg, i) => ({
                id: String(i),
                text: seg.text,
                startTime: seg.start,
                endTime: seg.end,
              }))}
              onDownload={() => alert("Download clicked!")}
            />
          </section>
        )}

        {/* ── Industry Showcase Carousel ── */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">10 Industries, One Platform</h2>
            <p className="text-white/50">
              AuthiChain's AI AutoFlow™ automatically adapts authentication workflows for every
              major product category.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <IndustryCarousel />
          </div>
        </section>

        {/* ── $14T Market Size Visualization ── */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">
              {getTotalMarketSize()} Total Addressable Market
            </h2>
            <p className="text-white/50">
              Across all 10 industries, AuthiChain addresses one of the largest authentication
              opportunities in history.
            </p>
          </div>
          <Card className="p-8 bg-white/5 border-white/10">
            <MarketSizeChart />
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Card className="p-4 bg-white/5 border-white/10">
              <p className="text-2xl font-bold text-green-400">$8.5T</p>
              <p className="text-xs text-white/40 mt-1">Largest: Food & Beverage</p>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10">
              <p className="text-2xl font-bold text-blue-400">$1.7T</p>
              <p className="text-xs text-white/40 mt-1">Fashion & Apparel</p>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10">
              <p className="text-2xl font-bold text-purple-400">$1.5T</p>
              <p className="text-xs text-white/40 mt-1">Electronics</p>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10">
              <p className="text-2xl font-bold text-yellow-400">$1.4T</p>
              <p className="text-xs text-white/40 mt-1">Pharmaceuticals</p>
            </Card>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="text-center space-y-6 pb-8">
          <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-purple-300 text-sm font-medium mb-2">
            Ready to protect your brand?
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Authenticate everything.<br />
            <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Start in minutes.
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Use code <span className="font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">LAUNCH25</span> for 25% off your first 3 months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-green-500 hover:opacity-90 text-white font-semibold px-8">
                Start Free — No Credit Card
              </Button>
            </a>
            <a href="/pricing">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-semibold px-8">
                View Plans →
              </Button>
            </a>
          </div>
          <p className="text-white/30 text-sm">Starter from $299/mo · Cancel anytime</p>
        </section>

      </div>

      {/* Sticky upgrade bar — appears after classification */}
      {classification && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 to-green-900/95 backdrop-blur border-t border-white/10 px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-400 text-lg">✓</span>
              <span className="text-white font-medium">
                <span className="text-green-300">{classification.industry}</span> detected at{" "}
                <span className="text-purple-300">{(classification.confidence * 100).toFixed(0)}% confidence</span>
              </span>
              <span className="text-white/40 hidden sm:inline">—</span>
              <span className="text-white/60 hidden sm:inline">Protect your full catalog with AuthiChain</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <a href="/pricing">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 font-semibold">
                  See Plans
                </Button>
              </a>
              <a href="/signup">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Sign Up Free
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
