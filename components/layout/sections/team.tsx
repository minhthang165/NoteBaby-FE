import GithubIcon from "@/components/icons/github-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import XIcon from "@/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
interface TeamProps {
  imageUrl: string;
  name: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}
export const TeamSection = () => {
  const teamList: TeamProps[] = [
    {
      imageUrl: "/minh-thang.jpg",
      name: "Minh Thắng",
      positions: ["Người đồng hành"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/",
        },
        {
          name: "Github",
          url: "https://github.com/minhthang165",
        },
        {
          name: "X",
          url: "https://x.com",
        },
      ],
    },
    {
      imageUrl:"/tuan.jpg",
      name: "Anh Tuấn",
      positions: ["Người đồng hành"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
        },
        {
          name: "Github",
          url: "https://github.com/AnhTuanFPT1303",
        },
        {
          name: "X",
          url: "https://x.com",
        },
      ],
    },
    {
      imageUrl:"/phuong.jpg",
      name: "Hà Phương",
      positions: ["Người đồng hành"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
        },
        {
          name: "X",
          url: "https://x.com",
        },
      ],
    },
    {
      imageUrl:"/trung-nguyen.jpg",
      name: "Trung Nguyên",
      positions: ["Người đồng hành"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
        },
        {
          name: "Github",
          url: "https://github.com/AlexNguyenHere",
        },
        {
          name: "X",
          url: "https://x.com",
        },
      ],
    },
    {
      imageUrl: "/thu.jpg",
      name: "Anh Thư",
      positions: ["Người đồng hành"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
        },
        {
          name: "X",
          url: "https://x.com",
        },
      ],
    },
    {
      imageUrl:"/tu.jpg",
      name: "Minh Tú",
      positions: ["Người đồng hành"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/leopoldo-miranda/",
        },
        {
          name: "X",
          url: "https://x.com",
        },
      ],
    },

  ];
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "Github":
        return <GithubIcon />;
      case "X":
        return <XIcon />;
    }
  };

  return (
    <section id="team" className="container lg:w-[75%] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Đội ngũ
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Đội ngũ của chúng tôi
        </h2>
      </div>

      <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-lg w-full px-4">
        {teamList.map(({ imageUrl, name, positions, socialNetworks }, index) => (
          <Card
            key={index}
            className="bg-muted/60 flex flex-col h-full overflow-hidden group/hoverimg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="p-0 gap-0">
              <div className="h-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt=""
                  width={300}
                  height={300}
                  className="w-full aspect-square object-cover transition-all duration-200 ease-linear size-full group-hover/hoverimg:scale-[1.01]"
                />
              </div>
              <CardTitle className="py-6 pb-4 px-6 text-center">
                {name}
              </CardTitle>
            </CardHeader>
            {positions.map((position, index) => (
              <CardContent
                key={index}
                className={`pb-0 text-center text-muted-foreground ${
                  index === positions.length - 1 && "pb-6"
                }`}
              >
                {position}
                {index < positions.length - 1 && <span>,</span>}
              </CardContent>
            ))}
            <CardFooter className="space-x-4 mt-auto justify-center p-6">
              {socialNetworks.map(({ name, url }, index) => (
                <Link
                  key={index}
                  href={url}
                  target="_blank"
                  className="hover:opacity-80 transition-all"
                >
                  {socialIcon(name)}
                </Link>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>

    </section>
  );
};
