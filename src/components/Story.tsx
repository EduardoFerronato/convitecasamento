"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { SectionHeading } from "@/components/ui/WeddingUI";

export function Story() {
  const { story } = weddingConfig;

  return (
    <section id="historia" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading label={story.label} title={story.title} />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Timeline */}
          <div className="relative pl-8">
            <div className="absolute top-2 bottom-2 left-[5px] w-px bg-white/15" />

            {story.chapters.map((chapter, index) => (
              <motion.div
                key={chapter.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative pb-10 last:pb-0 md:pb-12"
              >
                <div className="absolute top-1.5 -left-8 flex h-2.5 w-2.5 items-center justify-center">
                  {"isFinal" in chapter && chapter.isFinal ? (
                    <Heart className="h-3 w-3 text-white" strokeWidth={1.5} fill="none" />
                  ) : (
                    <div className="h-2 w-2 rounded-full border border-white/50 bg-night" />
                  )}
                </div>

                <span className="text-xs text-silver">{chapter.year}</span>
                <h3 className="font-display mt-1 mb-2 text-xl text-white md:text-2xl">
                  {chapter.title}
                </h3>
                <p className="text-sm leading-relaxed text-silver md:text-[15px]">
                  {chapter.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[3/4] overflow-hidden rounded-sm lg:sticky lg:top-28 lg:self-start"
          >
            <Image
              src="/images/story-couple.jpg"
              alt="Anna e Eduardo"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-night/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
