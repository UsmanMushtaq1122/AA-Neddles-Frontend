'use client';

import { useEffect, useState } from 'react';
import { bannersApi } from '@/services/banners';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      cancelled = true;
    }, 8000);

    bannersApi.getAll()
      .then((res) => {
        if (cancelled) return;
        const activeAnnouncements = (Array.isArray(res?.data) ? res.data : [])
          .filter((banner) => banner.type === 'announcement' && banner.title)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setAnnouncements(activeAnnouncements);
      })
      .catch(() => {
        if (!cancelled) setAnnouncements([]);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  if (announcements.length === 0) return null;

  const repeated = [...announcements, ...announcements, ...announcements];

  return (
    <div className="announcement-bar" role="marquee" aria-live="off" aria-label="Site announcements">
      <div className="announcement-track">
        {repeated.map((announcement, i) => {
          const content = (
            <>
              {announcement.title}
              <span className="announcement-dot" aria-hidden="true">•</span>
            </>
          );
          const className = "announcement-item";
          const style = {
            backgroundColor: announcement.bgColor || '#1a1a1a',
            color: announcement.textColor || '#fff',
          };

          return announcement.link ? (
            <a key={`${announcement.id}-${i}`} className={className} href={announcement.link} style={style}>
              {content}
            </a>
          ) : (
            <span key={`${announcement.id}-${i}`} className={className} style={style}>
              {content}
            </span>
          );
        })}
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
          align-items: stretch;
          height: 100%;
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
          text-decoration: none;
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
