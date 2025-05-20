"use client";

import { Icon } from "@/components/ui/icon";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { icons } from "lucide-react";
interface sponsorsProps {
  name: string;
}

const sponsors: sponsorsProps[] = [
  {
    name: "Mỗi khoảnh khắc đều đáng nhớ.",
  },
  {
    name: "Ghi lại từng bước lớn khôn.",
  },
  {
    name: "Lưu giữ ký ức, nuôi dưỡng tương lai.",
  },
  {
    name: "Bé lớn từng ngày, bạn chẳng bỏ lỡ phút giây nào.",
  },
];

export const SponsorsSection = () => {
  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-xl text-center mb-6">
        Châm ngôn của chúng tôi
      </h2>

      <div className="mx-auto">
        <Marquee
          className="gap-[3rem]"
          fade
          innerClassName="gap-[3rem]"
          pauseOnHover
        >
          {sponsors.map(({ name }) => (
            <div
              key={name}
              className="flex items-center text-xl md:text-2xl font-medium"
            >
              {name}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
