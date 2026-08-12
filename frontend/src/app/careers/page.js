'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Briefcase, MapPin, Loader2, X, CheckCircle2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { careersApi } from '@/services/careers';

const EMPTY_FORM = { name: '', email: '', phone: '', portfolio: '', message: '' };

export default function CareersPage() {
  const [apiJobs, setApiJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('');
  const [jobType, setJobType] = useState('');

  const [applyJob, setApplyJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    careersApi.getAll()
      .then((res) => {
        const data = res.data || [];
        setApiJobs(Array.isArray(data) ? data.filter((j) => j.isActive !== false) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const jobList = useMemo(() => {
    return apiJobs.map((j) => ({
      id: j.id,
      title: j.title,
      branch: j.location || j.branch || '',
      type: j.type || 'Full Time',
    }));
  }, [apiJobs]);

  const branches = useMemo(() => ['All', ...new Set(jobList.map((j) => j.branch).filter(Boolean))], [jobList]);
  const types = useMemo(() => ['All', ...new Set(jobList.map((j) => j.type).filter(Boolean))], [jobList]);

  const filteredJobs = useMemo(() => {
    return jobList.filter((job) => {
      const matchesQuery = query
        ? job.title.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesBranch = branch && branch !== 'All' ? job.branch === branch : true;
      const matchesType = jobType && jobType !== 'All' ? job.type === jobType : true;
      return matchesQuery && matchesBranch && matchesType;
    });
  }, [query, branch, jobType, jobList]);

  const openApply = (job) => {
    setApplyJob(job);
    setForm(EMPTY_FORM);
    setSubmitError('');
    setSubmitted(false);
  };

  const closeApply = () => {
    setApplyJob(null);
    setForm(EMPTY_FORM);
    setSubmitError('');
    setSubmitted(false);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const portfolio = form.portfolio.trim();
      await careersApi.apply(applyJob.id, {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        portfolio: portfolio && !/^https?:\/\//i.test(portfolio) ? `https://${portfolio}` : portfolio,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="absolute inset-0 bg-[url('/images/hero1.jpeg')] bg-cover bg-center opacity-40" />
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
                <span className="sr-only">Branch</span>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10 appearance-none"
                >
                  {branches.map((b) => (
                    <option key={b} value={b === 'All' ? '' : b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="sr-only">Job Type</span>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10 appearance-none"
                >
                  {types.map((t) => (
                    <option key={t} value={t === 'All' ? '' : t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={24} className="animate-spin text-noor-maroon" />
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-500">
                {filteredJobs.length} open position{filteredJobs.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-4">
                {filteredJobs.map((job, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-zinc-200 bg-white p-5">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex w-12 h-12 bg-zinc-50 rounded-full items-center justify-center shrink-0">
                        <Briefcase size={20} className="text-noor-maroon" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-noor-black">{job.title}</h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} strokeWidth={1.5} />
                            {job.branch}
                          </span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openApply(job)}
                      className="whitespace-nowrap px-6 py-3 bg-noor-black text-white text-sm font-semibold hover:bg-noor-gold transition-colors text-center cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Search size={40} className="mx-auto text-zinc-200 mb-4" />
                  <h3 className="text-lg font-medium text-noor-black mb-1">No positions match your criteria</h3>
                  <p className="text-sm text-zinc-400">Try adjusting your search filters.</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {applyJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={closeApply}
              aria-label="Close"
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X size={22} />
            </button>

            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
                <h3 className="text-xl font-semibold text-noor-black">Application Sent</h3>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                  Thank you, {form.name}. Your application for <span className="text-noor-black font-medium">{applyJob.title}</span> has been received. Our team will get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={closeApply}
                  className="mt-6 px-6 py-3 bg-noor-black text-white text-sm font-semibold hover:bg-noor-gold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-noor-black">Apply for {applyJob.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{applyJob.branch} · {applyJob.type}</p>

                <form onSubmit={handleApply} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="apply-name" className="block text-sm font-medium text-zinc-700">Full Name *</label>
                    <input
                      id="apply-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1.5 w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-email" className="block text-sm font-medium text-zinc-700">Email *</label>
                    <input
                      id="apply-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1.5 w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-phone" className="block text-sm font-medium text-zinc-700">Phone Number</label>
                    <input
                      id="apply-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1.5 w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-portfolio" className="block text-sm font-medium text-zinc-700">Portfolio / LinkedIn URL</label>
                    <input
                      id="apply-portfolio"
                      type="text"
                      value={form.portfolio}
                      onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                      placeholder="e.g. linkedin.com/in/your-profile"
                      className="mt-1.5 w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="apply-message" className="block text-sm font-medium text-zinc-700">Why are you a good fit?</label>
                    <textarea
                      id="apply-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="mt-1.5 w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3.5 bg-noor-black text-white text-sm font-semibold hover:bg-noor-gold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
