"use client";

import { ArrowUpRight } from "lucide-react";

const INSTAGRAM_CARRIES = [
  {
    src: "https://cdn.store.link/products/basava/bpji8a-bbk601br01_1.jpg?versionId=ORaMkCFaoR4.Q7XJBqDEYlIL9N9.dOma",
    title: "Textured Brown Tote",
    tag: "Everyday Carry",
  },
  {
    src: "https://cdn.store.link/products/basava/vk9w27-bbk601tn01_1.jpg?versionId=sYdsc.5dO3P3BFnf6n3NmLls1NbTu2yd",
    title: "Tan Sling Pouch",
    tag: "Hands-Free",
  },
  {
    src: "https://cdn.store.link/products/basava/fkv6v4-bbn601bk01_1.jpg?versionId=mMiN2HP5yXaOgwzCC5gJUBu4v6P7oT5.",
    title: "Black Bindle Carryall",
    tag: "Architectural",
  },
  {
    src: "https://cdn.store.link/products/basava/x3xvpo-bsl601br01_1.jpg?versionId=xmBhR0VKuaiuOEFaCcjkCDiU0J9brphg",
    title: "Chic Brown Crossbody",
    tag: "Botanical Hide",
  },
];

export function DailyLifeSection() {
  return (
    <section className="py-20 sm:py-28 border-b border-espresso/15 bg-paper/60">
      <div className="shell">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow text-saddle-deep tracking-[0.2em]">From the Bengaluru Bench</span>
            <h2 className="display-md text-espresso mt-2">Daily Life with BASAVA</h2>
            <p className="text-sm text-charcoal/80 mt-1 max-w-lg">
              Explore real workshop moments, workbench details, and customer carries on Instagram <strong>@basava_social</strong>.
            </p>
          </div>
          <a
            href="https://www.instagram.com/basava_social/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0 hover:border-espresso hover:bg-espresso hover:text-ivory transition-all"
          >
            <span>Follow @basava_social</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTAGRAM_CARRIES.map((item, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/basava_social/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square border border-espresso/15 bg-ivory rounded-xs overflow-hidden block shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover p-3 filter drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-espresso/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-ivory">
                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#F5D77F]">
                  {item.tag}
                </span>
                <p className="font-display text-base text-ivory font-semibold mt-0.5">
                  {item.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
