import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Freelancer Marriage - ফ্রিল্যান্সারদের বিয়ের এক বিশ্বস্ত মাধ্যম",
        short_name: "Freelancer Marriage",
        description: "বাংলাদেশের ফ্রিল্যান্সারদের জন্য তৈরি প্রথম বিশ্বস্ত ম্যাট্রিমনি ওয়েবসাইট",
        start_url: "/",
        display: "standalone",
        background_color: "#fdf2f8",
        theme_color: "#ec4899",
        orientation: "portrait-primary",
        scope: "/",
        lang: "bn",
        icons: [
            {
                src: "/icon-light-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "/apple-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
            {
                src: "/icon.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
        ],
        categories: ["lifestyle", "social"],
    }
}
