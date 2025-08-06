import Image from "next/image";
import Link from "next/link";
import React from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import useIsUserAt1295px from "@/utils/useIsUserAt1295px";

const PlansYearly = () => {
  const isAt1295px = useIsUserAt1295px();

  const pricingPlans = [
    {
      price: '55,000',
      title: 'Enterprise Basic',
      billing: "Billed Annually",
      features: [
        "Document generation (Reciept, Lease Agreements & Quit notices)",
        "Rent reminder",
        "Up to 10 Properties",
        "Up to 2 users",
        "Financial mangement & statement generation",
        "Maintenance management",
        "Property information",
        "Tenant Management",
        "Manage tenant applications",
        "Advertise vacant properties",
        "Whitelabels",

        "Training & data migration",
        "Expense management",
      ],
      status: false,
      interval: "annually"
    },
    {
      price: "95,000",
      title: "Enterprise Starter",
      billing: "Billed Annually",
      features: [
        "Up to 10 Properties",
        "Up to 2 users",
        "Financial mangement & statement generation",
        "Maintenance management",
        "Property information",
        "Tenant Management",
        "Document generation (Reciept, Lease Agreements & Quit notices)",
        "Manage tenant applications",
        "Advertise vacant properties",
        "Expense management",
        "Rent reminder",

        "Whitelabels",
        "Training & data migration",
      ],
      status: false,
      interval: "annually"
    },
    {
      price: "190,000",
      title: "Enterprise Plus",
      billing: "Billed Annually",
      features: [
        "Up to 30 properties",
        "Up to 5 users",
        "Financial mangement & statement generation",
        "Maintenance management",
        "Property information",
        "Tenant Management",
        "Document generation (Reciept, Lease Agreements & Quit notices)",
        "Manage tenant applications",
        "Advertise vacant properties",
        "Expense management",
        "Rent reminder",

        "Whitelabels",
        "Training & data migration",
      ],
      status: false,
      interval: "annually"
    },
    {
      price: "500,000",
      title: "Enterprise Premium",
      billing: "Billed Annually",
      features: [
        "Up to 100 properties",
        "Unlimited",
        "Financial mangement & statement generation",
        "Maintenance management",
        "Property information",
        "Tenant Management",
        "Document generation (Reciept, Lease Agreements & Quit notices)",
        "Manage tenant applications",
        "Advertise vacant properties",
        "Training & data migration",
        "Expense management",
        "Rent reminder",
        "Whitelabels",

      ],
      status: false,
      interval: "annually"
    },
    {
      price: "Contact Sales",
      title: "Premium Plan",
      billing: "Billed Annually",
      features: [
        "Unlimited Properties",
        "Unlimited Users",
        "Financial mangement & statement generation",
        "Maintenance management",
        "Property information",
        "Tenant Management",
        "Document generation (Reciept, Lease Agreements & Quit notices)",
        "Manage tenant applications",
        "Advertise vacant properties",
        "Training & data migration",
        "Expense management",
        "Rent reminder",

        "Whitelabels",
      ],
      status: true,
      interval: "annually"
    },
  ];

  return (
    <div className="mt-[60px] w-full m-auto px-4 md:px-6 flex flex-col items-center gap-[60px]">
      <div className={`text-GrayHomz w-full ${isAt1295px ? "hidden" : ""}`}>
        <Swiper
          // Add to modules:
          modules={[Navigation, Pagination]}

          // Add to Swiper props:
          pagination={{
            clickable: true,
            dynamicBullets: true,
            el: '.swiper-pagination', // Add this if you want a custom class
          }}
          touchRatio={0.8}
          resistanceRatio={0.7}
          spaceBetween={20}  // Increased space between slides
          slidesPerView={1} // Always show 1 slide on mobile
          centeredSlides={true} // Center the active slide
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          breakpoints={{
            // When window width is >= 640px
            640: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            // When window width is >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            // When window width is >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            // When window width is >= 1280px
            1280: {
              slidesPerView: 4,
              spaceBetween: 20
            }
          }}
          className="pb-8" // Add padding for navigation
        >
          {pricingPlans.map((plan, index) => (
            <SwiperSlide key={index} className="!h-auto py-4"> {/* Added !h-auto and padding */}
              <div className="flex flex-col justify-around p-6 mx-2 text-[16px] font-[400] w-full max-w-[280px] h-full min-h-[860px] border shadow-lg rounded-2xl hover:border hover:border-BlueHomz hover:bg-whiteblue">
                <h1 className="text-[23px] text-center font-[700] text-BlackHomz">
                  <span className={`font-sans ${plan.price === "Contact Sales" ? "hidden" : ""}`}>₦</span>{plan.price}
                </h1>
                <h1 className="text-[20px] text-center font-[500]">{plan.title}</h1>
                <p className="text-[14px] mt-[-10px] text-center font-[500] text-BlueHomz">
                  {plan.billing}
                </p>
                <Link href={"/contact-page"}
                  className={`h-[48px] rounded-lg text-[16px] w-full flex justify-center items-center ${plan.status === true
                    ? "bg-BlueHomz hover:bg-blue-400 text-white"
                    : " hidden"
                    }
              `}
                >
                  Contact Sales
                </Link>
                <button
                  className={`h-[48px] rounded-lg text-[16px] w-full bg-BlueHomz hover:bg-blue-400 text-white ${plan.status === true
                    ? " hidden"
                    : ""
                    } 
            `}
                >
             Get Started
                </button>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex flex-row items-center gap-2">
                    <div
                      className={`h-[14px] w-[16px] ${(plan.title === "Enterprise Starter" && feature === "Whitelabels") ||
                        (plan.title === "Enterprise Basic" && (feature !== "Document generation (Reciept, Lease Agreements & Quit notices)")) ||
                        (feature === "Whitelabels" && plan.title !== "Premium Plan") ||
                        feature === "Early rent incentives for renters" ||
                        (plan.title === "Enterprise Plus" && feature === "Training & data migration")
                        || (plan.title === "Enterprise Starter" && feature === "Training & data migration")
                        ? "opacity-[20%]"
                        : "bg-green-200"
                        } flex justify-center border rounded-full min-w-[16px]`}
                    >
                      <Image
                        height={10.5}
                        width={12}
                        alt="img"
                        src={"/IconMark.png"}
                      />
                    </div>
                    <p
                      className={` ${(plan.title === "Enterprise Starter" && feature === "Whitelabels") ||
                        feature === "Early rent incentives for renters" ||
                        (plan.title === "Enterprise Basic" && (feature !== "Document generation (Reciept, Lease Agreements & Quit notices)")) ||
                        (feature === "Whitelabels" && plan.title !== "Premium Plan") ||
                        (plan.title === "Enterprise Plus" && feature === "Training & data migration")
                        || (plan.title === "Enterprise Starter" && feature === "Training & data migration")
                        ? "text-GrayHomz5"
                        : ""
                        }`}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev !text-BlueHomz"></div>
          <div className="swiper-button-next !text-BlueHomz"></div>
        </Swiper>
      </div>
      <div className={`text-GrayHomz w-full ${isAt1295px ? "" : "hidden"}`}>
        <div className="grid grid-cols-5">
          {pricingPlans.map((plan, index) => (
            <div key={index}>
              <div
                className="flex flex-col justify-around p-6 text-[16px] font-[400] sm:w-[236px] h-[860px] border shadow-lg rounded-2xl hover:border hover:border-BlueHomz hover:bg-whiteblue"
              >
                <h1 className="text-[20px] text-center font-[700] text-BlackHomz">
                  <span className={`font-sans ${plan.price === "Contact Sales" ? "hidden" : ""}`}>₦</span>{plan.price}
                </h1>
                <h1 className="text-[17px] text-center font-[500]">{plan.title}</h1>
                <p className="text-[12px] mt-[-10px] text-center font-[500] text-BlueHomz">
                  {plan.billing}
                </p>
                <Link href={"/contact-page"}
                  className={`h-[48px] rounded-lg text-[14px] w-full flex justify-center items-center ${plan.status === true
                    ? "bg-BlueHomz hover:bg-blue-400 text-white"
                    : " hidden"
                    }
              `}
                >
                  Contact Sales
                </Link>
                <button
                   className={`h-[48px] rounded-lg text-[14px] w-full bg-BlueHomz hover:bg-blue-400 text-white ${plan.status === true
                    ? " hidden"
                    : ""
                    } 
             `}
                >
               Get Started
                </button>
                {plan.features.map((feature, i) => (
                  <div key={i} className="text-[14px] flex flex-row items-center gap-2">
                    <div
                      className={`h-[14px] w-[16px] ${(plan.title === "Enterprise Starter" && feature === "Whitelabels") ||
                        (plan.title === "Enterprise Basic" && (feature !== "Document generation (Reciept, Lease Agreements & Quit notices)")) ||
                        (feature === "Whitelabels" && plan.title !== "Premium Plan") ||
                        feature === "Early rent incentives for renters" ||
                        (plan.title === "Enterprise Plus" && feature === "Training & data migration")
                        || (plan.title === "Enterprise Starter" && feature === "Training & data migration")
                        ? "opacity-[20%]"
                        : "bg-green-200"
                        } flex justify-center border rounded-full min-w-[16px]`}
                    >
                      <Image
                        height={10.5}
                        width={12}
                        alt="img"
                        src={"/IconMark.png"}
                      />
                    </div>
                    <p
                      className={` ${(plan.title === "Enterprise Starter" && feature === "Whitelabels") ||
                        feature === "Early rent incentives for renters" ||
                        (plan.title === "Enterprise Basic" && (feature !== "Document generation (Reciept, Lease Agreements & Quit notices)")) ||
                        (feature === "Whitelabels" && plan.title !== "Premium Plan") ||
                        (plan.title === "Enterprise Plus" && feature === "Training & data migration")
                        || (plan.title === "Enterprise Starter" && feature === "Training & data migration")
                        ? "text-GrayHomz5"
                        : ""
                        }`}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansYearly;
