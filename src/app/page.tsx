import Link from 'next/link'

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
            <header className="bg-blue-600 text-white py-4">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <h1 className="text-xl font-bold">HTML to X Converter</h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold mb-4">Convert HTML into Your Desired Format</h2>
                <p className="mb-6">Easily convert HTML to formats like PDF, PNG, JPEG with our simple tool.</p>
                <Link href={'https://github.com/mkazinauskas/html-to-x'} target="_blank" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Get Started</Link>
            </main>
            <section id="features" className="py-8">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4">Features</h3>
                    <ul className="grid gap-4 grid-cols-1 md:grid-cols-3">
                        <li className="bg-white p-4 rounded shadow">
                            <h4 className="font-bold">Fast Conversion</h4>
                            <p>Convert your files in seconds with high accuracy.</p>
                        </li>
                        <li className="bg-white p-4 rounded shadow">
                            <h4 className="font-bold">Multiple Formats</h4>
                            <p>Support for various output formats like PDF, PNG, JPEG.</p>
                        </li>
                        <li className="bg-white p-4 rounded shadow">
                            <h4 className="font-bold">Free</h4>
                            <p>No subscriptions, no limits, no hidden costs.</p>
                        </li>
                    </ul>
                </div>
            </section>
            <footer id="contact" className="bg-blue-600 text-white py-4">
                <div className="container mx-auto px-4">
                    <p className="text-center">&copy; HTML to X Converter. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
