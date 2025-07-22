"use client"
import Link from "next/link";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import DateFooter from "./dateFooter";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};


const images = [
  {
    icon: "https://res.cloudinary.com/dniaq8eiz/image/upload/v1713181064/public/images/manWithPhone_gvgvta.jpg",
    alt: "people",
  },
  {
    icon: "https://res.cloudinary.com/dniaq8eiz/image/upload/v1713181043/public/images/happyFamily_udw4c5.jpg",
    alt: "people",
  },
  {
    icon: "https://res.cloudinary.com/dniaq8eiz/image/upload/v1713184726/public/images/smilingLady_shwnxw.jpg",
    alt: "people",
  },
];


const AuthSlider = () => {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    // This effect is optional. It updates the year if the component ever re-renders in a new year.
    const year = new Date().getFullYear();
    if (year !== currentYear) {
      setCurrentYear(year);
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col  justify-around items-center">
        <div className="max-w-[472px] pt-8 flex flex-col gap-[50px]">
          <Link href={"/"} className="h-[27px] w-[131px]">
            <Image
              src={"/Homz_colorless.png"}
              className="ml-2"
              height={27}
              width={131}
              alt="img"
            />
          </Link>
          <div className="">
            <Slider {...settings}>
              {images.map((card, index) => (
                <div key={index} className="rounded-[40px] border border-white">
                  <Image
                    src={card.icon}
                    alt="img"
                    width={4096}  // Specify the desired width
                    height={2731}
                    layout="full" // Specify the desired height
                    objectFit="cover"
                    objectPosition="center"
                    className="object-cover bg-center w-[480px] h-[286px] sm:h-[464px] rounded-[40px]"
                    priority
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div>
            <p className="text-[20px] mt-6 text-white text-start font-[500]">
              All-In-One Account Portal To Find, Manage And Monitor Your
              Property Effortlessly.
            </p>
          </div>
        </div>
      </div>
      <div className="pt-[140px] font-[600] text-GrayHomz3 text-center text-[14px]">
        <DateFooter />
      </div>
    </div>

  );
};

export default AuthSlider;
