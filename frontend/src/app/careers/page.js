'use client';

import { useMemo, useState } from 'react';
import { Search, Briefcase, MapPin } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const jobList = [
  { title: 'Assistant Manager Product Development', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Fashion Designer', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Performance Marketing Manager', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Inventory Assistant', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Tracer', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Customer Experience Executive', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Graphic Designer', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Quality Assurance Specialist', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Merchandiser', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Tailoring Supervisor', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Retail Sales Manager', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Production Planner', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Social Media Executive', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Logistics Coordinator', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Customer Support Representative', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Visual Merchandiser', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Procurement Executive', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Finance Officer', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Inventory Coordinator', branch: 'Head Office & Factory', type: 'Full Time' },
  { title: 'Brand Partnerships Lead', branch: 'Head Office & Factory', type: 'Full Time' },
];

export default function CareersPage() {
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('');
  const [jobType, setJobType] = useState('');

  const filteredJobs = useMemo(() => {
    return jobList.filter((job) => {
      const matchesQuery = query
        ? job.title.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesBranch = branch ? job.branch === branch : true;
      const matchesType = jobType ? job.type === jobType : true;
      return matchesQuery && matchesBranch && matchesType;
    });
  }, [query, branch, jobType]);

  return (
    <PageLayout
      title="Careers"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Careers' },
      ]}
      heroBackground={false}
    >
      <div className="space-y-16">
        <section className="relative overflow-hidden bg-noor-black text-white">
          <div className="absolute inset-0 bg-[url('/images/career-hero.jpg')] bg-cover bg-center opacity-40" />
          <div className="relative px-6 py-24 sm:px-10 md:px-16 lg:px-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">WEAVE YOUR CAREER WITH US</h1>
              <p className="mt-6 max-w-2xl text-base md:text-lg text-zinc-100 leading-relaxed">
                Discover a career that&apos;s tailored to your skills and interests, and help us stitch together a better tomorrow.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-noor-black">Search for opportunities</h2>
            <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_auto]">
              <label className="block">
                <span className="sr-only">Job Title</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job Title ..."
                    className="w-full border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                />
              </label>
              <label className="block">
                <span className="sr-only">Select Branch</span>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                >
                  <option value="">Select Branch</option>
                  <option value="Head Office & Factory">Head Office & Factory</option>
                </select>
              </label>
              <label className="block">
                <span className="sr-only">Select Job Type</span>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                    className="w-full border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                >
                  <option value="">Select Job Type</option>
                  <option value="Full Time">Full Time</option>
                </select>
              </label>
              <button
                type="button"
                className="inline-flex items-center justify-center bg-[#00A65A] px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00894f]"
              >
                <Search size={18} className="mr-2" />
                Search Job
              </button>
            </div>
          </div>

          <div className="border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h3 className="text-2xl font-semibold text-noor-black">{filteredJobs.length} Jobs Listed</h3>
              <p className="text-sm text-zinc-500">Find the latest openings and apply for the role that matches your talent.</p>
            </div>

            <div className="mt-6 overflow-hidden border border-zinc-200">
              <div className="grid grid-cols-12 gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
                <span className="col-span-6">Job Title</span>
                <span className="col-span-4">Location</span>
                <span className="col-span-2 text-right">Apply</span>
              </div>
              {filteredJobs.map((job) => (
                <div key={job.title} className="grid grid-cols-12 gap-4 border-b border-zinc-200 px-6 py-5 text-sm text-noor-black last:border-0">
                  <div className="col-span-6 flex items-center gap-3">
                    <Briefcase size={18} className="text-noor-maroon" />
                    <span>{job.title}</span>
                  </div>
                  <div className="col-span-4 flex items-center gap-2 text-zinc-500">
                    <MapPin size={16} />
                    <span>{job.branch}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <a
                      href={`mailto:careers@aaneddles.com?subject=${encodeURIComponent('Application: ' + job.title)}`}
                      className="border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-noor-black shadow-sm transition hover:bg-zinc-50"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
