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
    name: "Giáo dục là vũ khí mạnh nhất để thay đổi thế giới.",
  },
  {
    name: "Học vấn không chỉ là con đường đến tri thức, mà còn là con đường đến tương lai.",
  },
  {
    name: "Thành công bắt đầu từ những bài học nhỏ nhất.",
  },
  {
    name: "Không có học sinh dốt, chỉ có học sinh chưa được dạy đúng cách.",
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
