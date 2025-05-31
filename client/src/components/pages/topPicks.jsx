// import React, { useEffect, useRef } from "react";


// // Import images
// import productImage1 from '../images/chip.png';
// import productImage2 from '../images/gaming.png';
// import productImage3 from '../images/intelcorei7.png';
// import productImage4 from '../images/keyboard.png';

// import "./topPicks.css"; 

// const TopPicks = () => {
//   const productRefs = useRef([]);

//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.querySelector(".product_name")?.classList.add("visible");
//           entry.target.querySelector(".image")?.classList.add("visible");
//         }
//       });
//     }, { threshold: 0.3 });

//     productRefs.current.forEach((el) => {
//       if (el) observer.observe(el);
//     });

//     return () => {
//       productRefs.current.forEach((el) => {
//         if (el) observer.unobserve(el);
//       });
//     };
//   }, []);


//   return (
//     <div className="top-pick-container">
//       <h1 className="top-pick-heading">OUR TOP PICKS</h1>

//       <div className="product" ref={(el) => productRefs.current[0] = el}>
//         <div className="product_name fade-in-left">
//             <p>Intel Core Processor i7</p> {/* fade-in-left  */}
//             <p>Rs. <span>40000</span></p>  {/* fade-in-left  */}
//         </div>
//         <div className="image fade-in-right">
//             <img src={productImage3} alt=""/>  {/* fade-in-right  */}
//         </div>
//       </div>

//       <div className="product" ref={(el) => productRefs.current[1] = el}>
//         <div className="image fade-in-left">
//             <img src={productImage1} alt=""/>  {/* fade-in-left  */}
//         </div>
//         <div className="product_name fade-in-right">
//             <p>Intel Chip</p>  {/* fade-in-right  */}
//             <p>Rs. <span>10000</span></p>  {/* fade-in-right  */}
//         </div>
//         </div>

//         <div className="product" ref={(el) => productRefs.current[2] = el}>
//         <div className="product_name fade-in-left">
//             <p>Gaming Keyboard</p> {/* fade-in-left  */}
//             <p>Rs. <span>5000</span></p> {/* fade-in-left  */}
//         </div>
//         <div className="image fade-in-right">
//             <img src={productImage4} alt=""/> {/* fade-in-right  */}
//         </div>
//       </div>

//       <div className="product" ref={(el) => productRefs.current[3] = el}>
//         <div className="image fade-in-left">
//             <img src={productImage2} alt=""/> {/* fade-in-left  */}
//         </div>
//         <div className="product_name fade-in-right">
//             <p>Gaming Processor</p> {/* fade-in-right  */}
//             <p>Rs. <span>70000</span></p> {/* fade-in-right  */}
//         </div>
//         </div>

//     </div>
//   );
// };

// export default TopPicks;

import React, { useEffect, useRef } from "react";
import productImage1 from '../images/chip.png';
import productImage2 from '../images/gaming.png';
import productImage3 from '../images/intelcorei7.png';
import productImage4 from '../images/keyboard.png';
import "./topPicks.css";

const TopPicks = () => {
  const productRefs = useRef([]);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          if (entry.target.classList.contains("product-item")) {
            const info = entry.target.querySelector(".product-info");
            const image = entry.target.querySelector(".product-image");
            if (info) info.classList.add("visible");
            if (image) image.classList.add("visible");
          }
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px"
    });

    // Observe all elements
    if (headingRef.current) observer.observe(headingRef.current);
    if (subheadingRef.current) observer.observe(subheadingRef.current);
    productRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current);
      if (subheadingRef.current) observer.unobserve(subheadingRef.current);
      productRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section className="top-picks-section">
      <div className="top-pick-container">
        <h1 className="top-pick-heading" ref={headingRef}>OUR TOP PICKS</h1>
        <p className="subheading" ref={subheadingRef}>Premium Hardware Selection</p>

        <div className="products-list">
          {/* Product 1 */}
          <div className="product-item" ref={(el) => productRefs.current[0] = el}>
            <div className="product-info">
              <h3 className="product-name">Intel Core Processor i7</h3>
              <p className="product-description">12th Gen 14-core processor with turbo boost technology</p>
              <div className="product-price">Rs. 40,000</div>
            </div>
            <div className="product-image">
              <img src={productImage3} alt="Intel Core i7"/>
            </div>
          </div>

          {/* Product 2 */}
          <div className="product-item" ref={(el) => productRefs.current[1] = el}>
            <div className="product-image">
              <img src={productImage1} alt="Intel Chip"/>
            </div>
            <div className="product-info">
              <h3 className="product-name">Intel Chip</h3>
              <p className="product-description">High-performance chipset for advanced computing</p>
              <div className="product-price">Rs. 10,000</div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="product-item" ref={(el) => productRefs.current[2] = el}>
            <div className="product-info">
              <h3 className="product-name">Gaming Keyboard</h3>
              <p className="product-description">Mechanical RGB keyboard with anti-ghosting</p>
              <div className="product-price">Rs. 5,000</div>
            </div>
            <div className="product-image">
              <img src={productImage4} alt="Gaming Keyboard"/>
            </div>
          </div>

          {/* Product 4 */}
          <div className="product-item" ref={(el) => productRefs.current[3] = el}>
            <div className="product-image">
              <img src={productImage2} alt="Gaming Processor"/>
            </div>
            <div className="product-info">
              <h3 className="product-name">Gaming Processor</h3>
              <p className="product-description">High-end processor optimized for gaming performance</p>
              <div className="product-price">Rs. 70,000</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPicks;