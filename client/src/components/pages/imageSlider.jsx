import { useEffect, useState } from "react";
import "./imageSlider.css"; // Import CSS file
import chip from "../images/chip.png";
import gaming from "../images/gaming.png"; 
import intel from "../images/intelcorei7.png";
import keyboard from "../images/keyboard.png";


const HomeStart = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false)

// #08122B
// #1A3D4F
// #3C5767
// #394959
// #33506D


  // Product data
  const products = [
    {
      name: "Studio Pro X7",
      description: "Experience unparalleled sound clarity with our flagship headphones",
      price: "RS. 64,999",
      image: chip,
      color: "#08122B",
    },
    {
      name: "Gaming DAC",
      description: "Ultra-low latency audio processing for competitive gaming",
      price: "RS. 89,999",
      image: gaming,
      color: "#1A3D4F",
    },
    {
      name: "Intel Core i9",
      description: "High-performance processor for audio workstations",
      price: "RS. 35,999",
      image: intel,
      color: "#3C5767",
    },
    {
      name: "Mechanical Keyboard",
      description: "Premium tactile feedback for audio production",
      price: "RS. 14,999",
      image: keyboard,
      color: "#394959",
    },
    {
      name: "Audio Interface",
      description: "Professional-grade audio conversion for studio use",
      price: "RS. 79,999",
      image: gaming,
      color: "#33506D",
    },
  ]

  // Company logos
  const companies = [
    { name: "Intel", logo: "/placeholder.svg?height=80&width=80" },
    { name: "AMD", logo: "/placeholder.svg?height=80&width=80" },
    { name: "NVIDIA", logo: "/placeholder.svg?height=80&width=80" },
    { name: "Corsair", logo: "/placeholder.svg?height=80&width=80" },
    { name: "Logitech", logo: "/placeholder.svg?height=80&width=80" },
    { name: "Razer", logo: "/placeholder.svg?height=80&width=80" },
  ]
  // Image slider effect
    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % products.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [products.length]);

