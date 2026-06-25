"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { MotionReveal } from "@/components/MotionReveal";

const navItems = ["Services", "Portfolio", "Packages", "About", "Contact"];

const features = [
  "Mobile-first vertical storytelling",
  "BTS moments your main camera misses",
  "Trending audio and reel pacing",
  "Cinematic color grading",
  "Same-day social delivery",
];

const portfolio = [
  {
    title: "Luxury Wedding BTS",
    type: "Wedding Film",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Concert Night Recap",
    type: "Event Coverage",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Fashion Launch Reels",
    type: "Brand Shoot",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Reception Same-Day Edit",
    type: "Social Delivery",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  },
];

const services = [
  "Wedding BTS",
  "Event Coverage",
  "Brand Shoots",
  "Reels Creation",
  "Drone Shots",
];

const process = ["Book", "Shoot", "Edit", "Deliver"];

const shootGrid = [
  "Bride and groom prep",
  "Guest reactions",
  "Vendor and decor details",
  "Portrait BTS",
  "Stage and dance-floor energy",
  "Vertical reels and shorts",
  "Raw phone gallery",
  "Same-day teaser",
];

const packages = [
  {
    name: "Silver",
    duration: "4 hours",
    details: ["1 creator", "75+ BTS clips", "2 edited reels", "48 hour delivery"],
  },
  {
    name: "Gold",
    duration: "8 hours",
    featured: true,
    details: ["2 creators", "150+ BTS clips", "5 edited reels", "Same-day teaser"],
  },
  {
    name: "Platinum",
    duration: "Full day",
    details: ["Creator team", "Drone add-on", "10 edited reels", "Priority delivery"],
  },
];

const testimonials = [
  {
    quote:
      "The reels looked premium, emotional, and perfectly timed. We had shareable content before the wedding hangover ended.",
    name: "Aarav and Meera",
  },
  {
    quote:
      "They captured the behind-the-scenes chaos and the quiet family moments without interrupting our photographer.",
    name: "Rhea and Kabir",
  },
  {
    quote:
      "Our launch reel felt cinematic and fast. The edits matched the brand energy exactly.",
    name: "Nova Atelier",
  },
];

function SectionHeading({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy?: string;
}) {
  return (
    <MotionReveal className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 font-display text-xs font-black uppercase tracking-[0.3em] text-neon">
        {kicker}
      </p>
      <h2 className="font-display text-4xl font-black uppercase leading-none tracking-wide text-frost md:text-6xl">
        {title}
      </h2>
      {copy ? <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-smoke md:text-base">{copy}</p> : null}
    </MotionReveal>
  );
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full border-2 border-neon shadow-neon" />
          <span className="font-display text-lg font-black uppercase tracking-[0.16em]">
            VantaFrame
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-smoke lg:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-frost">
              {item}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-none bg-neon px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-neon transition hover:-translate-y-0.5"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-4 pt-28 md:px-8">
      <div className="absolute inset-0 -z-20 bg-radial-lux" />
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(5,4,10,.98), rgba(5,4,10,.35), rgba(5,4,10,.9)), url('https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1800&q=85')",
        }}
      />
      <div className="pointer-events-none absolute inset-x-5 bottom-8 top-24 border border-neon/20 diagonal-frame md:inset-x-12" />

      <div className="mx-auto grid w-full max-w-7xl items-end gap-12 pb-14 lg:grid-cols-[1.05fr_.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="mb-5 font-display text-xs font-black uppercase tracking-[0.32em] text-neon">
            Event BTS / Wedding Content Creator / Brand Shoot Agency
          </p>
          <h1 className="max-w-5xl font-display text-5xl font-black uppercase leading-[0.86] tracking-wide text-frost md:text-7xl xl:text-8xl">
            Capture every moment like a cinematic story
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-smoke md:text-lg">
            Premium wedding, event, and brand content creation for reels, BTS,
            short videos, and same-day social media delivery.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="bg-neon px-6 py-4 text-center text-sm font-black uppercase tracking-wider text-white shadow-neon transition hover:-translate-y-1" href="#contact">
              Book Your Shoot
            </a>
            <a className="border border-white/20 bg-white/5 px-6 py-4 text-center text-sm font-black uppercase tracking-wider text-frost backdrop-blur transition hover:border-neon/70 hover:text-white" href="#portfolio">
              View Portfolio
            </a>
          </div>
        </motion.div>

        <MotionReveal delay={0.15} className="glass-panel diagonal-frame p-4">
          <div className="relative aspect-[4/5] overflow-hidden diagonal-frame">
            <img
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=85"
              alt="Cinematic event shoot setup with guests and dramatic lighting"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-neon">Live capture mode</p>
              <p className="mt-2 text-sm text-frost">Reels, BTS, same-day teasers, and social-ready clips from one shoot day.</p>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

