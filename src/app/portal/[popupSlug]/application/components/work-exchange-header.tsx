'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Ticket, Bus, Tent, UtensilsCrossed } from "lucide-react"

export const WorkExchangeHeader = () => {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
      {/* Title + Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Work Exchange
        </h2>
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isExpanded ? "Hide work exchange details" : "Show work exchange details"}
          aria-expanded={isExpanded}
          tabIndex={0}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          {isExpanded ? "Hide details" : "Show details"}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-8 pt-2">
              {/* Subtitle */}
              <p className="text-base text-muted-foreground font-medium">
                <span className="font-semibold text-foreground">Work:</span>{" "}
                One of the following work exchange options
              </p>

              {/* Table Image */}
              <div className="overflow-x-auto rounded-xl w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/eclipse_form.png"
                  alt="Work Exchange options table showing Long Build, Short Build, Event, and Post-Event options with arrival dates, work requirements, accommodations, transportation, and meals details"
                  className=" w-[600px] h-auto mx-auto  border border-border"
                />
              </div>

              {/* In Exchange For */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  In exchange for:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                    <Ticket className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">Non-transferable Work Exchange Ticket</span>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                    <Bus className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">Roundtrip shuttle from Reykjavík (KEF)</span>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                    <Tent className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">Accommodations vary by Work Exchange Option</span>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                    <UtensilsCrossed className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">Meals vary by Work Exchange Option</span>
                  </li>
                </ul>
              </div>

              {/* Application & Confirmation Process */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  The Application &amp; Confirmation Process
                </h3>

                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </span>
                    <p className="text-sm text-foreground leading-relaxed pt-0.5">
                      <span className="font-semibold">Start by filling out the application</span> and paying the $5 Non-Refundable Application Fee.
                      The Application Fee helps Iceland Eclipse offset the cost of operating the program.{" "}
                      <span className="font-semibold">The soft deadline to apply is April 1st, 2026.</span>
                    </p>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </span>
                    <p className="text-sm text-foreground leading-relaxed pt-0.5">
                      <span className="font-semibold">The Volunteer Coordinator will review your application and send you an invitation</span> to
                      support during a specific phase of the production based on previous experience, skillset, availability and interest.{" "}
                      <em className="text-muted-foreground">You won&apos;t be invited to a specific team until you confirm your participation.</em>
                    </p>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </span>
                    <p className="text-sm text-foreground leading-relaxed pt-0.5">
                      <span className="font-semibold">To confirm your participation, purchase your $600 Refundable Work Exchange Deposit.</span>{" "}
                      The soft deadline to confirm your participation is April 1st, 2026, but the program will likely fill before then.
                    </p>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      4
                    </span>
                    <p className="text-sm text-foreground leading-relaxed pt-0.5">
                      <span className="font-semibold">Confirmed participants will be invited to request shifts on the team(s) they were invited to support.</span>{" "}
                      The Coordinator will review your shift requests, finalize your schedule and send to you by July 15th, 2026.
                    </p>
                  </li>

                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      5
                    </span>
                    <p className="text-sm text-foreground leading-relaxed pt-0.5">
                      As long as you complete the work requirement and uphold the Code of Conduct,{" "}
                      <span className="font-semibold">$600 will be refunded within one week after the event.</span>
                    </p>
                  </li>
                </ol>
              </div>

              {/* Final Note */}
              <p className="text-sm text-muted-foreground italic border-l-4 border-primary pl-4 py-2">
                If the work exchange looks good to you, please proceed with filling out the application.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
