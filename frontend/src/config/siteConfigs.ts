/**
 * Site configuration for question extraction
 *
 * Maps hostnames to site-specific metadata. The floating extraction
 * button will only be shown on sites that are configured here.
 */

/**
 * Configuration for a supported extraction site
 */
export interface SiteConfig {
    /** Human-readable site name */
    siteName: string;
    /** CSS selector for question element (placeholder for future use) */
    questionSelector?: string;
    /** CSS selector for answer choices (placeholder for future use) */
    choicesSelector?: string;
    /** CSS selector for explanation (placeholder for future use) */
    explanationSelector?: string;
    /** CSS selector for correct answer indicator (placeholder for future use) */
    correctAnswerSelector?: string;
}

/**
 * Map of hostnames to their site configurations
 *
 * Add new sites here to enable extraction support.
 * The hostname must match exactly (e.g., "www.acep.org", not "acep.org").
 */
export const siteConfigs: Record<string, SiteConfig> = {
    "www.acep.org": {
        siteName: "ACEP PeerPrep",
        questionSelector: "REPLACE_WITH_ACEP_QUESTION_SELECTOR",
        choicesSelector: "REPLACE_WITH_ACEP_CHOICES_SELECTOR",
        explanationSelector: "REPLACE_WITH_ACEP_EXPLANATION_SELECTOR",
        correctAnswerSelector: "REPLACE_WITH_ACEP_CORRECT_ANSWER_SELECTOR",
    },
    "learn.acep.org": {
        siteName: "ACEP PeerPrep",
        questionSelector: "REPLACE_WITH_ACEP_QUESTION_SELECTOR",
        choicesSelector: "REPLACE_WITH_ACEP_CHOICES_SELECTOR",
        explanationSelector: "REPLACE_WITH_ACEP_EXPLANATION_SELECTOR",
        correctAnswerSelector: "REPLACE_WITH_ACEP_CORRECT_ANSWER_SELECTOR",
    },
    "mksap.acponline.org": {
        siteName: "MKSAP 19",
        questionSelector: "REPLACE_WITH_MKSAP_QUESTION_SELECTOR",
        choicesSelector: "REPLACE_WITH_MKSAP_CHOICES_SELECTOR",
        explanationSelector: "REPLACE_WITH_MKSAP_EXPLANATION_SELECTOR",
        correctAnswerSelector: "REPLACE_WITH_MKSAP_CORRECT_ANSWER_SELECTOR",
    },
    "mksap19.acponline.org": {
        siteName: "MKSAP 19",
        questionSelector: "REPLACE_WITH_MKSAP_QUESTION_SELECTOR",
        choicesSelector: "REPLACE_WITH_MKSAP_CHOICES_SELECTOR",
        explanationSelector: "REPLACE_WITH_MKSAP_EXPLANATION_SELECTOR",
        correctAnswerSelector: "REPLACE_WITH_MKSAP_CORRECT_ANSWER_SELECTOR",
    },
    // Development: Allow localhost for testing
    "localhost": {
        siteName: "Local Development",
    },
};

/**
 * Check if a hostname is supported for extraction
 */
export function isSupportedSite(hostname: string): boolean {
    return hostname in siteConfigs;
}

/**
 * Get the site configuration for a hostname
 * Returns undefined if the hostname is not supported
 */
export function getSiteConfig(hostname: string): SiteConfig | undefined {
    return siteConfigs[hostname];
}
