import { useCallback, useMemo, useState } from 'react';
import { FloatingActionButton, FloatingActionButtonStatus } from './components/ui/FloatingActionButton';
import { getSiteConfig, isSupportedSite, siteConfigs } from './config/siteConfigs';

/** API endpoint for extraction */
const EXTRACTION_API_URL = '/api/extract';

/** Delay before resetting button to idle state (ms) */
const RESET_DELAY_MS = 3000;

/**
 * Main Application Component
 * 
 * Renders the DougHub2 application with the floating extraction button.
 * The button is only visible on supported sites defined in siteConfigs.
 */
function App() {
    const [buttonStatus, setButtonStatus] = useState<FloatingActionButtonStatus>('idle');
    const [lastError, setLastError] = useState<string | null>(null);

    // Check if current hostname is a supported site
    const hostname = window.location.hostname;
    const isSupported = useMemo(() => isSupportedSite(hostname), [hostname]);
    const siteConfig = useMemo(() => getSiteConfig(hostname), [hostname]);

    /**
     * Handles the extraction button click.
     * Sends extraction request to backend and updates button state based on response.
     */
    const handleExtractClick = useCallback(async () => {
        // Don't do anything if not in idle state
        if (buttonStatus !== 'idle') return;

        // Clear previous error
        setLastError(null);

        // Start processing
        setButtonStatus('processing');

        try {
            // Prepare the payload
            const payload = {
                url: window.location.href,
                hostname: hostname,
                siteName: siteConfig?.siteName ?? 'Unknown',
                timestamp: new Date().toISOString(),
            };

            // Send extraction request to backend
            const response = await fetch(EXTRACTION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Success - API returned 2xx status
                setButtonStatus('success');
            } else {
                // Error - API returned non-2xx status
                const errorText = await response.text().catch(() => 'Unknown error');
                setLastError(`Server error: ${response.status} - ${errorText}`);
                setButtonStatus('error');
            }
        } catch (error) {
            // Network error or fetch failed
            const message = error instanceof Error ? error.message : 'Unknown error';
            setLastError(`Network error: ${message}`);
            setButtonStatus('error');
        }

        // Reset to idle after delay
        setTimeout(() => {
            setButtonStatus('idle');
        }, RESET_DELAY_MS);
    }, [buttonStatus, hostname, siteConfig]);

    return (
        <div className="min-h-screen bg-[#2C3134] text-[#F0DED3]">
            {/* Main content area */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-[#F0DED3] mb-2">
                            DougHub2
                        </h1>
                        <p className="text-[#A79385]">
                            Personal learning and productivity hub
                        </p>
                    </header>

                    {/* Site Status */}
                    <section className="bg-[#2F3A48] rounded-lg border border-[#506256] p-6 mb-6">
                        <h2 className="text-xl font-semibold text-[#F0DED3] mb-4">
                            Question Extraction
                        </h2>

                        {/* Site detection status */}
                        <div className="bg-[#09232A] rounded-lg p-4 border border-[#506256]/30 mb-4">
                            <p className="text-[#858A7E] text-sm mb-2">
                                <strong className="text-[#DEC28C]">Current Hostname:</strong>{' '}
                                <code className="text-[#F0DED3] bg-[#254341] px-2 py-0.5 rounded">{hostname}</code>
                            </p>
                            <p className="text-[#858A7E] text-sm">
                                <strong className="text-[#DEC28C]">Extraction Status:</strong>{' '}
                                {isSupported ? (
                                    <span className="text-[#a8e063]">
                                        ✓ Supported ({siteConfig?.siteName})
                                    </span>
                                ) : (
                                    <span className="text-[#f45c43]">
                                        ✗ Not supported - button hidden
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Button status */}
                        <div className="bg-[#09232A] rounded-lg p-4 border border-[#506256]/30">
                            <p className="text-[#858A7E] text-sm">
                                <strong className="text-[#DEC28C]">Button Status:</strong>{' '}
                                <span className={
                                    buttonStatus === 'idle' ? 'text-[#A79385]' :
                                        buttonStatus === 'processing' ? 'text-[#f093fb]' :
                                            buttonStatus === 'success' ? 'text-[#a8e063]' :
                                                'text-[#f45c43]'
                                }>
                                    {buttonStatus.charAt(0).toUpperCase() + buttonStatus.slice(1)}
                                </span>
                            </p>
                            {lastError && (
                                <p className="text-[#f45c43] text-xs mt-2">
                                    <strong>Last Error:</strong> {lastError}
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Supported Sites */}
                    <section className="bg-[#254341] rounded-lg border border-[#506256] p-6">
                        <h3 className="text-lg font-semibold text-[#F0DED3] mb-3">
                            Supported Sites
                        </h3>
                        <ul className="space-y-2 text-[#A79385] text-sm">
                            {Object.entries(siteConfigs).map(([host, config]) => (
                                <li key={host} className="flex items-start gap-2">
                                    <span className="text-[#C8A92A]">•</span>
                                    <span>
                                        <code className="text-[#F0DED3] bg-[#09232A] px-2 py-0.5 rounded">{host}</code>
                                        {' → '}
                                        <span className="text-[#DEC28C]">{config.siteName}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </main>

            {/* Floating Action Button - only shown on supported sites */}
            {isSupported && (
                <FloatingActionButton
                    status={buttonStatus}
                    onClick={handleExtractClick}
                />
            )}
        </div>
    );
}

export default App;