// Intersection observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelector(".why-us").classList.add("show");
                    document.querySelector(".why-heading").classList.add("fade-in-top");
                    document.querySelectorAll(".why-box").forEach(box => {
                        if (box.classList.contains("box1")) box.classList.add("fade-in-left");
                        else if (box.classList.contains("box2")) box.classList.add("fade-in-top");
                        else if (box.classList.contains("box3")) box.classList.add("fade-in-left");
                        else if (box.classList.contains("box4")) box.classList.add("fade-in-bottom");
                        else box.classList.add("fade-in-right");
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        observer.observe(document.querySelector(".why-us"));
        return () => observer.disconnect();
    }, []);

    // const images = [chip, gaming, intel, keyboard, intel];
    // const backgrounds = ["#C7F6D0", "#D1E4F6", "#FFB7B2", "#d7d7d7", "#6b6b6b"];

    return (
        <div>
            <section className="slider-main">
                <div className="container">
                    {/* <div className="logo">
                        <a href="#"><img src="../images/instagram.png" alt="logo" /></a>
                    </div> */}
                    <div className="slider-content-wrap">
                        <div className="slider-content" style={{ color: products[imageIndex].color === "#FFFFFF" ? "#000000" : "#FFFFFF" }}>
                            {/* <h2 className="heading-style-2">{products.name}</h2>
                            <p className="image-description">{products.description}</p>
                            <h3 className="heading-style-2">{products.price}</h3> */}
                            <h2>{products[imageIndex].name}</h2>
                            <p>{products[imageIndex].description}</p>
                            <h3 >{products[imageIndex].price}</h3>
                        </div>
                    </div>
                </div>
                {/* <div className="slider-images">
                    {products.map((src, index) => (
                        <img 
                            key={index} 
                            className={index === imageIndex ? "active" : "inactive"} 
                            src={src} 
                            alt="product" 
                        />
                    ))}
                </div>
                <div id="backgrounds">
                    {backgrounds.map((color, index) => (
                        <div 
                            key={index} 
                            className="background" 
                            style={{ background: color, opacity: index === imageIndex ? 1 : 0 }}
                        />
                    ))}
                </div> */}
                <div className="slider-images">
                    {products.map((product, index) => (
                        <img 
                            key={index} 
                            className={index === imageIndex ? "active" : "inactive"} 
                            src={product.image} 
                            alt={product.name} 
                        />
                    ))}
                </div>
                <div id="backgrounds">
                    {products.map((product, index) => (
                        <div 
                            key={index} 
                            className="background" 
                            style={{ background: product.color, opacity: index === imageIndex ? 1 : 0 }}
                        />
                    ))}
                </div>
            </section>
            
            {/* Section to Display Company Names */}
    {/* <section className="company-logos">
        <div className="company-content">
            <h2 className="heading-style-2">COMPANIES</h2>
            <div className="companies">
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
                <img className="company" src= {chip}/>
            </div>
        </div>
    </section> */}

            {/* <section className="why-us hidden">
                <div className="why-container">
                    <div className="top_div">
                        <div className="why-box box1">40+ Qualified Experts</div>
                        <div className="why-box box2">10% More Availability</div>
                        <h2 className="why-heading">Why Us?</h2>
                    </div>
                    <div className="bottom_div">
                        <div className="why-box box3">99% Success Rate</div>
                        <div className="why-box box4">Comprehensive Consultation</div>
                        <div className="why-box box5">Our Platform's Features Lead the Way</div>
                    </div>
                </div>
            </section> */}
            <section className="why-us">
  <div className="why-container">
    <h2 className="why-heading">Why Choose Our Platform?</h2>
    
    <div className="feature-grid">
      {/* Row 1 */}
      <div className="feature-box fade-in-left">
        <div className="icon-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
    {/* <!-- Main dashboard background --> */}
    <rect x="-70" y="-30" width="140" height="100" fill="#4A90E2" stroke="#2A5082" stroke-width="2" rx="3" />
    
    {/* <!-- Graph grid lines --> */}
    <line x1="-60" y1="0" x2="60" y2="0" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    <line x1="-60" y1="20" x2="60" y2="20" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    <line x1="-60" y1="-20" x2="60" y2="-20" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    
    <line x1="-40" y1="-25" x2="-40" y2="60" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    <line x1="-20" y1="-25" x2="-20" y2="60" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    <line x1="0" y1="-25" x2="0" y2="60" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    <line x1="20" y1="-25" x2="20" y2="60" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    <line x1="40" y1="-25" x2="40" y2="60" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.3" />
    
    {/* <!-- Graph axis --> */}
    <path d="M-60 60 L60 60" stroke="#FFFFFF" stroke-width="2" fill="none" />
    <path d="M-60 60 L-60 -20" stroke="#FFFFFF" stroke-width="2" fill="none" />
    
    {/* <!-- Data line --> */}
    <path d="M-60 30 L-50 10 L-40 40 L-30 20 L-20 0 L-10 30 L0 -10 L10 5 L20 -15 L30 10 L40 -5 L50 20" 
          stroke="#4CD964" stroke-width="3" fill="none" />
    {/* <!-- Live indicator --> */}
    <circle cx="60" cy="-20" r="5" fill="#FF3B30" stroke="#FFFFFF" stroke-width="1" />
    <text x="50" y="-20" font-size="7" fill="#FFFFFF">LIVE</text>
  </g>
</svg>
        </div>
        <h3>Real-Time Inventory</h3>
        <p>Always know exactly what's available with live stock updates</p>
        <div className="pulse-dot"></div>
      </div>

      <div className="feature-box fade-in-bottom main-feature">
        <div className="counter-animation" data-target="40">40+</div>
        <h3>Hardware Categories</h3>
        <p>From CPUs to networking gear - we've got it all organized</p>
        <div className="sparkles">
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
        </div>
      </div>

      <div className="feature-box fade-in-right">
        <div className="icon-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
    {/* <!-- Wider shield shape --> */}
    <path d="M0 -80 L-55 -50 L-55 -15 C-55 30 0 60 0 60 C0 60 55 30 55 -15 L55 -50 L0 -80Z" 
          fill="#3498db" 
          stroke="#2980b9" 
          stroke-width="3"/>
    
    {/* <!-- Checkmark --> */}
    <path d="M-25 0 L-5 20 L30 -25" 
          stroke="#ecf0f1" 
          stroke-width="6" 
          fill="none" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
    
    {/* <!-- Optional: Add subtle inner shield highlight --> */}
    <path d="M0 -70 L-55 -45 L-55 -15 C-55 20 0 48 0 48" 
          stroke="#4ca3e0" 
          stroke-width="1.5" 
          fill="none" 
          stroke-opacity="0.7"/>
  </g>
</svg>
        </div>
        <h3>PKI Product Authentication</h3>
        <p>Military-grade verification for every product</p>
      </div>

      {/* Row 2 */}
      <div className="feature-box fade-in-left">
        <div className="icon-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
    {/* <!-- Left payment card/device --> */}
    <rect x="-60" y="-40" width="40" height="80" fill="#8e44ad" stroke="#703688" stroke-width="3" rx="6"/>
    
    {/* <!-- Right payment card/device --> */}
    <rect x="30" y="-40" width="40" height="80" fill="#8e44ad" stroke="#703688" stroke-width="3" rx="6"/>
    
    {/* <!-- Connection line between devices --> */}
    <path d="M-20 0 L30 0" stroke="#703688" stroke-width="3" stroke-dasharray="4,4" fill="none"/>
    
    {/* <!-- Confirmation circle --> */}
    <circle cx="5" cy="0" r="20" fill="#ecf0f1" stroke="#703688" stroke-width="3"/>
    
    {/* <!-- Checkmark inside circle --> */}
    <path d="M-5 0 L5 10 L15 -10" stroke="#703688" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
        </div>
        <h3>Secure Payment Gateway</h3>
        <p>PayFast integration with multiple options</p>
      </div>

      <div className="feature-box fade-in-top">
        <div className="icon-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
    {/* Calendar base - larger size */}
    <rect x="-70" y="-80" width="140" height="120" fill="#FF9500" stroke="#CC7600" stroke-width="3" rx="8"/>
    <rect x="-65" y="-75" width="130" height="25" fill="#CC7600" stroke="none"/>
    
    {/* Calendar dates - Row 1 */}
    <rect x="-60" y="-42" width="25" height="25" fill="#FFFFFF" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    <rect x="-25" y="-42" width="25" height="25" fill="#FFFFFF" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    <rect x="10" y="-42" width="25" height="25" fill="#FFFFFF" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    <rect x="45" y="-42" width="25" height="25" fill="#FFFFFF" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    
    {/* Calendar dates - Row 2 */}
    <rect x="-60" y="-10" width="25" height="25" fill="#FFFFFF" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    <rect x="-25" y="-10" width="25" height="25" fill="#FF3B30" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    <rect x="10" y="-10" width="25" height="25" fill="#FFFFFF" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    <rect x="45" y="-10" width="25" height="25" fill="#FFFFFF" stroke="#CC7600" stroke-width="1.5" rx="3"/>
    
    {/* Hardware element - enlarged */}
    <rect x="-50" y="30" width="100" height="35" fill="#5856D6" stroke="#403DC4" stroke-width="3" rx="5"/>
    <circle cx="-30" cy="47" r="6" fill="#FFFFFF"/>
    <rect x="-15" y="37" width="50" height="20" fill="#403DC4" stroke="none" rx="2"/>
    
    {/* Day numbers in calendar */}
    <text x="-53" y="-25" font-size="14" fill="#333333" font-family="Arial">1</text>
    <text x="-18" y="-25" font-size="14" fill="#333333" font-family="Arial">2</text>
    <text x="17" y="-25" font-size="14" fill="#333333" font-family="Arial">3</text>
    <text x="52" y="-25" font-size="14" fill="#333333" font-family="Arial">4</text>
    
    <text x="-53" y="7" font-size="14" fill="#333333" font-family="Arial">5</text>
    <text x="-18" y="7" font-size="14" fill="#FFFFFF" font-family="Arial">6</text>
    <text x="17" y="7" font-size="14" fill="#333333" font-family="Arial">7</text>
    <text x="52" y="7" font-size="14" fill="#333333" font-family="Arial">8</text>
          </g>
          </svg>
        </div>
        <h3>Flexible Rental Options</h3>
        <p>Short-term hardware solutions available</p>
        <div className="new-badge">NEW</div>
      </div>

      <div className="feature-box fade-in-right">
        <div className="icon-container">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 100)">
    {/* <!-- Computer body - larger --> */}
    <rect x="-70" y="-60" width="140" height="80" fill="#1abc9c" stroke="#16a085" stroke-width="4" rx="7"/>
    
    {/* <!-- Computer screen - larger --> */}
    <rect x="-60" y="-50" width="120" height="60" fill="#34495e" stroke="#16a085" stroke-width="3"/>
    
    {/* <!-- Computer stand - larger --> */}
    <rect x="-30" y="20" width="60" height="30" fill="#1abc9c" stroke="#16a085" stroke-width="3"/>
    
    {/* <!-- Computer base - larger --> */}
    <rect x="-60" y="50" width="120" height="15" fill="#1abc9c" stroke="#16a085" stroke-width="3"/>
    
    {/* <!-- Verification circle - larger --> */}
    <circle cx="40" cy="-30" r="22" fill="#2ecc71" stroke="#27ae60" stroke-width="3"/>
    
    {/* <!-- Checkmark - larger --> */}
    <path d="M28 -30 L38 -20 L52 -40" stroke="#ecf0f1" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
        </div>
        <h3>Verified Second-Hand</h3>
        <p>Quality-checked used hardware</p>
      </div>
    </div>
  </div>
</section>

        </div>
    );
};

export default HomeStart;
