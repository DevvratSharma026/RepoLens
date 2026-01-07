import React from 'react'
import logo from '../../assets/mainLogo.png'
import linkedinLogo from '../../assets/linkedin.png'
import githubLogo from '../../assets/github.png'
import { href, Link } from 'react-router-dom'

const FooterSectionTwo = () => {

    const FooterLinks = [
        {
            title: "Company",
            links: [
                { name: "About Us", href: "*" },
                { name: "Careers", href: "*" },
                { name: "Brand Center", href: "*" },
            ],
        },
        {
            title: "Support",
            links: [
                { name: "Help Center", href: "*" },
                { name: "Safety Center", href: "*" },
                { name: "Community Guidelines", href: "/*" },
            ],
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "*" },
                { name: "Terms of Service", href: "*" },
                { name: "Cookie Policy", href: "*" },
            ],
        },
    ]

    return (
        <div className="border-t mt-14 border-gray-800 w-full bg-white dark:bg-transparent">
            {/* Container to keep content centered on ultra-wide screens */}
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">

                {/* Left Section: Branding & Socials */}
                <div className="lg:w-1/3 space-y-6">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Code Nexus Logo" className="h-10 w-10 object-contain rounded-xl" />
                        <h2 className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                            Code Nexus
                        </h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                        Your AI-powered code review assistant. Faster reviews, better code, happier developers.
                    </p>

                    <div className="flex gap-4">
                        <a
                            href="https://github.com/DevvratSharma026"
                            target="_blank"
                            rel="noreferrer"
                            className="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <img src={githubLogo} alt="GitHub" className="h-6 w-6" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/devvrat-sharma/"
                            target="_blank"
                            rel="noreferrer"
                            className="opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <img src={linkedinLogo} alt="LinkedIn" className="h-6 w-6" />
                        </a>
                    </div>
                </div>

                {/* Right Section: Navigation Links */}
                <div className="lg:w-2/3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {FooterLinks.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                to={link.href}
                                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors text-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Optional: Bottom Credit Bar */}
            <div className="flex justify-between max-w-7xl mx-auto px-6 py-6 border-t border-gray-100 dark:border-gray-800 text-center md:text-left">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Code Nexus. Built with passion for developers.
                </p>
                <p>Built for developer with LOVE❤️</p>
            </div>
        </div>
    )
}

export default FooterSectionTwo