function PersonalSection() {
  return (
    <section id="about" className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 md:px-8 lg:grid-cols-[.85fr_1fr]">
      <MotionReveal>
        <p className="mb-4 font-display text-xs font-black uppercase tracking-[0.3em] text-neon">
          Make Every Event Personal
        </p>
        <h2 className="font-display text-4xl font-black uppercase leading-none text-frost md:text-6xl">
          We shoot the moments that make your event feel alive.
        </h2>
        <p className="mt-6 text-sm leading-7 text-smoke md:text-base">
          From wedding prep to stage lights and brand launches, we blend event
          awareness with social-first framing so every delivery feels intimate,
          polished, and ready to post.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {features.map((feature) => (
            <span key={feature} className="border border-neon/25 bg-neon/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-frost">
              {feature}
            </span>
          ))}
        </div>
      </MotionReveal>
      <MotionReveal delay={0.12} className="glass-panel diagonal-frame p-4">
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85"
          alt="Premium event venue ready for content creation"
          className="aspect-[16/10] h-full w-full object-cover diagonal-frame"
        />
      </MotionReveal>
    </section>
  );
}

function FreshFeatures() {
  return (
    <section id="services" className="relative overflow-hidden py-24">
      <div className="absolute inset-x-0 top-0 h-px neon-line" />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          kicker="Fresh Shoot Features"
          title="Social content systems for premium events"
          copy="A complete creator workflow built for couples, hosts, and brands who need beautiful content fast."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {services.map((service, index) => (
            <MotionReveal key={service} delay={index * 0.05} className="glass-panel group min-h-64 p-5 transition hover:-translate-y-2 hover:border-neon/60 hover:shadow-neon">
              <p className="font-display text-xs font-black text-neon">0{index + 1}</p>
              <h3 className="mt-24 font-display text-2xl font-black uppercase leading-none text-frost">
                {service}
              </h3>
              <p className="mt-4 text-sm leading-6 text-smoke">
                Cinematic coverage, strong composition, and polished vertical edits tuned for the platform.
              </p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  return (
    <section id="portfolio" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionHeading
        kicker="Portfolio Showcase"
        title="Horizontal stories with a luxury pulse"
      />
      <div className="hide-scrollbar flex snap-x gap-5 overflow-x-auto pb-5">
        {portfolio.map((item) => (
          <article key={item.title} className="glass-panel group relative min-w-[82vw] snap-center overflow-hidden diagonal-frame md:min-w-[470px]">
            <img src={item.image} alt={item.title} className="h-[540px] w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-display text-xs font-black uppercase tracking-[0.28em] text-neon">{item.type}</p>
              <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none text-frost">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionHeading kicker="Process" title="Book -> Shoot -> Edit -> Deliver" />
      <div className="grid gap-4 md:grid-cols-4">
        {process.map((step, index) => (
          <MotionReveal key={step} delay={index * 0.08} className="relative glass-panel p-6">
            <p className="font-display text-6xl font-black text-neon/25">0{index + 1}</p>
            <h3 className="mt-10 font-display text-3xl font-black uppercase text-frost">{step}</h3>
            <p className="mt-4 text-sm leading-6 text-smoke">
              {index === 0 && "Choose the package, lock the date, and share your vision."}
              {index === 1 && "We capture BTS, key moments, reactions, and social-first angles."}
              {index === 2 && "Your clips are cut with music, pacing, color, and hooks."}
              {index === 3 && "Receive reels, raw clips, and ready-to-post assets fast."}
            </p>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          kicker="Everything You Want In One Shoot"
          title="One team. Every social asset."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shootGrid.map((item, index) => (
            <MotionReveal key={item} delay={index * 0.035} className="border border-white/10 bg-purple/60 p-5 transition hover:border-neon/70 hover:bg-neon/10">
              <span className="font-display text-xs font-black text-neon">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-12 font-display text-xl font-black uppercase leading-tight text-frost">{item}</p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages({
  onSelectPackage,
}: {
  onSelectPackage: (packageName: string) => void;
}) {
  return (
    <section id="packages" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionHeading kicker="Packages" title="Choose your content drop" />
      <div className="grid gap-5 lg:grid-cols-3">
        {packages.map((pack) => (
          <MotionReveal key={pack.name} className={`glass-panel p-7 ${pack.featured ? "border-neon/70 shadow-neon" : ""}`}>
            <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-neon">{pack.name}</p>
            <h3 className="mt-4 font-display text-5xl font-black uppercase text-frost">{pack.duration}</h3>
            <ul className="mt-8 space-y-4 text-sm text-smoke">
              {pack.details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon shadow-neon" />
                  {detail}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelectPackage(pack.name)}
              className="mt-9 inline-flex w-full justify-center border border-neon/40 px-5 py-4 text-sm font-black uppercase tracking-wider text-frost transition hover:bg-neon hover:text-white hover:shadow-neon"
            >
              Select {pack.name}
            </button>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
      <SectionHeading kicker="Testimonials" title="Clients remember the speed and the feeling" />
      <div className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <MotionReveal key={item.name} delay={index * 0.08} className="glass-panel p-6">
            <p className="text-lg leading-8 text-frost">"{item.quote}"</p>
            <p className="mt-8 font-display text-sm font-black uppercase tracking-[0.25em] text-neon">
              {item.name}
            </p>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ selectedPackage }: { selectedPackage: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      whatsapp: String(formData.get("whatsapp") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      eventDate: String(formData.get("eventDate") || "").trim(),
      eventType: String(formData.get("eventType") || "").trim(),
      packageName: String(formData.get("packageName") || selectedPackage || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (
      !payload.name ||
      !payload.whatsapp ||
      !payload.email ||
      !payload.eventDate ||
      !payload.eventType ||
      !payload.packageName ||
      !payload.message
    ) {
      setStatus("error");
      setMessage("Please complete every field before submitting your booking request.");
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseText = await response.text();
      const result = (responseText ? JSON.parse(responseText) : {}) as {
        ok?: boolean;
        message?: string;
        emailSent?: boolean;
        whatsappSent?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Booking could not be completed. Please try again.");
      }

      setStatus("success");
      setMessage(
        result.emailSent && result.whatsappSent
          ? "Booking request completed. Confirmation has been sent by WhatsApp and email."
          : result.message ||
              "Package workflow completed. Booking saved and confirmation notification records created.",
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden px-4 py-28 md:px-8">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(5,4,10,.7), rgba(5,4,10,1)), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=85')",
        }}
      />
      <MotionReveal className="mx-auto max-w-4xl text-center">
        <p className="mb-4 font-display text-xs font-black uppercase tracking-[0.32em] text-neon">
          Final CTA
        </p>
        <h2 className="font-display text-5xl font-black uppercase leading-none text-frost md:text-7xl">
          You deserve a premium shoot
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-smoke">
          Tell us your wedding date, event mood, or brand launch brief. We will
          build the content plan, shoot the story, and deliver assets ready for
          Instagram, YouTube Shorts, and every group chat.
        </p>
        <form
          onSubmit={handleSubmit}
          className="glass-panel mx-auto mt-10 grid max-w-4xl gap-3 p-4 text-left md:grid-cols-2"
        >
          <input
            name="name"
            className="border border-white/10 bg-ink/80 px-4 py-4 text-sm text-frost outline-none transition placeholder:text-smoke focus:border-neon"
            placeholder="Your name"
            required
          />
          <input
            name="whatsapp"
            className="border border-white/10 bg-ink/80 px-4 py-4 text-sm text-frost outline-none transition placeholder:text-smoke focus:border-neon"
            placeholder="WhatsApp number"
            type="tel"
            required
          />
          <input
            name="email"
            className="border border-white/10 bg-ink/80 px-4 py-4 text-sm text-frost outline-none transition placeholder:text-smoke focus:border-neon"
            placeholder="Email address"
            type="email"
            required
          />
          <input
            name="eventDate"
            className="border border-white/10 bg-ink/80 px-4 py-4 text-sm text-frost outline-none transition placeholder:text-smoke focus:border-neon"
            placeholder="Event date"
            type="text"
            required
          />
          <select
            name="eventType"
            className="border border-white/10 bg-ink/80 px-4 py-4 text-sm text-smoke outline-none transition focus:border-neon md:col-span-2"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select event type
            </option>
            <option>Wedding BTS</option>
            <option>Engagement / Proposal</option>
            <option>Birthday / Private Event</option>
            <option>Corporate Event</option>
            <option>Brand Shoot</option>
            <option>Concert / Festival</option>
            <option>Reels Creation Package</option>
          </select>
          <select
            key={selectedPackage}
            name="packageName"
            className="border border-white/10 bg-ink/80 px-4 py-4 text-sm text-smoke outline-none transition focus:border-neon md:col-span-2"
            defaultValue={selectedPackage}
            required
          >
            <option value="" disabled>
              Select package
            </option>
            {packages.map((pack) => (
              <option key={pack.name}>{pack.name}</option>
            ))}
          </select>
          <textarea
            name="message"
            className="min-h-32 border border-white/10 bg-ink/80 px-4 py-4 text-sm text-frost outline-none transition placeholder:text-smoke focus:border-neon md:col-span-2"
            placeholder="Tell us your event mood, venue, timing, deliverables, or any special moments to capture"
            required
          />
          <button
            disabled={status === "sending"}
            className="bg-neon px-5 py-4 text-center text-sm font-black uppercase tracking-wider text-white shadow-neon transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
          >
            {status === "sending" ? "Completing Workflow..." : "Check Availability"}
          </button>
          {message ? (
            <p
              className={`md:col-span-2 border px-4 py-3 text-center text-sm ${
                status === "success"
                  ? "border-neon/40 bg-neon/10 text-frost"
                  : "border-red-400/40 bg-red-500/10 text-red-100"
              }`}
            >
              {message}
            </p>
          ) : null}
        </form>
      </MotionReveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-smoke md:flex-row md:items-center">
        <div>
          <p className="font-display text-xl font-black uppercase tracking-[0.16em] text-frost">VantaFrame</p>
          <p className="mt-2">Event BTS, wedding content creation, brand shoots, reels, and same-day edits.</p>
        </div>
        <div className="flex flex-wrap gap-5">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-neon">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState("");

  function handlePackageSelect(packageName: string) {
    setSelectedPackage(packageName);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PersonalSection />
        <FreshFeatures />
        <Portfolio />
        <Process />
        <FeatureGrid />
        <Packages onSelectPackage={handlePackageSelect} />
        <Testimonials />
        <FinalCta selectedPackage={selectedPackage} />
      </main>
      <Footer />
    </>
  );
}
