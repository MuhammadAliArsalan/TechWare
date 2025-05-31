import React from "react";
// import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
// Import images
import sliderImage1 from '../images/chip.png';
import sliderImage2 from '../images/gaming.png';
import sliderImage3 from '../images/intelcorei7.png';
import sliderImage4 from '../images/keyboard.png';
import sliderImage5 from "../images/modem.png"
import sliderImage6 from "../images/power.png"

import "./slider.css"; 
// const categories = [
//   { image: sliderImage1, title: "Power & Electrical" },
//   { image: sliderImage2, title: "Peripherals & Accessories" },
//   { image: sliderImage3, title: "Computer Hardware" },
//   { image: sliderImage4, title: "Networking Components" },
//   { image: sliderImage4, title: "Storage & Backup" }
// ];
const Slider = () => {
  
  return (
    <div className="slider-container">
      <h1 className="slider-heading">AVAILABLE CATEGORIES</h1>
      <div className="sub_slider_container">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        // loopAdditionalSlides={2}
        slidesPerView={3}
        // spaceBetween={10}
        initialSlide={2}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{el:'.swiper-pagination', clickable: true }}
        navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
        }}
        modules={[Navigation, Pagination, EffectCoverflow]}
        className="swiper-container"
        // breakpoints={{
        //   320: {
        //     slidesPerView: 1,
        //     spaceBetween: 20
        //   },
        //   768: {
        //     slidesPerView: 2,
        //     spaceBetween: 30
        //   },
        //   1024: {
        //     slidesPerView: 3,
        //     spaceBetween: 40
        //   }
        // }}
      >
        <div className="swiper-slides">
        <SwiperSlide className="swiper-slide">
          <img src={sliderImage6} alt="chip" />
          <p>Power & Electrical</p>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide">
          <img src={sliderImage2} alt="gaming" />
          <p>Peripherals & Accessories</p>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide">
          <img src={sliderImage3} alt="intelCore" />
          <p>Computer Hardware</p>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide">
          <img src={sliderImage5} alt="keyboard" />
          <p>Networking Components</p>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide">
          <img src={sliderImage1} alt="ssd" />
          <p>Storage & Backup</p>
        </SwiperSlide>

        {/* <SwiperSlide className="slide">
          <img src={sliderImage2} alt="ssd" />
          <p>StartUp systems</p>
        </SwiperSlide>

        <SwiperSlide className="slide">
          <img src={sliderImage3} alt="ssd" />
          <p>Components</p>
        </SwiperSlide> */}

        </div>
        {/* {categories.map((category, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <div className="slide-content">
              <div className="image-container">
                <img src={category.image} alt={category.title} />
              </div>
              <p>{category.title}</p>
              <div className="slide-overlay"></div>
            </div>
          </SwiperSlide>
        ))} */}
        {/* <div className="slider-controller">
            <div className="swiper-button-prev slider-arrow">
                <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow">
                <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
            <div className="swiper-pagination"></div>
        </div> */}
        
      </Swiper>
      </div>
    </div>
  );
};

export default Slider;

// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/effect-coverflow";
// import sliderImage1 from '../images/chip.png';
// import sliderImage2 from '../images/gaming.png';
// import sliderImage3 from '../images/intelcorei7.png';
// import sliderImage4 from '../images/keyboard.png';
// import "./slider.css";

// const Slider = () => {
//   const categories = [
//     { image: sliderImage1, title: "Power & Electrical" },
//     { image: sliderImage2, title: "Peripherals & Accessories" },
//     { image: sliderImage3, title: "Computer Hardware" },
//     { image: sliderImage4, title: "Networking Components" },
//     { image: sliderImage4, title: "Storage & Backup" }
//   ];

//   return (
//     <div className="slider-container">
//       <h1 className="slider-heading">AVAILABLE CATEGORIES</h1>
//       <Swiper
//         effect={"coverflow"}
//         grabCursor={true}
//         centeredSlides={true}
//         loop={true}
//         slidesPerView={3}
//         initialSlide={2} // This ensures the middle slide is shown first
//         coverflowEffect={{
//           rotate: 0,
//           stretch: 0,
//           depth: 300,
//           modifier: 1,
//           slideShadows: false,
//         }}
//         pagination={{ 
//           el: '.swiper-pagination', 
//           clickable: true,
//           dynamicBullets: true
//         }}
//         navigation={{
//           nextEl: '.swiper-button-next',
//           prevEl: '.swiper-button-prev',
//           clickable: true,
//         }}
//         modules={[Navigation, Pagination, EffectCoverflow]}
//         className="swiper-container"
//         breakpoints={{
//           320: {
//             slidesPerView: 1,
//             spaceBetween: 20
//           },
//           768: {
//             slidesPerView: 2,
//             spaceBetween: 30
//           },
//           1024: {
//             slidesPerView: 3,
//             spaceBetween: 40
//           }
//         }}
//       >
//         {categories.map((category, index) => (
//           <SwiperSlide key={index} className="swiper-slide">
//             <div className="slide-content">
//               <div className="image-container">
//                 <img src={category.image} alt={category.title} />
//               </div>
//               <p>{category.title}</p>
//               <div className="slide-overlay"></div>
//             </div>
//           </SwiperSlide>
//         ))}

//         <div className="slider-controls">
//           <div className="swiper-button-prev slider-arrow">
//             <ion-icon name="arrow-back-outline"></ion-icon>
//           </div>
//           <div className="swiper-button-next slider-arrow">
//             <ion-icon name="arrow-forward-outline"></ion-icon>
//           </div>
//           <div className="swiper-pagination"></div>
//         </div>
//       </Swiper>
//     </div>
//   );
// };

// export default Slider;