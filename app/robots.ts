import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://freelancermarriage.com"

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/dashboard/", "/sign-in/", "/sign-up/", "/login/", "/register/"],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: ["/api/", "/dashboard/", "/sign-in/", "/sign-up/", "/login/", "/register/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}