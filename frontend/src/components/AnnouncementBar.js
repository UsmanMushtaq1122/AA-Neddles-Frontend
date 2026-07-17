'use client';

const MESSAGES = [
  'FREE SHIPPING ON ORDERS ABOVE PKR 5,000',
  'NEW COLLECTION 2026 — SHOP NOW',
  'EASY RETURNS & EXCHANGES WITHIN 7 DAYS',
  'EXCLUSIVE STITCHING AVAILABLE — CALL US',
  'FOLLOW US @AANEDDLES FOR DAILY STYLE INSPO',
];

export default function AnnouncementBar() {
  // Repeat messages so the marquee looks seamless
  const repeated = [...MESSAGES, ...MESSAGES, ...MESSAGES];

  return (
    <div className="announcement-bar" role="marquee" aria-live="off" aria-label="Site announcements">
      <div className="announcement-track" aria-hidden="true">
        {repeated.map((msg, i) => (
          <span key={i} className="announcement-item">
            {msg}
            <span className="announcement-dot" aria-hidden="true">•</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .announcement-bar {
          background: #1a1a1a;
          color: #fff;
          height: 34px;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
          z-index: 60;
        }

        .announcement-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: announcementScroll 38s linear infinite;
          will-change: transform;
        }

        .announcement-bar:hover .announcement-track {
          animation-play-state: paused;
        }

        .announcement-item {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #fff;
          display: inline-flex;
          align-items: center;
          padding: 0 0;
        }

        .announcement-dot {
          margin: 0 20px;
          color: #c9a227;
          font-size: 10px;
        }

        @keyframes announcementScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        @media (max-width: 640px) {
          .announcement-bar {
            height: 30px;
          }
          .announcement-item {
            font-size: 10px;
            letter-spacing: 0.1em;
          }
        }
      `}</style>
    </div>
  );
}
