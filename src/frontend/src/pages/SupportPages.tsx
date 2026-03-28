import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Headphones, Mail, Receipt, Scale } from "lucide-react";
import type { ReactNode } from "react";

function InfoPage({
  eyebrow,
  title,
  intro,
  icon,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  icon: ReactNode;
  sections: { heading: string; body: string }[];
}) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-cinema-bg py-10">
      <div className="max-w-[900px] mx-auto px-6">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1 text-cinema-muted hover:text-cinema-gold text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-cinema-card border border-cinema-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-cinema-gold/15 text-cinema-gold flex items-center justify-center">
              {icon}
            </div>
            <div>
              <p className="text-cinema-gold text-xs font-bold tracking-[0.18em] uppercase mb-1">
                {eyebrow}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-cinema-text">
                {title}
              </h1>
            </div>
          </div>

          <p className="text-cinema-muted leading-relaxed mb-8 max-w-2xl">
            {intro}
          </p>

          <div className="space-y-4">
            {sections.map((section) => (
              <section
                key={section.heading}
                className="bg-cinema-inner border border-cinema-border rounded-xl p-5"
              >
                <h2 className="text-cinema-text font-bold text-lg mb-2">
                  {section.heading}
                </h2>
                <p className="text-cinema-muted leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-8">
            <Button
              className="bg-cinema-gold hover:bg-red-700 text-cinema-bg font-bold text-xs tracking-[0.12em] uppercase rounded-sm"
              onClick={() => navigate({ to: "/" })}
            >
              Back To Movies
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export function HelpCenterPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Help Center"
      intro="Find quick answers for booking, seat selection, payment, and ticket access. If something looks off, start here before placing another order."
      icon={<Headphones className="w-7 h-7" />}
      sections={[
        {
          heading: "Booking Issues",
          body: "If your confirmation screen did not appear, check My Bookings first. Avoid placing another order until you confirm whether the booking already exists.",
        },
        {
          heading: "Seat Selection",
          body: "Selected seats are reserved only when checkout completes. If a seat becomes unavailable, return to the seating map and choose another option.",
        },
        {
          heading: "Payments",
          body: "If payment is interrupted, wait a moment and refresh My Bookings. Temporary delays can happen before a booking appears in the list.",
        },
      ]}
    />
  );
}

export function RefundPolicyPage() {
  return (
    <InfoPage
      eyebrow="Policy"
      title="Refund Policy"
      intro="Refunds depend on when the request is made relative to showtime. This page gives users a clear reference before they complete a booking."
      icon={<Receipt className="w-7 h-7" />}
      sections={[
        {
          heading: "Before Showtime",
          body: "Refund requests made well before the scheduled show are typically eligible, subject to payment processor timing and booking status verification.",
        },
        {
          heading: "Near Showtime",
          body: "Requests made shortly before the movie starts may be limited or unavailable, especially if the booking has already been finalized.",
        },
        {
          heading: "Processing Time",
          body: "Approved refunds may take several business days to appear, depending on the card issuer or payment method used during checkout.",
        },
      ]}
    />
  );
}

export function ContactUsPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Contact Us"
      intro="Need direct help? Use the details below when a booking, refund, or seat issue needs manual support."
      icon={<Mail className="w-7 h-7" />}
      sections={[
        {
          heading: "Email Support",
          body: "Reach the support desk at support@cinebook.local for booking corrections, refund questions, and ticket-related help.",
        },
        {
          heading: "Response Window",
          body: "Most requests should receive a response within one business day. Include the booking ID when possible to speed things up.",
        },
        {
          heading: "Best Information To Share",
          body: "Send the movie title, show date, time, selected seats, and the email or account you used during booking so support can trace the request quickly.",
        },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="These terms outline how users access the booking experience, what counts as a valid reservation, and the general responsibilities around purchases."
      icon={<Scale className="w-7 h-7" />}
      sections={[
        {
          heading: "Ticket Usage",
          body: "Tickets are intended for the selected showtime only and may not be transferable if venue rules or payment verification requirements prevent it.",
        },
        {
          heading: "User Responsibility",
          body: "Customers are responsible for reviewing movie, date, time, hall, and seat details before confirming a booking.",
        },
        {
          heading: "Service Availability",
          body: "Showtimes, seat availability, and pricing can change without notice until the booking is successfully completed and confirmed.",
        },
      ]}
    />
  );
}
