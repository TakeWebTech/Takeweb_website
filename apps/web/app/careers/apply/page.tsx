"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FloatingElements } from "@/components/floating-elements";
import { Card3D } from "@/components/ui/card-3d";
import {
    ArrowRight, ArrowLeft, Upload, FileText, User, Briefcase,
    GraduationCap, Award, Check, X, Loader2, Sparkles,
    Mail, Phone, MapPin, Linkedin, Github
} from "lucide-react";

// Simulated job data - in production this would come from API
const jobsData: Record<string, { title: string; department: string; skills: string[] }> = {
    "senior-fullstack-1": { title: "Senior Full-Stack Engineer", department: "Engineering", skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"] },
    "devops-engineer-1": { title: "DevOps Engineer", department: "Infrastructure", skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"] },
    "ai-ml-engineer-1": { title: "AI/ML Engineer", department: "Data Science", skills: ["Python", "TensorFlow", "PyTorch", "NLP", "MLOps"] },
    "product-designer-1": { title: "Senior Product Designer", department: "Design", skills: ["Figma", "Design Systems", "User Research", "Prototyping"] },
};

function ApplyPageContent() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get("job");
    const job = jobId ? jobsData[jobId] : null;

    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [cvUploaded, setCvUploaded] = useState(false);
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        currentRole: "",
        experience: "",
        education: "",
        skills: [] as string[],
        coverLetter: "",
    });

    const [newSkill, setNewSkill] = useState("");

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Simulate file upload and parsing
        setTimeout(() => {
            setIsUploading(false);
            setCvUploaded(true);

            // Simulate extracted data
            setFormData(prev => ({
                ...prev,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@email.com",
                phone: "+91 98765 43210",
                location: "Bangalore, India",
                linkedin: "linkedin.com/in/johndoe",
                github: "github.com/johndoe",
                currentRole: "Full-Stack Developer",
                experience: "5 years",
                education: "B.Tech in Computer Science",
                skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"],
            }));

            // Simulate match analysis
            if (job) {
                setIsAnalyzing(true);
                setTimeout(() => {
                    const matchedSkills = formData.skills.filter(s =>
                        job.skills.some(js => js.toLowerCase() === s.toLowerCase())
                    ).length;
                    setMatchScore(Math.min(95, Math.floor(60 + (matchedSkills / job.skills.length) * 35)));
                    setIsAnalyzing(false);
                }, 1500);
            }
        }, 2000);
    }, [job, formData.skills]);

    const addSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const calculateMatchScore = useCallback(() => {
        if (!job) return;

        setIsAnalyzing(true);
        setTimeout(() => {
            const matchedSkills = formData.skills.filter(s =>
                job.skills.some(js => js.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(js.toLowerCase()))
            ).length;
            const score = Math.min(95, Math.floor(40 + (matchedSkills / job.skills.length) * 55));
            setMatchScore(score);
            setIsAnalyzing(false);
        }, 1000);
    }, [job, formData.skills]);

    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                <FloatingElements />
                <div className="container-main relative z-10">
                    <Link
                        href="/careers"
                        className="inline-flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back to Careers
                    </Link>

                    <div className="max-w-2xl">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                            {job ? `Apply for ${job.title}` : "Apply to TakeWeb"}
                        </h1>
                        <p className="text-[var(--text-tertiary)]">
                            {job
                                ? `Join our ${job.department} team and help build the future of enterprise technology.`
                                : "Submit your application and we'll find the best role for you."
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section className="section-padding pt-8">
                <div className="container-main">
                    <div className="max-w-3xl mx-auto">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-center gap-2 mb-12">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${step >= s
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                                        }`}>
                                        {step > s ? <Check size={18} /> : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-20 h-1 mx-2 transition-colors ${step > s ? 'bg-amber-500' : 'bg-[var(--bg-tertiary)]'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step 1: Upload CV or Enter Manually */}
                        {step === 1 && (
                            <Card3D className="p-8">
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                    Get Started
                                </h2>
                                <p className="text-[var(--text-tertiary)] mb-8">
                                    Upload your CV for quick autofill or enter your details manually.
                                </p>

                                {/* CV Upload */}
                                <div className="mb-8">
                                    <label className="block">
                                        <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${cvUploaded
                                                ? 'border-emerald-500 bg-emerald-500/5'
                                                : 'border-[var(--border-secondary)] hover:border-amber-500 hover:bg-amber-500/5'
                                            }`}>
                                            {isUploading ? (
                                                <div className="flex flex-col items-center">
                                                    <Loader2 className="animate-spin text-amber-500 mb-3" size={48} />
                                                    <p className="text-[var(--text-secondary)]">Parsing your CV...</p>
                                                </div>
                                            ) : cvUploaded ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                                                        <Check size={28} />
                                                    </div>
                                                    <p className="font-medium text-[var(--text-primary)]">CV Uploaded Successfully</p>
                                                    <p className="text-sm text-[var(--text-tertiary)]">We've extracted your details below</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                                                        <Upload size={28} />
                                                    </div>
                                                    <p className="font-medium text-[var(--text-primary)] mb-1">
                                                        Drop your CV here or click to upload
                                                    </p>
                                                    <p className="text-sm text-[var(--text-muted)]">
                                                        Supports PDF, DOC, DOCX (max 5MB)
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                        </div>
                                    </label>
                                </div>

                                {/* Match Score */}
                                {job && (matchScore !== null || isAnalyzing) && (
                                    <div className={`p-6 rounded-2xl mb-8 ${matchScore && matchScore >= 70
                                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                                            : matchScore && matchScore >= 50
                                                ? 'bg-amber-500/10 border border-amber-500/20'
                                                : 'bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                                        }`}>
                                        {isAnalyzing ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="animate-spin text-amber-500" size={24} />
                                                <span className="text-[var(--text-secondary)]">Analyzing match...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Sparkles className={matchScore! >= 70 ? 'text-emerald-500' : 'text-amber-500'} size={24} />
                                                    <div>
                                                        <p className="font-medium text-[var(--text-primary)]">Match Score</p>
                                                        <p className="text-sm text-[var(--text-tertiary)]">
                                                            {matchScore! >= 70 ? 'Great match!' : matchScore! >= 50 ? 'Good match' : 'Consider adding more relevant skills'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`text-3xl font-bold ${matchScore! >= 70 ? 'text-emerald-500' : matchScore! >= 50 ? 'text-amber-500' : 'text-[var(--text-muted)]'
                                                    }`}>
                                                    {matchScore}%
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="text-center">
                                    <p className="text-[var(--text-muted)] mb-4">or</p>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[var(--text-primary)] border-2 border-[var(--border-secondary)] rounded-xl hover:border-amber-500 transition-all"
                                    >
                                        <FileText size={18} />
                                        Enter Details Manually
                                    </button>
                                </div>

                                {cvUploaded && (
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all"
                                    >
                                        Continue to Review
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                            </Card3D>
                        )}

                        {/* Step 2: Profile Details */}
                        {step === 2 && (
                            <Card3D className="p-8">
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                    Your Profile
                                </h2>
                                <p className="text-[var(--text-tertiary)] mb-8">
                                    Review and complete your profile details.
                                </p>

                                <div className="space-y-6">
                                    {/* Personal Info */}
                                    <div>
                                        <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                            <User size={18} className="text-amber-500" />
                                            Personal Information
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-[var(--text-muted)] mb-1 block">First Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-[var(--text-muted)] mb-1 block">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-[var(--text-muted)] mb-1 block">Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                        className="w-full pl-11 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                        placeholder="john@email.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm text-[var(--text-muted)] mb-1 block">Phone</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="w-full pl-11 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                        placeholder="+91 98765 43210"
                                                    />
                                                </div>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="text-sm text-[var(--text-muted)] mb-1 block">Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                                    <input
                                                        type="text"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                        className="w-full pl-11 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                        placeholder="City, Country"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div>
                                        <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                            <Briefcase size={18} className="text-amber-500" />
                                            Experience
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-[var(--text-muted)] mb-1 block">Current Role</label>
                                                <input
                                                    type="text"
                                                    value={formData.currentRole}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                    placeholder="Software Engineer"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-[var(--text-muted)] mb-1 block">Years of Experience</label>
                                                <input
                                                    type="text"
                                                    value={formData.experience}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                                                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                    placeholder="5 years"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                            <Award size={18} className="text-amber-500" />
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-sm"
                                                >
                                                    {skill}
                                                    <button onClick={() => removeSkill(skill)} className="hover:text-amber-700">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                                className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                placeholder="Add a skill"
                                            />
                                            <button
                                                onClick={addSkill}
                                                className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {job && formData.skills.length > 0 && (
                                            <button
                                                onClick={calculateMatchScore}
                                                className="mt-4 text-sm text-amber-500 hover:underline"
                                            >
                                                Check match with this job
                                            </button>
                                        )}
                                    </div>

                                    {/* Education */}
                                    <div>
                                        <h3 className="font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                            <GraduationCap size={18} className="text-amber-500" />
                                            Education
                                        </h3>
                                        <input
                                            type="text"
                                            value={formData.education}
                                            onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                            placeholder="Degree, University"
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div>
                                        <h3 className="font-medium text-[var(--text-primary)] mb-4">Social Links</h3>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                                <input
                                                    type="text"
                                                    value={formData.linkedin}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                                                    className="w-full pl-11 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                    placeholder="LinkedIn URL"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                                <input
                                                    type="text"
                                                    value={formData.github}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                                                    className="w-full pl-11 pr-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500"
                                                    placeholder="GitHub URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 font-semibold text-[var(--text-secondary)] border border-[var(--border-secondary)] rounded-xl hover:border-[var(--text-muted)] transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all"
                                    >
                                        Continue
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </Card3D>
                        )}

                        {/* Step 3: Cover Letter & Submit */}
                        {step === 3 && (
                            <Card3D className="p-8">
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                    Final Step
                                </h2>
                                <p className="text-[var(--text-tertiary)] mb-8">
                                    Add a cover letter and submit your application.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-[var(--text-muted)] mb-2 block">
                                            Cover Letter (Optional)
                                        </label>
                                        <textarea
                                            value={formData.coverLetter}
                                            onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                                            rows={6}
                                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-amber-500 resize-none"
                                            placeholder="Tell us why you're excited about this role..."
                                        />
                                    </div>

                                    {/* Summary */}
                                    <div className="p-6 bg-[var(--bg-secondary)] rounded-xl">
                                        <h3 className="font-medium text-[var(--text-primary)] mb-4">Application Summary</h3>
                                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-[var(--text-muted)]">Name:</span>
                                                <span className="ml-2 text-[var(--text-primary)]">
                                                    {formData.firstName} {formData.lastName}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[var(--text-muted)]">Email:</span>
                                                <span className="ml-2 text-[var(--text-primary)]">{formData.email}</span>
                                            </div>
                                            <div>
                                                <span className="text-[var(--text-muted)]">Experience:</span>
                                                <span className="ml-2 text-[var(--text-primary)]">{formData.experience}</span>
                                            </div>
                                            <div>
                                                <span className="text-[var(--text-muted)]">Skills:</span>
                                                <span className="ml-2 text-[var(--text-primary)]">{formData.skills.length} added</span>
                                            </div>
                                        </div>

                                        {matchScore && (
                                            <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[var(--text-muted)]">Job Match Score:</span>
                                                    <span className={`font-bold ${matchScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {matchScore}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Terms */}
                                    <label className="flex items-start gap-3">
                                        <input type="checkbox" className="mt-1" required />
                                        <span className="text-sm text-[var(--text-tertiary)]">
                                            I agree to TakeWeb&apos;s <Link href="/privacy" className="text-amber-500 hover:underline">Privacy Policy</Link> and consent to the processing of my personal data for recruitment purposes.
                                        </span>
                                    </label>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-6 py-3 font-semibold text-[var(--text-secondary)] border border-[var(--border-secondary)] rounded-xl hover:border-[var(--text-muted)] transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => alert("Application submitted! In production, this would send to your backend.")}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:shadow-lg transition-all"
                                    >
                                        Submit Application
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </Card3D>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default function ApplyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>}>
            <ApplyPageContent />
        </Suspense>
    );
}
